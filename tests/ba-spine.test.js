/**
 * ba-spine.test.js — the traceability spine, inside ClauKit's own suite (D-12).
 *
 * The spine needs no install to exercise: plain CommonJS over `node:` builtins,
 * requiring `.claude/scripts/ba/lib/spine-index.cjs` directly. Fixtures are
 * written by the test into a temp dir, never into a `plans/` tree.
 */

const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const REPO = path.join(__dirname, '..');
const { buildIndex, findGaps, validate } = require(path.join(REPO, '.claude/scripts/ba/lib/spine-index.cjs'));
const CLI = path.join(REPO, '.claude/scripts/ba/traceability.cjs');

let WORK;
before(() => { WORK = fs.mkdtempSync(path.join(os.tmpdir(), 'ba-spine-')); });
after(() => fs.rmSync(WORK, { recursive: true, force: true }));

/** A fresh `<tmp>/acme` project dir — basename fixed so `project: acme` in every fixture matches. */
function mkProject() {
  const root = fs.mkdtempSync(path.join(WORK, 'proj-'));
  const dir = path.join(root, 'acme');
  fs.mkdirSync(path.join(dir, 'entities'), { recursive: true });
  return dir;
}

function entity({ id, kind, title, doc, parents, source, confidence, out_of_scope, touches }) {
  const lines = ['---', `id: ${id}`, `kind: ${kind}`, 'project: acme', `title: ${title}`];
  if (doc !== undefined) lines.push(`doc: ${doc}`);
  lines.push(`parents: [${parents.join(', ')}]`, `source: ${source}`, `confidence: ${confidence}`);
  if (out_of_scope !== undefined) lines.push(`out_of_scope: ${out_of_scope}`);
  if (touches !== undefined) lines.push(`touches: ${touches}`);
  lines.push('---', '', `# ${id} — ${title}`, '');
  return lines.join('\n');
}

function writeEntity(dir, opts) {
  fs.writeFileSync(path.join(dir, 'entities', `${opts.id}.md`), entity(opts));
}

/**
 * `synth(dir, { clean })` writes 13 entity files into `<dir>/entities/`.
 * `touches` is legal only on FR/US (`bad-touches`), so it lands on `FR-001`,
 * not on the EPIC — `out_of_scope` (required on EPIC) lands on `EPIC-001`.
 * Both Node fields the D-6 contract adds are exercised, on the kinds the
 * contract actually allows them on.
 */
function synth(dir, { clean = false } = {}) {
  writeEntity(dir, { id: 'PRD-001', kind: 'PRD', title: 'Hoàn tiền đơn hàng', parents: [], source: 'doc:brainstorm.md p.1', confidence: 'med' });
  writeEntity(dir, {
    id: 'EPIC-001', kind: 'EPIC', title: 'Duyệt hoàn tiền', doc: 'PRD-001', parents: ['PRD-001'],
    source: 'doc:brainstorm.md p.2', confidence: 'med', out_of_scope: 'Không xử lý hoàn tiền qua thẻ quốc tế',
  });
  writeEntity(dir, { id: 'SRS-001', kind: 'SRS', title: 'Đặc tả hoàn tiền', parents: ['PRD-001'], source: 'doc:brainstorm.md p.3', confidence: 'med' });

  for (let n = 1; n <= 8; n++) {
    const id = `FR-${String(n).padStart(3, '0')}`;
    writeEntity(dir, {
      id, kind: 'FR', title: `FR số ${n}`, doc: 'SRS-001', parents: ['EPIC-001'],
      source: `src/order/refund.service.ts:${n}`, confidence: 'high',
      ...(n === 1 ? { touches: 'src/order/refund.service.ts' } : {}),
    });
  }
  writeEntity(dir, {
    id: 'FR-009', kind: 'FR', title: 'FR số 9', doc: 'SRS-001',
    parents: clean ? ['EPIC-001'] : [], source: 'src/order/refund.service.ts:9', confidence: 'high',
  });
  writeEntity(dir, {
    id: 'FR-010', kind: 'FR', title: 'FR số 10', doc: 'SRS-001',
    parents: clean ? ['EPIC-001'] : ['EPIC-999'], source: 'src/order/refund.service.ts:10', confidence: 'high',
  });
}

function run(args) {
  return spawnSync('node', [CLI, ...args], { encoding: 'utf-8' });
}

test('the index round-trips 13 nodes and 11 edges', () => {
  const dir = mkProject();
  synth(dir);
  const { index } = buildIndex(dir);
  assert.strictEqual(index.nodes.length, 13);
  // EPIC-001->PRD-001, SRS-001->PRD-001, FR-001..FR-008->EPIC-001 (8), and
  // FR-010's declared (dangling) parent EPIC-999 — the edge is still recorded,
  // only its target is missing from the node set: 1+1+8+1 = 11.
  assert.strictEqual(index.edges.length, 11);
  assert.strictEqual(index.version, 1);
  assert.strictEqual(index.project, 'acme');
});

test('gap finds exactly the two planted orphans and nothing else', () => {
  const dir = mkProject();
  synth(dir);
  const { index } = buildIndex(dir);
  const { orphans, unsourced } = findGaps(index);
  assert.deepStrictEqual(orphans.map((o) => o.id).sort(), ['FR-009', 'FR-010']);
  assert.deepStrictEqual(orphans.map((o) => o.reason).sort(), ['dangling', 'unparented']);
  assert.deepStrictEqual(unsourced, [], 'zero false positives');
});

