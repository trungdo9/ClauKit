/**
 * End-to-end tests for `bin/lib/retired-files.js` — the path that DELETES files
 * from a user's project on upgrade.
 *
 * It had no coverage. That is the wrong place to have none: `copyPath` only ever
 * writes, so this module is the only thing that removes anything, it decides on a
 * content digest, and getting it wrong destroys work a user cannot recover. The
 * digest tables are checked statically in installer-packaging.test.js; what is
 * checked here is the behaviour those tables drive.
 *
 * Fixtures are built from real blobs out of git history, so "an install running an
 * older release" means the bytes that release actually shipped, not a stand-in.
 */

const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { RETIRED, STALE } = require('../bin/lib/retired-files');

const REPO = path.join(__dirname, '..');
const CK = path.join(REPO, 'bin', 'ck.js');

let work;
before(() => { work = fs.mkdtempSync(path.join(os.tmpdir(), 'ck-retire-')); });
after(() => fs.rmSync(work, { recursive: true, force: true }));

/** Bytes of a blob from this repo's history. */
const blob = (sha) => spawnSync('git', ['cat-file', 'blob', sha], { cwd: REPO, maxBuffer: 1 << 24 }).stdout;

function project() {
  const d = fs.mkdtempSync(path.join(work, 'p-'));
  spawnSync('git', ['init', '-q', '.'], { cwd: d });
  fs.writeFileSync(path.join(d, 'package.json'), JSON.stringify({ name: 'host', version: '1.0.0' }, null, 2));
  return d;
}

const init = (d) => spawnSync('node', [CK, 'init', '--kit', 'engineer'], { cwd: d, encoding: 'utf-8' });

/** Put a file back the way an older release shipped it. */
function rewind(dir, rel, sha) {
  const abs = path.join(dir, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, blob(sha));
  return abs;
}

const RETIRED_DOC = RETIRED.find((r) => r.path.endsWith('debugging/references/verification.md'));
const STALE_SKILL = STALE.find((r) => r.path.endsWith('debugging/SKILL.md'));
const STALE_AGENT = STALE.find((r) => r.path.endsWith('engineering/debugger.md'));

test('the tables still describe the duplicate-verification retirement', () => {
  // A guard on the fixtures below: if these entries are renamed away, the tests
  // that follow would silently stop testing anything.
  for (const [name, e] of [['RETIRED doc', RETIRED_DOC], ['STALE skill', STALE_SKILL], ['STALE agent', STALE_AGENT]]) {
    assert.ok(e, `${name} entry is missing from retired-files.js`);
  }
});

test('upgrade: an older install loses the duplicated reference and gains the pointer', () => {
  const p = project();
  assert.strictEqual(init(p).status, 0);

  // Rewind to a release that shipped the duplicate plus the prose naming it.
  const dup = rewind(p, RETIRED_DOC.path, RETIRED_DOC.sha[0]);
  rewind(p, STALE_SKILL.path, STALE_SKILL.sha[0]);
  rewind(p, STALE_AGENT.path, STALE_AGENT.sha[0]);
  assert.ok(fs.existsSync(dup));

  const res = init(p);
  assert.strictEqual(res.status, 0, res.stderr);

  assert.ok(!fs.existsSync(dup), 'the duplicated reference must be removed');
  const skill = fs.readFileSync(path.join(p, STALE_SKILL.path), 'utf-8');
  assert.match(skill, /verification-before-completion/,
    'the skill must name the reference that still exists');
  assert.doesNotMatch(skill, /references\/verification\.md/,
    'no shipped doc may still invoke the deleted path');
});

test('a reference the user edited is reported, never deleted', () => {
  const p = project();
  assert.strictEqual(init(p).status, 0);

  const dup = rewind(p, RETIRED_DOC.path, RETIRED_DOC.sha[0]);
  fs.writeFileSync(dup, fs.readFileSync(dup, 'utf-8') + '\n## My team\'s extra gate\n- deploys need a smoke test\n');
  rewind(p, STALE_SKILL.path, STALE_SKILL.sha[0]);
  rewind(p, STALE_AGENT.path, STALE_AGENT.sha[0]);

  const res = init(p);
  assert.strictEqual(res.status, 0, res.stderr);
  assert.ok(fs.existsSync(dup), "an edited file is the user's work, not ClauKit's to delete");
  assert.match(fs.readFileSync(dup, 'utf-8'), /My team's extra gate/, 'and it must be left byte-identical');
  assert.match(res.stdout, /kept .*verification\.md/, 'a file left behind must be reported');
});

test('removal waits until the prose that invokes it has been refreshed', () => {
  // The coherence gate: a no---force upgrade skips existing directories, so the
  // doc telling an agent to load the reference can still be on disk. Deleting the
  // reference under that doc is worse than leaving both.
  const p = project();
  assert.strictEqual(init(p).status, 0);

  const dup = rewind(p, RETIRED_DOC.path, RETIRED_DOC.sha[0]);
  // A doc that names the reference but is NOT one ClauKit shipped — so the
  // refresher will not touch it, and the gate must hold.
  const mine = path.join(p, '.claude/commands/ck/my-flow.md');
  fs.mkdirSync(path.dirname(mine), { recursive: true });
  fs.writeFileSync(mine, `Load \`${RETIRED_DOC.token}\` before claiming done.\n`);

  const res = init(p);
  assert.strictEqual(res.status, 0, res.stderr);
  assert.ok(fs.existsSync(dup), 'the reference must survive while something still invokes it');
  assert.match(res.stdout, /kept .*verification\.md.*still invoked by/,
    'and the reason must name the blocker, so the user can act on it');
});

test('upgrade: a v1.7.0 ba install loses its grouped skills, dirs included, and keeps the kit docs', () => {
  // v1.7.0 shipped the six BA skills at `.claude/skills/ba/<name>/`, one level
  // below the depth Claude Code registers. Rewind every retired file to its first
  // shipped blob and every STALE BA doc likewise, then upgrade without --force.
  const p = project();
  assert.strictEqual(spawnSync('node', [CK, 'init', '--kit', 'ba'], { cwd: p, encoding: 'utf-8' }).status, 0);
  const grouped = RETIRED.filter((r) => r.path.startsWith('.claude/skills/ba/'));
  assert.ok(grouped.length >= 6, 'the BA retirement entries are missing — the test would pass vacuously');
  for (const r of grouped) rewind(p, r.path, r.sha[0]);
  for (const s of STALE.filter((e) => e.path.includes('/ba/') || e.path.endsWith('business-analysis-rules.md'))) {
    rewind(p, s.path, s.sha[s.sha.length - 1]);
  }

  const res = spawnSync('node', [CK, 'init', '--kit', 'ba'], { cwd: p, encoding: 'utf-8' });
  assert.strictEqual(res.status, 0, res.stderr);

  const left = fs.readdirSync(path.join(p, '.claude/skills/ba')).sort();
  assert.deepStrictEqual(left, ['README.md', 'capability-map.md'],
    'only the kit docs stay under skills/ba/ — no emptied skill directories');
  for (const n of ['ba-context', 'ba-prd', 'ba-spec', 'ba-traceability', 'ba-diagramming', 'ba-deliver']) {
    assert.ok(fs.existsSync(path.join(p, '.claude/skills', n, 'SKILL.md')), `${n} must be installed`);
  }
  const prd = fs.readFileSync(path.join(p, '.claude/commands/ba/prd.md'), 'utf-8');
  assert.doesNotMatch(prd, /skills\/ba\/prd\//, 'the command must be refreshed to the flat path');
});
