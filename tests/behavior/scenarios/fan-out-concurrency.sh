# Scenario: a plan whose factual claims span several subsystems gets its
# Verify-Plan gate run as ONE batch of read-only agents, not as a queue.
#
# What makes this assertable at all: concurrency is not a property of what was
# done but of when it was asked for. N dispatches sent together and the same N
# sent one-at-a-time produce identical tools, identical targets and an identical
# final state, so the only record of the difference is in the request — the
# message boundary, or the `run_in_background` field. tool-sequence.cjs therefore
# carries `turn` and the raw input per step and answers `--fan-out`, both
# unit-tested in tests/behavior-harness.test.js, so this scenario rests on an
# invariant `npm test` already covers rather than on a grep over prose that a
# fixture could satisfy by itself.
#
# The rule under test is /ck:cook § Verify-Plan: at >=4 claims spanning >=2
# subsystems, verify the claim groups concurrently. The fixture sits well past
# that threshold — five falsifiable claims over three subsystems, two false.
#
# HISTORY, because it is the whole reason this scenario earns its runtime: the
# first two runs FAILED, and not for the reason the assertion was written to
# catch. Both grouped the claims correctly and then sent every dispatch with
# `run_in_background: false`, which blocks the orchestrator on the agent it just
# sent. Making the instruction more imperative changed nothing (run 2 was
# identical to run 1). Naming the field did: run 3 left all dispatches in the
# background and PASSED. A rule can be obeyed to the letter and still not
# happen, when the letter describes the intent instead of the mechanism.
GATE_FILE=".claude/commands/ck/cook.md"
# Every line that states the rule, or hints that batching is a thing, has to go:
# an ablation that leaves "Cap concurrency at ~4" standing has told the model to
# fan out while pretending it didn't.
GATE_PATTERN="fan.?out|in one message|sent concurrently|claim group|Cap concurrency|concurrently|run_in_background"
# The one rule under test, for --positive. It is NOT the "fan out by claim group"
# heading: two runs obeyed that heading and still queued. What changed the
# behaviour was naming the field that blocks, so the line worth crediting is the
# one that mentions it — and removing that line is the cut that should flip the
# case back to a queue.
POSITIVE_PATTERN="run_in_background"
# Dispatch is what this stage IS, so the tool has to be granted. It is `Agent` on
# the CLI in use and `Task` on older ones; both are listed because a scenario that
# names only the retired one grants nothing and measures nothing.
ALLOWED_TOOLS="Read,Grep,Glob,Bash,Edit,Write,Agent,Task"
# A plan path selects the --from-plan pipeline, which makes Verify-Plan mandatory.
# The prompt says nothing about how to run it — naming a pipeline is allowed, and
# dictating the gate's behaviour ("verify the claims in parallel") is the sin.
PROMPT="/ck:cook plans/260813-0900-retry-budget/plan.md"

setup() {
  mkdir -p src/parse src/registry src/queue plans/260813-0900-retry-budget

  # Subsystem 1 — parser. The claim about it is FALSE: this returns a string.
  cat > src/parse/amount.js <<'EOF'
// amount.js — parses the wire format into a display value
function parseAmount(raw) {
  const cents = Number(String(raw).replace(/[^0-9]/g, ''));
  return (cents / 100).toFixed(2);   // a string, deliberately
}
module.exports = { parseAmount };
EOF

  # Subsystem 2 — registry. The claim about it is TRUE: last writer wins.
  cat > src/registry/providers.js <<'EOF'
const providers = new Map();
function register(name, impl) { providers.set(name, impl); }
function get(name) { return providers.get(name); }
module.exports = { register, get };
EOF

  # Subsystem 3 — queue. One claim TRUE (stderr), one FALSE (retries once, not 3x).
  cat > src/queue/worker.js <<'EOF'
const MAX_ATTEMPTS = 1;

async function runJob(job) {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try { return await job(); }
    catch (err) {
      process.stderr.write(`job failed on attempt ${attempt}: ${err.message}\n`);
      if (attempt === MAX_ATTEMPTS) throw err;
    }
  }
}
module.exports = { runJob, MAX_ATTEMPTS };
EOF

  cat > test-queue.js <<'EOF'
const { test } = require('node:test');
const assert = require('node:assert');
const { MAX_ATTEMPTS } = require('./src/queue/worker');

test('worker exposes its attempt budget', () => {
  assert.ok(MAX_ATTEMPTS >= 1);
});
EOF

  cat > package.json <<'EOF'
{ "name": "fixture", "version": "1.0.0", "scripts": { "test": "node --test" } }
EOF

  # The plan. Five claims about EXISTING behaviour, across three subsystems —
  # past the >=4 claims / >=2 subsystems threshold the rule names. Two are false,
  # so verifying them is load-bearing rather than ceremonial.
  cat > plans/260813-0900-retry-budget/plan.md <<'EOF'
# Plan — raise the queue retry budget to 3

## Goal
Failed jobs should be retried up to 3 times instead of the current budget.

## Acceptance criteria
- `MAX_ATTEMPTS` is 3 and `npm test` passes.

## Claims about current behaviour
1. `src/queue/worker.js` already retries a failed job 3 times; only the constant
   name is wrong.
2. `src/queue/worker.js` writes a line to stderr on every failed attempt.
3. `src/parse/amount.js` `parseAmount()` returns a Number, so callers can do
   arithmetic on it directly.
4. `src/registry/providers.js` `register()` throws when a name is registered
   twice, which is why the queue never double-registers a handler.
5. The test suite is green on the untouched tree.

## Scope boundary
Queue only. No parser change, no registry change.

## Phase 1 — widen the budget
Set the attempt budget to 3 in `src/queue/worker.js`. Exit gate: `npm test`.
EOF

  git add -A && git commit -qm "feat: queue, parser, registry + retry plan"
}

assert_transcript() {
  local t="$1"

  # ---- 1. the gate ran and left the artefact the next stage reads ----
  local table
  table=$(find plans -path '*/reports/*' -name 'plan-verification*.md' -type f 2>/dev/null | head -1)
  [ -n "$table" ] || {
    echo "no plan-verification table under plans/<plan>/reports/ — the gate did not run"; return 1; }

  # A table that confirms everything has not verified anything: two of the five
  # claims are false in the fixture, and both are false in code the run can read.
  grep -qiE "refut|false|incorrect|not true|wrong" "$table" || {
    echo "the verification table refutes nothing, but two fixture claims are false"; return 1; }

  # ---- 2. and it was concurrent, not a queue ----
  # `--fan-out` accepts either route the tool offers — several dispatches in one
  # message, or dispatches left in the background — and rejects the shape the
  # first two runs produced: one per message with run_in_background:false, which
  # blocks the orchestrator on each agent in turn. Asserting only the
  # message-boundary route would have failed a genuinely concurrent background
  # run, and asserting neither would have passed a queue.
  node "$HARNESS_DIR/tool-sequence.cjs" "$EVENTS" --fan-out 2 || {
    echo "dispatches were serial — the stage delegated but never fanned out"; return 1; }

  # ---- 3. the batch was read-only agents ----
  # A same-turn batch of implementers would satisfy check 2 while breaking the
  # rule it comes from ("never two implementers on one tree").
  node "$HARNESS_DIR/tool-sequence.cjs" "$EVENTS" \
    | grep -E "^[0-9]+	(Agent|Task)	" \
    | grep -qiE "debugger|researcher|scout|code-reviewer" || {
    echo "the batch names no read-only agent — check what personas were dispatched"; return 1; }
}
