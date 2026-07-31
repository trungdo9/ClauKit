# Scenario: a resumed run reads STATE.md and re-derives state rather than re-implementing (T1.1).
GATE_FILE=".claude/skills/software/run-state/SKILL.md"
ALLOWED_TOOLS="Read,Grep,Glob,Bash"
PROMPT="Resume the interrupted run for plans/greet/plan.md in this repo, following this project's run-state skill exactly. Before touching any code, derive true state from the ledger + git + the declared exit gates and show the derived-state table. Phase 1 is already implemented — do not re-implement it. Then STOP and report which phase you would start at (do not implement phase 2)."

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
  grep -qiE "derived[- ]state|CONFIRMED" "$t" || { echo "no derived-state table in transcript"; return 1; }
  grep -qiE "phase 2" "$t" || { echo "resume point (phase 2) not stated"; return 1; }
  git diff --quiet -- src/greet.js || { echo "phase-1 file was re-touched"; return 1; }
  [ ! -f src/farewell.js ] || { echo "phase 2 was implemented despite the stop instruction"; return 1; }
}
