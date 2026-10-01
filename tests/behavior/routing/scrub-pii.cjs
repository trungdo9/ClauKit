/**
 * PII scrubber for mined prompts. The repo is public and the transcript pool
 * holds client work, so everything identifying is replaced by a placeholder
 * before a prompt can reach cases.jsonl.
 *
 * Order matters: client terms first (single alternation, so a later term can't
 * eat an earlier placeholder), then URLs (they contain emails/IPs/paths), then
 * secrets (before ticket keys, `AKIA...` would otherwise look like one).
 *
 * CLI: node scrub-pii.cjs [--in candidates.jsonl] [--out scrubbed.jsonl] [--terms file]
 *   defaults live in ./data/ (git-ignored). Prints counts only.
 */

const fs = require('node:fs');
const path = require('node:path');

const DATA = path.join(__dirname, 'data');

/** One term per line; blank lines and `#` comments ignored; missing file => []. */
function loadTerms(file) {
  let raw;
  try { raw = fs.readFileSync(file, 'utf8'); } catch { return []; }
  return raw.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
}

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const SECRET_RES = [
  /\bsk-[A-Za-z0-9_-]{16,}/g,
  /\bghp_[A-Za-z0-9]{20,}/g,
  /\bAKIA[0-9A-Z]{16}\b/g,
  /\bxox[bp]-[A-Za-z0-9-]{10,}/g,
  /\b[0-9a-fA-F]{32,}\b/g,
];
// Base64-ish run: only a secret if it mixes digits, lower and upper case, so
// long kebab-case names and file paths are left alone.
const B64 = /[A-Za-z0-9+/_=-]{32,}/g;
const mixed = s => /\d/.test(s) && /[a-z]/.test(s) && /[A-Z]/.test(s);

const URL_RE = /\b(?:https?|ftp|ssh|git):\/\/[^\s<>"'`)\]]+/gi;
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+/g;
const IPV4_RE = /\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g;
const TICKET_RE = /\b[A-Z]{2,6}-\d+\b/g;
const HOME_RE = /(?:\/(?:home|Users)\/|[A-Za-z]:\\Users\\)[^\s'"`<>)\]]*/g;

/** Trailing sentence punctuation is not part of the path. */
function homePath(m) {
  const tail = m.match(/[.,;:!?]+$/);
  return '~/project/…' + (tail ? tail[0] : '');
}

/** @param {string} text @param {string[]} terms @returns {string} */
function scrub(text, terms = []) {
  let out = String(text);
  const ts = [...new Set(terms.map(t => t.trim()).filter(Boolean))].sort((a, b) => b.length - a.length);
  if (ts.length) out = out.replace(new RegExp(ts.map(esc).join('|'), 'gi'), '<CLIENT>');
  out = out.replace(URL_RE, '<URL>').replace(EMAIL_RE, '<EMAIL>');
  for (const re of SECRET_RES) out = out.replace(re, '<SECRET>');
  out = out.replace(B64, m => (mixed(m) ? '<SECRET>' : m));
  out = out.replace(HOME_RE, homePath).replace(IPV4_RE, '<IP>').replace(TICKET_RE, 'PROJ-123');
  return out;
}

function arg(argv, name, dflt) {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : dflt;
}

function main(argv) {
  const inp = arg(argv, '--in', path.join(DATA, 'candidates.jsonl'));
  const out = arg(argv, '--out', path.join(DATA, 'scrubbed.jsonl'));
  const terms = loadTerms(arg(argv, '--terms', path.join(DATA, 'scrub-terms.local.txt')));
  let rows;
  try {
    rows = fs.readFileSync(inp, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
  } catch (e) {
    console.error(`cannot read input: ${e.code || 'parse error'}`);
    return 2;
  }
  let changed = 0;
  const scrubbed = rows.map(r => {
    const text = scrub(r.text, terms);
    if (text !== r.text) changed++;
    return { ...r, text };
  });
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, scrubbed.map(r => JSON.stringify(r)).join('\n') + (scrubbed.length ? '\n' : ''));
  console.log(`rows=${rows.length} changed=${changed} terms=${terms.length}`);
  return 0;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));

module.exports = { scrub, loadTerms };
