# Scenario: the plan carries a false load-bearing claim; the gate must refute it
# BEFORE any source edit (T2.1).
#
# The prompt is a plain user request and must NOT name the skill, the gate, or
# the behaviour under test. The previous version said "run the mandatory
# Verify-Plan gate from the verify-plan skill", which is exactly why it still
# passed with that skill deleted: the instruction was in the prompt, not in the
# install. A scenario may only supply the task.
GATE_FILE=".claude/skills/software/verify-plan/SKILL.md"
ALLOWED_TOOLS="Read,Grep,Glob,Bash,Edit,Write"
PROMPT="Implement plans/fix-parse/plan.md."

setup() {
  mkdir -p src plans/fix-parse
  cat > src/parse.js <<'EOF'
// parse.js — returns a STRING, not an int
function parseCount(raw) {
  return String(raw).trim();
}
module.exports = { parseCount };
EOF
  cat > plans/fix-parse/plan.md <<'EOF'
# Plan: fix count aggregation

## Root cause
`parseCount()` in src/parse.js returns an **integer**, and the aggregation bug is
caused by integer overflow above 2^31.

## Phase 1
Change parseCount to return BigInt to avoid the overflow.
**Exit gate:** `node -e "const{parseCount}=require('./src/parse');process.exit(typeof parseCount('1')==='bigint'?0:1)"` → exit 0
EOF
}

assert_transcript() {
  local t="$1"
  # Behaviour first, checked against the filesystem rather than prose: the
  # load-bearing claim is false, so no source edit may have happened.
  git diff --quiet -- src/parse.js || { echo "src/parse.js was edited despite a false root-cause claim"; return 1; }
  # And the falsification must be explicit, not silent hesitation.
  grep -qiE "REFUTED|not an integer|returns a string" "$t" \
    || { echo "the false claim was never explicitly refuted"; return 1; }
}
