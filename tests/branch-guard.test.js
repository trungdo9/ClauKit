/**
 * Tests for branch-guard.cjs — HEAD is shared once worktrees are retired.
 *
 * Two things must both hold or the guard is worthless: it denies every form of
 * HEAD movement (`checkout -b`, `switch -c`, plain switch, detach) while another
 * session is live, and it stays out of the way otherwise — file-restoring
 * checkouts, ref-only `git branch`, `--auto`, and an empty registry. The
 * benign cases carry the same weight as the refusals: a guard that fires on
 * `git checkout -- src/a.ts` would be routed around within a day.
 */

const { test } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const SCRIPT = path.join(__dirname, '..', 'scripts', 'ck', 'branch-guard.cjs');
const { classify, classifyCommand, assess } = require(SCRIPT);

const SESSIONS = new Set(['6c5ee444', 'aa11bb22']);
const NONE = new Set();

const kindOf = cmd => classify(cmd).kind;

// ---------- classification ----------

test('create-and-switch forms are recognised', () => {
  for (const cmd of ['git checkout -b feat/x', 'git checkout -B feat/x', 'git switch -c feat/x',
    'git switch -C feat/x', 'git switch --create feat/x']) {
    assert.strictEqual(kindOf(cmd), 'create', cmd);
  }
});

test('plain switches and detaches are recognised', () => {
  assert.strictEqual(kindOf('git checkout main'), 'switch');
  assert.strictEqual(kindOf('git switch main'), 'switch');
  assert.strictEqual(kindOf('git checkout --detach'), 'detach');
  assert.strictEqual(kindOf('git switch --detach main'), 'detach');
  // A hex ref is a detach, which is how the tdd baseline path reaches a base commit.
  assert.strictEqual(kindOf('git checkout 286a2fd'), 'detach');
  assert.strictEqual(kindOf('git checkout 286a2fd9c1e4b7a3f5d2081c6e9a4b7d3f5e1a2c'), 'detach');
});

test('file-restoring checkouts are not HEAD moves — guard-destructive owns those', () => {
  for (const cmd of ['git checkout -- src/a.ts', 'git checkout HEAD -- src/a.ts', 'git restore src/a.ts',
    'git checkout', 'git status', 'npm test']) {
    assert.strictEqual(kindOf(cmd), 'none', cmd);
  }
});

test('`git branch <new>` creates a ref without moving HEAD', () => {
  assert.strictEqual(kindOf('git branch feat/x'), 'branch-only');
  for (const cmd of ['git branch -d feat/x', 'git branch -a', 'git branch --list', 'git branch -m old new']) {
    assert.strictEqual(kindOf(cmd), 'none', cmd);
  }
});

test('env prefixes and git global options do not hide the subcommand', () => {
  assert.strictEqual(kindOf('CK_ALLOW_DESTRUCTIVE=1 git checkout -b feat/x'), 'create');
  assert.strictEqual(kindOf('git -C /tmp/repo switch -c feat/x'), 'create');
  assert.strictEqual(kindOf('git -c user.name=x checkout -b feat/x'), 'create');
  assert.strictEqual(kindOf('/usr/bin/git checkout -b feat/x'), 'create');
});

test('a HEAD move hidden in a compound command is still found', () => {
  const ops = classifyCommand('npm test && git checkout -b feat/x && echo done');
  assert.strictEqual(ops.length, 1);
  assert.strictEqual(ops[0].kind, 'create');
  assert.strictEqual(ops[0].target, 'feat/x');
});

test('a non-git command that merely mentions checkout is ignored', () => {
  for (const cmd of ['echo "git checkout -b x"', 'gitk --all', 'my-git-tool checkout -b x',
    'grep -rn "git checkout -b" docs/']) {
    assert.strictEqual(classifyCommand(cmd).length, 0, cmd);
  }
});

test('a HEAD move inside a shell wrapper is still found', () => {
  // Without descending into the payload, `bash -c "…"` reads as an invocation of
  // bash and the guard never sees the checkout.
  for (const cmd of ['bash -c "git checkout -b feat/x"', "sh -c 'git switch -c feat/x'",
    'bash -lc "git checkout -b feat/x"', 'zsh -c "npm test && git checkout -b feat/x"']) {
    const ops = classifyCommand(cmd);
    assert.strictEqual(ops.length, 1, cmd);
    assert.strictEqual(ops[0].kind, 'create', cmd);
  }
});

// ---------- decision ----------

test('DENY every HEAD move while another session is live', () => {
  for (const cmd of ['git checkout -b feat/x', 'git switch -c feat/x', 'git checkout main', 'git checkout 286a2fd']) {
    const res = assess(classifyCommand(cmd), SESSIONS, false);
    assert.strictEqual(res.verdict, 'DENY', cmd);
  }
});

