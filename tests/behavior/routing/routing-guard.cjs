#!/usr/bin/env node
/**
 * Overfit guards for the climb surface.
 *
 * `leak`: the surface (skill-activation.md) must not quote an eval prompt. A rule
 * that contains a case's own sentence passes that case by recall, not routing, and
 * the gain would vanish on any new prompt. Six consecutive words is long enough
 * that a shared run is a copy, not a coincidence of vocabulary.
 * `bytes`: the size rule — the surface may not grow past its baseline.
 *
 *   node routing-guard.cjs leak <cases.jsonl> <surface.md>   exit 0 clean, 1 leak
 *   node routing-guard.cjs bytes <file>...                   prints total bytes
 *
 * The leak CLI prints a count only: the offending text is prompt text, and the
 * output lands in committed reports.
 */

const fs = require('node:fs');

/** All n-word windows over lower-cased [a-z0-9]+ tokens (whitespace/punctuation-insensitive). */
function shingles(text, n = 6) {
  const words = String(text).toLowerCase().match(/[a-z0-9]+/g) || [];
  const out = new Set();
  for (let i = 0; i + n <= words.length; i++) out.add(words.slice(i, i + n).join(' '));
  return out;
}

/** Shingles of the surface that also occur in any prompt; [] = clean. */
function leak(surfaceText, prompts) {
  const surface = shingles(surfaceText);
  const hits = new Set();
  for (const p of prompts) for (const s of shingles(p)) if (surface.has(s)) hits.add(s);
  return [...hits];
}

function surfaceBytes(files) {
  return files.reduce((sum, f) => sum + fs.statSync(f).size, 0);
}

function main() {
  const [cmd, ...args] = process.argv.slice(2);
  if (cmd === 'leak' && args.length === 2) {
    const prompts = fs.readFileSync(args[0], 'utf-8').split('\n').filter(Boolean)
      .map((l) => JSON.parse(l).prompt).filter((p) => typeof p === 'string');
    const hits = leak(fs.readFileSync(args[1], 'utf-8'), prompts);
    console.log(hits.length ? `LEAK: ${hits.length} shingle(s)` : 'clean');
    process.exit(hits.length ? 1 : 0);
  }
  if (cmd === 'bytes' && args.length) {
    console.log(surfaceBytes(args));
    return;
  }
  console.error('usage: routing-guard.cjs leak <cases.jsonl> <surface.md> | bytes <file>...');
  process.exit(2);
}

if (require.main === module) main();
module.exports = { shingles, leak, surfaceBytes };
