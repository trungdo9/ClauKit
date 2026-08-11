/**
 * Tests for delivery-tail.cjs (T4.2/T6.1) — the declared-tail executor.
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

const SCRIPT = path.join(__dirname, '..', 'scripts', 'ck', 'delivery-tail.cjs');
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

/** Execution requires an approved declaration; call after writing CLAUDE.md. */
function approveTail() {
  const res = runTail(['--approve']);
  assert.strictEqual(res.status, 0, res.stderr);
  return res;
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
  approveTail();
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
  approveTail();
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
  approveTail();
  const res = runTail([]);
  assert.strictEqual(res.status, 0);
  assert.match(res.stdout, /FAILED: needs-input/);
  assert.match(res.stdout, /unresolved input\(s\) in run: nope/);
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
  approveTail();
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
  approveTail();
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

// ---------- C3 (code review 2026-07-31) ----------

test('a value carrying shell metacharacters is refused, not spliced', () => {
  const marker = path.join(dir, 'INJECTED');
  fs.writeFileSync(path.join(dir, 'CLAUDE.md'), [
    '## Delivery tail',
    '- **notify**',
    '  - run: `echo shipped {{who}}`',
    '',
  ].join('\n'));
  approveTail();
  const res = runTail(['--context', `who=x;touch ${marker}`]);
  assert.strictEqual(res.status, 0);
  assert.ok(!fs.existsSync(marker), 'COMMAND INJECTION via --context');
  assert.match(res.stdout, /refusing to substitute value\(s\) containing shell metacharacters/);
  assert.match(res.stdout, /TAIL COMPLETE: 0\/1 done, 0 skipped, 1 failed/);
});

test('an injected branch name never reaches the shell via {{branch}}', () => {
  const marker = path.join(dir, 'INJECTED-BRANCH');
  fs.writeFileSync(path.join(dir, 'CLAUDE.md'), [
    '## Delivery tail',
    '- **notify**',
    '  - run: `echo shipped {{branch}}`',
    '',
  ].join('\n'));
  approveTail();
  spawnSync('git', ['add', '.'], { cwd: dir });
  spawnSync('git', ['-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', 'base'], { cwd: dir });
  // `${IFS}` matters: git rejects a branch name containing a literal space.
  const evil = 'x;touch${IFS}' + marker;
  const cb = spawnSync('git', ['checkout', '-q', '-b', evil], { cwd: dir, encoding: 'utf-8' });
  assert.strictEqual(cb.status, 0, `git should accept this branch name: ${cb.stderr}`);
  const res = runTail([]);
  assert.ok(!fs.existsSync(marker), 'COMMAND INJECTION via {{branch}}');
  assert.match(res.stdout, /refusing to substitute/);
  spawnSync('git', ['checkout', '-q', '-'], { cwd: dir });
});

test('a fenced example block is documentation, not declared steps', () => {
  const marker = path.join(dir, 'FENCED-RAN');
  fs.writeFileSync(path.join(dir, 'CLAUDE.md'), [
    '## Delivery tail',
    'We do not use the tail yet. The format looks like this:',
    '',
    '```markdown',
    '- **close the tracker issue**',
    `  - run: \`touch ${marker}\``,
    '```',
    '',
  ].join('\n'));
  const res = runTail([]);
  assert.strictEqual(res.status, 0);
  assert.ok(!fs.existsSync(marker), 'a documented example must never execute');
  assert.strictEqual((res.stdout + res.stderr).trim(), '', 'nothing is declared, so nothing is said');
});

test('an unapproved declaration refuses to run and says how to review it', () => {
  const marker = path.join(dir, 'UNAPPROVED-RAN');
  fs.writeFileSync(path.join(dir, 'CLAUDE.md'), [
    '## Delivery tail',
    '- **exfiltrate**',
    `  - run: \`touch ${marker}\``,
    '',
  ].join('\n'));
  const res = runTail([]);           // deliberately NOT approved
  assert.strictEqual(res.status, 0, 'refusal must not dead-end the PR');
  assert.ok(!fs.existsSync(marker), 'an unapproved step must not execute');
  assert.match(res.stdout, /REFUSED: this delivery tail/);
  assert.match(res.stdout, /--approve/);
  assert.match(res.stdout, /Steps declared: exfiltrate/);
});

// ---------- parser defects (code review 2026-08-11) ----------

test('a bold name with trailing prose starts its own step', () => {
  // The name regexes required `**bold**` to END the line, and the plain
  // alternative rejected a leading `*`. So `- **notify team** (optional)` matched
  // neither, no new step started, and its `run:` overwrote the PREVIOUS step's
  // command: one step's command ran and was reported DONE under the other's name.
  const { steps, bad, warn } = parseSteps(extractTailBlock([
    '## Delivery tail',
    '- **close issue**',
    '  - run: `echo closed > out-close`',
    '- **notify team** (optional)',
    '  - run: `echo notified > out-notify`',
    '',
  ].join('\n')));
  assert.strictEqual(bad.length, 0);
  assert.strictEqual(warn.length, 0);
  assert.deepStrictEqual(steps.map(s => s.name), ['close issue', 'notify team']);
  assert.match(steps[0].run, /echo closed/, "the first step's command must survive the second step");
  assert.match(steps[1].run, /echo notified/);
});

test('a second run: never replaces a command already declared', () => {
  // The invariant that closes the dropped-step class for good, whatever an
  // unrecognised line looks like.
  const { steps, warn } = parseSteps([
    '- **step**',
    '  - run: `echo first`',
    '  - run: `echo second`',
  ].join('\n'));
  assert.strictEqual(steps.length, 1);
  assert.match(steps[0].run, /echo first/);
  assert.ok(warn.some(w => /second 'run:'/.test(w)), 'silently keeping the last one is how a step went missing');
});

test('an H1 ends the tail block — bullets below it are not steps', () => {
  const marker = path.join(dir, 'H1-RAN');
  fs.writeFileSync(path.join(dir, 'CLAUDE.md'), [
    '## Delivery tail',
    '- **declared**',
    '  - run: `echo d > out-declared`',
    '',
    '# Other section',
    '- **not a step**',
    `  - run: \`touch ${marker}\``,
    '',
  ].join('\n'));
  const { steps } = parseSteps(extractTailBlock(fs.readFileSync(path.join(dir, 'CLAUDE.md'), 'utf-8')));
  assert.deepStrictEqual(steps.map(s => s.name), ['declared'], 'a later H1 closes the section');
  approveTail();
  runTail([]);
  assert.ok(!fs.existsSync(marker), 'a bullet in an unrelated section must never execute');
});

test('an unbackticked done-when is not split at a bare =', () => {
  const { parseDoneWhen } = require(SCRIPT);
  // Splitting at the FIRST `=` truncated the command and invented an expected
  // value, so the check could never pass and the step ran on every invocation.
  assert.deepStrictEqual(parseDoneWhen('curl -sf http://x/y?a=b'),
    { cmd: 'curl -sf http://x/y?a=b', expected: null });
  assert.deepStrictEqual(parseDoneWhen('gh pr view --json state=x'),
    { cmd: 'gh pr view --json state=x', expected: null });
  // The documented spaced form still parses.
  assert.deepStrictEqual(parseDoneWhen('cat marker.txt = ready'),
    { cmd: 'cat marker.txt', expected: 'ready' });
});

test('an unresolved done-when placeholder fails the step BEFORE it writes', () => {
  // isDone() returned a bare `false`, so the step executed, was reported FAILED
  // with no reason line, and executed AGAIN on the next run — both halves of the
  // idempotency contract broken by one missing branch.
  fs.writeFileSync(path.join(dir, 'CLAUDE.md'), [
    '## Delivery tail',
    '- **append**',
    '  - run: `echo ran >> tally.txt`',
    '  - done-when: `grep -c ran tally.txt` = `{{pr}}`',
    '',
  ].join('\n'));
  approveTail();
  const first = runTail([]);
  assert.strictEqual(first.status, 0);
  assert.match(first.stdout, /FAILED: append/);
  assert.match(first.stdout, /unresolved input\(s\) in done-when: pr/, 'the payload must name the missing key');
  assert.ok(!fs.existsSync(path.join(dir, 'tally.txt')), 'a step with an unresolvable check must not run at all');

  runTail([]);
  assert.ok(!fs.existsSync(path.join(dir, 'tally.txt')), 'and must not accumulate writes across runs');
});

test('approval is content-bound: editing a step re-arms the refusal', () => {
  const marker = path.join(dir, 'MUTATED-RAN');
  const write = run => fs.writeFileSync(path.join(dir, 'CLAUDE.md'),
    ['## Delivery tail', '- **step**', `  - run: \`${run}\``, ''].join('\n'));

  write('echo original > approved-out');
  approveTail();
  assert.match(runTail([]).stdout, /DONE: step/);

  write(`touch ${marker}`);           // what a merged PR would do
  const res = runTail([]);
  assert.ok(!fs.existsSync(marker), 'a changed step must not run under the old approval');
  assert.match(res.stdout, /REFUSED/);
});
