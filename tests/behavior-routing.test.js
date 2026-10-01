/**
 * Tests for the routing eval's deterministic pieces (tests/behavior/routing/*,
 * tests/behavior/stats.cjs): the grader, the interval maths, the accept rule and
 * the leak guard. No model in the loop — the eval spends money, these must not.
 */

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { parse } = require('./behavior/tool-sequence.cjs');
const { wilson } = require('./behavior/stats.cjs');
const { routeOf, isMutation, commandAliases, gradeRoute } = require('./behavior/routing/route-grade.cjs');
const { aggregate, decide } = require('./behavior/routing/routing-stats.cjs');
const { leak, surfaceBytes } = require('./behavior/routing/routing-guard.cjs');

const asst = (...blocks) => JSON.stringify({ type: 'assistant', message: { content: blocks } });
const res = (id, content, isError) => JSON.stringify({
  type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: id, content, is_error: !!isError }] },
});
const use = (id, name, input) => ({ type: 'tool_use', id, name, input });

/** A tool call plus its result, as two stream lines. */
const call = (id, name, input, out = 'ok', isError = false) => [asst(use(id, name, input)), res(id, out, isError)];
const stepsOf = (...calls) => parse(calls.flat()).steps;
const skillPath = (n) => `.claude/skills/software/${n}/SKILL.md`;
const readSkill = (id, n) => call(id, 'Read', { file_path: skillPath(n) });
const near = (a, b, eps = 0.001) => assert.ok(Math.abs(a - b) <= eps, `${a} !~ ${b}`);

test('Read cook/SKILL.md then Edit -> PASS', () => {
  const g = gradeRoute(stepsOf(readSkill('r', 'cook'), call('e', 'Edit', { file_path: 'a.js' })), ['cook']);
  assert.strictEqual(g.verdict, 'PASS');
  assert.strictEqual(g.route, 'cook');
  assert.strictEqual(g.routeIdx, 1);
  assert.strictEqual(g.mutationIdx, 2);
});

test('Edit then Read cook -> FAIL mutation-first', () => {
  const g = gradeRoute(stepsOf(call('e', 'Edit', { file_path: 'a.js' }), readSkill('r', 'cook')), ['cook']);
  assert.strictEqual(g.verdict, 'FAIL');
  assert.strictEqual(g.why, 'mutation-first@1');
});

test('first route debugging with expected [tdd] -> FAIL wrong-route:debugging', () => {
  const g = gradeRoute(stepsOf(readSkill('a', 'debugging'), readSkill('b', 'tdd')), ['tdd']);
  assert.strictEqual(g.verdict, 'FAIL');
  assert.strictEqual(g.why, 'wrong-route:debugging');
});

test('Bash cat of a SKILL.md counts as a route', () => {
  const s = stepsOf(call('b', 'Bash', { command: `cat ${skillPath('tdd')}` }));
  assert.strictEqual(routeOf(s[0]), 'tdd');
  assert.strictEqual(gradeRoute(s, ['tdd']).verdict, 'PASS');
  assert.strictEqual(routeOf(stepsOf(call('b', 'Bash', { command: `echo ${skillPath('tdd')}` }))[0]), null);
});


test('Skill ck:fix with alias ck:fix -> {tdd} satisfies expected [tdd]', () => {
  const aliases = new Map([['ck:fix', new Set(['tdd'])]]);
  const s = stepsOf(call('s', 'Skill', { skill: 'ck:fix' }));
  assert.strictEqual(routeOf(s[0], aliases), 'ck:fix');
  assert.strictEqual(gradeRoute(s, ['tdd'], aliases).verdict, 'PASS');
  const bare = gradeRoute(s, ['tdd'], new Map());
  assert.strictEqual(bare.why, 'wrong-route:ck:fix');
});

test('Read of a command file routes as <ns>:<x>', () => {
  const s = stepsOf(call('r', 'Read', { file_path: '/p/.claude/commands/ck/fix.md' }));
  assert.strictEqual(routeOf(s[0]), 'ck:fix');
});

test('registry / workflow / references reads are neutral; first real route wins', () => {
  const calls = [
    call('a', 'Read', { file_path: 'docs/clauKit-registry.md' }),
    call('b', 'Read', { file_path: '.claude/workflows/development-rules.md' }),
    call('c', 'Read', { file_path: '.claude/skills/software/cook/references/x.md' }),
    call('d', 'Read', { file_path: 'CLAUDE.md' }),
    readSkill('e', 'cook'),
  ];
  const s = stepsOf(...calls);
  assert.deepStrictEqual(s.slice(0, 4).map((x) => routeOf(x)), [null, null, null, null]);
  const g = gradeRoute(s, ['cook']);
  assert.strictEqual(g.route, 'cook');
  assert.strictEqual(g.routeIdx, 5);
  assert.strictEqual(g.verdict, 'PASS');
});

test('a denied Write still counts as a mutation', () => {
  const denied = call('w', 'Write', { file_path: 'a.js' }, 'permission denied', true);
  assert.ok(isMutation(stepsOf(denied)[0]));
  assert.strictEqual(gradeRoute(stepsOf(denied, readSkill('r', 'cook')), ['cook']).why, 'mutation-first@1');
});

test('Bash: redirect to a file is a mutation; cat and /dev/null or fd-dup redirects are not', () => {
  const mut = (command) => isMutation(stepsOf(call('b', 'Bash', { command }))[0]);
  assert.ok(mut('echo x > f'));
  assert.ok(mut('echo x > f 2>/dev/null'));
  assert.ok(!mut('cat f'));
  assert.ok(!mut('ls x > /dev/null 2>&1'));
  assert.ok(!mut('cat a 2>/dev/null'));
});

