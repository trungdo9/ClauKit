/**
 * Tests for file-claims.cjs — the per-worktree claim registry (T1.2b).
 */

const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const HOOK = path.join(__dirname, '..', '.claude', 'hooks', 'file-claims.cjs');
const { readClaims, claimsPath } = require(HOOK);

let repo;

function git(args, cwd) {
  const res = spawnSync('git', args, { cwd: cwd || repo, encoding: 'utf-8' });
  assert.strictEqual(res.status, 0, `git ${args.join(' ')} failed: ${res.stderr}`);
  return res.stdout;
}

function runHook(payload, env) {
  return spawnSync('node', [HOOK], {
    input: JSON.stringify(payload),
    encoding: 'utf-8',
    cwd: repo,
    env: { ...process.env, ...env },
  });
}

function seedClaim(session, file, tool = 'Edit') {
  const res = runHook({
    session_id: session,
    cwd: repo,
    tool_name: tool,
    tool_input: { file_path: path.join(repo, file) },
  });
  assert.strictEqual(res.status, 0, `hook exited ${res.status}: ${res.stderr}`);
}

before(() => {
  repo = fs.mkdtempSync(path.join(os.tmpdir(), 'ck-claims-'));
  git(['init', '-q'], repo);
  git(['config', 'user.email', 'test@test'], repo);
  git(['config', 'user.name', 'test'], repo);
  fs.writeFileSync(path.join(repo, 'a.txt'), 'a\n');
  fs.writeFileSync(path.join(repo, 'b.txt'), 'b\n');
  git(['add', '.'], repo);
  git(['commit', '-qm', 'init'], repo);
});

after(() => {
  fs.rmSync(repo, { recursive: true, force: true });
});

test('hook appends a claim for a dirty file, readClaims returns it', () => {
  fs.writeFileSync(path.join(repo, 'a.txt'), 'a-changed\n');
  seedClaim('session-A', 'a.txt');
  const claims = readClaims(repo);
  assert.strictEqual(claims.length, 1);
  assert.strictEqual(claims[0].session, 'session-A');
  assert.strictEqual(claims[0].file, 'a.txt');
});

test('claim on a CLEAN file is pruned on read (self-cleaning)', () => {
  fs.writeFileSync(path.join(repo, 'b.txt'), 'b-changed\n');
  seedClaim('session-B', 'b.txt');
  // commit b.txt → claim becomes moot
  git(['add', 'b.txt'], repo);
  git(['commit', '-qm', 'commit b'], repo);
  const claims = readClaims(repo);
  assert.ok(!claims.some(c => c.file === 'b.txt'), 'clean-file claim must be pruned');
  assert.ok(claims.some(c => c.file === 'a.txt'), 'dirty-file claim must survive');
});

test('claims older than TTL are pruned', () => {
  const claims = readClaims(repo, { now: Date.now() + 5 * 60 * 60 * 1000 }); // 5h later, default TTL 4h
  assert.strictEqual(claims.length, 0);
});

test('two sessions on the same tree: list --json marks mine vs foreign', () => {
  fs.writeFileSync(path.join(repo, 'b.txt'), 'b-again\n');
  seedClaim('session-B', 'b.txt');
  const res = spawnSync('node', [HOOK, 'list', '--json'], {
    cwd: repo,
    encoding: 'utf-8',
    env: { ...process.env, CLAUDE_CODE_SESSION_ID: 'session-A' },
  });
  const claims = JSON.parse(res.stdout);
  const mine = claims.filter(c => c.mine).map(c => c.file);
  const foreign = claims.filter(c => !c.mine).map(c => c.file);
  assert.deepStrictEqual(mine, ['a.txt']);
  assert.deepStrictEqual(foreign, ['b.txt']);
});

test('tolerates a partial trailing line (concurrent append)', () => {
  fs.appendFileSync(claimsPath(repo), '{"session":"sess');
  const claims = readClaims(repo);
  assert.ok(claims.length >= 2, 'valid claims still readable');
});

test('compacts the registry past the line threshold', () => {
  const file = claimsPath(repo);
  const stale = JSON.stringify({ session: 's', file: 'gone.txt', ts: 1, tool: 'Edit' });
  fs.appendFileSync(file, (stale + '\n').repeat(2100));
  readClaims(repo); // triggers compaction
  const lines = fs.readFileSync(file, 'utf-8').split('\n').filter(Boolean);
  assert.ok(lines.length < 100, `expected compacted file, got ${lines.length} lines`);
});

test('hook never blocks: garbage stdin exits 0', () => {
  const res = spawnSync('node', [HOOK], { input: 'garbage', encoding: 'utf-8', cwd: repo });
  assert.strictEqual(res.status, 0);
});

test('file outside the worktree is ignored', () => {
  const res = runHook({
    session_id: 'session-C',
    cwd: repo,
    tool_name: 'Write',
    tool_input: { file_path: '/etc/hosts' },
  });
  assert.strictEqual(res.status, 0);
  assert.ok(!readClaims(repo).some(c => c.session === 'session-C'));
});

// `git status --porcelain` collapses an untracked directory to `?? src/`, so a
// claim on a file inside it never matched the dirty set and was pruned as
// "clean" — losing exactly the files a concurrent session had just created.
test('a claim inside a NEW untracked directory survives pruning', () => {
  const dir = path.join(repo, 'brand-new-dir');
  fs.mkdirSync(dir, { recursive: true });
  const rel = 'brand-new-dir/fresh.ts';
  fs.writeFileSync(path.join(repo, rel), 'export const x = 1;\n');
  const res = runHook({
    session_id: 'session-D',
    cwd: repo,
    tool_name: 'Write',
    tool_input: { file_path: path.join(repo, rel) },
  });
  assert.strictEqual(res.status, 0);
  const live = readClaims(repo);
  assert.ok(live.some(c => c.session === 'session-D' && c.file === rel),
    `claim on a file in a new untracked directory must survive; got ${JSON.stringify(live)}`);
});
