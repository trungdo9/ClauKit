/**
 * Tests for delivery-tail.js (T4.2/T6.1) — the declared-tail executor.
 *
 * Execution is deterministic (no LLM on this path), so it is fully covered
 * here: no declaration = no-op exit 0, parsing, commented-out samples stay
 * inert, dry-run executes nothing, then real execution — order, idempotent
 * re-run, paste-ready failure that still exits 0, unresolved placeholders,
 * and the STATE.md lines.
 */

const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const SCRIPT = path.join(__dirname, '..', 'scripts', 'ck', 'delivery-tail.js');
const { extractTailBlock, parseSteps } = require(SCRIPT);

let dir;

before(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ck-tail-'));
  spawnSync('git', ['init', '-q'], { cwd: dir });
});

after(() => {
  fs.rmSync(dir, { recursive: true, force: true });
});

function runTail(args) {
  return spawnSync('node', [SCRIPT, ...args], { cwd: dir, encoding: 'utf-8' });
}

test('no CLAUDE.md → no-op, exit 0, no output', () => {
  const res = runTail([]);
  assert.strictEqual(res.status, 0);
  assert.strictEqual((res.stdout + res.stderr).trim(), '');
});

test('CLAUDE.md without a Delivery tail block → no-op, exit 0', () => {
  fs.writeFileSync(path.join(dir, 'CLAUDE.md'), '# Project\n\n## Rules\n- be nice\n');
  const res = runTail([]);
  assert.strictEqual(res.status, 0);
  assert.strictEqual((res.stdout + res.stderr).trim(), '');
});

test('commented-out sample steps stay inert (the shipped default)', () => {
  fs.writeFileSync(path.join(dir, 'CLAUDE.md'), [
    '# Project', '',
    '## Delivery tail (optional)',
    '<!-- Steps run in listed order after the PR opens. Delete this block if unused.',
    '- **close-issue**',
    '  - run: `gh issue close {{issue}}`',
    '  - done-when: `gh issue view {{issue}} --json state -q .state` = `CLOSED`',
    '-->',
    '',
  ].join('\n'));
  const res = runTail([]);
  assert.strictEqual(res.status, 0);
  assert.strictEqual((res.stdout + res.stderr).trim(), '', 'commented steps are NOT declared steps');
});

test('a declared 2-step tail parses in declaration order with all 4 keys', () => {
  const block = extractTailBlock([
    '## Delivery tail',
    '- **close-issue**',
    '  - run: `gh issue close {{issue}} --comment "Fixed in {{pr_url}}"`',
    '  - needs: issue (from branch name), pr_url',
    '  - done-when: `gh issue view {{issue}} --json state -q .state` = `CLOSED`',
    '  - on-fail: paste-ready',
    '- **notify**',
    '  - run: `./scripts/notify.sh {{pr_url}}`',
    '  - done-when: `test -f .notified` = ``',
    '## Next section',
  ].join('\n'));
  const { steps, bad } = parseSteps(block);
  assert.strictEqual(bad.length, 0);
  assert.deepStrictEqual(steps.map(s => s.name), ['close-issue', 'notify']);
  assert.match(steps[0].run, /gh issue close/);
  assert.match(steps[0]['done-when'], /CLOSED/);
  assert.strictEqual(steps[0]['on-fail'], 'paste-ready');
});

test('a step without run: is reported and skipped, never aborts', () => {
  fs.writeFileSync(path.join(dir, 'CLAUDE.md'), [
    '## Delivery tail',
    '- **broken-step**',
    '  - done-when: `true` = ``',
    '',
  ].join('\n'));
  const res = runTail(['--dry-run']);
  assert.strictEqual(res.status, 0);
  assert.match(res.stderr, /broken-step.*skipped/i);
});

