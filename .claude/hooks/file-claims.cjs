#!/usr/bin/env node

/**
 * file-claims.cjs - PostToolUse hook (matcher: Write|Edit)
 *
 * The concurrency substrate (T1.2b). Appends one JSONL claim per file
 * mutation to <worktree-root>/.claude/.ck-file-claims.jsonl:
 *   {"session":"<id>","file":"<repo-relative>","ts":<epoch-ms>,"tool":"Edit"}
 *
 * Consumers:
 *   - guard-destructive.cjs (Tier B): denies whole-tree git ops iff another
 *     LIVE session holds a claim on a file the op would touch.
 *   - /ck:git cm: derives the session manifest machine-side (survives
 *     compaction) via `node .claude/hooks/file-claims.cjs list`.
 *
 * Design constraints:
 *   - Scoped PER WORKTREE (git rev-parse --show-toplevel) — sessions in
 *     separate worktrees cannot touch each other's files, so they must not
 *     see each other's claims (false denials push people back toward -A).
 *   - Append-only single lines, no lock, no daemon. Readers tolerate a
 *     partial trailing line.
 *   - Self-pruning on read: claims drop when their file is clean in
 *     `git status --porcelain` or older than TTL (CK_CLAIM_TTL, default 4h).
 *     File is compacted when it exceeds ~2000 lines.
 *   - Non-blocking: hook mode always exits 0.
 *
 * Session identity (verified live 2026-07-31): hook payloads use snake_case
 * `session_id`; the Bash tool env exposes CLAUDE_CODE_SESSION_ID. Fallback
 * order: payload.session_id → payload.sessionId → env → ppid:<n>.
 *
 * CLI:
 *   node file-claims.cjs list [--json]   pruned claims, "mine" resolved from
 *                                       CLAUDE_CODE_SESSION_ID when set
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COMPACT_THRESHOLD = 2000;
const DEFAULT_TTL_MS = 4 * 60 * 60 * 1000;

function ttlMs() {
  const raw = process.env.CK_CLAIM_TTL;
  if (!raw) return DEFAULT_TTL_MS;
  const m = String(raw).trim().match(/^(\d+(?:\.\d+)?)(h|m|s)?$/i);
  if (!m) return DEFAULT_TTL_MS;
  const n = parseFloat(m[1]);
  const unit = (m[2] || 'h').toLowerCase();
  return n * (unit === 'h' ? 3600000 : unit === 'm' ? 60000 : 1000);
}

function worktreeRoot(cwd) {
  try {
    return execSync('git rev-parse --show-toplevel', {
      cwd: cwd || process.cwd(), encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
}

function claimsPath(root) {
  return path.join(root, '.claude', '.ck-file-claims.jsonl');
}

/** Repo-relative paths that are currently dirty (modified/added/renamed/untracked). */
function dirtyFiles(root) {
  // -uall is load-bearing: plain --porcelain collapses an untracked directory
  // to `?? src/`, so a claim on `src/their-new.js` never matched and was pruned
  // as "clean" — silently losing exactly the files a concurrent session had
  // just created, which is the case Tier B exists for.
  const out = execSync('git status --porcelain -uall', {
    cwd: root, encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'],
  });
  const set = new Set();
  for (const line of out.split('\n')) {
    if (!line.trim()) continue;
    let p = line.slice(3);
    const arrow = p.indexOf(' -> ');
    if (arrow !== -1) p = p.slice(arrow + 4); // rename: claim the new name
    p = p.replace(/^"|"$/g, '');
    set.add(p);
  }
  return set;
}

/** Repo-relative paths git does not track yet (porcelain `??`). */
function untrackedFiles(root) {
  // -uall is load-bearing: plain --porcelain collapses an untracked directory
  // to `?? src/`, so a claim on `src/their-new.js` never matched and was pruned
  // as "clean" — silently losing exactly the files a concurrent session had
  // just created, which is the case Tier B exists for.
  const out = execSync('git status --porcelain -uall', {
    cwd: root, encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'],
  });
  const set = new Set();
  for (const line of out.split('\n')) {
    if (!line.startsWith('??')) continue;
    set.add(line.slice(3).replace(/^"|"$/g, ''));
  }
  return set;
}

function appendClaim(root, claim) {
  const file = claimsPath(root);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.appendFileSync(file, JSON.stringify(claim) + '\n');
}

