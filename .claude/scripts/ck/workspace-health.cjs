#!/usr/bin/env node

/**
 * workspace-health — one deterministic pass over the checks that otherwise get run
 * by hand, or not at all, in a multi-repo workspace root.
 *
 * WHY THESE SEVEN. Each is a failure that stays silent until it bites: a kit that
 * drifts between repos, a memory index that grows past the size where it loads, a
 * backup that quietly stopped happening, a router that grows back past its budget,
 * links that rot as docs move, a credential inlined into an always-loaded file, and
 * repo nodes nobody routes.
 *
 * NOTHING IS HARDCODED to one workspace: repos are discovered, the memory path is
 * derived from the project directory, and the upstream kit is resolved from the
 * `kit` field of a repo's own install stamp. It reports what it finds, including
 * "nothing to compare against".
 *
 * Read-only. Never writes, never network. Exit 0 = all PASS, 1 = at least one
 * WARN or FAIL, 2 = the script itself could not run.
 *
 * Usage: node .claude/scripts/workspace-health.cjs [--json]
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = process.env.CLAUDE_PROJECT_DIR || path.resolve(__dirname, '..', '..');
const NAME = path.basename(ROOT);
const BACKUP_DIR = process.env.BACKUP_DIR || path.join(os.homedir(), 'backups', `${NAME}-workspace-config`);
const PROJECTS = path.join(os.homedir(), 'workspace', 'project');

/** Claude Code slugifies the project path into its per-project state directory. */
const MEMORY = path.join(os.homedir(), '.claude', 'projects', ROOT.replace(/\//g, '-'), 'memory', 'MEMORY.md');

const results = [];
const add = (name, status, detail) => results.push({ name, status, detail });
const read = p => { try { return fs.readFileSync(p, 'utf-8'); } catch { return null; } };
const days = ms => Math.floor((Date.now() - ms) / 86400000);

/** Every directory below the root (depth ≤ 2) that carries its own agent config. */
function discoverRepos() {
  const found = [];
  const scan = (rel, depth) => {
    let entries = [];
    try { entries = fs.readdirSync(path.join(ROOT, rel), { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (!e.isDirectory() || e.name.startsWith('.') || e.name === 'node_modules') continue;
      const child = rel ? path.join(rel, e.name) : e.name;
      const abs = path.join(ROOT, child);
      const owned = fs.existsSync(path.join(abs, 'CLAUDE.md')) || fs.existsSync(path.join(abs, '.claude'));
      if (owned) found.push(child);
      else if (depth < 2) scan(child, depth + 1);
    }
  };
  scan('', 1);
  return found.sort();
}

/** 1 — kit drift: what each repo has installed vs what its own upstream published. */
function checkKitDrift(repos) {
  const rows = [];
  const kits = new Set();
  for (const r of repos) {
    const raw = read(path.join(ROOT, r, '.claude', '.nak-version.json'));
    if (!raw) { rows.push({ repo: r, version: null }); continue; }
    try {
      const d = JSON.parse(raw);
      rows.push({ repo: r, version: d.version || null, kit: d.kit || null });
      if (d.kit) kits.add(d.kit);
    } catch { rows.push({ repo: r, version: null }); }
  }
  let upstream = null;
  for (const k of kits) {
    const pkg = read(path.join(PROJECTS, k, 'package.json'));
    if (pkg) { try { upstream = JSON.parse(pkg).version; break; } catch { /* next */ } }
  }
  const stamped = rows.filter(r => r.version);
  if (!stamped.length) return add('kit drift', 'PASS', 'no install stamps here — nothing to compare');
  if (!upstream) {
    return add('kit drift', 'WARN',
      `upstream clone not found, cannot compare · ${stamped.map(r => `${r.repo}=${r.version}`).join(' · ')}`);
  }
  const behind = stamped.filter(r => r.version !== upstream);
  const unstamped = rows.filter(r => !r.version).map(r => r.repo);
  const notes = unstamped.length ? ` · unstamped: ${unstamped.join(', ')} (an update there applies unconditionally)` : '';
  add('kit drift', behind.length ? 'WARN' : 'PASS',
    behind.length
      ? `${behind.length} behind ${upstream}: ${behind.map(r => `${r.repo}=${r.version}`).join(', ')}${notes}`
      : `all ${stamped.length} at ${upstream}${notes}`);
}

/** 2 — an untracked root has no history; the snapshot is its only recovery path. */
function checkBackup() {
  if (fs.existsSync(path.join(ROOT, '.git'))) return add('root backup', 'PASS', 'root is a git repo — history is the recovery path');
  let files = [];
  try {
    files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.tar.gz'))
      .map(f => ({ f, m: fs.statSync(path.join(BACKUP_DIR, f)).mtimeMs }))
      .sort((a, b) => b.m - a.m);
  } catch { /* dir missing */ }
  if (!files.length) return add('root backup', 'FAIL', `no snapshot in ${BACKUP_DIR} — this untracked root has NO recovery path`);
  const age = days(files[0].m);
  add('root backup', age > 14 ? 'WARN' : 'PASS', `newest ${age}d old, ${files.length} kept (${files[0].f})`);
}

/** 3 — the memory index is dropped once it passes the read limit. */
function checkMemory() {
  let size = 0;
  try { size = fs.statSync(MEMORY).size; } catch { return add('memory index', 'PASS', 'no memory index for this project'); }
  const entries = (read(MEMORY) || '').split('\n').filter(l => l.startsWith('- [')).length;
  add('memory index', size > 17510 ? 'WARN' : 'PASS',
    `${(size / 1024).toFixed(1)} KB, ${entries} entries (compact past 17.1 KB; stops loading at 24.4 KB)`);
}

/** 4 — the router costs this on every turn of every session. */
function checkRouterSize() {
  const s = read(path.join(ROOT, 'CLAUDE.md'));
  if (s === null) return add('router size', 'WARN', 'no CLAUDE.md at the root');
  const lines = s.split('\n').length;
  add('router size', lines > 250 ? 'WARN' : 'PASS',
    `${lines} lines ≈ ${Math.round(s.length / 4)} tok/turn (soft 150, defensible ≤250)`);
}

/** 5 — a dead pointer reads as a missing rule. */
function checkLinks() {
  const targets = [path.join(ROOT, 'CLAUDE.md'), path.join(ROOT, 'AGENTS.md')].filter(fs.existsSync);
  try {
    for (const f of fs.readdirSync(path.join(ROOT, 'docs'))) {
      if (f.endsWith('.md')) targets.push(path.join(ROOT, 'docs', f));
    }
  } catch { /* no docs dir */ }
  const dead = [];
  for (const t of targets) {
    const s = read(t); if (!s) continue;
    const base = path.dirname(t);
    for (const m of s.matchAll(/\]\((?!https?:|#|mailto:)([^)]+)\)/g)) {
      const rel = m[1].split('#')[0].trim();
      if (!rel) continue;
      if (!fs.existsSync(path.resolve(base, rel))) dead.push(`${path.relative(ROOT, t)} → ${rel}`);
    }
  }
  add('doc links', dead.length ? 'WARN' : 'PASS',
    dead.length ? `${dead.length} dead: ${dead.slice(0, 3).join(' | ')}${dead.length > 3 ? ' …' : ''}`
                : `${targets.length} file(s), all resolve`);
}

/** 6 — a credential in an always-loaded file reaches every subagent context. */
function checkInlineSecrets() {
  const hits = [];
  for (const f of ['CLAUDE.md', 'AGENTS.md']) {
    const s = read(path.join(ROOT, f)); if (!s) continue;
    s.split('\n').forEach((line, i) => {
      if (/[A-Z_]{6,}\s*=\s*['"`]?[A-Za-z0-9_\-]{16,}/.test(line) && !/\.env|<REDACTED>|MASKED|example/i.test(line)) {
        hits.push(`${f}:${i + 1}`);
      }
    });
  }
  add('inline secrets', hits.length ? 'FAIL' : 'PASS',
    hits.length ? `credential-shaped value at ${hits.join(', ')} — move it to .claude/.env, leave the variable NAME`
                : 'none in the root instruction files');
}

/** 7 — a repo with its own rules but no owning orchestrator falls back silently. */
function checkOrchestratorCoverage(repos) {
  let agents = [];
  try { agents = fs.readdirSync(path.join(ROOT, '.claude', 'agents', 'orchestrators')).filter(f => f.endsWith('.md')); } catch { /* none */ }
  if (!agents.length) return add('orchestrator coverage', 'PASS', 'no orchestrator layer in this workspace');
  const slug = r => r.replace(/[\/]/g, '-');
  const unowned = repos.filter(r => !agents.some(a => a.includes(slug(r)) || slug(r).includes(a.replace(/-orchestrator\.md$/, ''))));
  add('orchestrator coverage', 'PASS',
    `${agents.length} orchestrator(s)` + (unowned.length ? ` · flat dispatch: ${unowned.join(', ')}` : ' · all repos owned'));
}

function main() {
  const repos = discoverRepos();
  checkKitDrift(repos); checkBackup(); checkMemory(); checkRouterSize();
  checkLinks(); checkInlineSecrets(); checkOrchestratorCoverage(repos);

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify({ root: ROOT, repos, checked: new Date().toISOString(), results }, null, 2));
  } else {
    const icon = { PASS: '✓', WARN: '!', FAIL: '✗' };
    console.log(`workspace health — ${ROOT}\n  ${repos.length} repo node(s): ${repos.join(', ')}\n`);
    for (const r of results) console.log(`  ${icon[r.status]} ${r.status.padEnd(4)} ${r.name.padEnd(22)} ${r.detail}`);
    const bad = results.filter(r => r.status !== 'PASS');
    console.log(`\n  ${results.length - bad.length}/${results.length} pass` + (bad.length ? ` · ${bad.length} to look at` : ''));
  }
  process.exit(results.some(r => r.status !== 'PASS') ? 1 : 0);
}

try { main(); } catch (e) { console.error(`workspace-health: ${e.message}`); process.exit(2); }
