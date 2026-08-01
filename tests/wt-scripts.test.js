/**
 * Tests for the worktree fleet scripts (T1.6a): wt-new, wt-doctor, wt-clean.
 */

const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const SCRIPTS = path.join(__dirname, '..', 'scripts', 'ck');

let base;   // parent dir holding fixture repos + worktrees
let repo;   // healthy fixture repo

function git(args, cwd) {
  const res = spawnSync('git', args, { cwd, encoding: 'utf-8' });
  assert.strictEqual(res.status, 0, `git ${args.join(' ')} failed: ${res.stderr}`);
  return res.stdout;
}

function runScript(name, args, cwd) {
  return spawnSync('node', [path.join(SCRIPTS, name), ...args], { cwd, encoding: 'utf-8' });
}

function mkRepo(name, opts = {}) {
  const dir = path.join(base, name);
  fs.mkdirSync(dir, { recursive: true });
  git(['init', '-q'], dir);
  git(['config', 'user.email', 't@t'], dir);
  git(['config', 'user.name', 't'], dir);
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({
    name, version: '1.0.0',
    scripts: { test: opts.redTests ? 'node -e "process.exit(1)"' : 'node -e "process.exit(0)"' },
  }, null, 2));
  if (opts.nodeModulesSymlink) fs.symlinkSync(opts.nodeModulesSymlink, path.join(dir, 'node_modules'));
  git(['add', '-A'], dir);
  git(['commit', '-qm', 'init'], dir);
  return dir;
}

before(() => {
  base = fs.mkdtempSync(path.join(os.tmpdir(), 'ck-wt-test-'));
  repo = mkRepo('healthy');
});

after(() => {
  fs.rmSync(base, { recursive: true, force: true });
});

test('wt-new provisions outside the repo root and the smoke gate passes on a green base', () => {
  const res = runScript('wt-new.cjs', ['feat1', '--skip-install'], repo);
  assert.strictEqual(res.status, 0, res.stdout + res.stderr);
  const wt = path.join(base, 'healthy-wt-feat1');
  assert.ok(fs.existsSync(wt), 'worktree dir must exist');
  assert.ok(!wt.startsWith(repo + path.sep), 'worktree must be OUTSIDE the repo root');
  assert.match(res.stdout, /smoke\/tests green/);
  assert.match(res.stdout, /WORKTREE READY/);
});

test('wt-new smoke gate result is cached per base SHA (R8)', () => {
  const res = runScript('wt-new.cjs', ['feat2', '--skip-install'], repo);
  assert.strictEqual(res.status, 0, res.stdout + res.stderr);
  assert.match(res.stdout, /cached for base/);
});

test('wt-new hard-fails on a knowingly-red base commit', () => {
  const red = mkRepo('redbase', { redTests: true });
  const res = runScript('wt-new.cjs', ['x', '--skip-install'], red);
  assert.strictEqual(res.status, 1, `expected smoke-gate failure:\n${res.stdout}${res.stderr}`);
  assert.match(res.stderr, /SMOKE GATE RED/);
  assert.match(res.stderr, /baseline is broken/i);
});

test('wt-new refuses to install onto a node_modules symlink (exit-216 shape)', () => {
  const linkTarget = path.join(base, 'shared-nm');
  fs.mkdirSync(linkTarget, { recursive: true });
  const sym = mkRepo('symrepo', { nodeModulesSymlink: linkTarget });
  // no lockfile → install path would run `npm install`; the symlink check fires first
  const res = runScript('wt-new.cjs', ['y'], sym);
  assert.strictEqual(res.status, 1, res.stdout + res.stderr);
  assert.match(res.stderr, /SYMLINK/);
  assert.match(res.stderr, /exit-216/);
});

test('wt-doctor detects a circular node_modules symlink', () => {
  const sick = mkRepo('sick');
  const nm = path.join(sick, 'node_modules');
  fs.symlinkSync(nm, nm + '.tmp');
  fs.renameSync(nm + '.tmp', nm); // node_modules -> itself
  const res = runScript('wt-doctor.cjs', [sick], sick);
  assert.strictEqual(res.status, 1, res.stdout + res.stderr);
  assert.match(res.stdout, /CIRCULAR/i);
});

test('wt-doctor detects dependency version skew (declared ^4, installed 3.x)', () => {
  const skew = mkRepo('skew');
  fs.writeFileSync(path.join(skew, 'package.json'), JSON.stringify({
    name: 'skew', version: '1.0.0',
    dependencies: { fakelib: '^4.0.0' },
    scripts: { test: 'node -e "process.exit(0)"' },
  }, null, 2));
  fs.mkdirSync(path.join(skew, 'node_modules', 'fakelib'), { recursive: true });
  fs.writeFileSync(path.join(skew, 'node_modules', 'fakelib', 'package.json'),
    JSON.stringify({ name: 'fakelib', version: '3.2.1' }));
  const res = runScript('wt-doctor.cjs', [skew], skew);
  assert.strictEqual(res.status, 1, res.stdout + res.stderr);
  assert.match(res.stdout, /fakelib: installed 3\.2\.1, declared \^4\.0\.0/);
});

test('wt-doctor passes on a healthy tree', () => {
  const fine = mkRepo('fine');
  fs.mkdirSync(path.join(fine, 'node_modules'), { recursive: true });
  const res = runScript('wt-doctor.cjs', [fine], fine);
  assert.strictEqual(res.status, 0, res.stdout + res.stderr);
  assert.match(res.stdout, /HEALTHY/);
});

test('wt-clean refuses a path git does not know as a worktree', () => {
  const stranger = path.join(base, 'not-a-worktree');
  fs.mkdirSync(stranger, { recursive: true });
  const res = runScript('wt-clean.cjs', [stranger], repo);
  assert.strictEqual(res.status, 1, res.stdout + res.stderr);
  assert.match(res.stderr, /refusing/i);
  assert.ok(fs.existsSync(stranger), 'path must NOT be deleted');
});

test('wt-clean refuses the main worktree', () => {
  const res = runScript('wt-clean.cjs', [repo], repo);
  assert.strictEqual(res.status, 1, res.stdout + res.stderr);
  assert.match(res.stderr, /MAIN worktree/);
});

test('wt-clean removes a known worktree and reports reclaimed disk', () => {
  const wt = path.join(base, 'healthy-wt-feat1');
  const res = runScript('wt-clean.cjs', [wt], repo);
  assert.strictEqual(res.status, 0, res.stdout + res.stderr);
  assert.match(res.stdout, /reclaimed/);
  assert.ok(!fs.existsSync(wt), 'worktree dir must be gone');
});
