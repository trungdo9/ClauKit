/**
 * End-to-end tests for `bin/lib/relocate-scripts.js` — the upgrade path that
 * DELETES the root `scripts/ck/` an older ClauKit installed.
 *
 * Same reason `retirement.test.js` exists: this module removes files from a
 * user's project on a plain `ck init`, it decides on a content digest, and a
 * wrong decision destroys work nobody can recover. The two halves pinned here
 * are the two that can fail silently — the cleanup happening at all (otherwise
 * every upgraded project keeps two copies of every helper), and the cleanup
 * stopping at files ClauKit did not write.
 *
 * Fixtures use real blobs out of git history, so "a project on 1.5.1" means the
 * bytes 1.5.1 actually shipped.
 */

const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { SHIPPED, newPathOf } = require('../bin/lib/relocate-scripts');

const REPO = path.join(__dirname, '..');
const CK = path.join(REPO, 'bin', 'ck.js');

let work;
before(() => { work = fs.mkdtempSync(path.join(os.tmpdir(), 'ck-relocate-')); });
after(() => fs.rmSync(work, { recursive: true, force: true }));

const blob = (sha) => spawnSync('git', ['cat-file', 'blob', sha], { cwd: REPO, maxBuffer: 1 << 24 }).stdout;

function project() {
  const d = fs.mkdtempSync(path.join(work, 'p-'));
  spawnSync('git', ['init', '-q', '.'], { cwd: d });
  return d;
}

const init = (dir, extra = []) =>
  spawnSync('node', [CK, 'init', '--kit', 'engineer', ...extra], { cwd: dir, encoding: 'utf-8' });

/** Lay down the root `scripts/ck/` exactly as a pre-relocation release left it. */
function legacyInstall(dir) {
  for (const entry of SHIPPED) {
    if (!entry.path.endsWith('.cjs')) continue;
    const abs = path.join(dir, entry.path);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, blob(entry.sha[entry.sha.length - 1]));
  }
}

test('every relocation digest resolves to a blob in this repo', () => {
  // The table is the entire basis for deleting a user's file: an invented digest
  // is no proof, and a typo'd one silently turns the cleanup into a no-op.
  for (const entry of SHIPPED) {
    assert.ok(entry.sha.length > 0, `${entry.path} declares no digest`);
    for (const sha of entry.sha) {
      assert.match(sha, /^[0-9a-f]{40}$/, `${entry.path}: ${sha} is not a blob id`);
      const t = spawnSync('git', ['cat-file', '-t', sha], { cwd: REPO, encoding: 'utf-8' });
      assert.strictEqual(t.stdout.trim(), 'blob', `${entry.path}: ${sha} is not a blob in this repo`);
    }
  }
});

test('every relocated helper has a destination that ships today', () => {
  for (const entry of SHIPPED) {
    assert.ok(fs.existsSync(path.join(REPO, newPathOf(entry.path))),
      `${entry.path} relocates to ${newPathOf(entry.path)}, which is not in the package`);
  }
});

test('upgrading from the root layout moves the helpers and takes the old tree with it', () => {
  const p = project();
  legacyInstall(p);
  // Prose from that era, which an agent would still be told to run.
  fs.mkdirSync(path.join(p, '.claude/commands/ck'), { recursive: true });
  fs.writeFileSync(path.join(p, '.claude/commands/ck/mine.md'), 'run `node scripts/ck/plan-lint.cjs <plan>`\n');

  const res = init(p);
  assert.strictEqual(res.status, 0, res.stderr);

  assert.ok(fs.existsSync(path.join(p, '.claude/scripts/ck/plan-lint.cjs')), 'the helpers install under .claude/');
  assert.ok(!fs.existsSync(path.join(p, 'scripts/ck')), 'the old tree is gone, not duplicated');
  assert.ok(!fs.existsSync(path.join(p, 'scripts')), 'and so is the directory ClauKit created to hold it');
  assert.match(res.stdout, /helpers moved to \.claude\/scripts\/ck\//);

  assert.strictEqual(
    fs.readFileSync(path.join(p, '.claude/commands/ck/mine.md'), 'utf-8'),
    'run `node .claude/scripts/ck/plan-lint.cjs <plan>`\n',
    'prose that invoked the old path is repointed in the same run'
  );
});

test('a file ClauKit never shipped at the old path survives, and keeps its directory', () => {
  const p = project();
  legacyInstall(p);
  fs.writeFileSync(path.join(p, 'scripts/ck/my-own-deploy.cjs'), '// mine\n');
  // Same path ClauKit ships, but the user's bytes: the digest gate must catch it.
  fs.writeFileSync(path.join(p, 'scripts/ck/plan-lint.cjs'), '// I rewrote this\n');

  const res = init(p);
  assert.strictEqual(res.status, 0, res.stderr);

  assert.strictEqual(fs.readFileSync(path.join(p, 'scripts/ck/my-own-deploy.cjs'), 'utf-8'), '// mine\n',
    'a file ClauKit never wrote must survive byte-for-byte');
  assert.strictEqual(fs.readFileSync(path.join(p, 'scripts/ck/plan-lint.cjs'), 'utf-8'), '// I rewrote this\n',
    'an edited helper is the user\'s, not ours to delete');
  assert.match(res.stdout, /kept scripts\/ck\/plan-lint\.cjs/);
});

test('the helper is never deleted before its replacement is on disk', () => {
  const p = project();
  legacyInstall(p);
  const before = fs.readdirSync(path.join(p, 'scripts/ck')).length;

  // A kit that installs no scripts (marketing) must leave the old tree alone —
  // removing it would take the working copy and leave nothing in its place.
  const res = spawnSync('node', [CK, 'init', '--kit', 'marketing'], { cwd: p, encoding: 'utf-8' });
  assert.strictEqual(res.status, 0, res.stderr);
  assert.strictEqual(fs.readdirSync(path.join(p, 'scripts/ck')).length, before,
    'no replacement installed ⇒ nothing removed');
});

test('relocation is idempotent and silent once a project is current', () => {
  const p = project();
  init(p);
  const res = init(p);
  assert.strictEqual(res.status, 0, res.stderr);
  assert.ok(!/helpers moved to/.test(res.stdout), 'nothing to do must print nothing');
});
