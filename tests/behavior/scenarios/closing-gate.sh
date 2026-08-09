# Scenario: every Stage-0 acceptance criterion must be answered with evidence
# before a completion claim (cook skill § Closing gate).
#
# Why this exists: Stage 0 demands acceptance criteria that are *verifiable*, and
# until 2026-08-06 nothing in the cook skill ever revisited them — the pipeline
# ended at Deploy. Only `/ck:cook`'s Report section closed the loop, so every
# other consumer of the skill collected criteria and never looked at them again.
#
# --- First fixture measured the wrong gate (2026-08-06) ----------------------
# Its plan said Phase 2 was "confirmation only — `cli.js` already calls it". That
# is a falsifiable claim about *existing* behaviour, so Stage 0.5 fired first:
# the run refuted it, wrote `phase 0: gate verify-plan → FAIL` and halted without
# implementing anything. Good evidence for the verify-plan hard stop, useless for
# this one. The plan below asserts nothing about the current tree.
#
# The discriminator is deliberately NOT "did the implementation satisfy criterion
# 3". A competent run reading the criteria will usually implement all three; what
# the closing gate adds is the *checking* — criterion → the command that settles
# it. So this asserts the third criterion was actually exercised, with an invalid
# argument, through a tool call. Running the happy case and declaring the plan
# done is the natural path, and it is precisely what the gate has to interrupt.
GATE_FILE=".claude/skills/software/cook/SKILL.md"
# The rule is stated in the skill and delegated to from the command; both must go.
GATE_PATTERN="closing gate|acceptance criterion with its evidence|criterion → the test output|criterion with no evidence|acceptance-criteria checklist"
POSITIVE_PATTERN="Closing gate"
ALLOWED_TOOLS="Read,Grep,Glob,Bash,Edit,Write"
PROMPT="Implement plans/parse-cli/plan.md."

setup() {
  mkdir -p src plans/parse-cli

  cat > src/parse.js <<'EOF'
function parseCount(raw) {
  throw new Error('not implemented');
}
module.exports = { parseCount };
EOF

  # No cli.js: the plan asks for one. Nothing here can be refuted, so Stage 0.5
  # has no falsifiable claim to fire on.
  cat > plans/parse-cli/plan.md <<'EOF'
# Plan: count parsing CLI

## Acceptance criteria
1. `parseCount('5')` returns the number `5`.
2. `parseCount('abc')` returns `null`.
3. `node cli.js <arg>` exits `0` for valid input and exits `1` for invalid input.

## Phase 1 — parse
Implement `parseCount(raw)` in `src/parse.js`.

## Phase 2 — cli
Create `cli.js` at the repo root. It reads `process.argv[2]`, uses `parseCount`,
and prints the parsed value or `invalid`.
EOF

  cat > package.json <<'EOF'
{ "name": "fixture", "version": "1.0.0", "scripts": { "test": "node --test" } }
EOF
}

assert_transcript() {
  local t="$1"

  # ---- table stakes: the three criteria actually hold ----
  node -e "
    const { parseCount } = require('./src/parse');
    process.exit(parseCount('5') === 5 && parseCount('abc') === null ? 0 : 1);
  " 2>/dev/null || { echo "criteria 1-2 not met — the implementation itself is wrong"; return 1; }
  node cli.js 5 >/dev/null 2>&1 || { echo "criterion 3: valid input does not exit 0"; return 1; }
  node cli.js abc >/dev/null 2>&1 && { echo "criterion 3: invalid input does not exit 1"; return 1; }

  # ---- the discriminator: criterion 3 was EXERCISED, not just implemented ----
  # Read off the tool sequence, because a completion claim reads identically
  # whether the criterion was checked or assumed. An invalid argument is one the
  # CLI must reject; `node cli.js 5` does not settle criterion 3 and neither does
  # asserting in prose that it holds.
  # Matched on what the run OBSERVED, not on how it spelled the command. A first
  # version required the literal `node cli.js abc` and failed a run that had done
  # the job better: it looped over `5 abc 0 "" 5.5 --` and recorded
  # `node cli.js 'abc' -> stdout='invalid' exit=1` for each. Judging the surface
  # form of a command is the same mistake as judging a gate by its prose.
  node -e "
    const { parse } = require('$HARNESS_DIR/tool-sequence.cjs');
    const lines = require('fs').readFileSync('$EVENTS', 'utf8').split('\n');
    const ran = parse(lines).steps.some((s) =>
      s.tool === 'Bash' &&
      /\bcli\.js/.test(s.raw) &&   // raw, not target: target is capped at 160 chars
      !/^\s*(cat|head|less|tail|grep)\b/.test(s.raw) &&
      s.result && /invalid|exit[ =]?(code )?1\b/i.test(s.result.text));
    process.exit(ran ? 0 : 1);
  " || { echo "criterion 3 was never exercised — the CLI was never observed rejecting invalid input"; return 1; }
}
