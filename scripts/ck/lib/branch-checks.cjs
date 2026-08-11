/**
 * branch-checks.cjs — classify git commands that move HEAD, and decide.
 * Verdict only; command parsing lives in `lib/shell-parse.cjs`, the CLI in
 * `scripts/ck/branch-guard.cjs`, the hook in `.claude/hooks/branch-guard.cjs`.
 *
 * WHY. The worktree fleet was retired (2026-08-05), so concurrent sessions no
 * longer get a tree each — they share **one working tree and one HEAD**. That
 * turns branch creation from a private act into a global one: `git checkout -b
 * feat/x` relocates the HEAD of every other live session at once. They keep
 * editing, and their next commit lands on a branch they never chose; the base SHA
 * each recorded in `STATE.md` no longer describes HEAD, so
 * `review-package.cjs BASE..HEAD` spans the wrong range and a `run-state` resume
 * re-derives against the wrong history.
 *
 * Nothing caught this. `guard-destructive` denies whole-tree `checkout`/`restore`
 * (pathspec `.`, `:/`, `-f`) but its own suite asserts `git checkout -b feat/x`
 * and `git checkout main` are benign, and `switch` is not matched at all. The
 * `tdd` scratch-branch path stops on a FOREIGN *dirty file* — but a session
 * mid-plan with nothing dirty yet still gets its HEAD moved out from under it.
 *
 * SCOPE. Only HEAD movement is denied, because only HEAD is shared: create-and-
 * switch, plain switch, detach. A bare `git branch <new>` creates a ref and moves
 * nothing, so it is allowed with an advisory — the rule is about not relocating
 * other sessions, not about ref hygiene.
 */

const { commandSegments, normalizeSegment, unquote } = require('./shell-parse.cjs');

/** A ref that looks like an object id — checking it out detaches HEAD. */
const SHA = /^[0-9a-f]{7,40}$/i;

/**
 * Per-segment consent, same shape and binding as `guard-destructive`'s
 * `CK_ALLOW_DESTRUCTIVE=1`: it exempts the segment it prefixes and nothing else,
 * because bash does not carry a `VAR=1` prefix across `&&`.
 */
const AUTO_PREFIX = /^CK_AUTO_MODE=1(\s|$)/;

const MOVES_HEAD = new Set(['create', 'switch', 'detach']);

/**
 * Classify one git invocation: 'create' · 'switch' · 'detach' · 'branch-only' · 'none'.
 * 'create' covers create-and-switch only. `consented` records the per-segment
 * `CK_AUTO_MODE=1` prefix.
 */
function classify(segment) {
  const consented = AUTO_PREFIX.test(String(segment).trim());
  const tokens = normalizeSegment(segment);
  if (!tokens) return { kind: 'none' };
  const [sub, ...args] = tokens;
  const has = (...flags) => args.some(a => flags.includes(a));
  const positional = args.filter(a => !a.startsWith('-')).map(unquote);
  const op = (kind, target) => ({ kind, target, consented });

  if (sub === 'switch') {
    if (has('-c', '-C', '--create', '--force-create')) return op('create', positional[0]);
    if (has('-d', '--detach')) return op('detach', positional[0]);
    if (!positional.length) return { kind: 'none' };
    return op('switch', positional[0]);
  }

  if (sub === 'checkout') {
    // `checkout -- <paths>` / `checkout <ref> -- <paths>` restores files; that is
    // guard-destructive's territory, not a HEAD move.
    if (args.includes('--')) return { kind: 'none' };
    if (has('-b', '-B')) return op('create', positional[0]);
    if (has('--detach')) return op('detach', positional[0]);
    if (!positional.length) return { kind: 'none' };
    const target = positional[0];
    return op(SHA.test(target) ? 'detach' : 'switch', target);
  }

  if (sub === 'branch') {
    // Creating a ref moves no HEAD; listing/deleting/renaming is inert here.
    if (has('-d', '-D', '--delete', '-m', '-M', '--move', '-a', '-r', '--list')) return { kind: 'none' };
    return positional.length ? op('branch-only', positional[0]) : { kind: 'none' };
  }

  return { kind: 'none' };
}

/** Every HEAD-affecting op in a command line, wrappers expanded, in order. */
function classifyCommand(cmd, depth = 0) {
  return commandSegments(cmd, depth).map(classify).filter(op => op.kind !== 'none');
}

/**
 * Pure decision, so the CLI, the hook and the tests share one verdict.
 * `auto` = run-wide consent (`--auto` flag or `CK_AUTO_MODE=1` in the
 * environment); a per-segment prefix consents to that segment alone.
 */
function assess(ops, sessions, auto) {
  const notes = ops
    .filter(op => op.kind === 'branch-only')
    .map(op => `note: \`git branch ${op.target}\` creates a ref without moving HEAD — allowed, but nobody is on it until someone switches`);

  const moves = ops.filter(op => MOVES_HEAD.has(op.kind));
  if (!moves.length) return { verdict: 'ALLOW', notes };
  if (auto) return { verdict: 'ALLOW', notes: [...notes, `--auto: HEAD move permitted (${moves.map(m => m.kind).join(', ')})`] };

  const unconsented = moves.filter(op => !op.consented);
  if (moves.length !== unconsented.length)
    notes.push(`CK_AUTO_MODE=1 consented to ${moves.length - unconsented.length} of ${moves.length} HEAD move(s) in this line`);
  if (!unconsented.length) return { verdict: 'ALLOW', notes };
  if (!sessions.size) return { verdict: 'ALLOW', notes: [...notes, 'no other live session holds a claim'] };

  const op = unconsented[0];
  const what = op.kind === 'create'
    ? `create + switch to \`${op.target}\``
    : op.kind === 'detach' ? `detach HEAD at \`${op.target}\`` : `switch to \`${op.target}\``;
  return {
    verdict: 'DENY',
    notes,
    reason: [
      `refusing to ${what} — ${sessions.size} other live session(s) share this working tree: ${[...sessions].join(', ')}`,
      '',
      'HEAD is shared. Moving it relocates those sessions mid-run: their next commit lands on a branch',
      'they never chose, and the base SHA each recorded in STATE.md stops describing HEAD.',
      '',
      'Instead:',
      '  · stay on the current branch — the default for every mode except --auto;',
      '  · need a branch anyway? ask the user, or wait until `file-claims.cjs list` shows no FOREIGN rows;',
      '  · autonomous run (`/ck:cook --auto`)? prefix the one command with `CK_AUTO_MODE=1`, or export it',
      '    for the run — same shape as CK_ALLOW_DESTRUCTIVE=1, and it binds to that segment only.',
    ].join('\n'),
  };
}

module.exports = { classify, classifyCommand, assess, normalizeSegment, MOVES_HEAD, AUTO_PREFIX };
