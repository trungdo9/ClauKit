/**
 * Tests for the behavioural harness itself (tests/behavior/tool-sequence.cjs).
 *
 * The scenarios need a live `claude -p` run and are deliberately outside
 * `npm test`. Their *checker* does not: `tdd-red-first`'s whole verdict now rests
 * on one ordering function, and a silent regression in it would turn the gate
 * into a rubber stamp — which is exactly the failure the rewrite was fixing
 * (the previous assertion passed with its gate blanked). So the checker is
 * pinned here, deterministically, with no model in the loop.
 */

const { test } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { parse, outcomeOf, tddOrder, evidenceBefore, sameTurn, concurrentDispatch } = require('./behavior/tool-sequence.cjs');

const RUNNER = path.join(__dirname, 'behavior', 'run-scenario.sh');

/** Ask the harness's ERROR-class heuristic about a transcript body. */
function infraReason(body) {
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'ck-infra-')), 't.txt');
  fs.writeFileSync(f, body);
  const r = spawnSync('bash', ['-c', `source "${RUNNER}"; infra_failure_reason "${f}"`], { encoding: 'utf-8' });
  return { isInfra: r.status === 0, reason: r.stdout.trim() };
}

/** One stream-json event carrying assistant blocks. */
const asst = (...blocks) => JSON.stringify({ type: 'assistant', message: { content: blocks } });
const res = (id, content, isError) => JSON.stringify({
  type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: id, content, is_error: !!isError }] },
});
const use = (id, name, input) => ({ type: 'tool_use', id, name, input });

/** Steps for a stream, from JSONL lines. */
const stepsOf = (lines) => parse(lines).steps;

const PROD = /src\/math\.js/;

// A disciplined run: read → write test → run it red → fix.
const RED_FIRST = [
  asst({ type: 'text', text: 'Reading first.' }, use('r', 'Read', { file_path: 'src/math.js' })),
  res('r', 'function add(a,b){return a+b+1}'),
  asst(use('w', 'Write', { file_path: 'test-math.js' })),
  res('w', 'ok'),
  asst(use('b', 'Bash', { command: 'node test-math.js' })),
  res('b', 'AssertionError: Expected 4 but got 5', true),
  asst(use('e', 'Edit', { file_path: 'src/math.js' })),
  res('e', 'ok'),
];

// The undisciplined shape the gate exists to catch: fix, then write a test that
// passes by construction. Final disk state is IDENTICAL to RED_FIRST.
const FIX_FIRST = [
  asst(use('r', 'Read', { file_path: 'src/math.js' })),
  res('r', 'function add(a,b){return a+b+1}'),
  asst(use('e', 'Edit', { file_path: 'src/math.js' })),
  res('e', 'ok'),
  asst(use('w', 'Write', { file_path: 'test-math.js' })),
  res('w', 'ok'),
  asst(use('b', 'Bash', { command: 'node test-math.js' })),
  res('b', 'all good'),
];

// Fan-out and queue, as the stream records them. Same tools, same targets, same
// order, same end state — the ONLY difference is the message boundary, which is
// exactly the thing `/ck:cook` § Dispatch Tiers says decides whether a "parallel"
// stage is parallel at all.
const FANNED_OUT = [
  asst({ type: 'text', text: 'Verifying all four claims at once.' },
    use('t1', 'Task', { description: 'verify claims re parser' }),
    use('t2', 'Task', { description: 'verify claims re registry' })),
  res('t1', 'CONFIRMED'),
  res('t2', 'REFUTED'),
];
const QUEUED = [
  asst({ type: 'text', text: 'Verifying the parser claims.' }, use('t1', 'Task', { description: 'verify claims re parser' })),
  res('t1', 'CONFIRMED'),
  asst({ type: 'text', text: 'Now the registry claims.' }, use('t2', 'Task', { description: 'verify claims re registry' })),
  res('t2', 'REFUTED'),
];

test('two dispatches in one message read as a fan-out', () => {
  const v = sameTurn(stepsOf(FANNED_OUT), /^Task$/, 2);
  assert.ok(v.ok, v.why);
  assert.strictEqual(v.max, 2);
  assert.strictEqual(v.total, 2);
});

