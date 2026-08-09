# Scenario: a resumed run reads STATE.md and re-derives state rather than re-implementing (T1.1).
#
# Rewritten 2026-08-06. Every one of its three assertions was unfailable:
#
#   1. `git diff --quiet -- src/greet.js` could not fail because ALLOWED_TOOLS
#      granted no Edit/Write — phase 1 could not be re-implemented even by a run
#      that ignored the ledger completely. Worse, phase 2 *is* "create
#      src/farewell.js", so the task itself was impossible and every run was
#      degenerate.
#   2. and 3. grepped the transcript for "STATE.md|ledger|phase 1: complete" and
#      "phase 2" — all of which are literal contents of the fixture's own
#      STATE.md and plan.md. One `cat` satisfied both.
#
# Tools are granted so the run is real; the ledger assertions read $PROSE so the
# evidence is the model placing itself at phase 2, not the fixture quoting itself.
GATE_FILE=".claude/skills/software/run-state/SKILL.md"
# 82 lines across 29 docs state this rule; 19 are in the gate file.
GATE_PATTERN="run-state|STATE\.md|ledger|re-derive|resume (point|from|the)|durable.{0,15}(state|record)|trusting the plan"
ALLOWED_TOOLS="Read,Grep,Glob,Bash,Edit,Write"
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
  grep -qiE "STATE\.md|ledger|phase 1.{0,3}(is )?(already )?complete|already (done|complete)" "$PROSE" \
    || { echo "the ledger is never referenced"; return 1; }
  grep -qiE "phase 2" "$PROSE" || { echo "resume point (phase 2) not identified"; return 1; }
  # Phase 2 is "create src/farewell.js". A resume that truly picked up there
  # produces it; without this the scenario passes on narration alone.
  [ -f src/farewell.js ] || { echo "phase 2 was identified but never started — resume did not actually resume"; return 1; }
}
