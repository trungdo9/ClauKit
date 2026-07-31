/**
 * Tests for guard-destructive.js (T1.2 / G5).
 *
 * Tier A: irreversible-loss shapes always deny, benign lookalikes pass.
 * Tier B: over-broad staging denies IFF a foreign live claim exists.
 */

const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const HOOK = path.join(__dirname, '..', '.claude', 'hooks', 'guard-destructive.js');
const CLAIMS = path.join(__dirname, '..', '.claude', 'hooks', 'file-claims.js');

let repo;

function git(args) {
  const res = spawnSync('git', args, { cwd: repo, encoding: 'utf-8' });
  assert.strictEqual(res.status, 0, `git ${args.join(' ')} failed: ${res.stderr}`);
}

function runGuard(command, opts = {}) {
  const env = { ...process.env, ...(opts.env || {}) };
  delete env.CK_ALLOW_DESTRUCTIVE;
  Object.assign(env, opts.env || {});
  return spawnSync('node', [HOOK], {
    input: JSON.stringify({ session_id: opts.session || 'me-session', cwd: opts.cwd || repo, tool_input: { command } }),
    encoding: 'utf-8',
    cwd: opts.cwd || repo,
    env,
  });
}

function seedClaim(session, file) {
  const res = spawnSync('node', [CLAIMS], {
    input: JSON.stringify({ session_id: session, cwd: repo, tool_name: 'Edit', tool_input: { file_path: path.join(repo, file) } }),
    encoding: 'utf-8',
    cwd: repo,
  });
  assert.strictEqual(res.status, 0);
}

before(() => {
  repo = fs.mkdtempSync(path.join(os.tmpdir(), 'ck-guard-'));
  git(['init', '-q']);
  git(['config', 'user.email', 't@t']);
  git(['config', 'user.name', 't']);
  fs.writeFileSync(path.join(repo, 'mine.ts'), 'x\n');
  fs.writeFileSync(path.join(repo, 'theirs.ts'), 'y\n');
  git(['add', '.']);
  git(['commit', '-qm', 'init']);
});

after(() => {
  fs.rmSync(repo, { recursive: true, force: true });
});

// ---------- Tier A: 14 destructive shapes deny ----------

const TIER_A_DENY = [
  'git stash -u',
  'git stash --include-untracked',
  'git stash -au',
  'git reset --hard',
  'git reset --hard HEAD~1',
  'git clean -fd',
  'git clean -fdx',
  'git clean -f -d',
  'git checkout .',
  'git checkout -- .',
  'git restore .',
  'git push --force origin main',
  'git push -f',
  'cd sub && git reset --hard',
  'psql -c "DELETE FROM users"',
  'mysql -e "TRUNCATE TABLE sessions"',
  'psql "$DSN" -c "DROP TABLE answers"',
  'psql -c "UPDATE users SET active = false"',
];

for (const cmd of TIER_A_DENY) {
  test(`tier A denies: ${cmd}`, () => {
    const res = runGuard(cmd);
    assert.strictEqual(res.status, 2, `expected DENY for: ${cmd}\n${res.stderr}`);
    assert.ok(res.stderr.length > 0, 'denial must carry a message naming the alternative');
  });
}

// ---------- Benign lookalikes pass ----------

const BENIGN_ALLOW = [
  'git stash list',
  'git stash push -- src/a.ts',
  'git stash pop',
  'git add -p',
  'git add src/auth/token.ts tests/auth/token.test.ts',
  'git clean -n',
  'git checkout main',
  'git checkout -b feature/x',
  'git restore --source=HEAD -- src/a.ts',
  'git restore --staged .',
  'git push --force-with-lease origin main',
  'git reset --soft HEAD~1',
  'grep -rn "DELETE FROM" src/',
  'echo "DELETE FROM is dangerous"',
  'psql -c "SELECT * FROM users WHERE deleted_at IS NULL"',
  'psql -c "UPDATE users SET active = false WHERE id = 42"',
];

for (const cmd of BENIGN_ALLOW) {
  test(`benign passes: ${cmd}`, () => {
    const res = runGuard(cmd);
    assert.strictEqual(res.status, 0, `expected ALLOW for: ${cmd}\n${res.stderr}`);
  });
}

// ---------- Tier A extras from T1.6 ----------

test('npm ci onto a node_modules symlink denies', () => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'ck-nm-'));
  fs.symlinkSync(target, path.join(repo, 'node_modules'));
  try {
    const res = runGuard('npm ci');
    assert.strictEqual(res.status, 2, res.stderr);
    assert.match(res.stderr, /SYMLINK/i);
  } finally {
    fs.unlinkSync(path.join(repo, 'node_modules'));
    fs.rmSync(target, { recursive: true, force: true });
  }
});

test('npm ci with a real node_modules dir passes', () => {
  fs.mkdirSync(path.join(repo, 'node_modules'));
  try {
    const res = runGuard('npm ci');
    assert.strictEqual(res.status, 0, res.stderr);
  } finally {
    fs.rmSync(path.join(repo, 'node_modules'), { recursive: true });
  }
});

test('rm -rf on a registered worktree path denies', () => {
  const wt = path.join(os.tmpdir(), `ck-wt-${process.pid}`);
  git(['worktree', 'add', '-q', wt, '-b', 'tmp-wt']);
  try {
    const res = runGuard(`rm -rf ${wt}`);
    assert.strictEqual(res.status, 2, res.stderr);
    assert.match(res.stderr, /worktree remove/);
  } finally {
    git(['worktree', 'remove', '--force', wt]);
    git(['branch', '-D', 'tmp-wt']);
  }
});