test('the same two dispatches one-per-message do NOT — the discriminator', () => {
  // Without this the assertion would pass on a serial queue, i.e. it would
  // measure "did it delegate", a thing the model does anyway, and never
  // "did it delegate concurrently", which is the rule.
  const v = sameTurn(stepsOf(QUEUED), /^Task$/, 2);
  assert.ok(!v.ok, 'a queue must not satisfy a fan-out assertion');
  assert.strictEqual(v.max, 1);
  assert.strictEqual(v.total, 2, 'both calls are still counted — only their batching differs');
});

// The two routes to a real fan-out, and the one shape that has neither. `bg` is
// what two measured runs actually sent: run_in_background:false on every
// dispatch, which blocks the orchestrator and serializes the stage whatever the
// instruction says. The tool's own default is background.
const dispatch = (id, bg) => use(id, 'Agent', { subagent_type: 'debugger', description: `verify ${id}`,
                                                ...(bg === undefined ? {} : { run_in_background: bg }) });

test('dispatches left in the background are concurrent even one per message', () => {
  const v = concurrentDispatch(stepsOf([
    asst(dispatch('a')), res('a', 'CONFIRMED'),
    asst(dispatch('b')), res('b', 'REFUTED'),
  ]), 2);
  assert.ok(v.ok, v.why);
  assert.strictEqual(v.background, 2);
  assert.strictEqual(v.batched, 1, 'not batched in one message — background is the other route');
});

test('dispatches that force blocking are NOT a fan-out — the measured failure', () => {
  const v = concurrentDispatch(stepsOf([
    asst(dispatch('a', false)), res('a', 'CONFIRMED'),
    asst(dispatch('b', false)), res('b', 'REFUTED'),
  ]), 2);
  assert.ok(!v.ok, 'run_in_background:false one per message is a queue');
  assert.strictEqual(v.blocking, 2);
  assert.strictEqual(v.background, 0);
});

test('blocking dispatches still count as a fan-out when batched in one message', () => {
  // Both routes are genuinely sufficient on their own; asserting the AND would
  // fail runs that are actually concurrent.
  const v = concurrentDispatch(stepsOf([
    asst(dispatch('a', false), dispatch('b', false)), res('a', 'x'), res('b', 'y'),
  ]), 2);
  assert.ok(v.ok, v.why);
  assert.strictEqual(v.batched, 2);
});

test('a dispatch names its persona even when the prompt is long', () => {
  // The persona has to survive the 160-char cap: a batch of read-only debuggers
  // is the rule, a batch of implementers is the violation, and a truncated
  // JSON blob cannot tell them apart.
  const steps = stepsOf([
    asst(use('t', 'Task', { subagent_type: 'debugger', description: 'refute claim 3',
                            prompt: 'x'.repeat(4000) })),
    res('t', 'REFUTED'),
  ]);
  assert.strictEqual(steps[0].target, 'debugger: refute claim 3');
  assert.ok(steps[0].target.length < 160);
});

test('turn numbers advance per message that calls tools, not per call', () => {
  assert.deepStrictEqual(stepsOf(FANNED_OUT).map(s => s.turn), [1, 1]);
  assert.deepStrictEqual(stepsOf(QUEUED).map(s => s.turn), [1, 2]);
});

test('a batch of other tools is not a fan-out of the tool asked about', () => {
  const mixed = [
    asst(use('a', 'Read', { file_path: 'a.md' }), use('b', 'Read', { file_path: 'b.md' }),
         use('t', 'Task', { description: 'one agent' })),
    res('a', 'x'), res('b', 'y'), res('t', 'done'),
  ];
  const v = sameTurn(stepsOf(mixed), /^Task$/, 2);
  assert.ok(!v.ok, 'three parallel calls but only one is a dispatch');
  assert.strictEqual(v.max, 1);
});

test('no dispatch at all is reported as the stage not running, not as a queue', () => {
  const v = sameTurn(stepsOf([asst(use('r', 'Read', { file_path: 'a.md' })), res('r', 'x')]), /^Task$/, 2);
  assert.ok(!v.ok);
  assert.strictEqual(v.total, 0);
  assert.match(v.why, /did not run/);
});

test('parse keeps tool calls in order and pairs each result to its call', () => {
  const steps = stepsOf(RED_FIRST);
  assert.deepStrictEqual(steps.map(s => `${s.tool}:${s.target}`), [
    'Read:src/math.js', 'Write:test-math.js', 'Bash:node test-math.js', 'Edit:src/math.js',
  ]);
  assert.deepStrictEqual(steps.map(s => s.idx), [1, 2, 3, 4]);
  assert.match(outcomeOf(steps[2].result), /^fail:AssertionError/);
  assert.strictEqual(outcomeOf(steps[0].result), 'ok');
});

