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

const SCRIPT = path.join(__dirname, '..', '.claude', 'scripts', 'ck', 'branch-guard.cjs');
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

test('a global option outside the old whitelist does not hide the subcommand', () => {
  // The loop used to `break` on the first unrecognised token, so `--no-pager`
  // became tokens[0], `sub` was never `checkout`, and the guard allowed it.
  for (const cmd of ['git --no-pager checkout -b feat/x', 'git -P switch -c feat/x',
    'git --git-dir /tmp/r switch -c feat/x', 'git --git-dir=/tmp/r switch -c feat/x',
    'git --no-optional-locks checkout -b feat/x']) {
    assert.strictEqual(kindOf(cmd), 'create', cmd);
  }
});

test('a launcher prefix does not hide the subcommand', () => {
  for (const cmd of ['env git checkout -b feat/x', 'nohup git switch -c feat/x',
    'env FOO=1 git checkout -b feat/x']) {
    assert.strictEqual(kindOf(cmd), 'create', cmd);
  }
});

test('a quoted ref is reported without its quotes', () => {
  assert.deepStrictEqual(classify('git checkout -b "feat/x"'),
    { kind: 'create', target: 'feat/x', consented: false });
});

test('newline and single & separate commands as surely as && does', () => {
  // Multi-line Bash strings are the normal shape for an agent's git calls, and a
  // single `&` backgrounds the left side. Neither was a separator, so each of
  // these arrived as ONE segment whose first token is not `git` — ALLOW, 0 ops.
  for (const cmd of ['git add -A\ngit checkout -b feat/x', 'git add -A\r\ngit switch -c feat/x',
    'git status & git checkout -b feat/x', 'git checkout -b feat/x & wait']) {
    const ops = classifyCommand(cmd);
    assert.strictEqual(ops.length, 1, cmd);
    assert.strictEqual(ops[0].kind, 'create', cmd);
  }
});

