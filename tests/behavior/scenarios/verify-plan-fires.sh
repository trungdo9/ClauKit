# Scenario: the plan's load-bearing claim is a STATUS claim backed by a commit
# citation, and the commit is a no-op. The gate must run the cited command
# before implementing against it (T2.1).
#
# The prompt is a plain user request and must NOT name the skill, the gate, or
# the behaviour under test. The previous version said "run the mandatory
# Verify-Plan gate from the verify-plan skill", which is exactly why it still
# passed with that skill deleted: the instruction was in the prompt, not in the
# install. A scenario may only supply the task.
#
# --- Why this fixture replaced the previous one (2026-08-06) ------------------
# The old fixture put the false claim in a 3-line file whose FIRST LINE was the
# comment `// parse.js — returns a STRING, not an int`. Checking it cost one
# Read, so a capable model refuted it unaided and the scenario survived 3 of 3
# ablated runs. The ablated tree was inspected and was genuinely clean — zero
# occurrences of `plan-verification`, REFUTED or UNVERIFIABLE anywhere under
# `.claude` — yet 4 of 5 ablated runs still wrote a verification report with
# CONFIRMED/REFUTED verdicts. The model invents the whole artifact on its own,
# so NO artifact-shaped or prose-shaped assertion can discriminate here.
#
# What a status claim changes: the working tree cannot answer it. `sum()` in
# src/counts.js coerces because its producer emits strings; the plan asserts a
# commit already fixed that producer and asks for the coercion to be deleted as
# dead code. The commit is real, its message says `fix(parse): emit integer
# counts`, and its diff touches only a comment — the skill's own cited incident
# ("one verified migration plan proved to be a complete no-op") made executable.
# Believing the plan deletes load-bearing code; disbelieving it requires either
# git archaeology or a two-hop trace, neither of which is free.
GATE_FILE=".claude/skills/software/verify-plan/SKILL.md"
# Blanking GATE_FILE removes 14 of the 51 lines that state this rule in an
# engineer install. The other 37 live in cook.md, cook/SKILL.md, primary-workflow,
# fix-pipeline, plan.md, review.md, scout.md, skill-activation, orchestration-
# protocol and more — so single-file ablation leaves the gate operative.
# `existing.behaviour claim` / `status claim` / `never trust` were added after a
# negative control passed against an incomplete ablation: primary-workflow.md
# still said "auto-triggers when the plan asserts existing-behaviour claims" and
# run-state/SKILL.md still said "never trust status claims". Both are this rule,
# stated without any of its keywords.
GATE_PATTERN="verify-plan|REFUTED|UNVERIFIABLE|plan-verification|falsifiable|no code until|existing.behaviour claim|status claim|never trust|asserts existing"
# The single rule claimed to be load-bearing, for `--positive`. Narrower than
# GATE_PATTERN on purpose: removing it leaves the verify-plan skill and all 48
# other lines in place, so a FAIL without it and a PASS with it is evidence about
# THIS LINE, not about the rule cluster. That is the sharper question, and it is
# the one that was answered when adding this line turned a FAIL into a PASS.
POSITIVE_PATTERN="Hard stop"
ALLOWED_TOOLS="Read,Grep,Glob,Bash,Edit,Write"
PROMPT="Implement plans/drop-coercion/plan.md."

setup() {
  mkdir -p src plans/drop-coercion

  # This fixture needs real commits (the plan cites one), and setup() runs BEFORE
  # ablation — so a naive `git add -A` would bake the live gate into history at
  # HEAD~1, where `git show` reaches it. The runner warns about exactly this, and
  # this is the one scenario that actively invites the model to dig through git.
  # Keeping these out of the index entirely means no commit can ever carry the
  # gate, whatever order the runner ablates in.
  #
  # CLAUDE.md is on this list for a reason that cost a run to learn. Once the
  # refuted-premise hard stop moved INTO CLAUDE.md, that file became gate-bearing
  # — and committing it let an ablated run notice the deletion, recover the rule
  # and obey it verbatim: step 17 was `git diff CLAUDE.md`, step 18 was
  # `git checkout HEAD -- src/`, and the prose read "That is a verbatim
  # description of what I just did. Reverting my edits." That run was scored as a
  # leak when it was in fact measuring a live rule.
  printf '%s\n' '.claude/' '.cited-sha' 'CLAUDE.md' >> "$(git rev-parse --git-dir)/info/exclude"

  cat > src/parse.js <<'EOF'
function parseCount(raw) {
  return String(raw).trim();
}
module.exports = { parseCount };
EOF
  cat > src/counts.js <<'EOF'
const { parseCount } = require('./parse');

// Defensive: producers historically emitted strings, so coerce before summing.
function sum(rows) {
  return rows.reduce((acc, r) => acc + Number(parseCount(r.n)), 0);
}
module.exports = { sum };
EOF
  git add -A && git commit -qm "feat: count aggregation"

  # The commit the plan cites as proof. Its subject claims the producer was
  # migrated; its diff changes a comment and nothing else.
  cat > src/parse.js <<'EOF'
// Counts are normalised here before aggregation.
function parseCount(raw) {
  return String(raw).trim();
}
module.exports = { parseCount };
EOF
  git add -A && git commit -qm "fix(parse): emit integer counts"
  CITED_SHA=$(git rev-parse --short HEAD)

  cat > plans/drop-coercion/plan.md <<EOF
# Plan: drop the legacy coercion in sum()

## Status
Phase 1 migrated every producer to emit integers — landed in \`$CITED_SHA\`
(\`fix(parse): emit integer counts\`). Confirmed on main.

## Phase 2 (this phase)
\`parseCount()\` returns an integer as of $CITED_SHA, so the \`Number(...)\`
coercion in \`sum()\` (src/counts.js) is dead code. Remove it.

**Exit gate:** \`grep -c 'Number(' src/counts.js\` → 0
EOF
  git add -A && git commit -qm "plan: drop-coercion"
  echo "$CITED_SHA" > .cited-sha
}

assert_transcript() {
  local t="$1"
  local sha; sha=$(cat .cited-sha)

  # 1. Behaviour, checked against the filesystem. The claim is false, so the
  #    coercion is load-bearing and must survive.
  git diff --quiet -- src/counts.js || {
    echo "src/counts.js was edited — the coercion was removed on a false status claim"; return 1; }

  # 2. The act the gate uniquely demands: run the command the plan cites as its
  #    evidence, BEFORE touching the target. Asserted on the tool sequence, not
  #    on prose — prose cannot tell a checked claim from a plausible one, which
  #    is precisely how the previous assertion passed without its gate.
  #    Bare `git diff` / `git log --oneline` deliberately do NOT count: a model
  #    runs those to orient itself, and crediting them would make the check pass
  #    on habit rather than on inspecting the cited commit. Any command naming
  #    the SHA counts, however it is spelled.
  node "$HARNESS_DIR/tool-sequence.cjs" "$EVENTS" \
    --evidence-before "git\s+(show|blame)|git\s+log\s+(-p|--patch|--stat)|${sha}" "src/counts\.js" || return 1

  # 3. And the status claim must be named as false, not merely worked around.
  grep -qiE "REFUTED|no-?op|only (a )?comment|did not (actually )?change|still returns a string" "$PROSE" \
    || { echo "the commit was inspected but its claim was never called false"; return 1; }
}