test('a non-zero tool result without a known marker is still a failure', () => {
  const steps = stepsOf([asst(use('b', 'Bash', { command: 'npm test' })), res('b', 'weird output', true)]);
  assert.strictEqual(outcomeOf(steps[0].result), 'fail:tool-error');
});

test('red-before-green passes for a test written and observed failing first', () => {
  const v = tddOrder(stepsOf(RED_FIRST), PROD);
  assert.ok(v.ok, v.why);
  assert.deepStrictEqual(v.steps, { prod: 4, written: 2, red: 3 });
});

test('the same end state fails when the fix came first — the discriminator', () => {
  const v = tddOrder(stepsOf(FIX_FIRST), PROD);
  assert.ok(!v.ok);
  assert.match(v.why, /AFTER the fix at step 2/);
});

test('a test written before the fix but never run red is not red-before-green', () => {
  const v = tddOrder(stepsOf([
    asst(use('w', 'Write', { file_path: 'test-math.js' })), res('w', 'ok'),
    asst(use('b', 'Bash', { command: 'node test-math.js' })), res('b', 'ok, 1 passing'),
    asst(use('e', 'Edit', { file_path: 'src/math.js' })), res('e', 'ok'),
  ]), PROD);
  assert.ok(!v.ok);
  assert.match(v.why, /red was never demonstrated/);
});

test('an unrelated failing node command is not "the test was seen failing"', () => {
  // Regression: TEST_RUN matched bare `node\s`, so an exploratory
  // `node .claude/hooks/file-claims.cjs` exiting non-zero counted as red — at a
  // step before any test existed. A real no-gate run was passed on that basis.
  const v = tddOrder(stepsOf([
    asst(use('probe', 'Bash', { command: 'node .claude/hooks/file-claims.cjs list' })), res('probe', 'no claims', true),
    asst(use('w', 'Write', { file_path: 'test-math.js' })), res('w', 'ok'),
    asst(use('e', 'Edit', { file_path: 'src/math.js' })), res('e', 'ok'),
  ]), PROD);
  assert.ok(!v.ok);
  assert.match(v.why, /red was never demonstrated/);
});

test('the red run must name the test, or invoke the suite', () => {
  const viaSuite = tddOrder(stepsOf([
    asst(use('w', 'Write', { file_path: 'test-math.js' })), res('w', 'ok'),
    asst(use('b', 'Bash', { command: 'npm test' })), res('b', 'AssertionError', true),
    asst(use('e', 'Edit', { file_path: 'src/math.js' })), res('e', 'ok'),
  ]), PROD);
  assert.ok(viaSuite.ok, viaSuite.why);

  const viaName = tddOrder(stepsOf([
    asst(use('w', 'Write', { file_path: 'test-math.js' })), res('w', 'ok'),
    asst(use('b', 'Bash', { command: 'node test-math.js' })), res('b', 'AssertionError', true),
    asst(use('e', 'Edit', { file_path: 'src/math.js' })), res('e', 'ok'),
  ]), PROD);
  assert.ok(viaName.ok, viaName.why);
});

test('reading the production file does not count as mutating it', () => {
  // A run that only ever Reads src/math.js has no ordering to judge — reporting
  // it as a pass would let a no-op run through the gate.
  const v = tddOrder(stepsOf([
    asst(use('r', 'Read', { file_path: 'src/math.js' })), res('r', 'src'),
    asst(use('g', 'Grep', { pattern: 'add', path: 'src/math.js' })), res('g', 'hit'),
  ]), PROD);
  assert.ok(!v.ok);
  assert.match(v.why, /never mutated/);
});

test('a heredoc/sed write through Bash counts as mutating the production file', () => {
  // Otherwise `cat > src/math.js <<EOF` is an invisible fix and the gate passes
  // on ordering it never actually saw.
  const v = tddOrder(stepsOf([
    asst(use('b1', 'Bash', { command: "cat > src/math.js <<'EOF'\nfixed\nEOF" })), res('b1', ''),
    asst(use('w', 'Write', { file_path: 'test-math.js' })), res('w', 'ok'),
    asst(use('b2', 'Bash', { command: 'node test-math.js' })), res('b2', 'AssertionError', true),
  ]), PROD);
  assert.ok(!v.ok, 'the Bash write must be seen as the fix, at step 1');
  assert.match(v.why, /step 1/);
});