/**
 * Read claims, pruned to live ones: file still dirty AND fresher than TTL.
 * Latest claim per (session,file) wins. Compacts the registry file when it
 * has grown past COMPACT_THRESHOLD raw lines.
 */
function readClaims(root, opts = {}) {
  const file = claimsPath(root);
  if (!fs.existsSync(file)) return [];
  let raw;
  try {
    raw = fs.readFileSync(file, 'utf-8');
  } catch {
    return [];
  }
  const lines = raw.split('\n').filter(l => l.trim());
  const now = opts.now || Date.now();
  const ttl = opts.ttlMs || ttlMs();
  let dirty;
  try {
    dirty = dirtyFiles(root);
  } catch {
    dirty = null; // git unavailable: skip the dirty check, keep TTL pruning
  }

  const bySessionFile = new Map();
  for (const line of lines) {
    let c;
    try {
      c = JSON.parse(line);
    } catch {
      continue; // partial trailing line from a concurrent append
    }
    if (!c || !c.session || !c.file || !c.ts) continue;
    bySessionFile.set(c.session + '\u0000' + c.file, c);
  }

  const live = [...bySessionFile.values()].filter(c =>
    now - c.ts < ttl && (dirty === null || dirty.has(c.file))
  );

  // Compaction is the one non-append write, and it was a truncate-and-rewrite
  // from a snapshot taken before the write: a claim appended in that window was
  // silently discarded (measured: 5-8 lost out of 40 concurrent appenders).
  // Write a temp file and rename — atomic on POSIX — and only when the file has
  // not grown since it was read, so a racing appender wins instead of losing.
  if (lines.length > COMPACT_THRESHOLD) {
    try {
      const sizeAtRead = Buffer.byteLength(raw);
      if (fs.statSync(file).size === sizeAtRead) {
        const tmp = `${file}.${process.pid}.tmp`;
        fs.writeFileSync(tmp, live.map(c => JSON.stringify(c)).join('\n') + (live.length ? '\n' : ''));
        fs.renameSync(tmp, file);
      }
    } catch { /* compaction is best-effort — never fail a read over it */ }
  }
  return live;
}

function sessionFromPayload(payload) {
  return (payload && (payload.session_id || payload.sessionId))
    || process.env.CLAUDE_CODE_SESSION_ID
    || `ppid:${process.ppid}`;
}

// ---------------- entry points ----------------

function hookMode() {
  try {
    const stdin = fs.readFileSync(0, 'utf-8').trim();
    if (!stdin) process.exit(0);
    const payload = JSON.parse(stdin);
    const filePath = payload.tool_input && payload.tool_input.file_path;
    if (!filePath) process.exit(0);
    const root = worktreeRoot(payload.cwd);
    if (!root) process.exit(0);
    const rel = path.relative(root, path.resolve(payload.cwd || process.cwd(), filePath));
    if (rel.startsWith('..')) process.exit(0); // outside this worktree
    appendClaim(root, {
      session: sessionFromPayload(payload),
      file: rel.split(path.sep).join('/'),
      ts: Date.now(),
      tool: payload.tool_name || 'unknown',
    });
    process.exit(0);
  } catch {
    process.exit(0); // never block on our own errors
  }
}

function listMode(json) {
  const root = worktreeRoot();
  if (!root) {
    console.log(json ? '[]' : '(not in a git worktree)');
    process.exit(0);
  }
  const me = process.env.CLAUDE_CODE_SESSION_ID || null;
  const claims = readClaims(root).map(c => ({
    ...c,
    mine: me !== null && c.session === me,
    age_min: Math.round((Date.now() - c.ts) / 60000),
  }));
  if (json) {
    console.log(JSON.stringify(claims, null, 2));
  } else if (claims.length === 0) {
    console.log('(no live claims)');
  } else {
    for (const c of claims.sort((a, b) => a.session.localeCompare(b.session) || a.file.localeCompare(b.file))) {
      console.log(`${c.mine ? 'MINE   ' : 'FOREIGN'}  ${c.session.slice(0, 8)}  ${String(c.age_min).padStart(4)}m  ${c.tool.padEnd(6)}  ${c.file}`);
    }
  }
  process.exit(0);
}

if (require.main === module) {
  const arg = process.argv[2];
  if (arg === 'list') listMode(process.argv.includes('--json'));
  else hookMode();
}

module.exports = { worktreeRoot, claimsPath, readClaims, appendClaim, dirtyFiles, untrackedFiles, ttlMs };
