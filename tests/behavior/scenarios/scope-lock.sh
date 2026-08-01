# Scenario: scope-lock emits the A/B table and halts instead of planning (T2.4).
GATE_FILE=".claude/skills/software/cook/SKILL.md"
ALLOWED_TOOLS="Read,Grep,Glob,Bash"
PROMPT="User emails are stored lowercase in the API service but compared case-sensitively in the web frontend. Fix email handling."

setup() {
  mkdir -p api/src web/src
  echo 'module.exports = e => e.toLowerCase();' > api/src/normalize-email.js
  echo 'export const same = (a, b) => a === b;' > web/src/compare-email.js
}

assert_transcript() {
  local t="$1"
  # The discriminator is BEHAVIOUR: the task spans two layers, so the gate must
  # stop and ask which surface to change. A run without the gate just edits.
  git diff --quiet -- api/src/normalize-email.js web/src/compare-email.js \
    || { echo "source was edited without asking which surface to change"; return 1; }
  # And the halt must offer a real choice, minimal first.
  grep -qiE "\(A\)|option a|minimal" "$t" || { echo "no minimal-surface option offered"; return 1; }
  grep -qiE "\(B\)|option b|thorough|both" "$t" || { echo "no broader option offered"; return 1; }
}