test('a separator inside a quoted string is not a separator', () => {
  // The price of noticing `&` must not be denying commands that execute no git.
  for (const cmd of ['echo "a && git checkout -b x"', 'echo "a & git switch -c x"',
    'git commit -m "wip & more"', "git commit -m 'a; git checkout -b x'"]) {
    assert.strictEqual(classifyCommand(cmd).length, 0, cmd);
  }
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

test('a wrapper followed by more text is still descended into', () => {
  // The pattern was anchored `^…\s*$`, so any trailing text made it miss; the
  // line then fell through to a plain split and `sh -c "…"` read as an
  // invocation of `sh`, whose first token is not `git`.
  for (const cmd of ['sh -c "git switch -c feat/x" && echo hi', 'bash -c "git checkout -b feat/x"; true',
    'echo start; bash -lc "git switch -c feat/x"; echo end']) {
    const ops = classifyCommand(cmd);
    assert.strictEqual(ops.length, 1, cmd);
    assert.strictEqual(ops[0].kind, 'create', cmd);
  }
});

test('ops keep textual order across a wrapper boundary', () => {
  const ops = classifyCommand('git checkout main && sh -c "git switch -c feat/x"');
  assert.deepStrictEqual(ops.map(o => `${o.kind}:${o.target}`), ['switch:main', 'create:feat/x']);
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

// ---------- the hook (registration is the gate; prose is not) ----------

const fs = require('node:fs');
const os = require('node:os');
const HOOK = path.join(__dirname, '..', '.claude', 'hooks', 'branch-guard.cjs');
const REPO = path.join(__dirname, '..');

/** A throwaway repo with one dirty tracked file and its own claim registry. */
function seededRepo(claims) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ck-bg-'));
  spawnSync('git', ['init', '-q'], { cwd: dir });
  fs.writeFileSync(path.join(dir, 'a.txt'), 'base\n');
  spawnSync('git', ['add', '.'], { cwd: dir });
  spawnSync('git', ['-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', 'base'], { cwd: dir });
  fs.appendFileSync(path.join(dir, 'a.txt'), 'dirty\n');   // claims on clean files are pruned
  fs.mkdirSync(path.join(dir, '.claude', 'hooks'), { recursive: true });
  fs.copyFileSync(path.join(REPO, '.claude', 'hooks', 'file-claims.cjs'),
    path.join(dir, '.claude', 'hooks', 'file-claims.cjs'));
  if (claims) fs.writeFileSync(path.join(dir, '.claude', '.ck-file-claims.jsonl'), claims);
  return dir;
}

function hook(command, cwd, env = {}) {
  return spawnSync('node', [HOOK], {
    encoding: 'utf-8',
    input: JSON.stringify({ tool_input: { command }, cwd, session_id: 'mine1234' }),
    env: { ...process.env, CK_AUTO_MODE: '', CLAUDE_CODE_SESSION_ID: 'mine1234', ...env },
  });
}

test('the hook DENIES a HEAD move while a foreign claim is live', () => {
  const dir = seededRepo(JSON.stringify({ session: 'foreign9', file: 'a.txt', ts: Date.now(), tool: 'Edit' }) + '\n');
  try {
    const res = hook('git checkout -b feat/x', dir);
    assert.strictEqual(res.status, 2, `expected a blocking exit\nstdout: ${res.stdout}\nstderr: ${res.stderr}`);
    assert.match(res.stderr, /BLOCKED \(shared HEAD\)/);
    assert.match(res.stderr, /foreign9/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('the hook is silent and allows when nothing else holds a claim', () => {
  const dir = seededRepo(null);
  try {
    const res = hook('git checkout -b feat/x', dir);
    assert.strictEqual(res.status, 0, res.stderr);
    assert.strictEqual((res.stdout + res.stderr).trim(), '',
      'the verdict\'s bookkeeping ("no other live session holds a claim") is not news to the model');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('the hook still passes on the one real advisory', () => {
  // `git branch <new>` moves no HEAD, so it is allowed — but nobody is on it.
  const dir = seededRepo(JSON.stringify({ session: 'foreign9', file: 'a.txt', ts: Date.now(), tool: 'Edit' }) + '\n');
  try {
    const res = hook('git branch feat/x', dir);
    assert.strictEqual(res.status, 0);
    assert.match(res.stderr, /without moving HEAD/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('the hook says nothing at all about a command with no branch operation', () => {
  const dir = seededRepo(JSON.stringify({ session: 'foreign9', file: 'a.txt', ts: Date.now(), tool: 'Edit' }) + '\n');
  try {
    const res = hook('npm test', dir);
    assert.strictEqual(res.status, 0);
    assert.strictEqual((res.stdout + res.stderr).trim(), '', 'a guard that chatters gets routed around');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('CK_AUTO_MODE=1 in the environment is consent the hook honours', () => {
  const dir = seededRepo(JSON.stringify({ session: 'foreign9', file: 'a.txt', ts: Date.now(), tool: 'Edit' }) + '\n');
  try {
    assert.strictEqual(hook('git checkout -b feat/x', dir, { CK_AUTO_MODE: '1' }).status, 0);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('the hook fails open on a payload it cannot read', () => {
  for (const input of ['', 'not json', '{"tool_input":{}}']) {
    const res = spawnSync('node', [HOOK], { encoding: 'utf-8', input });
    assert.strictEqual(res.status, 0, `input ${JSON.stringify(input)} must not block Bash`);
  }
});

test('the hook is registered in settings.json — an unregistered gate never fires', () => {
  const settings = JSON.parse(fs.readFileSync(path.join(REPO, '.claude', 'settings.json'), 'utf-8'));
  const bash = (settings.hooks.PreToolUse || []).filter(g => g.matcher === 'Bash');
  const commands = bash.flatMap(g => g.hooks.map(h => h.command));
  assert.ok(commands.some(c => /branch-guard\.cjs/.test(c)),
    'the verdict shipped once with no registration anywhere; this asserts it cannot happen again');
});
