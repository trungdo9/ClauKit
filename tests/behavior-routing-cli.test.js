/**
 * Second half of the routing-eval tests: route-reader edge cases, the accept
 * rule's float ties, and the two CLIs' exit codes (phase 04 keys on them:
 * grader 0 PASS / 1 FAIL / 2 error; guard 0 clean / 1 leak / 2 error).
 * No model in the loop.
 */

const { test } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { parse } = require('./behavior/tool-sequence.cjs');
const { routeOf, gradeRoute } = require('./behavior/routing/route-grade.cjs');
const { aggregate, decide } = require('./behavior/routing/routing-stats.cjs');

const GRADER = path.join(__dirname, 'behavior', 'routing', 'route-grade.cjs');
const GUARD = path.join(__dirname, 'behavior', 'routing', 'routing-guard.cjs');

const asst = (...blocks) => JSON.stringify({ type: 'assistant', message: { content: blocks } });
const res = (id, content, isError) => JSON.stringify({
  type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: id, content, is_error: !!isError }] },
});
const call = (id, name, input, out = 'ok', isError = false) => [
  asst({ type: 'tool_use', id, name, input }), res(id, out, isError),
];
const stepsOf = (...calls) => parse(calls.flat()).steps;
const SKILL = '.claude/skills/software/tdd/SKILL.md';
const edit = call('e', 'Edit', { file_path: 'a.js' });
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'ck-cli-'));
const write = (dir, name, body) => { const f = path.join(dir, name); fs.writeFileSync(f, body); return f; };
const run = (script, args) => spawnSync('node', [script, ...args], { encoding: 'utf-8' });

// --- route reader ------------------------------------------------------------

test('a failed Skill call is neutral: wrong name then recovery is judged on the recovery', () => {
  const failed = call('s', 'Skill', { skill: 'ck:nonexistent' }, 'Unknown skill', true);
  const g = gradeRoute(stepsOf(failed, call('r', 'Read', { file_path: SKILL }), edit), ['tdd']);
  assert.strictEqual(g.verdict, 'PASS');
  assert.strictEqual(g.route, 'tdd');
});

test('a failed route attempt with no recovery is no-route, not PASS', () => {
  const failed = call('s', 'Skill', { skill: 'ck:fix' }, 'Unknown skill', true);
  assert.strictEqual(gradeRoute(stepsOf(failed, edit), ['ck:fix']).why, 'no-route');
  const missing = call('r', 'Read', { file_path: SKILL }, 'File does not exist', true);
  assert.strictEqual(gradeRoute(stepsOf(missing, edit), ['tdd']).why, 'no-route');
});

test('a failed Bash cat of a SKILL.md is neutral too', () => {
  const failed = call('b', 'Bash', { command: `cat ${SKILL}` }, 'No such file', true);
  assert.strictEqual(routeOf(stepsOf(failed)[0]), null);
});

test('Skill with a bare name is not a route unless aliased; ns:name is', () => {
  const route = (skill, aliases) => routeOf(stepsOf(call('s', 'Skill', { skill }))[0], aliases);
  assert.strictEqual(route('tdd'), null);
  assert.strictEqual(route('code-review'), null);
  assert.strictEqual(route('ck:fix'), 'ck:fix');
  assert.strictEqual(route('legacy', new Map([['legacy', new Set(['tdd'])]])), 'legacy');
});

test('Bash route reader sees past cd/&&/||/;/| prefixes and trailing ;', () => {
  const route = (command) => routeOf(stepsOf(call('b', 'Bash', { command }))[0]);
  assert.strictEqual(route(`cd x && cat ${SKILL}`), 'tdd');
  assert.strictEqual(route(`cd x; head -50 ${SKILL}`), 'tdd');
  assert.strictEqual(route(`test -d x || cat ${SKILL}`), 'tdd');
  assert.strictEqual(route(`ls | cat ${SKILL}`), 'tdd');
  assert.strictEqual(route(`cat ${SKILL};`), 'tdd');
  assert.strictEqual(route(`cat "${SKILL}"`), 'tdd');
});

test('Bash route reader still ignores non-readers, even after a separator', () => {
  const route = (command) => routeOf(stepsOf(call('b', 'Bash', { command }))[0]);
  assert.strictEqual(route(`cd x && echo ${SKILL}`), null);
  assert.strictEqual(route(`cat a.txt && grep -n x ${SKILL}`), null);
  assert.strictEqual(route(`cd ${SKILL}`), null);
});

// --- accept rule: float ties -------------------------------------------------

/** n = cases x runs rows, `passes[i]` of the cases passing in run i. */
function rowsOf(passes, cases) {
  const rows = [];
  passes.forEach((k, run) => {
    for (let c = 0; c < cases; c++) rows.push({ case: `c${c}`, split: 'train', run, verdict: c < k ? 'PASS' : 'FAIL' });
  });
  return rows;
}
const OK = { sizeOk: true, leakOk: true };
const side = (passes, testAcc) => ({ train: aggregate(rowsOf(passes, 28), 'train', {}), test: { acc: testAcc, noise: 0 } });

test('decide: an exact integer tie (base [0,0,0] vs cand [3,4,8], 28 cases) is REVERT', () => {
  const base = side([0, 0, 0], 0.5);
  const cand = side([3, 4, 8], 0.6);
  assert.strictEqual(cand.train.k * 28, 15 * 28); // 15/84 == 5/28 in exact arithmetic
  assert.strictEqual(decide(base, cand, OK).verdict, 'REVERT');
});