test('a plain-text infra notice never parses into a passing sequence', () => {
  // A spend-limit run emits no JSON. It must not read as "no violation found".
  const { steps } = parse(["You've hit your org's monthly spend limit."]);
  assert.strictEqual(steps.length, 0);
  const v = tddOrder(steps, PROD);
  assert.ok(!v.ok);
});

test('--prose carries what the model said, never what a tool returned', () => {
  // The hazard this closes: `verify-plan-fires` asserts the model refuted a
  // claim by grepping for "returns a string" — and its fixture's first line is
  // `// parse.js — returns a STRING, not an int`. Once tool results are rendered
  // into the transcript, merely reading the file satisfies the assertion.
  const lines = [
    asst({ type: 'text', text: 'Checking the plan claim.' }, use('r', 'Read', { file_path: 'src/parse.js' })),
    res('r', '// parse.js — returns a STRING, not an int'),
    asst({ type: 'text', text: 'The root cause is REFUTED.' }),
    JSON.stringify({ type: 'result', subtype: 'success', result: 'Stopped before editing.' }),
  ];
  const { steps, prose } = parse(lines);
  const results = new Set(steps.filter(s => s.result).map(s => s.result.text));
  const spoken = prose.filter(p => !results.has(p.text)).map(p => p.text).join('\n');

  assert.match(spoken, /REFUTED/, "the model's own conclusion must survive");
  assert.match(spoken, /Stopped before editing/, 'the final result is the model speaking');
  assert.doesNotMatch(spoken, /returns a STRING/,
    'file contents are tool output — letting them through makes the fixture satisfy its own assertion');
});

// ---------- the ERROR class (run-scenario.sh) ----------
// It has misdiagnosed in both directions on real runs: 6× FAIL when every
// transcript was a spend-limit notice, and 1× ERROR on a healthy 14KB run whose
// session UUID happened to contain "529". Both directions are pinned here.

test('a run that never happened is classified as infrastructure, not as a gate failure', () => {
  for (const notice of [
    "You've hit your org's monthly spend limit. Visit /usage-credits.",
    'Invalid API key · please run `claude login`',
    'API Error: 529 {"type":"error","error":{"type":"overloaded_error"}}',
    'Internal server error',
  ]) {
    const { isInfra, reason } = infraReason(notice.padEnd(500, ' '));
    assert.ok(isInfra, `should be ERROR, not FAIL: ${notice}`);
    assert.ok(reason.length > 0, 'an ERROR must say why');
  }
  assert.ok(infraReason('').isInfra, 'an empty transcript is not a verdict');
  assert.ok(infraReason('tiny').isInfra, 'an implausibly short transcript is not a verdict');
});

test('a healthy transcript is not mistaken for an upstream error by stray digits', () => {
  // The regression: `529` was a bare alternative, so any three digits matched.
  const healthy = [
    'session 4f0e0ae0-4284-4e1a-8c64-06666529a20b',
    '[tool 1: Bash] node test-math.js',
    '[result 1: fail:AssertionError] AssertionError: Expected 4 but got 5',
    '[tool 2: Edit] src/math.js',
    'duration_ms: 5291 · input_tokens: 15293 · cost: 0.00529',
  ].join('\n').padEnd(900, '.');
  const { isInfra, reason } = infraReason(healthy);
  assert.ok(!isInfra, `a real run must produce a verdict, not an ERROR (got: ${reason})`);
});

// --- the "genuinely verified" count -----------------------------------------
// Regression: the count incremented on the gate run alone, so a sweep printed
// "2 scenario(s) genuinely verified" directly beneath "NOT SENSITIVE" and an
// ERROR that meant one scenario never ran. The word "genuinely" is in that line
// specifically to resist self-deception; the number beside it said otherwise.
const { execFileSync } = require('node:child_process');