test('no route, no mutation -> FAIL no-route', () => {
  const g = gradeRoute(stepsOf(call('g', 'Grep', { pattern: 'x' })), ['cook']);
  assert.deepStrictEqual([g.verdict, g.why, g.route, g.routeIdx, g.mutationIdx], ['FAIL', 'no-route', null, null, null]);
});

test('commandAliases collects every linked skill; commands without links get an empty set', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ck-alias-'));
  fs.mkdirSync(path.join(dir, 'ck'));
  fs.mkdirSync(path.join(dir, 'mk'));
  fs.writeFileSync(path.join(dir, 'ck', 'cook.md'),
    'Read [a](../../skills/software/cook/SKILL.md) and [b](../../skills/software/tdd/SKILL.md#base) not [c](x.md)');
  fs.writeFileSync(path.join(dir, 'mk', 'seo.md'), 'no links');
  const m = commandAliases(dir);
  assert.deepStrictEqual([...m.get('ck:cook')].sort(), ['cook', 'tdd']);
  assert.strictEqual(m.get('mk:seo').size, 0);
});

test('commandAliases on the real commands dir: ck:cook links cook', () => {
  const m = commandAliases(path.join(__dirname, '..', '.claude', 'commands'));
  assert.ok(m.get('ck:cook').has('cook'));
});

test('wilson matches known values', () => {
  near(wilson(0, 3).hi, 0.5615);
  near(wilson(3, 3).lo, 0.4385);
  assert.deepStrictEqual(wilson(0, 0), { p: 0, lo: 0, hi: 1 });
  near(wilson(1, 3).p, 1 / 3);
});

const row = (c, run, verdict, extra = {}) => ({ case: c, split: 'train', run, verdict, costUsd: 0.1, ...extra });
const CASES = { a: { expected: ['cook'] }, b: { expected: ['tdd'] } };

test('aggregate excludes ERROR rows from n and derives noise from replicate spread', () => {
  const rows = [
    row('a', 1, 'PASS'), row('b', 1, 'PASS'),
    row('a', 2, 'PASS'), row('b', 2, 'FAIL'),
    row('a', 3, 'FAIL'), row('b', 3, 'ERROR'),
    row('a', 1, 'PASS', { split: 'test' }),
  ];
  const g = aggregate(rows, 'train', CASES);
  assert.deepStrictEqual([g.n, g.k, g.errors], [5, 3, 1]);
  assert.deepStrictEqual(g.replicateAcc, [1, 0.5, 0]);
  assert.strictEqual(g.noise, 1);
  near(g.costUsd, 0.6);
  assert.deepStrictEqual(g.byGate.cook, { n: 3, k: 2, acc: 2 / 3 });
  assert.strictEqual(g.byGate.tdd.n, 2);
  assert.strictEqual(g.flaky, 2); // a: 2/3 pass, b: 1/2 pass
  assert.ok(g.lo <= g.acc && g.acc <= g.hi);
});

test('aggregate without a split takes every row; empty input is all zeros', () => {
  assert.strictEqual(aggregate([row('a', 1, 'PASS'), row('a', 1, 'PASS', { split: 'test' })], undefined, CASES).n, 2);
  assert.strictEqual(aggregate([], 'train', CASES).noise, 0);
});

const agg = (acc, noise) => ({ acc, noise });
const OK = { sizeOk: true, leakOk: true };

test('decide: train delta within noise -> REVERT', () => {
  const d = decide({ train: agg(0.5, 0.1), test: agg(0.5, 0) }, { train: agg(0.6, 0.1), test: agg(0.7, 0) }, OK);
  assert.strictEqual(d.verdict, 'REVERT');
  near(d.trainDelta, 0.1);
});

test('decide: train ok but test delta 0 -> REVERT', () => {
  const d = decide({ train: agg(0.5, 0.05), test: agg(0.5, 0) }, { train: agg(0.7, 0.05), test: agg(0.5, 0) }, OK);
  assert.strictEqual(d.verdict, 'REVERT');
  assert.strictEqual(d.testDelta, 0);
});

test('decide: train ok, test up, size and leak ok -> ACCEPT', () => {
  const d = decide({ train: agg(0.5, 0.05), test: agg(0.5, 0) }, { train: agg(0.7, 0.05), test: agg(0.6, 0) }, OK);
  assert.strictEqual(d.verdict, 'ACCEPT');
});

test('decide: sizeOk false or leakOk false -> REVERT even when the numbers pass', () => {
  const b = { train: agg(0.5, 0.05), test: agg(0.5, 0) };
  const c = { train: agg(0.7, 0.05), test: agg(0.6, 0) };
  assert.strictEqual(decide(b, c, { sizeOk: false, leakOk: true }).verdict, 'REVERT');
  assert.strictEqual(decide(b, c, { sizeOk: true, leakOk: false }).verdict, 'REVERT');
  assert.strictEqual(decide(b, c, {}).verdict, 'REVERT'); // unchecked is not ok
});

test('leak: a 6-word run from a prompt in the surface is flagged; 5 words is clean', () => {
  const prompt = 'Please add retry handling to the upload worker today';
  const six = 'Rule: add RETRY handling   to the upload\nworker.';
  const five = 'Rule: retry handling to the upload, then stop.';
  assert.ok(leak(six, [prompt]).length > 0);
  assert.deepStrictEqual(leak(five, [prompt]), []);
});

test('surfaceBytes sums file sizes', () => {
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'ck-bytes-')), 'x.md');
  fs.writeFileSync(f, 'héllo');
  assert.strictEqual(surfaceBytes([f, f]), 12);
});
