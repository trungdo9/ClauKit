/**
 * Mine candidate prompts from Claude Code transcripts into data/candidates.jsonl.
 *
 * PRIVACY: transcripts hold client work and project dir names are client names.
 * Output goes only to the git-ignored data dir; stdout/stderr carry COUNTS
 * ONLY (never message text, never dir names) and rows carry `projectHash`.
 *
 * Scope: <root>/<dir>/*.jsonl at depth 1 (nested subagent transcripts are
 * out), dirs matching ^-tmp excluded (harness/scratch runs).
 * Root: --root <dir> | env CK_ROUTING_PROJECTS_ROOT | ~/.claude/projects.
 *
 * CLI: node mine-prompts.cjs [--root <dir>] [--out <file>]
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');

const MIN_WORDS = 6;
const MAX_CHARS = 1500;

const sha1 = s => crypto.createHash('sha1').update(s).digest('hex');
const words = s => s.trim().split(/\s+/).filter(Boolean).length;
const norm = s => s.toLowerCase().replace(/\s+/g, ' ').trim();

/**
 * Prompt text of one user line, or a skip reason string prefixed '!'.
 * String content, or the concatenated text blocks of an array that has no
 * tool_result block (those lines are tool output, not a person typing).
 */
function textOf(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '!shape';
  if (content.some(b => b && b.type === 'tool_result')) return '!toolResult';
  const t = content.filter(b => b && b.type === 'text' && typeof b.text === 'string').map(b => b.text).join('\n');
  return t || '!noText';
}

const tag = (s, name) => {
  const m = s.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return m ? m[1].trim() : null;
};

/** -> { text, sourceCmd } | { drop: reason } */
function classify(raw) {
  const s = raw.trim();
  const name = tag(s, 'command-name');
  if (name !== null) {
    const args = tag(s, 'command-args') || '';
    if (words(args) < MIN_WORDS) return { drop: 'short' };
    return { text: args, sourceCmd: name.replace(/^\//, '') };
  }
  if (s.startsWith('<')) return { drop: 'markup' };
  if (words(s) < MIN_WORDS) return { drop: 'short' };
  if (s.length > MAX_CHARS) return { drop: 'long' };
  return { text: s, sourceCmd: null };
}

/** @returns {{candidates: object[], counts: object}} */
function mine(root) {
  const counts = { dirs: 0, dirsSkippedTmp: 0, files: 0, userLines: 0, kept: 0, duplicates: 0, slash: 0,
    dropped: { meta: 0, toolResult: 0, short: 0, long: 0, markup: 0, other: 0 }, badLines: 0 };
  const seen = new Set();
  const candidates = [];
  let dirs = [];
  try { dirs = fs.readdirSync(root, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name).sort(); } catch { /* empty */ }

  for (const dir of dirs) {
    if (/^-tmp/.test(dir)) { counts.dirsSkippedTmp++; continue; }
    counts.dirs++;
    const projectHash = sha1(dir).slice(0, 8);
    let files = [];
    try { files = fs.readdirSync(path.join(root, dir), { withFileTypes: true }).filter(f => f.isFile() && f.name.endsWith('.jsonl')).map(f => f.name).sort(); } catch { /* skip */ }
    for (const f of files) {
      counts.files++;
      let body;
      try { body = fs.readFileSync(path.join(root, dir, f), 'utf8'); } catch { continue; }
      for (const line of body.split('\n')) {
        if (!line) continue;
        let o;
        try { o = JSON.parse(line); } catch { counts.badLines++; continue; }
        if (!o || o.type !== 'user' || !o.message) continue;
        counts.userLines++;
        if (o.isMeta || o.isSidechain) { counts.dropped.meta++; continue; }
        const raw = textOf(o.message.content);
        if (raw.startsWith('!')) { counts.dropped[raw === '!toolResult' ? 'toolResult' : 'other']++; continue; }
        const c = classify(raw);
        if (c.drop) { counts.dropped[c.drop]++; continue; }
        const key = norm(c.text);
        if (seen.has(key)) { counts.duplicates++; continue; }
        seen.add(key);
        candidates.push({ id: sha1(c.text).slice(0, 10), projectHash, sourceCmd: c.sourceCmd, text: c.text });
        counts.kept++;
        if (c.sourceCmd) counts.slash++;
      }
    }
  }
  return { candidates, counts };
}

function arg(argv, name, dflt) {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : dflt;
}

function main(argv) {
  const root = arg(argv, '--root', process.env.CK_ROUTING_PROJECTS_ROOT || path.join(os.homedir(), '.claude', 'projects'));
  const out = arg(argv, '--out', path.join(__dirname, 'data', 'candidates.jsonl'));
  const { candidates, counts } = mine(root);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, candidates.map(c => JSON.stringify(c)).join('\n') + (candidates.length ? '\n' : ''));
  const d = counts.dropped;
  console.log(`dirs=${counts.dirs} skippedTmp=${counts.dirsSkippedTmp} files=${counts.files} userLines=${counts.userLines}`);
  console.log(`kept=${counts.kept} slash=${counts.slash} duplicates=${counts.duplicates} badLines=${counts.badLines}`);
  console.log(`dropped: meta=${d.meta} toolResult=${d.toolResult} short=${d.short} long=${d.long} markup=${d.markup} other=${d.other}`);
  return 0;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));

module.exports = { mine, classify, textOf };