test('a clean project reports no gaps', () => {
  // Negative control: without this, test 2 also passes for a findGaps that flags everything.
  const dir = mkProject();
  synth(dir, { clean: true });
  const { index } = buildIndex(dir);
  const { orphans, unsourced } = findGaps(index);
  assert.deepStrictEqual(orphans, []);
  assert.deepStrictEqual(unsourced, []);
});

test('indexing is deterministic apart from the timestamp', () => {
  const dir = mkProject();
  synth(dir, { clean: true });
  const a = buildIndex(dir).index;
  const b = buildIndex(dir).index;
  delete a.generated;
  delete b.generated;
  assert.deepStrictEqual(a, b);
});

test('the CLI exit codes are the contract', () => {
  const dirty = mkProject();
  synth(dirty);
  const clean = mkProject();
  synth(clean, { clean: true });

  assert.strictEqual(run(['index', dirty]).status, 0, 'index');
  assert.strictEqual(run(['gap', dirty]).status, 1, 'gap on planted orphans');
  assert.strictEqual(run(['gap', clean]).status, 0, 'gap on a clean project');

  const violating = mkProject();
  synth(violating, { clean: true });
  fs.copyFileSync(path.join(violating, 'entities/FR-001.md'), path.join(violating, 'entities/FR-099.md'));
  assert.strictEqual(run(['validate', violating]).status, 1, 'validate with violations');

  assert.strictEqual(run(['bogus-action', dirty]).status, 2, 'unknown action');
  assert.strictEqual(run(['index', path.join(dirty, 'does-not-exist')]).status, 2, 'nonexistent dir');

  const noEntities = fs.mkdtempSync(path.join(WORK, 'noent-'));
  assert.strictEqual(run(['index', noEntities]).status, 2, 'dir with no entities/');
});

test('the filename is part of the contract', () => {
  const dir = mkProject();
  synth(dir, { clean: true });
  fs.copyFileSync(path.join(dir, 'entities/FR-001.md'), path.join(dir, 'entities/FR-099.md'));
  const { index, errors } = buildIndex(dir);
  const checks = validate(index, errors).map((v) => v.check);
  assert.ok(checks.includes('filename-id-mismatch'));
  assert.ok(checks.includes('duplicate-id'));

  const cleanDir = mkProject();
  synth(cleanDir, { clean: true });
  const built = buildIndex(cleanDir);
  assert.deepStrictEqual(validate(built.index, built.errors), []);
});

test('an AC whose prefix disagrees with its parent is a violation', () => {
  const dir = mkProject();
  synth(dir, { clean: true });
  writeEntity(dir, { id: 'US-003', kind: 'US', title: 'US mẫu', doc: 'SRS-001', parents: ['EPIC-001'], source: '"[UNVERIFIED]"', confidence: 'low' });
  writeEntity(dir, { id: 'AC-007.1', kind: 'AC', title: 'AC mẫu', doc: 'SRS-001', parents: ['US-003'], source: '"[UNVERIFIED]"', confidence: 'low' });
  const { index, errors } = buildIndex(dir);
  assert.ok(validate(index, errors).some((v) => v.check === 'ac-prefix-mismatch'));

  const cleanDir = mkProject();
  synth(cleanDir, { clean: true });
  const built = buildIndex(cleanDir);
  assert.deepStrictEqual(validate(built.index, built.errors), []);
});

test('the derived index is ignored in a consumer project, entity files are not', () => {
  // D-6 (multi-BA needs no format migration) and D-9 (the kit declares no ignore
  // rule of its own; the filename IS the contract) in one check.
  const { PLAN_RULES } = require(path.join(REPO, 'bin/lib/gitignore-wire.js'));
  const p = fs.mkdtempSync(path.join(WORK, 'ignore-'));
  spawnSync('git', ['init', '-q', '.'], { cwd: p });
  fs.writeFileSync(path.join(p, '.gitignore'), PLAN_RULES.join('\n') + '\n');
  fs.mkdirSync(path.join(p, 'plans/ba/demo/entities'), { recursive: true });
  fs.writeFileSync(path.join(p, 'plans/ba/demo/traceability.derived.json'), '{}');
  fs.writeFileSync(path.join(p, 'plans/ba/demo/entities/FR-001.md'), '# x');

  const ignored = (f) => spawnSync('git', ['check-ignore', '-q', f], { cwd: p }).status === 0;
  assert.strictEqual(ignored('plans/ba/demo/traceability.derived.json'), true, 'the derived index must be ignored');
  assert.strictEqual(ignored('plans/ba/demo/entities/FR-001.md'), false, 'the entity file — source of truth — must not be');
});

function walkFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkFiles(full, out);
    else out.push(full);
  }
  return out;
}

test('no shipped ba doc tells the reader to activate a grouped skill', () => {
  // Skills at `.claude/skills/<group>/<name>/` sit at group depth and are not
  // registered (measured, root CLAUDE.md); "Activate the `x` skill" burns a
  // failed tool call in every session that believes it. Say "Read" instead.
  const files = [
    ...walkFiles(path.join(REPO, '.claude/skills/ba')),
    ...walkFiles(path.join(REPO, '.claude/commands/ba')),
    path.join(REPO, '.claude/workflows/business-analysis-rules.md'),
  ].filter((f) => fs.existsSync(f) && fs.statSync(f).isFile());

  const RE = /[Aa]ctivate the `[a-z-]+` skill/;
  const hits = files.filter((f) => RE.test(fs.readFileSync(f, 'utf-8'))).map((f) => path.relative(REPO, f));
  assert.deepStrictEqual(hits, []);
});