test('the denial names the owning sessions and the alternative', () => {
  const res = assess(classifyCommand('git checkout -b feat/x'), SESSIONS, false);
  assert.match(res.reason, /6c5ee444/);
  assert.match(res.reason, /aa11bb22/);
  assert.match(res.reason, /stay on the current branch/);
  assert.match(res.reason, /--auto/, 'must name the one mode that is allowed to move HEAD');
  assert.match(res.reason, /STATE\.md/, 'must say what breaks, not just that it is refused');
});

test('ALLOW when no other session holds a claim', () => {
  const res = assess(classifyCommand('git checkout -b feat/x'), NONE, false);
  assert.strictEqual(res.verdict, 'ALLOW');
  assert.ok(res.notes.some(n => /no other live session/.test(n)));
});

test('--auto is the recorded consent and permits the move', () => {
  const res = assess(classifyCommand('git checkout -b feat/x'), SESSIONS, true);
  assert.strictEqual(res.verdict, 'ALLOW');
  assert.ok(res.notes.some(n => /--auto/.test(n)));
});

test('the denial names CK_AUTO_MODE — the only consent a hook can see', () => {
  // A slash command's --auto is invisible to a PreToolUse hook, so the message
  // must name the mechanism that does reach it.
  const res = assess(classifyCommand('git checkout -b feat/x'), SESSIONS, false);
  assert.match(res.reason, /CK_AUTO_MODE=1/);
  assert.match(res.reason, /CK_ALLOW_DESTRUCTIVE=1/, 'must point at the existing pattern it mirrors');
});

test('CK_AUTO_MODE=1 prefix consents to the segment it prefixes, and no other', () => {
  // Same binding as guard-destructive: bash does not carry VAR=1 across &&.
  const ops = classifyCommand('CK_AUTO_MODE=1 git switch -c feat/x && git checkout main');
  assert.strictEqual(ops.length, 2);
  assert.strictEqual(ops[0].consented, true);
  assert.strictEqual(ops[1].consented, false);

  const res = assess(ops, SESSIONS, false);
  assert.strictEqual(res.verdict, 'DENY', 'the unconsented switch must still be refused');
  assert.match(res.reason, /switch to `main`/);
  assert.ok(res.notes.some(n => /consented to 1 of 2/.test(n)));
});

test('a fully consented line is allowed', () => {
  const res = assess(classifyCommand('CK_AUTO_MODE=1 git checkout -b feat/x'), SESSIONS, false);
  assert.strictEqual(res.verdict, 'ALLOW');
});

test('a different env prefix is not consent', () => {
  for (const cmd of ['CK_AUTO_MODE=0 git checkout -b feat/x', 'CK_ALLOW_DESTRUCTIVE=1 git checkout -b feat/x',
    'FOO=1 git checkout -b feat/x']) {
    assert.strictEqual(assess(classifyCommand(cmd), SESSIONS, false).verdict, 'DENY', cmd);
  }
});

test('a ref-only branch create is allowed even with live sessions, with an advisory', () => {
  const res = assess(classifyCommand('git branch feat/x'), SESSIONS, false);
  assert.strictEqual(res.verdict, 'ALLOW');
  assert.ok(res.notes.some(n => /without moving HEAD/.test(n)));
});

test('commands with no branch operation are allowed', () => {
  assert.strictEqual(assess(classifyCommand('git add src/a.ts && git commit -m x'), SESSIONS, false).verdict, 'ALLOW');
});

// ---------- CLI ----------

function cli(...args) {
  return spawnSync('node', [SCRIPT, ...args], { encoding: 'utf-8', cwd: path.join(__dirname, '..') });
}

test('CLI exits 2 without a command', () => {
  assert.strictEqual(cli().status, 2);
  assert.match(cli().stderr, /usage/);
});

test('CLI allows a non-branch command in this repo', () => {
  const res = cli('git add src/a.ts');
  assert.strictEqual(res.status, 0, res.stderr);
  assert.match(res.stdout, /ALLOW/);
});

test('CLI --auto never denies', () => {
  const res = cli('git checkout -b feat/probe', '--auto');
  assert.strictEqual(res.status, 0, res.stderr);
});

test('an unreadable registry must not invent a refusal', () => {
  // Run from a directory with no .claude/hooks: foreignSessions() yields empty,
  // so the guard allows. A guard that fails closed on a missing registry would
  // block every project that does not ship the hook.
  const res = spawnSync('node', [SCRIPT, 'git checkout -b feat/x'], {
    encoding: 'utf-8', cwd: require('node:os').tmpdir(),
  });
  assert.strictEqual(res.status, 0, res.stderr);
});