function sweepSummary({ negative, gateRc, nogateRcs }) {
  // Drive main() with run_one stubbed, so the counting logic is exercised
  // without spending a single `claude -p` call.
  const script = `
    source tests/behavior/run-scenario.sh
    _i=0
    run_one() {
      if [ "$2" = gate ]; then return ${gateRc}; fi
      _i=$((_i + 1)); set -- ${nogateRcs.join(' ')}; return \${!_i}
    }
    ALL_SET="stub"; FAST_SET="stub"
    main stub ${negative ? '--negative=' + nogateRcs.length : ''} 2>&1 | tail -20
  `;
  return execFileSync('bash', ['-c', script], { encoding: 'utf8' });
}

test('a leaking negative control is not counted as genuinely verified', () => {
  const out = sweepSummary({ negative: true, gateRc: 0, nogateRcs: [0, 1, 0] });
  assert.match(out, /SUPPORTED, NOT DEMONSTRATED/, 'a leak must be reported');
  assert.match(out, /absent in 2 of/, 'it must say how the runs actually split');
  assert.match(out, /── 0 scenario\(s\) genuinely verified/,
    'a scenario whose gate was not demonstrated must not be counted');
});

test('a gate is counted only when every ablated run loses the behaviour', () => {
  const out = sweepSummary({ negative: true, gateRc: 0, nogateRcs: [0, 0, 0] });
  assert.match(out, /negative control OK/);
  assert.match(out, /── 1 scenario\(s\) genuinely verified/);
});

test('without --negative the gate run alone still counts, and says so', () => {
  const out = sweepSummary({ negative: false, gateRc: 0, nogateRcs: [] });
  assert.match(out, /── 1 scenario\(s\) genuinely verified/);
  assert.doesNotMatch(out, /with negative control/,
    'an unablated pass must not claim the negative control was run');
});

// --- evidence-before-implementation (verify-plan-fires) ----------------------
// The old assertion was "source unedited AND prose says the claim is false", and
// a capable model does both unaided — it survived 3 of 3 ablated runs against a
// tree with no trace of the rule left in it. What care alone does not do is RUN
// the command the plan cites before building on it. That is an ordering fact.
const EVI = /git\s+(show|blame)|abc1234/;
const MUT = /src\/counts\.js/;

test('checking the cited commit before touching the target passes', () => {
  const v = evidenceBefore(stepsOf([
    asst(use('a', 'Read', { file_path: 'plans/drop-coercion/plan.md' })),
    res('a', '# Plan'),
    asst(use('b', 'Bash', { command: 'git show abc1234 --stat' })),
    res('b', ' src/parse.js | 1 +'),
  ]), EVI, MUT);
  assert.ok(v.ok, v.why);
  assert.match(v.why, /no mutation/);
});

test('a plan claim built on without ever running its cited command fails', () => {
  const v = evidenceBefore(stepsOf([
    asst(use('a', 'Read', { file_path: 'src/counts.js' })),
    res('a', 'const { parseCount }'),
    asst(use('b', 'Bash', { command: 'git log --oneline -5' })),
    res('b', 'abc1234 fix(parse): emit integer counts'),
    asst(use('c', 'Edit', { file_path: 'src/counts.js' })),
    res('c', 'ok'),
  ]), EVI, MUT);
  assert.ok(!v.ok, 'orienting with git log is not inspecting the cited commit');
  assert.match(v.why, /taken on trust/);
});

test('inspecting the commit only after editing is not verification', () => {
  const v = evidenceBefore(stepsOf([
    asst(use('a', 'Edit', { file_path: 'src/counts.js' })),
    res('a', 'ok'),
    asst(use('b', 'Bash', { command: 'git show abc1234' })),
    res('b', 'comment only'),
  ]), EVI, MUT);
  assert.ok(!v.ok);
  assert.match(v.why, /mutated at step 1, BEFORE/);
});

test('a bash-written mutation counts as a mutation, not just Edit/Write', () => {
  const v = evidenceBefore(stepsOf([
    asst(use('a', 'Bash', { command: "sed -i 's/Number(//' src/counts.js" })),
    res('a', ''),
    asst(use('b', 'Bash', { command: 'git show abc1234' })),
    res('b', 'comment only'),
  ]), EVI, MUT);
  assert.ok(!v.ok, 'editing through a shell must not launder the ordering');
  assert.match(v.why, /BEFORE the cited claim/);
});

// --- verdict classes and the positive control -------------------------------
// Three outcomes, because two conflated the only two gates with real evidence
// into the same bucket as the ones with none: a rule that shifts behaviour
// without deciding it is not a rule that does nothing.