test('dry-run resolves every placeholder and executes nothing', () => {
  fs.writeFileSync(path.join(dir, 'CLAUDE.md'), [
    '## Delivery tail',
    '- **step-a**',
    '  - run: `touch {{marker}}`',
    '  - done-when: `cat {{marker}}` = `a`',
    '- **step-b**',
    '  - run: `echo b`',
    '',
  ].join('\n'));
  const res = runTail(['--dry-run', '--context', 'marker=dry-marker']);
  assert.strictEqual(res.status, 0);
  assert.match(res.stdout, /parsed 2 step\(s\): step-a → step-b/);
  assert.match(res.stdout, /run:\s+touch dry-marker/);
  assert.match(res.stdout, /done-when:\s+cat dry-marker\s+==\s+a/);
  assert.match(res.stdout, /done-when: \(none — runs once/);
  assert.ok(!fs.existsSync(path.join(dir, 'dry-marker')), 'dry run must not execute anything');
});

// ---------- deterministic execution (no LLM on this path) ----------

test('runs steps in order, re-checks done-when, reports DONE', () => {
  fs.writeFileSync(path.join(dir, 'CLAUDE.md'), [
    '## Delivery tail',
    '- **make-a**',
    '  - run: `echo a > out-a`',
    '  - done-when: `cat out-a` = `a`',
    '- **make-b**',
    '  - run: `echo b > out-b`',
    '  - done-when: `cat out-b` = `b`',
    '',
  ].join('\n'));
  const res = runTail([]);
  assert.strictEqual(res.status, 0, res.stderr);
  assert.match(res.stdout, /DONE: make-a[\s\S]*DONE: make-b/);
  assert.match(res.stdout, /TAIL COMPLETE: 2\/2 done, 0 skipped, 0 failed/);
});

test('re-running is idempotent — satisfied done-when skips without a second write', () => {
  const res = runTail([]);
  assert.strictEqual(res.status, 0);
  assert.match(res.stdout, /SKIPPED \(idempotent\): make-a/);
  assert.match(res.stdout, /TAIL COMPLETE: 0\/2 done, 2 skipped, 0 failed/);
});

test('a failing step emits a paste-ready payload, continues, and still exits 0', () => {
  fs.writeFileSync(path.join(dir, 'CLAUDE.md'), [
    '## Delivery tail',
    '- **will-fail**',
    '  - run: `exit 3`',
    '- **still-runs**',
    '  - run: `echo ok > after-fail`',
    '',
  ].join('\n'));
  const res = runTail([]);
  assert.strictEqual(res.status, 0, 'a failed step must never dead-end the tail');
  assert.match(res.stdout, /FAILED: will-fail/);
  assert.match(res.stdout, /run by hand:\s+exit 3/);
  assert.match(res.stdout, /DONE: still-runs/);
  assert.match(res.stdout, /TAIL COMPLETE: 1\/2 done, 0 skipped, 1 failed/);
});

test('unresolved {{placeholder}} fails the step instead of running a literal', () => {
  fs.writeFileSync(path.join(dir, 'CLAUDE.md'), [
    '## Delivery tail',
    '- **needs-input**',
    '  - run: `touch {{nope}}`',
    '  - needs: nope (from the ticket)',
    '',
  ].join('\n'));
  const res = runTail([]);
  assert.strictEqual(res.status, 0);
  assert.match(res.stdout, /FAILED: needs-input/);
  assert.match(res.stdout, /unresolved input\(s\): nope/);
  assert.match(res.stdout, /declared needs: nope/);
  assert.ok(!fs.existsSync(path.join(dir, '{{nope}}')), 'must not execute with a literal placeholder');
});

test('--plan writes one STATE.md line per step', () => {
  const planDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ck-tail-plan-'));
  fs.writeFileSync(path.join(dir, 'CLAUDE.md'), [
    '## Delivery tail',
    '- **ledger-step**',
    '  - run: `echo x > ledger-out`',
    '  - done-when: `cat ledger-out` = `x`',
    '',
  ].join('\n'));
  runTail(['--plan', planDir]);
  const state = fs.readFileSync(path.join(planDir, 'STATE.md'), 'utf-8');
  assert.match(state, /finish: tail ledger-step → DONE/);
  runTail(['--plan', planDir]);
  assert.match(fs.readFileSync(path.join(planDir, 'STATE.md'), 'utf-8'), /SKIPPED \(idempotent\)/);
  fs.rmSync(planDir, { recursive: true, force: true });
});

test('step names with regex metacharacters are handled literally', () => {
  fs.writeFileSync(path.join(dir, 'CLAUDE.md'), [
    '## Delivery tail',
    '- **close-issue [tracker] (v2)**',
    '  - run: `echo m > meta-out`',
    '  - done-when: `cat meta-out` = `m`',
    '',
  ].join('\n'));
  const res = runTail([]);
  assert.strictEqual(res.status, 0);
  assert.match(res.stdout, /DONE: close-issue \[tracker\] \(v2\)/);
});

test('parseDoneWhen: expected value, exit-0 form, and bare command', () => {
  const { parseDoneWhen } = require(SCRIPT);
  assert.deepStrictEqual(parseDoneWhen('`gh issue view 1 -q .state` = `CLOSED`'), { cmd: 'gh issue view 1 -q .state', expected: 'CLOSED' });
  assert.deepStrictEqual(parseDoneWhen('`test -f .notified` = ``'), { cmd: 'test -f .notified', expected: null });
  assert.deepStrictEqual(parseDoneWhen('`test -f x`'), { cmd: 'test -f x', expected: null });
  assert.strictEqual(parseDoneWhen(undefined), null);
});
