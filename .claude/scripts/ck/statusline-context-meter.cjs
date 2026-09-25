'use strict';
/**
 * statusline-context-meter — current context size + session age for the statusline.
 *
 * Every turn re-reads the whole context from cache, and cache re-reads were 97.5 % of all tokens
 * (measured on one Norskmat workspace, 2026-08-20..09-24). One 11-day session at ~412k average context was 41 % of the total.
 * This meter makes that size visible before it compounds. Reads only the transcript tail/head —
 * never the whole file (one transcript reached 171 MB).
 */
const fs = require('fs');

const WARN_CTX = 250000;
const ALERT_CTX = 400000;
const ALERT_AGE_H = 24;
const TAIL_BYTES = 512 * 1024;

function readSlice(file, start, len) {
  const fd = fs.openSync(file, 'r');
  try {
    const buf = Buffer.alloc(len);
    const n = fs.readSync(fd, buf, 0, len, start);
    return buf.slice(0, n).toString('utf8');
  } finally { fs.closeSync(fd); }
}

// Last main-thread assistant usage in the transcript → tokens sent on that request.
function lastContext(file) {
  const size = fs.statSync(file).size;
  const text = readSlice(file, Math.max(0, size - TAIL_BYTES), Math.min(size, TAIL_BYTES));
  const lines = text.split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    const l = lines[i];
    if (!l.includes('"usage"') || !l.includes('"assistant"')) continue;
    let d;
    try { d = JSON.parse(l); } catch { continue; } // first line of the slice may be partial
    if (d.isSidechain || !d.message || !d.message.usage || d.message.model === '<synthetic>') continue;
    const u = d.message.usage;
    return (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0);
  }
  return null;
}

function sessionAgeHours(file) {
  const head = readSlice(file, 0, 64 * 1024).split('\n');
  for (const l of head) {
    const m = l.match(/"timestamp":"([^"]+)"/);
    if (m) return (Date.now() - Date.parse(m[1])) / 36e5;
  }
  return null;
}

/** @returns {{text: string, level: 'ok'|'warn'|'alert'} | null} */
function contextMeter(transcriptPath) {
  if (!transcriptPath || !fs.existsSync(transcriptPath)) return null;
  const ctx = lastContext(transcriptPath);
  const age = sessionAgeHours(transcriptPath);
  if (ctx === null && age === null) return null;
  let level = 'ok';
  if (ctx !== null && ctx >= WARN_CTX) level = 'warn';
  if ((ctx !== null && ctx >= ALERT_CTX) || (age !== null && age >= ALERT_AGE_H)) level = 'alert';
  const parts = [];
  if (ctx !== null) parts.push(`ctx ${Math.round(ctx / 1000)}k`);
  if (age !== null) parts.push(age >= 24 ? `${(age / 24).toFixed(1)}d` : `${Math.round(age)}h`);
  let text = parts.join(' · ');
  if (level === 'alert') text += ' → new session? (resume from STATE.md)';
  return { text, level };
}

module.exports = { contextMeter, WARN_CTX, ALERT_CTX, ALERT_AGE_H };

// Two uses: require it and call contextMeter() from an existing statusline, or run this file as the
// statusline itself — `"statusLine": {"type": "command", "command": "node <path to this file>"}`.
// Claude Code pipes the session JSON on stdin; we print one line. Any failure prints nothing — a
// statusline must never break the session.
if (require.main === module) {
  let raw = '';
  process.stdin.on('data', (c) => { raw += c; });
  process.stdin.on('end', () => {
    try {
      const m = contextMeter(JSON.parse(raw || '{}').transcript_path);
      if (!m) return;
      const color = { ok: '\x1b[32m', warn: '\x1b[33m', alert: '\x1b[31m' }[m.level];
      process.stdout.write(`${color}🧠 ${m.text}\x1b[0m`);
    } catch { /* silent by design */ }
  });
}
