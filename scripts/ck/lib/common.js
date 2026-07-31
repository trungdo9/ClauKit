/**
 * Shared helpers for ClauKit scripts (scripts/ck/*).
 * Node-only, zero dependencies, cross-platform.
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

function sh(cmd, opts = {}) {
  return execSync(cmd, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'], ...opts }).trim();
}

function run(cmd, args, opts = {}) {
  return spawnSync(cmd, args, { encoding: 'utf-8', ...opts });
}

/**
 * Run git with an ARGV array — never a shell string.
 *
 * Refs reach these scripts from branch names, PR metadata and STATE.md lines,
 * and git happily accepts `;`, backtick, `$`, `|` and `&` inside a branch name.
 * Building `sh(\`git rev-parse ${ref}\`)` therefore turned any such name into
 * command execution — including inside the CI template, which runs holding an
 * API key and a write-scoped token. argv has no shell to inject into.
 *
 * Throws on non-zero exit so callers keep their existing try/catch shape.
 */
function git(args, opts = {}) {
  const res = spawnSync('git', args, {
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 64 * 1024 * 1024,
    ...opts,
  });
  if (res.error) throw res.error;
  if (res.status !== 0) throw new Error((res.stderr || '').trim() || `git ${args[0]} exited ${res.status}`);
  return (res.stdout || '').trim();
}

/**
 * Reject a ref that would be read as an option (`--upload-pack=…`, `--output=…`).
 * argv closes command injection; this closes argument injection, which is the
 * only injection left once the shell is gone.
 */
function assertRef(ref, label = 'ref') {
  if (typeof ref !== 'string' || ref === '') die(`${label} is required`);
  if (ref.startsWith('-')) die(`refusing ${label} that starts with '-': ${ref}\n  (it would be parsed as a git option, not a revision)`);
  return ref;
}

function repoRoot(cwd) {
  try {
    return sh('git rev-parse --show-toplevel', { cwd: cwd || process.cwd() });
  } catch {
    return null;
  }
}

/** All worktree roots known to git; first entry is the main worktree. */
function worktrees(cwd) {
  const out = sh('git worktree list --porcelain', { cwd: cwd || process.cwd() });
  return out.split('\n').filter(l => l.startsWith('worktree ')).map(l => path.resolve(l.slice(9).trim()));
}

function die(msg, code = 1) {
  console.error(`✗ ${msg}`);
  process.exit(code);
}

function ok(msg) {
  console.log(`✓ ${msg}`);
}

function info(msg) {
  console.log(`  ${msg}`);
}

/** Directory size in bytes via fs walk (du is not portable). */
function dirSize(p) {
  let total = 0;
  let entries;
  try {
    entries = fs.readdirSync(p, { withFileTypes: true });
  } catch {
    return 0;
  }
  for (const e of entries) {
    const full = path.join(p, e.name);
    try {
      if (e.isSymbolicLink()) continue;
      if (e.isDirectory()) total += dirSize(full);
      else total += fs.statSync(full).size;
    } catch { /* transient */ }
  }
  return total;
}

function fmtBytes(n) {
  if (n > 1024 * 1024 * 1024) return (n / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  if (n > 1024 * 1024) return (n / (1024 * 1024)).toFixed(1) + ' MB';
  return Math.round(n / 1024) + ' KB';
}

/** Detect package manager from lockfiles. Returns {pm, installCmd} or null. */
function detectPm(dir) {
  if (!fs.existsSync(path.join(dir, 'package.json'))) return null;
  if (fs.existsSync(path.join(dir, 'pnpm-lock.yaml'))) return { pm: 'pnpm', installCmd: ['pnpm', 'install', '--frozen-lockfile'] };
  if (fs.existsSync(path.join(dir, 'package-lock.json'))) return { pm: 'npm', installCmd: ['npm', 'ci'] };
  if (fs.existsSync(path.join(dir, 'yarn.lock'))) return { pm: 'yarn', installCmd: ['yarn', 'install', '--frozen-lockfile'] };
  return { pm: 'npm', installCmd: ['npm', 'install'] };
}

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch {
    return null;
  }
}

module.exports = { sh, run, git, assertRef, repoRoot, worktrees, die, ok, info, dirSize, fmtBytes, detectPm, readJson };
