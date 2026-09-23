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
const { buildIndex, findGaps, validate, changelog } = require(path.join(REPO, '.claude/scripts/ba/lib/spine-index.cjs'));
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

function entity({ id, kind, title, doc, parents, source, confidence, out_of_scope, touches, status, impact, release }) {
  const lines = ['---', `id: ${id}`, `kind: ${kind}`, 'project: acme', `title: ${title}`];
  if (doc !== undefined) lines.push(`doc: ${doc}`);
  lines.push(`parents: [${parents.join(', ')}]`, `source: ${source}`, `confidence: ${confidence}`);
  if (out_of_scope !== undefined) lines.push(`out_of_scope: ${out_of_scope}`);
  if (touches !== undefined) lines.push(`touches: ${touches}`);
  if (status !== undefined) lines.push(`status: ${status}`);
  if (impact !== undefined) lines.push(`impact: ${impact}`);
  if (release !== undefined) lines.push(`release: ${release}`);
  lines.push('---', '', `# ${id} — ${title}`, '');
  return lines.join('\n');
}

function writeEntity(dir, opts) {
  fs.writeFileSync(path.join(dir, 'entities', `${opts.id}.md`), entity(opts));
}

/**
 * `synth(dir, { clean, crs })` writes 13 entity files into `<dir>/entities/`.
 * `touches` is legal only on FR/US (`bad-touches`), so it lands on `FR-001`,
 * not on the EPIC — `out_of_scope` (required on EPIC) lands on `EPIC-001`.
 * Both Node fields the D-6 contract adds are exercised, on the kinds the
 * contract actually allows them on. With `crs: true`, adds two CR entities.
 */
