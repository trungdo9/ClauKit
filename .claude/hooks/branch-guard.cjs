#!/usr/bin/env node

/**
 * branch-guard.cjs — PreToolUse hook (matcher: Bash). Refuses a git command
 * that would move HEAD while another live session shares the working tree.
 *
 * WHY A HOOK. The verdict already existed in `scripts/ck/branch-guard.cjs` and
 * was registered nowhere: `.claude/settings.json` listed `scout-block` and
 * `guard-destructive` only, and the sole instruction to use it was one line of
 * prose in `.claude/commands/ck/git.md` ("Before running one, check it"). So the
 * gate fired exactly when the model chose to run it — which is not a gate, and
 * `guard-destructive`'s own suite asserts `git checkout -b feat/x` is benign, so
 * nothing else stopped it either. A shared HEAD is a mechanical invariant; it
 * needs a mechanical check.
 *
 * FAILS OPEN, deliberately and in three ways: an unparseable payload, a missing
 * checks module (a project that installed `.claude/` without `scripts/ck/`), and
 * an unreadable claim registry all exit 0. This hook adds a refusal to a
 * previously-allowed action, so a bug in it must not become a new way for work
 * to fail. The refusal is narrow and the override is documented in the message.
 *
 * Exit: 0 = allow · 2 = deny (reason on stderr, shown to the model)
 */

const fs = require('fs');
const path = require('path');

/** Where `scripts/ck/` sits relative to this hook, in the repo and in an install. */
function loadGuard() {
  try {
    return require(path.join(__dirname, '..', '..', 'scripts', 'ck', 'branch-guard.cjs'));
  } catch {
    return null;
  }
}

function main() {
  let payload;
  try {
    payload = JSON.parse(fs.readFileSync(0, 'utf-8'));
  } catch {
    process.exit(0); // cannot see the command
  }
  const command = payload && payload.tool_input && payload.tool_input.command;
  if (typeof command !== 'string' || !command.trim()) process.exit(0);

  // Run-wide consent. Same mechanism as guard-destructive's
  // CK_ALLOW_DESTRUCTIVE: a slash command's `--auto` never reaches a hook, an
  // env var does. A `CK_AUTO_MODE=1` PREFIX on the command consents to that
  // segment alone and is handled inside classify().
  if (process.env.CK_AUTO_MODE === '1') process.exit(0);

  const guard = loadGuard();
  if (!guard) process.exit(0);

  const cwd = payload.cwd || process.cwd();
  let res;
  try {
    const ops = guard.classifyCommand(command);
    if (!ops.length) process.exit(0);          // no branch operation: say nothing
    res = guard.assess(ops, guard.foreignSessions(cwd), false);
  } catch {
    process.exit(0);                            // a bug here must not block Bash
  }

  if (res.verdict === 'DENY') {
    console.error(`BLOCKED (shared HEAD): ${res.reason}`);
    process.exit(2);
  }
  // Only real advisories reach the model — the `note:` prefix, which today means
  // "`git branch <new>` creates a ref nobody is on". The rest of `notes` is the
  // verdict's own bookkeeping ("no other live session holds a claim", consent
  // counts): true, useless here, and printed on every allowed branch command. A
  // guard that chatters gets routed around, so it says nothing when it allows.
  for (const n of res.notes.filter(n => n.startsWith('note:'))) console.error(`[branch-guard] ${n}`);
  process.exit(0);
}

if (require.main === module) main();

module.exports = { loadGuard };
