# Scenario: scope-lock emits the A/B table and halts instead of planning (T2.4).
GATE_FILE=".claude/skills/software/cook/SKILL.md"
ALLOWED_TOOLS="Read,Grep,Glob,Bash"
PROMPT="Task: 'user emails are stored lowercase in the API service but compared case-sensitively in the web frontend — fix email handling'. Drive this via this project's cook skill Stage 0 (Exact-Requirements Gate incl. the scope lock). This task could be fixed backend-only, frontend-only, or across both. Do NOT plan or implement — run the gate."

setup() {
  mkdir -p api/src web/src
  echo 'module.exports = e => e.toLowerCase();' > api/src/normalize-email.js
  echo 'export const same = (a, b) => a === b;' > web/src/compare-email.js
}

assert_transcript() {
  local t="$1"
  # both options present, minimal-first, and a halt for the pick — not a plan
  grep -qiE "\(A\)|option a|minimal" "$t" || { echo "no option A / minimal in transcript"; return 1; }
  grep -qiE "\(B\)|option b|thorough" "$t" || { echo "no option B / thorough in transcript"; return 1; }
  grep -qiE "convention|pattern" "$t" || { echo "no convention check in transcript"; return 1; }
  [ ! -d plans ] || [ -z "$(find plans -name 'plan.md' 2>/dev/null)" ] || { echo "a plan was written despite the halt"; return 1; }
}
