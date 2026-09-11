'use strict';
// `/ba:deliver` — the six downstream documents in two classes (plan 260910-1533-ba-kit, phase 08.2).
// Each test gets its own mkdtemp copy of the demo spine, so tests are independent and safe to run
// concurrently with another checkout; `after()` removes every copy even when a test throws.

const { test, after } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..');
const CLI = path.join(REPO, '.claude/scripts/ba/traceability.cjs');
const DEMO = path.join(REPO, 'plans/ba/demo');
const made = [];

/** A fresh project dir holding a copy of the demo entities, renamed to its own slug. */
function freshProject() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ba-deliver-'));
  const slug = path.basename(dir);
  fs.mkdirSync(path.join(dir, 'entities'));
  for (const file of fs.readdirSync(path.join(DEMO, 'entities'))) {
    const text = fs.readFileSync(path.join(DEMO, 'entities', file), 'utf8');
    fs.writeFileSync(path.join(dir, 'entities', file), text.replace(/^project: demo$/m, `project: ${slug}`));
  }
  made.push(dir);
  return dir;
}

/** Run the CLI from inside the project dir; `<dir>` becomes the absolute project path. Returns { status, out }. */
function cli(projectDir, ...args) {
  const r = spawnSync('node', [CLI, ...args.map((a) => (a === '<dir>' ? projectDir : a))], { cwd: projectDir, encoding: 'utf8' });
  return { status: r.status, out: `${r.stdout}${r.stderr}` };
}
const read = (dir, name) => fs.readFileSync(path.join(dir, 'deliverables', name), 'utf8');

after(() => {
  for (const dir of made) fs.rmSync(dir, { recursive: true, force: true });
});

test('the derived class renders byte-identically twice, the owned class refuses the second run', () => {
  const dir = freshProject();

  assert.strictEqual(cli(dir, 'deliver', '<dir>', 'scope').status, 0);
  const scope1 = read(dir, 'SCOPE-001.md');
  assert.strictEqual(cli(dir, 'deliver', '<dir>', 'scope').status, 0);
  assert.strictEqual(read(dir, 'SCOPE-001.md'), scope1, 'derived: byte-identical on the second run');

  const first = cli(dir, 'deliver', '<dir>', 'uat');
  assert.strictEqual(first.status, 0, first.out);
  assert.match(first.out, /delivered/);

  const second = cli(dir, 'deliver', '<dir>', 'uat');
  assert.strictEqual(second.status, 1, 'owned: the second run without --force exits 1');
  assert.match(second.out, /class: owned/);
  assert.match(second.out, /--force/);

  const forced = cli(dir, 'deliver', '<dir>', 'uat', '--force');
  assert.strictEqual(forced.status, 0, forced.out);
  assert.match(forced.out, /delivered/);
});

test('the uat record covers every TC exactly once and its coverage line matches findGaps', () => {
  const dir = freshProject();
  assert.strictEqual(cli(dir, 'deliver', '<dir>', 'uat').status, 0);
  const uat = read(dir, 'UAT-001.md');

  const tcs = [...new Set(uat.match(/\bTC-\d{3}\b/g) || [])];
  assert.ok(tcs.length >= 2, 'the demo spine has TCs to cover');
  for (const id of tcs) {
    const rows = uat.match(new RegExp(`\\|\\s*${id}\\s*\\|`, 'g')) || [];
    assert.strictEqual(rows.length, 1, `${id} appears exactly once in the table`);
  }

  const gap = cli(dir, 'gap', '<dir>', '--json');
  const gaps = JSON.parse(gap.out.split('\n').find((l) => l.startsWith('{')));
  const coverage = uat.match(/\*\*Độ phủ:\*\*.*?orphans=(\d+).*?unsourced=(\d+)/);
  assert.ok(coverage, 'the coverage line is present');
  assert.strictEqual(Number(coverage[1]), gaps.orphans.length);
  assert.strictEqual(Number(coverage[2]), gaps.unsourced.length);
});

test('the variance section lists exactly the approved CRs', () => {
  const dir = freshProject();
  assert.strictEqual(cli(dir, 'deliver', '<dir>', 'acceptance').status, 0);
  const acceptance = read(dir, 'ACCEPTANCE-001.md');

  const log = JSON.parse(cli(dir, 'changelog', '<dir>', '--json').out.split('\n').find((l) => l.startsWith('[')));
  const approved = log.filter((c) => c.status === 'approved').map((c) => c.id);
  const rejected = log.filter((c) => c.status === 'rejected').map((c) => c.id);
  assert.ok(approved.length >= 1 && rejected.length >= 1, 'the demo spine has one CR of each status');

  const variance = (acceptance.match(/## Thay đổi[\s\S]*?(?=\n## |$)/) || [''])[0];
  for (const id of approved) assert.ok(variance.includes(id), `${id} (approved) is in the variance section`);
  for (const id of rejected) assert.ok(!variance.includes(id), `${id} (rejected) is not in the variance section`);
});

test('no deliverable carries a timestamp, every one declares its class, and --json is never empty', () => {
  const dir = freshProject();
  assert.strictEqual(cli(dir, 'compose', '<dir>').status, 0);
  assert.strictEqual(cli(dir, 'deliver', '<dir>', 'all').status, 0);

  const expected = {
    'PRD-001.md': 'derived', 'SRS-001.md': 'derived',
    'SCOPE-001.md': 'derived', 'RELEASE-NOTES-001.md': 'derived',
    'UAT-001.md': 'owned', 'ACCEPTANCE-001.md': 'owned', 'GOLIVE-001.md': 'owned', 'HANDOVER-001.md': 'owned',
  };
  const classLine = /<!--\s*ba-deliverable:\s*[^·]*·\s*class:\s*(derived|owned)\s*·/;
  const timestamp = /\d{4}-\d{2}-\d{2}T|\bGenerated at\b|\bSinh lúc\b/;
  for (const [file, cls] of Object.entries(expected)) {
    const text = read(dir, file);
    assert.ok(!timestamp.test(text), `${file} carries no timestamp`);
    const m = text.match(classLine);
    assert.ok(m, `${file} declares its class`);
    assert.strictEqual(m[1], cls, `${file} is class ${cls}`);
  }

  // A second `all` skips the four owned files: exit 1, and --json still returns an object.
  const again = cli(dir, 'deliver', '<dir>', 'all', '--json');
  assert.strictEqual(again.status, 1);
  const body = JSON.parse(again.out.split('\n').find((l) => l.startsWith('{')));
  assert.strictEqual(body.skipped.length, 4, 'four owned files skipped');
  assert.deepStrictEqual(body.files.sort(), ['RELEASE-NOTES-001.md', 'SCOPE-001.md']);

  // Containment: a relative project dir that climbs (`..`) is refused with exit 2 before anything
  // is written — the commands build `plans/ba/<slug>` from a user-typed slug. `.` (the cwd itself)
  // is fine, and its entities validate against the real directory name, not the literal dot.
  const climbing = cli(dir, 'index', path.join('..', path.basename(dir)));
  assert.strictEqual(climbing.status, 2);
  assert.match(climbing.out, /contain no '\.\.'/);
  assert.strictEqual(cli(dir, 'validate', '.').status, 0, 'a bare "." resolves to the project dir');
});
