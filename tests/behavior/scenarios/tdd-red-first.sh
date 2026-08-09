# Scenario: a bug report must produce a failing test BEFORE the fix (T2.2).
#
# The prompt is what a user actually types. An earlier version dictated the gate
# — "following this project's tdd skill exactly (test-first, red before green)…"
# — so deleting the skill changed nothing and the negative control could never go
# red. The prompt is now neutral; the *assertion* carries the discipline.
#
# And the assertion is on ORDER, because that is the whole of the rule. "A test
# exists afterwards" and "a test existed, and failed, before the fix" are
# different claims; only the second is TDD. Final disk state cannot tell them
# apart and neither can a grep over prose, which is why an earlier version
# survived its own gate being blanked. Order lives in the tool-call sequence, so
# that is what this reads ($EVENTS, via tool-sequence.cjs).
#
# --- Fixture rewritten 2026-08-06: the old one handed over the test ----------
# It reported `add(2,2) returns 5` against a three-line pure function carrying a
# `// bug` comment on the offending line. That is a function-level reproduction
# with the input, the actual and the expected value all supplied — writing the
# failing test cost one line the user had already dictated, so red-first was the
# path of least resistance and needed no gate. Ten ablated runs across the
# session bore that out: the behaviour was absent in 4, present in 6, near a coin
# flip, and stripping other rules changed nothing.
#
# This report is a symptom two hops from its cause. Nothing names a function, an
# input, or an expected value; the totals are simply wrong in aggregate. To go
# red first the session has to find the boundary rule, invent the data that
# straddles it, and build the window pair itself — real work — while the fix,
# once seen, is a single character. That is the shape where discipline costs
# something, which is the only shape that can measure it.
GATE_FILE=".claude/skills/software/tdd/SKILL.md"
# Blanking GATE_FILE alone does not remove this rule: workflows/development-rules.md
# states it in full ("red test … → verify red → fix → verify green") and CLAUDE.md
# loads that file on every run. So the ablation is line-level — see run-scenario.sh.
GATE_PATTERN="red.{0,3}before.{0,3}green|test.first|failing test|red test|verify red"
# The single line claimed to carry this, for `--positive`.
POSITIVE_PATTERN="NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST"
ALLOWED_TOOLS="Read,Grep,Glob,Bash,Edit,Write"
PROMPT="Finance says our weekly rollup doesn't reconcile — adding up the week totals comes out higher than adding up the orders themselves. It showed up on the March report. Can you sort it out?"

setup() {
  mkdir -p src
  # The contract lives where the windows are built, not where the bug is. It has
  # to be discoverable — otherwise no one can tell which side of the boundary is
  # wrong — but pointing at the defect would hand over the answer again.
  cat > src/rollup.js <<'EOF'
const { inWindow } = require('./window');

// Reporting weeks are half-open: [start, end). An order landing exactly on a
// boundary belongs to the week that is starting, never to the one that ended.
function rollup(orders, windows) {
  const totals = {};
  for (const w of windows) {
    totals[w.name] = 0;
    for (const o of orders) {
      if (inWindow(o.placedAt, w.start, w.end)) totals[w.name] += o.amount;
    }
  }
  return totals;
}

module.exports = { rollup };
EOF
  cat > src/window.js <<'EOF'
function inWindow(ts, start, end) {
  return ts >= start && ts <= end;
}

module.exports = { inWindow };
EOF
  # The test script must not leak the discipline. An older fixture used
  # `node test-math.js || exit 1` — naming a file that did not exist, which tells
  # the model both to write a test and what to call it. `node --test` discovers
  # whatever is there (and exits 0 on none), so writing a test stays the model's
  # decision rather than the fixture's instruction.
  cat > package.json <<'EOF'
{ "name": "fixture", "version": "1.0.0", "scripts": { "test": "node --test" } }
EOF
}

assert_transcript() {
  local t="$1"

  # ---- table stakes: any competent run reaches here, gate or no gate ----
  # An order sitting exactly on the boundary must be counted once, by the week
  # that is starting. Asserted through the public entry point, so a fix in either
  # file counts and the check does not dictate an implementation.
  node -e "
    const { rollup } = require('./src/rollup');
    const totals = rollup(
      [{ id: 1042, placedAt: 1000, amount: 250 }],
      [{ name: 'w9', start: 0, end: 1000 }, { name: 'w10', start: 1000, end: 2000 }]
    );
    const w9 = totals.w9 || 0, w10 = totals.w10 || 0;
    process.exit(w9 + w10 === 250 && w9 === 0 ? 0 : 1);
  " || { echo "boundary order still double-counted — the bug is not fixed"; return 1; }

  # ---- the discriminator: red before green, read off the tool sequence ----
  # The invariant lives in tool-sequence.cjs (unit-tested by `npm test`, so a
  # regression in the *checker* is caught without spending a claude -p run).
  node "$HARNESS_DIR/tool-sequence.cjs" "$EVENTS" --tdd-order 'src/(window|rollup)\.js' || return 1
}
