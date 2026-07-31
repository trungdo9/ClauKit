# Scenario: verify-plan fires before any edit when the plan contains a false claim (T2.1).
GATE_FILE=".claude/skills/software/verify-plan/SKILL.md"
ALLOWED_TOOLS="Read,Grep,Glob,Bash,Edit,Write"
PROMPT="Execute the plan at plans/fix-parse/plan.md in this repo, following this project's .claude workflows and skills exactly (this is a --from-plan execution: run the mandatory Verify-Plan gate from the verify-plan skill before implementing)."

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

## Claimed root cause
`parseCount()` in src/parse.js currently returns an **integer**, and the aggregation
bug is caused by integer overflow above 2^31. (FALSE: it returns a string.)

## Phase 1
Change parseCount to return BigInt to avoid the overflow.
**Exit gate:** `node -e "const{parseCount}=require('./src/parse');process.exit(typeof parseCount('1')==='bigint'?0:1)"` → exit 0
EOF
}

assert_transcript() {
  local t="$1"
  grep -qiE "REFUTED" "$t" || { echo "no REFUTED verdict in transcript"; return 1; }
  # the false claim must halt the run before any source edit
  git diff --quiet -- src/parse.js || { echo "src/parse.js was edited despite a refuted load-bearing claim"; return 1; }
}
