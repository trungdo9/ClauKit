#!/usr/bin/env node

/**
 * branch-guard.cjs — refuse to move HEAD while another live session shares the
 * tree (CLI). Checks and rationale live in `lib/branch-checks.cjs`.
 *
 * Usage: node scripts/ck/branch-guard.cjs "<git command>" [--auto]
 * Exit:  0 = ALLOW · 1 = DENY (reason on stderr) · 2 = usage
 *
 * This is the ASK-FIRST path, for a command a pipeline is about to run. The
 * mechanical one is `.claude/hooks/branch-guard.cjs`, a PreToolUse hook that
 * requires this file and applies the same verdict to every Bash call — prose in
 * a command doc ("before running one, check it") is not enforcement, and for one
 * release this guard existed with no registration anywhere.
 *
 * CONSENT. `/ck:cook --auto` and the other `--auto` pipelines may branch per
 * feature — the flag is the operator's consent, given at invocation. A slash
 * command's flags are invisible to a PreToolUse hook, so consent travels the way
 * `guard-destructive` already does it: `CK_AUTO_MODE=1`, as an env var for the run
 * or as a prefix on the one command (prefix binds to that segment only).
 *
 * Deliberately NOT derived from the run ledger: a `--auto` line in a plan's
 * STATE.md is durable, and a durable marker makes consent sticky — a later
 * interactive session in the same plan dir would inherit permission it was never
 * given. Per-command consent cannot go stale.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { repoRoot } = require('./lib/common.cjs');
const checks = require('./lib/branch-checks.cjs');

/**
 * Session ids holding a live claim other than ours, via the documented
 * `file-claims.cjs list` CLI (its own pruning decides what "live" means).
 * A registry that cannot be read yields an empty set — this guard adds a
 * refusal, so it must never become a new way for work to fail.
 *
 * The registry is resolved against the REPO ROOT, not the cwd. Spawning
 * `.claude/hooks/file-claims.cjs` as a cwd-relative path meant that from any
 * subdirectory the spawn failed, the catch below returned an empty set, and
 * every HEAD move was allowed with the note "no other live session holds a
 * claim" — a fail-open that reads as a verdict. `list` itself resolves the
 * worktree from its cwd, so it is given the root too.
 */
function foreignSessions(cwd = process.cwd()) {
  try {
    const root = repoRoot(cwd) || cwd;
    const registry = path.join(root, '.claude', 'hooks', 'file-claims.cjs');
    if (!fs.existsSync(registry)) return new Set();
    const out = execFileSync('node', [registry, 'list'],
      { cwd: root, encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] });
    const ids = new Set();
    for (const line of out.split('\n')) {
      const m = line.match(/^FOREIGN\s+(\S+)/);
      if (m) ids.add(m[1]);
    }
    return ids;
  } catch {
    return new Set();
  }
}

function main() {
  const argv = process.argv.slice(2);
  const cmd = argv.find(a => !a.startsWith('--'));
  if (!cmd) {
    console.error('✗ usage: branch-guard.js "<git command>" [--auto]');
    process.exit(2);
  }
  const auto = argv.includes('--auto') || process.env.CK_AUTO_MODE === '1';
  const ops = checks.classifyCommand(cmd);
  const res = checks.assess(ops, foreignSessions(), auto);
  for (const n of res.notes) console.log(n);
  if (res.verdict === 'DENY') {
    console.error(`✗ ${res.reason}`);
    process.exit(1);
  }
  console.log(`✓ branch-guard ALLOW${ops.length ? '' : ' (no branch operation)'}`);
}

if (require.main === module) main();

module.exports = { foreignSessions, ...checks };
