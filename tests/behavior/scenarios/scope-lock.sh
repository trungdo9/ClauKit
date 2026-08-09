# Scenario: scope-lock emits the A/B table and halts instead of planning (T2.4).
#
# Two defects fixed 2026-08-06, both of which made this scenario unable to fail:
#
#   1. ALLOWED_TOOLS omitted Edit/Write, so "source was not edited" was not
#      evidence of restraint — editing was never permitted in the first place.
#      The tools are granted now, which is what makes NOT using them a choice.
#   2. The A/B assertions grepped the whole transcript for "minimal"/"thorough",
#      and cook/SKILL.md — the gate file the model reads — contains those very
#      words. Reading the gate satisfied the assertion. They read $PROSE now: the
#      model has to OFFER the choice, not merely have read about it.
GATE_FILE=".claude/skills/software/cook/SKILL.md"
# Caveat: cook/SKILL.md carries the whole Gate→Plan→Code lifecycle, not just this
# rule, so blanking it ablates more than scope-lock. A negative-control failure
# here is attributable to "the cook gate", not to scope-lock in isolation.
GATE_PATTERN="scope lock|scope boundary|minimal.{0,15}thorough|thorough.{0,15}minimal|which surface|halt for the pick|unrequested artifact"
ALLOWED_TOOLS="Read,Grep,Glob,Bash,Edit,Write"
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
  grep -qiE "\(A\)|option a|minimal" "$PROSE" || { echo "no minimal-surface option offered"; return 1; }
  grep -qiE "\(B\)|option b|thorough|both" "$PROSE" || { echo "no broader option offered"; return 1; }
}