function synth(dir, { clean = false, crs = false } = {}) {
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
  if (crs) {
    writeEntity(dir, {
      id: 'CR-001', kind: 'CR', title: 'Yêu cầu thay đổi 1', doc: 'SRS-001', parents: ['FR-001'],
      source: 'ticket:CHANGE-001', confidence: 'high', status: 'approved', impact: 'Cập nhật UI hoàn tiền',
    });
    writeEntity(dir, {
      id: 'CR-002', kind: 'CR', title: 'Yêu cầu thay đổi 2', doc: 'SRS-001', parents: ['FR-002'],
      source: 'ticket:CHANGE-002', confidence: 'high', status: 'rejected', impact: 'Xóa tính năng cũ',
    });
  }
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

test('a CR indexes, and changelog orders by id', () => {
  const dir = mkProject();
  synth(dir, { crs: true });
  const { index } = buildIndex(dir);
  const rows = changelog(index);
  assert.deepStrictEqual(
    rows.map((r) => r.id),
    ['CR-001', 'CR-002'],
  );
  assert.deepStrictEqual(
    rows.map((r) => r.status),
    ['approved', 'rejected'],
  );
  assert.ok(rows.every((r) => r.impact), 'every impact non-empty');
});

test('a CR whose parents exist is not a gap', () => {
  const dir = mkProject();
  synth(dir, { clean: true, crs: true });
  const { index } = buildIndex(dir);
  const { orphans, unsourced } = findGaps(index);
  assert.deepStrictEqual(orphans, []);
  assert.deepStrictEqual(unsourced, []);
});

test('status and impact are required on CR and rejected everywhere else', () => {
  const dir = mkProject();
  synth(dir, { clean: true, crs: true });

  // CR without status
  const noStatus = mkProject();
  synth(noStatus, { clean: true, crs: true });
  const crPath = path.join(noStatus, 'entities/CR-001.md');
  let content = fs.readFileSync(crPath, 'utf8');
  content = content.replace(/^status: approved$/m, '');
  fs.writeFileSync(crPath, content);
  const { index: idx1, errors: e1 } = buildIndex(noStatus);
  const v1 = validate(idx1, e1);
  assert.ok(v1.some((v) => v.check === 'missing-status'), 'CR without status fails');

  // CR without impact
  const noImpact = mkProject();
  synth(noImpact, { clean: true, crs: true });
  const crImpactPath = path.join(noImpact, 'entities/CR-001.md');
  let contentNoImpact = fs.readFileSync(crImpactPath, 'utf8');
  contentNoImpact = contentNoImpact.replace(/^impact: .*$/m, '');
  fs.writeFileSync(crImpactPath, contentNoImpact);
  const { index: idx2, errors: e2 } = buildIndex(noImpact);
  const v2 = validate(idx2, e2);
  assert.ok(v2.some((v) => v.check === 'missing-impact'), 'CR without impact fails');

  // status on FR (wrong kind)
  const frWithStatus = mkProject();
  synth(frWithStatus, { clean: true });
  const frPath = path.join(frWithStatus, 'entities/FR-001.md');
  let frContent = fs.readFileSync(frPath, 'utf8');
  const insertAfter = 'confidence: high';
  frContent = frContent.replace(insertAfter, `${insertAfter}\nstatus: approved`);
  fs.writeFileSync(frPath, frContent);
  const { index: idx3, errors: e3 } = buildIndex(frWithStatus);
  const v3 = validate(idx3, e3);
  assert.ok(v3.some((v) => v.check === 'status-on-wrong-kind'), 'status on FR fails');

  // release on EPIC (wrong kind)
  const epicWithRelease = mkProject();
  synth(epicWithRelease, { clean: true });
  const epicPath = path.join(epicWithRelease, 'entities/EPIC-001.md');
  let epicContent = fs.readFileSync(epicPath, 'utf8');
  const insertEpic = 'out_of_scope:';
  epicContent = epicContent.replace(insertEpic, `release: v1.2\n${insertEpic}`);
  fs.writeFileSync(epicPath, epicContent);
  const { index: idx4, errors: e4 } = buildIndex(epicWithRelease);
  const v4 = validate(idx4, e4);
  assert.ok(v4.some((v) => v.check === 'bad-release'), 'release on EPIC fails');

  // release on FR (should NOT fail)
  const frWithRelease = mkProject();
  synth(frWithRelease, { clean: true });
  const frRPath = path.join(frWithRelease, 'entities/FR-001.md');
  let frRContent = fs.readFileSync(frRPath, 'utf8');
  frRContent = frRContent.replace('confidence: high', 'confidence: high\nrelease: v1.2');
  fs.writeFileSync(frRPath, frRContent);
  const { index: idx5, errors: e5 } = buildIndex(frWithRelease);
  const v5 = validate(idx5, e5);
  assert.ok(!v5.some((v) => v.check === 'bad-release'), 'release on FR is allowed');
});

test('CR is appended to KIND_ORDER, so a CR-free tree keeps its node order', () => {
  const { KIND_ORDER } = require(path.join(REPO, '.claude/scripts/ba/lib/spine-parse.cjs'));
  assert.strictEqual(KIND_ORDER.indexOf('CR'), KIND_ORDER.length - 1, 'CR is the last kind');

  const dir = mkProject();
  synth(dir, { clean: true });
  const { index } = buildIndex(dir);
  const expectedOrder = [
    'PRD-001', 'SRS-001', 'EPIC-001', 'FR-001', 'FR-002', 'FR-003', 'FR-004',
    'FR-005', 'FR-006', 'FR-007', 'FR-008', 'FR-009', 'FR-010',
  ];
  assert.deepStrictEqual(index.nodes.map((n) => n.id), expectedOrder);
  assert.ok(index.nodes.every((n) => n.status === null), 'all statuses null');
  assert.ok(index.nodes.every((n) => n.impact === null), 'all impacts null');
  assert.ok(index.nodes.every((n) => n.release === null), 'all releases null');
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
    ...fs.readdirSync(path.join(REPO, 'skills'))
      .filter((d) => d === 'ba' || d.startsWith('ba-'))
      .flatMap((d) => walkFiles(path.join(REPO, '.claude/skills', d))),
    ...walkFiles(path.join(REPO, '.claude/commands/ba')),
    path.join(REPO, '.claude/workflows/business-analysis-rules.md'),
  ].filter((f) => fs.existsSync(f) && fs.statSync(f).isFile());

  const RE = /[Aa]ctivate the `[a-z-]+` skill/;
  const hits = files.filter((f) => RE.test(fs.readFileSync(f, 'utf-8'))).map((f) => path.relative(REPO, f));
  assert.deepStrictEqual(hits, []);
});