function sweep({ negative = false, positive = false, gateRc = 0, nolineRc = 0, nogateRcs = [] } = {}) {
  const script = `
    source tests/behavior/run-scenario.sh
    _i=0
    run_one() {
      case "$2" in
        gate)   return ${gateRc} ;;
        noline) return ${nolineRc} ;;
      esac
      _i=$((_i + 1)); set -- ${nogateRcs.join(' ') || '0'}; return \${!_i}
    }
    ALL_SET="stub"; FAST_SET="stub"
    main stub ${positive ? '--positive' : ''} ${negative ? '--negative=' + nogateRcs.length : ''} 2>&1 | tail -20
  `;
  return execFileSync('bash', ['-c', script], { encoding: 'utf8' });
}

test('a partial ablation separation reads as SUPPORTED, not as nothing', () => {
  const out = sweep({ negative: true, nogateRcs: [0, 1, 0] });
  assert.match(out, /SUPPORTED, NOT DEMONSTRATED/);
  assert.match(out, /absent in 2 of/);
  assert.match(out, /--positive/, 'and it must point at the test that can settle it');
  assert.doesNotMatch(out, /NOT DISCRIMINATING/);
});

test('behaviour surviving every ablated run reads as NOT DISCRIMINATING', () => {
  const out = sweep({ negative: true, nogateRcs: [1, 1, 1] });
  assert.match(out, /NOT DISCRIMINATING/);
  assert.match(out, /measures the model, not the gate/);
});

test('a positive control credits a rule that fails without it and passes with it', () => {
  const out = sweep({ positive: true, nolineRc: 0, gateRc: 0 });
  assert.match(out, /positive control OK/);
  assert.match(out, /── 1 scenario\(s\) genuinely verified/);
});

test('a case that passes without the rule cannot credit the rule', () => {
  // nolineRc 1 = the assertion still held with the rule removed.
  const out = sweep({ positive: true, nolineRc: 1, gateRc: 0 });
  assert.match(out, /── 0 scenario\(s\) genuinely verified/);
  assert.doesNotMatch(out, /positive control OK/);
});

test('a real run is not reclassified by the docs it read', () => {
  // The regression, verbatim from a 24KB `resume-from-ledger` transcript: the
  // session read run-state/SKILL.md, which documents that runs get "killed
  // mid-phase by spend limits". The rendered transcript carries file contents,
  // so the notice grep matched a line the model had merely *read* — and the one
  // scenario whose own gate file contains that phrase became unrunnable, three
  // retries deep, while the next scenario in the same sweep passed.
  const healthy = [
    'I\'ll start by reading the plan file.',
    '[tool 1: Read] plans/greet/plan.md',
    '[result 1: ok] # Plan: greeting module',
    '[tool 2: Read] .claude/skills/software/run-state/SKILL.md',
    '[result 2: ok] Progress that lives in TodoWrite dies with the session: >=11 runs',
    '  across two users were killed mid-phase by spend limits / session loss / 529s.',
    '[tool 3: Bash] git log --oneline',
    '[result 3: ok] a1b2c3d phase 1',
  ].join('\n').padEnd(2000, '.');
  const { isInfra, reason } = infraReason(healthy);
  assert.ok(!isInfra, `a 3-tool run must produce a verdict, not an ERROR (got: ${reason})`);
});

test('a run killed mid-flight by the limit is still an ERROR, not a FAIL', () => {
  // The other direction: tool calls DID happen, then the session died on the
  // notice. That is not a verdict about the gate either, so the tool-call escape
  // hatch must not swallow it — the notice is where the transcript stops.
  const killed = [
    '[tool 1: Read] plans/greet/plan.md',
    '[result 1: ok] # Plan',
    '[tool 2: Bash] npm test',
  ].join('\n').padEnd(1200, '.') + "\nYou've hit your org's monthly spend limit. Visit /usage-credits.";
  const { isInfra, reason } = infraReason(killed);
  assert.ok(isInfra, 'a run that stops on the notice never finished');
  assert.match(reason, /spend\/usage limit/);
});