test('decide: a float-above tie (0.8-0.7 vs noise 0.7-0.6) is REVERT; a real margin still ACCEPTs', () => {
  const t = (acc, noise) => ({ acc, noise });
  const tie = decide({ train: t(0.7, 0.7 - 0.6), test: t(0.5, 0) }, { train: t(0.8, 0), test: t(0.6, 0) }, OK);
  assert.strictEqual(tie.verdict, 'REVERT');
  const real = decide({ train: t(0.5, 0.1), test: t(0.5, 0) }, { train: t(0.8, 0.1), test: t(0.6, 0) }, OK);
  assert.strictEqual(real.verdict, 'ACCEPT');
});

test('decide: a test delta that is only float dust is REVERT', () => {
  const t = (acc, noise = 0) => ({ acc, noise });
  const d = decide({ train: t(0.5), test: t(0.7 - 0.6 + 0.6) }, { train: t(0.9), test: t(0.7) }, OK);
  assert.strictEqual(d.verdict, 'REVERT');
});

// --- route-grade CLI ---------------------------------------------------------

function events(dir, ...calls) { return write(dir, 'events.jsonl', calls.flat().join('\n') + '\n'); }

test('route-grade CLI: PASS exits 0, FAIL exits 1 with the verdict JSON', () => {
  const f = events(tmp(), call('r', 'Read', { file_path: SKILL }), edit);
  const pass = run(GRADER, [f, '--expected', 'tdd']);
  assert.strictEqual(pass.status, 0);
  assert.strictEqual(JSON.parse(pass.stdout).verdict, 'PASS');
  const fail = run(GRADER, [f, '--expected', 'cook']);
  assert.strictEqual(fail.status, 1);
  assert.strictEqual(JSON.parse(fail.stdout).verdict, 'FAIL');
});

test('route-grade CLI: --commands supplies the aliases; the default dir does not know them', () => {
  const dir = tmp();
  fs.mkdirSync(path.join(dir, 'cmds', 'zz'), { recursive: true });
  write(path.join(dir, 'cmds', 'zz'), 'alias.md', 'See [tdd](../../skills/software/tdd/SKILL.md)\n');
  const f = events(dir, call('s', 'Skill', { skill: 'zz:alias' }), edit);
  assert.strictEqual(run(GRADER, [f, '--expected', 'tdd', '--commands', path.join(dir, 'cmds')]).status, 0);
  assert.strictEqual(run(GRADER, [f, '--expected', 'tdd']).status, 1);
});

test('route-grade CLI: usage error, missing events file, bad --commands dir -> exit 2, not FAIL', () => {
  const dir = tmp();
  const f = events(dir, call('r', 'Read', { file_path: SKILL }), edit);
  assert.strictEqual(run(GRADER, []).status, 2);
  assert.strictEqual(run(GRADER, [path.join(dir, 'nope.jsonl'), '--expected', 'tdd']).status, 2);
  assert.strictEqual(run(GRADER, [f, '--expected', 'tdd', '--commands', path.join(dir, 'nope')]).status, 2);
});

// --- routing-guard leak CLI --------------------------------------------------

const SURFACE = 'alpha bravo charlie delta echo foxtrot golf hotel';
const SECRET = 'zebra quartz mango violin harbor ticket lantern';
const guard = (cases, surface = SURFACE) => {
  const dir = tmp();
  return run(GUARD, ['leak', write(dir, 'cases.jsonl', cases), write(dir, 'surface.md', surface)]);
};

test('leak CLI: clean exits 0, an overlapping prompt exits 1 with a count only', () => {
  assert.strictEqual(guard(JSON.stringify({ prompt: SECRET }) + '\n').status, 0);
  const leaked = guard(JSON.stringify({ prompt: `please ${SURFACE} now` }) + '\n');
  assert.strictEqual(leaked.status, 1);
  assert.match(leaked.stdout, /^LEAK: \d+ shingle\(s\)\n$/);
  assert.doesNotMatch(leaked.stdout + leaked.stderr, /alpha|bravo/);
});

test('leak CLI fails closed (exit 2) on empty file, wrong key, or a row without prompt', () => {
  assert.strictEqual(guard('').status, 2);
  assert.strictEqual(guard(JSON.stringify({ text: SURFACE }) + '\n').status, 2);
  const mixed = guard(JSON.stringify({ prompt: SECRET }) + '\n' + JSON.stringify({ id: 'x' }) + '\n');
  assert.strictEqual(mixed.status, 2);
});

test('leak CLI: a malformed row exits 2 and never echoes the prompt text', () => {
  const r = guard(`{"prompt": "${SECRET}" oops\n`);
  assert.strictEqual(r.status, 2);
  assert.doesNotMatch(r.stdout + r.stderr, /zebra|quartz|mango|violin/);
});

test('leak CLI: missing input files exit 2 without a stack trace', () => {
  const r = run(GUARD, ['leak', path.join(tmp(), 'nope.jsonl'), path.join(tmp(), 'nope.md')]);
  assert.strictEqual(r.status, 2);
  assert.doesNotMatch(r.stderr, /\n\s+at /);
});
