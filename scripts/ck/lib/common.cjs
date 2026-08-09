/**
 * Shared helpers for ClauKit scripts (scripts/ck/*).
 * Node-only, zero dependencies, cross-platform.
 */

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

function die(msg, code = 1) {
  console.error(`✗ ${msg}`);
  process.exit(code);
}

module.exports = { sh, run, git, assertRef, repoRoot, die };