test('a Read is never "failed" because the file it returned contains FAIL', () => {
  // The bug: outcomeOf sniffed FAIL_MARKERS in the returned TEXT even when the
  // tool reported success, so a successful Read of cook/SKILL.md rendered as
  // `fail:FAIL` — the skill documents `gate <name> → PASS|FAIL`. It sent a live
  // investigation hunting a read error that never happened. Same mistake as the
  // ERROR class one level up: judging a tool by the data it handed back.
  const steps = stepsOf([
    asst(use('r', 'Read', { file_path: '.claude/skills/software/cook/SKILL.md' })),
    res('r', 'append `phase 0: gate verify-plan → PASS|FAIL` to STATE.md'),
  ]);
  assert.strictEqual(outcomeOf(steps[0].result), 'ok');
});

test('a Bash step is still judged by its output, which is the whole red signal', () => {
  // The content check must survive for Bash: a suite that prints AssertionError
  // while exiting 0 is a failing suite, and only the text says so.
  const steps = stepsOf([
    asst(use('b', 'Bash', { command: 'node test-math.js' })),
    res('b', 'AssertionError: Expected 4 but got 5'),
  ]);
  assert.match(outcomeOf(steps[0].result), /^fail:AssertionError/);
  const v = tddOrder(stepsOf([
    asst(use('w', 'Write', { file_path: 'test-math.js' })), res('w', 'ok'),
    asst(use('b', 'Bash', { command: 'node test-math.js' })), res('b', 'AssertionError'),
    asst(use('e', 'Edit', { file_path: 'src/math.js' })), res('e', 'ok'),
  ]), PROD);
  assert.ok(v.ok, `red-before-green must still be detectable: ${v.why}`);
});

test('a step keeps the untruncated command, because 160 chars is a display cap', () => {
  // `closing-gate` looked for `cli.js` in a Bash target and missed it twice: the
  // run chained `cd … && echo "== AC1 ==" && node -e …` first, pushing the
  // reference past the cap. Both times the run had done the work and the checker
  // reported it had not — a false FAIL is as costly as a false PASS, and harder
  // to notice because it looks like a finding.
  const long = 'cd /tmp/x && ' + 'echo padding; '.repeat(20) + 'node cli.js abc';
  const s = stepsOf([asst(use('a', 'Bash', { command: long }))])[0];
  assert.strictEqual(s.target.length, 160, 'target stays capped for one-line display');
  assert.ok(!/cli\.js/.test(s.target), 'and the cap is what hid the reference');
  assert.match(s.raw, /node cli\.js abc$/, 'raw carries the whole command');
  assert.strictEqual(s.raw.length, long.length);
});

test('a Bash step that prints a file is a read, not a failing run', () => {
  // The Read fix left this half open: `cat .claude/skills/software/cook/SKILL.md`
  // is a Bash step, so content-sniffing still applied and the skill's own
  // `gate <name> → PASS|FAIL` line rendered it `fail:FAIL`. Reading a file is a
  // read whichever tool does it.
  const cat = stepsOf([
    asst(use('a', 'Bash', { command: 'cat .claude/skills/software/cook/SKILL.md' })),
    res('a', 'append `phase 0: gate verify-plan → PASS|FAIL`'),
  ]);
  assert.strictEqual(outcomeOf(cat[0].result), 'ok');

  // ...and a real run is still judged by what it printed.
  const run = stepsOf([
    asst(use('b', 'Bash', { command: 'npm test' })), res('b', 'FAILED 2 of 9'),
  ]);
  assert.match(outcomeOf(run[0].result), /^fail:/);
});

test('a run with no tool calls is an ERROR, not a verdict about the gate', () => {
  // A `--model haiku` probe returned FAIL on a run that never received the
  // prompt: the stream carried a rate_limit_event, `MAX_UPLOAD_MB` appeared 0
  // times in 15KB of events, and the model answered "What would you like me to
  // work on?". The notice lived in a structured event, so every text heuristic
  // missed it. Every scenario needs the model to act — even a gate that halts
  // correctly reads files first — so zero tool calls means the run never engaged.
  const idle = [
    asst({ type: 'text', text: "I'm ready to help! What would you like me to work on?" }),
  ];
  assert.strictEqual(stepsOf(idle).length, 0, 'no tool calls is the signal the runner keys on');

  const engaged = stepsOf([
    asst(use('a', 'Read', { file_path: 'src/app.js' })), res('a', 'source'),
  ]);
  assert.strictEqual(engaged.length, 1, 'a run that acted must still receive a verdict');
});
