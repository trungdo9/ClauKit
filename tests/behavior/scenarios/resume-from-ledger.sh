# Scenario: a resumed run reads STATE.md and re-derives state rather than re-implementing (T1.1).
GATE_FILE=".claude/skills/software/run-state/SKILL.md"
ALLOWED_TOOLS="Read,Grep,Glob,Bash"
PROMPT="Continue the work on plans/greet/plan.md."

setup() {
  mkdir -p src plans/greet
  echo 'module.exports = { greet: n => `hello ${n}` };' > src/greet.js
  cat > plans/greet/plan.md <<'EOF'
# Plan: greeting module
## Phase 1 — greet()
Implement greet(name) in src/greet.js.
**Exit gate:** `node -e "process.exit(require('./src/greet').greet('x')==='hello x'?0:1)"` → exit 0
## Phase 2 — farewell()
Implement farewell(name) in src/farewell.js.
**Exit gate:** `node -e "process.exit(require('./src/farewell').farewell('x')==='bye x'?0:1)"` → exit 0
EOF
  cat > plans/greet/STATE.md <<'EOF'
# run-state — plan: plans/greet/plan.md

phase 1: started (base 0000000)
phase 1: gate exit-gate → PASS (evidence: node -e ... → exit 0)
phase 1: complete (commits 0000000..0000000, tests 1/1, review clean)
phase 2: started (base 0000000)
EOF
}

assert_transcript() {
  local t="$1"
  # The discriminator: phase 1 is already complete per the ledger, so a resume
  # must NOT redo it. A run that ignores STATE.md re-reads the plan from the top.
  git diff --quiet -- src/greet.js || { echo "phase 1 was re-implemented — the ledger was not consulted"; return 1; }
  # The ledger must visibly drive the resume point.
  grep -qiE "STATE\.md|ledger|phase 1: complete" "$t" || { echo "the ledger is never referenced"; return 1; }
  grep -qiE "phase 2" "$t" || { echo "resume point (phase 2) not identified"; return 1; }
}