test('rm -rf on a normal directory passes', () => {
  const res = runGuard(`rm -rf ${path.join(repo, 'some-scratch-dir')}`);
  assert.strictEqual(res.status, 0, res.stderr);
});

// ---------- Tier B: claim-registry-driven ----------

test('tier B allows git add -A with an empty registry (solo session)', () => {
  const res = runGuard('git add -A');
  assert.strictEqual(res.status, 0, res.stderr);
});

test('tier B denies git add -A with a seeded foreign claim, names the conflict + scoped command', () => {
  fs.writeFileSync(path.join(repo, 'theirs.ts'), 'their edit\n');
  fs.writeFileSync(path.join(repo, 'mine.ts'), 'my edit\n');
  seedClaim('other-session', 'theirs.ts');
  seedClaim('me-session', 'mine.ts');

  const res = runGuard('git add -A', { session: 'me-session' });
  assert.strictEqual(res.status, 2, `expected DENY:\n${res.stderr}`);
  assert.match(res.stderr, /theirs\.ts/);
  assert.match(res.stderr, /git add mine\.ts/);

  const resCommit = runGuard('git commit -am "msg"', { session: 'me-session' });
  assert.strictEqual(resCommit.status, 2, 'git commit -am must hit the same gate');

  const resStash = runGuard('git stash', { session: 'me-session' });
  assert.strictEqual(resStash.status, 2, 'bare git stash must hit the same gate');
});

test('tier B allows again once the foreign claim\'s file is committed (self-cleaning)', () => {
  git(['add', 'theirs.ts']);
  git(['commit', '-qm', 'their work landed']);
  const res = runGuard('git add -A', { session: 'me-session' });
  assert.strictEqual(res.status, 0, res.stderr);
});

// ---------- escape hatch + failure posture ----------

test('CK_ALLOW_DESTRUCTIVE=1 command prefix overrides', () => {
  const res = runGuard('CK_ALLOW_DESTRUCTIVE=1 git reset --hard');
  assert.strictEqual(res.status, 0, res.stderr);
});

test('unparseable payload fails open', () => {
  const res = spawnSync('node', [HOOK], { input: 'garbage', encoding: 'utf-8', cwd: repo });
  assert.strictEqual(res.status, 0);
});

// ---------- review regressions (found by code review, 2026-07-31) ----------

// Only the FIRST git invocation in a segment was ever inspected, and newlines
// were not separators — so a multi-line command hid everything after line 1.
const MULTILINE_DENY = [
  'git status\ngit reset --hard',
  'git log --oneline\ngit clean -fdx',
  'echo start\r\ngit stash -u',
  'set -e\ngit fetch\ngit push --force origin main',
  'git status & git reset --hard',
];

for (const cmd of MULTILINE_DENY) {
  test(`multi-line/backgrounded still denies: ${JSON.stringify(cmd)}`, () => {
    const res = runGuard(cmd);
    assert.strictEqual(res.status, 2, `expected DENY for: ${cmd}\n${res.stderr}`);
  });
}

// `git clean -f` spares untracked DIRECTORIES but still deletes untracked
// files throughout the tree — the -d/-x requirement left that loss path open.
test('git clean -f alone denies (untracked files are still destroyed)', () => {
  const res = runGuard('git clean -f');
  assert.strictEqual(res.status, 2, res.stderr);
});

test('git clean --force denies (long form)', () => {
  assert.strictEqual(runGuard('git clean --force').status, 2);
});

test('git clean -n and --dry-run still pass', () => {
  assert.strictEqual(runGuard('git clean -n').status, 0);
  assert.strictEqual(runGuard('git clean --dry-run').status, 0);
});

// The SQL match ran against the whole command while the client was detected
// per segment, so a harmless echo in segment 2 was attributed to psql.
test('DB client in one segment does not arm SQL matching in another', () => {
  const res = runGuard('psql -c "SELECT 1" && echo "DELETE FROM users is scary"');
  assert.strictEqual(res.status, 0, res.stderr);
});

test('destructive SQL in the same segment as the client still denies', () => {
  assert.strictEqual(runGuard('psql -c "DELETE FROM users"').status, 2);
});

// Heredoc bodies are data. Found by dogfooding: committing the fix for the
// multi-line bypass was itself denied, because the commit message described
// `git clean -fdx`. Documenting a destructive command must never trip the guard.
test('a commit message describing destructive commands is not a destructive command', () => {
  const cmd = [
    "git commit -q -F - <<'MSG'",
    'fix(install): ship hooks with the kit',
    '',
    'plans/**/* hid STATE.md, which git clean -fdx then deletes.',
    'Rolling a batch back used to say git reset --hard; it now scopes.',
    'MSG',
  ].join('\n');
  const res = runGuard(cmd);
  assert.strictEqual(res.status, 0, `heredoc prose must not deny:\n${res.stderr}`);
});

test('a real destructive command after a heredoc is still caught', () => {
  const cmd = ["cat <<'EOF' > notes.txt", 'just some notes', 'EOF', 'git reset --hard'].join('\n');
  assert.strictEqual(runGuard(cmd).status, 2, 'stripping heredocs must not blind the rest of the command');
});
