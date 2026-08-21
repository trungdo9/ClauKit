#!/bin/bash
# run-scenario.sh — behavioral eval harness runner (T5.4).
# Usage: run-scenario.sh <scenario> | --fast | --all [--negative]
# Each scenario: provision scratch repo → ck init → seed fixtures → claude -p → assert on transcript.
#
# Three outcomes, never conflated:
#   PASS   the gate fired and the assertion held
#   FAIL   the run happened and the assertion did NOT hold   ← the only real verdict about a gate
#   ERROR  the run never happened (spend limit, auth, timeout, empty transcript)
#
# The ERROR class exists because it bit us: a whole --all run reported 6× FAIL
# when every transcript was the same 101-byte "hit your org's monthly spend
# limit" notice. Read as FAIL, that verdict would have sent someone to fix five
# skills that were never exercised. "The agent produced nothing" is not evidence
# a gate is broken — the same rule orchestration-protocol.md applies in the
# other direction ("agent reported success" is not evidence either).
set -u

HARNESS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$HARNESS_DIR/../.." && pwd)"
SCENARIOS_DIR="$HARNESS_DIR/scenarios"
FAST_SET="guard-tier-b iron-law"
ALL_SET="verify-plan-fires tdd-red-first scope-lock resume-from-ledger iron-law guard-tier-b closing-gate deploy-waiver plan-before-code docs-usable fan-out-concurrency"

# Minimum plausible transcript. A real run of any scenario is far larger; the
# infrastructure notices we have seen are ~100 bytes.
MIN_TRANSCRIPT_BYTES=400

# Returns 0 when the transcript shows the run never really happened.
infra_failure_reason() {
  local t="$1"
  [ -s "$t" ] || { echo "empty transcript — claude produced no output"; return 0; }
  local bytes; bytes=$(wc -c <"$t")

  # A run is not reclassified by its own reading material. The rendered transcript
  # carries the contents of every file the session read, so any kit doc that
  # mentions a spend limit matches the notice patterns below —
  # `run-state/SKILL.md` says "killed mid-phase by spend limits", which made
  # `resume-from-ledger` permanently unrunnable: reading the very skill it tests
  # guaranteed a false ERROR. It burned three retries on a healthy 24KB run while
  # the next scenario in the same sweep passed, which is what gave it away.
  #
  # What matters is not where the phrase sits but whose words they are: text the
  # session READ arrives inside a `[result N: …]` block, text the CLI EMITTED does
  # not. So the notice patterns are applied to the transcript with tool output
  # removed. A run killed mid-flight still reports ERROR, because its notice is
  # raw output rather than something a tool handed back.
  local own; own=$(awk '
    /^\[tool [0-9]/   { inresult = 0; next }
    /^\[result [0-9]/ { inresult = 1; next }
    inresult          { next }
    { print }
  ' "$t")

  if printf '%s' "$own" | grep -qiE 'spend limit|usage limit|rate limit|quota exceeded|/usage-credits'; then
    echo "spend/usage limit reached — the scenario never ran"; return 0
  fi
  if grep -qiE 'invalid api key|not authenticated|please run .claude login|authentication_error' <<<"$own"; then
    echo "claude CLI not authenticated"; return 0
  fi
  # `529` used to be a bare alternative here. The `^` anchor binds only to the
  # FIRST alternative in an ERE, so that pattern matched those three digits
  # anywhere — including inside a session UUID (`…06666529a20b`), which reported
  # a perfectly good 14KB run as an infrastructure failure. Every alternative now
  # requires an error context of its own.
  if grep -qiE '(api )?error:?[[:space:]]*(5[0-9]{2}|overloaded)|overloaded_error|internal server error' <<<"$own"; then
    echo "upstream API error"; return 0
  fi
  if [ "$bytes" -lt "$MIN_TRANSCRIPT_BYTES" ]; then
    echo "transcript only ${bytes}B (< ${MIN_TRANSCRIPT_BYTES}B) — no real turn took place"; return 0
  fi
  return 1
}

# $1 scenario name · $2 "gate" | "nogate"
# In "nogate" mode the gate file is blanked first: the scenario MUST then fail,
# which is what proves the assertion is actually sensitive to the gate.
run_one() {
  local name="$1" mode="${2:-gate}"
  local scenario="$SCENARIOS_DIR/$name.sh"
  [ -f "$scenario" ] || { echo "✗ unknown scenario: $name"; return 1; }

  local work
  work=$(mktemp -d "${TMPDIR:-/tmp}/ck-behavior-$name-XXXXXX")
  local transcript="$work/transcript.txt"
  # Structured log alongside the text one. Ordering properties (TDD's red-before-
  # green is purely one) are invisible in prose but explicit in the tool-call
  # sequence, so scenarios that assert on order read $EVENTS instead of grepping.
  EVENTS="$work/events.jsonl"
  # What the model itself said, with tool output stripped. An assertion of the
  # form "the model stated X" belongs here, not in $transcript — the rendered
  # transcript carries file contents, so a fixture containing the asserted phrase
  # satisfies the grep as soon as anything reads it.
  PROSE="$work/prose.txt"
  local raw="$work/raw.out"

  # scratch repo + kit install (hooks, skills, workflows all live)
  git -C "$work" init -q
  git -C "$work" config user.email t@t && git -C "$work" config user.name t
  ( cd "$work" && node "$REPO_ROOT/bin/ck.js" init --kit engineer >/dev/null 2>&1 )

  # Each scenario redefines these; unset first so a previous scenario's
  # definitions can never leak into one that forgot to declare its own.
  unset -f setup assert_transcript 2>/dev/null || true
  unset GATE_FILE GATE_PATTERN POSITIVE_PATTERN PROMPT ALLOWED_TOOLS 2>/dev/null || true
  # shellcheck source=/dev/null
  source "$scenario"      # defines: GATE_FILE, PROMPT, ALLOWED_TOOLS, setup(), assert_transcript()
  for required in GATE_FILE PROMPT ALLOWED_TOOLS; do
    [ -n "${!required:-}" ] || { echo "✗ $name: scenario does not define $required"; rm -rf "$work"; return 1; }
  done
  declare -F setup >/dev/null && declare -F assert_transcript >/dev/null || {
    echo "✗ $name: scenario must define setup() and assert_transcript()"; rm -rf "$work"; return 1; }

  ( cd "$work" && setup ) || { echo "✗ $name: setup failed"; rm -rf "$work"; return 1; }

  # Ablate BEFORE the fixture commit, so the gate is absent from history and not
  # merely from the working tree. Blanking after the commit left the original at
  # HEAD, and a thorough agent runs `git show HEAD:<gate>` and reads it — which is
  # exactly what a `tdd-red-first` negative control was caught doing (step 6 of
  # its transcript). Every "negative control OK" produced by the old order is
  # therefore unreliable for any gate captured in the fixture commit.
  if [ "$mode" = nogate ]; then
    [ -f "$work/$GATE_FILE" ] || { echo "✗ $name: gate file not found in scratch install: $GATE_FILE"; rm -rf "$work"; return 1; }
    cp "$work/$GATE_FILE" "$work/gate-original.md"
    case "$GATE_FILE" in
      */SKILL.md)
        # A skill IS its directory. Blanking SKILL.md leaves a directory named
        # after the rule, and that name is enough: a verify-plan negative control
        # ran `find .claude/skills -iname "*verify*"`, found the emptied skill,
        # and produced the gate's own artifact (plan-verification.md) anyway.
        # Removing the directory is what "this skill does not exist" means.
        rm -rf "$(dirname "$work/$GATE_FILE")" ;;
      *)
        : >"$work/$GATE_FILE" ;;   # a hook or a reference file: blank it in place
    esac

    # A behavioural rule is stated redundantly across the kit, so blanking its
    # home file does not remove it. `tdd`'s red-before-green is also spelled out
    # in workflows/development-rules.md — which CLAUDE.md loads on EVERY run — so
    # the gate stayed fully operative and the negative control was measuring
    # nothing. Scenarios that set GATE_PATTERN strip every line stating the rule.
    if [ -n "${GATE_PATTERN:-}" ]; then
      # Prose only. A hand-authored pattern that matches inside a hook's source
      # would delete a line of executable JavaScript — at best a comment, at worst
      # a condition or a string literal, leaving a syntactically broken hook whose
      # misbehaviour has nothing to do with the gate under test. guard-tier-b's
      # pattern does match a line in file-claims.cjs (a comment, this time). The
      # code gate is ablated by blanking GATE_FILE, not by editing source.
      local hits=0 f
      while IFS= read -r f; do
        [ -n "$f" ] || continue
        hits=$((hits + $(grep -ciE "$GATE_PATTERN" "$f")))
        sed -i -E "/$GATE_PATTERN/Id" "$f"
      done < <(grep -rlEi --include='*.md' --include='*.sh' --include='*.ps1' \
                 --exclude-dir=node_modules "$GATE_PATTERN" \
                 "$work/.claude" "$work/CLAUDE.md" 2>/dev/null)
      echo "   ablation: stripped $hits line(s) stating the rule, plus $GATE_FILE"
      [ "$hits" -gt 0 ] || { echo "✗ $name: GATE_PATTERN matched nothing — the ablation is a no-op"; rm -rf "$work"; return 1; }

      # GATE_PATTERN is hand-authored, so it will miss phrasings. Report what
      # still speaks in the gate's own words, because a negative control run
      # against a partial ablation says nothing about the model. iron-law's first
      # attempt stripped 24 lines and left "before claiming work complete"
      # standing in three other files — found only by reading the tree by hand.
      # Outside $work on purpose: a negative control that passes deletes the work
      # dir, and the warning below would then print a path that no longer exists.
      local residue="${TMPDIR:-/tmp}/ck-residue-$name.txt"
      # Shingles from the WHOLE gate file, not just its headings: the phrase that
      # survived iron-law's first ablation ("before claiming") sits in body prose,
      # so a headings-only extractor would have missed it too.
      tr 'A-Z' 'a-z' <"$work/gate-original.md" 2>/dev/null \
        | grep -ohE '[a-z]{5,} [a-z]{6,}' | sort -u | head -40 >"$work/gate-phrases.txt"
      : >"$residue"
      while IFS= read -r phrase; do
        # Vendored dependencies live under .claude/skills/*/scripts/ and their
        # READMEs match almost any shingle; without this the residue report is
        # mostly cosmiconfig. guard-tier-b's 8 flagged lines were 7 of those.
        [ -n "$phrase" ] && grep -rniF --include='*.md' --exclude-dir=node_modules \
          "$phrase" "$work/.claude" 2>/dev/null >>"$residue"
      done <"$work/gate-phrases.txt"
      local left; left=$(sort -u "$residue" | wc -l)
      [ "$left" -gt 0 ] && echo "   ⚠ ablation residue: $left line(s) still use the gate's own phrasing — $residue"
    fi
  fi

  # Positive control: strip ONE claimed-load-bearing rule and nothing else.
  #
  # This is not a smaller negative control, it answers a sharper question.
  # `--negative` removes a whole rule cluster (the skill directory plus every
  # line stating the rule anywhere) and asks "is any of this necessary". A rule
  # whose behaviour a capable model also produces unaided can never pass that
  # bar, however well it works. `--positive` removes one line, and asks whether
  # that line alone flips a case that fails without it — which is what actually
  # happened when the refuted-premise hard stop turned a FAIL into a PASS.
  if [ "$mode" = noline ]; then
    [ -n "${POSITIVE_PATTERN:-}" ] || {
      echo "✗ $name: --positive needs POSITIVE_PATTERN (the one rule under test)"; rm -rf "$work"; return 1; }
    local phits=0 pf
    while IFS= read -r pf; do
      [ -n "$pf" ] || continue
      phits=$((phits + $(grep -ciE "$POSITIVE_PATTERN" "$pf")))
      sed -i -E "/$POSITIVE_PATTERN/Id" "$pf"
    done < <(grep -rlEi --include='*.md' --exclude-dir=node_modules "$POSITIVE_PATTERN" \
               "$work/.claude" "$work/CLAUDE.md" 2>/dev/null)
    echo "   positive control: removed $phits line(s) — the rule under test, nothing else"
    [ "$phits" -gt 0 ] || {
      echo "✗ $name: POSITIVE_PATTERN matched nothing — there is no rule to credit"; rm -rf "$work"; return 1; }
  fi

  # fixture commit — only when the scenario didn't manage its own commits/dirty state
  if ! git -C "$work" rev-parse HEAD >/dev/null 2>&1; then
    git -C "$work" add -A >/dev/null 2>&1 && git -C "$work" commit -qm "scenario fixture" >/dev/null 2>&1
  fi

  # A scenario that made its own commits already captured the gate. Commit the
  # ablation scoped to that one path — `add -A` would sweep up dirty state a
  # scenario left on purpose (guard-tier-b's foreign WIP must stay uncommitted).
  # The gate is still reachable at HEAD~1 here; only the fresh-repo case above
  # erases it from history outright.
  if [ "$mode" = nogate ] && ! git -C "$work" diff --quiet -- "$GATE_FILE" 2>/dev/null; then
    git -C "$work" commit -qm "ablate gate for negative control" -- "$GATE_FILE" >/dev/null 2>&1
  fi

  # A rule that the strongest model follows unprompted cannot be shown to change
  # ITS behaviour — there is no difference to detect, and no fixture work creates
  # one. But most of these rules are insurance, and insurance is measured against
  # the case it insures. CK_BEHAVIOR_MODEL runs the same scenario, unchanged,
  # against a weaker model: if the behaviour disappears there when the rule is
  # ablated, the rule demonstrably does something — just not for a model that
  # already does it.
  local model_arg=()
  [ -n "${CK_BEHAVIOR_MODEL:-}" ] && model_arg=(--model "$CK_BEHAVIOR_MODEL")
  ( cd "$work" && timeout 600 claude -p "$PROMPT" --allowedTools "$ALLOWED_TOOLS" "${model_arg[@]}" \
      --permission-mode acceptEdits --output-format stream-json --verbose ) >"$EVENTS" 2>&1
  cp "$EVENTS" "$raw"

  # Render the stream into the ordered text the other scenarios grep. If the run
  # died before emitting any JSON, the raw output IS the transcript — otherwise an
  # infrastructure notice would be rendered away and misread as a gate failure.
  if ! node "$HARNESS_DIR/tool-sequence.cjs" "$EVENTS" --render >"$transcript" 2>/dev/null || [ ! -s "$transcript" ]; then
    cp "$raw" "$transcript"
  fi
  node "$HARNESS_DIR/tool-sequence.cjs" "$EVENTS" --prose >"$PROSE" 2>/dev/null || : >"$PROSE"

  # Detect on the RENDERED text, not the raw stream: a JSONL stream is full of
  # ids, token counts and timings that read like error codes to a heuristic.
  # `$transcript` falls back to `$raw` when nothing rendered, so a run that died
  # before emitting JSON is still caught.
  local reason
  # A run that called no tool at all did not engage with the task. Every scenario
  # here requires the model to DO something — even a gate that correctly halts
  # reads files first — so zero tool calls is not a verdict about a gate.
  #
  # Found when a `--model haiku` probe came back FAIL: the stream carried a
  # `rate_limit_event`, the prompt never reached the model (`MAX_UPLOAD_MB`
  # appeared 0 times in 15KB of events) and it answered "What would you like me to
  # work on?". The notice was a structured event, so it never reached the prose
  # the text heuristics read. Fifth instance of the same class: a verdict reported
  # for a run that did not happen.
  if [ "$(node "$HARNESS_DIR/tool-sequence.cjs" "$EVENTS" 2>/dev/null | wc -l)" -eq 0 ]; then
    echo "⚠ $name ERROR ($mode) — the run made no tool calls; it never engaged with the task"
    echo "   NOT a verdict about the gate. Transcript kept at $transcript"
    return 2
  fi

  if reason=$(infra_failure_reason "$transcript"); then
    echo "⚠ $name ERROR ($mode) — $reason"
    echo "   NOT a verdict about the gate. Transcript kept at $transcript"
    return 2
  fi

  if ( cd "$work" && assert_transcript "$transcript" ); then
    if [ "$mode" = nogate ]; then
      echo "✗ $name NEGATIVE-CONTROL FAIL — assertion still passed with $GATE_FILE blanked;"
      echo "   the scenario is not sensitive to its own gate. Transcript kept at $transcript"
      return 1
    fi
    if [ "$mode" = noline ]; then
      echo "✗ $name POSITIVE-CONTROL FAIL — the case passes without the rule, so the rule"
      echo "   cannot be what carries it. Transcript kept at $transcript"
      return 1
    fi
    echo "✓ $name PASS"
    rm -rf "$work"
    return 0
  fi

  if [ "$mode" = nogate ]; then
    echo "✓ $name negative control OK (fails without its gate, as required)"
    rm -rf "$work"
    return 0
  fi
  if [ "$mode" = noline ]; then
    echo "   without the rule: FAILS (as a positive control requires)"
    rm -rf "$work"
    return 0
  fi
  echo "✗ $name FAIL — transcript kept at $transcript"
  return 1
}

# Sourcing this file defines the functions without running anything, so the
# ERROR-class heuristic above can be exercised by a unit test. It has already
# produced one real misdiagnosis in each direction (6× FAIL on spend-limit
# notices; one ERROR on a healthy run whose UUID contained "529"), which is
# reason enough for it to be testable rather than only reviewable.
main() {
command -v claude >/dev/null || { echo "✗ claude CLI not on PATH"; exit 1; }
NEGATIVE=0
POSITIVE=0
# How many times the ablated run must fail before the gate is credited.
#
# n=1 is a coin flip and it produced two wrong verdicts in one session:
# `scope-lock`'s negative control came back OK, then FAIL on an identical setup,
# and `verify-plan-fires` went OK → FAIL → FAIL. Both times the ablated tree was
# checked and the rule really was gone; the model simply asks the scoping question
# about half the time on its own. "Removing the gate removes the behaviour" is a
# claim about reliability, so one sample cannot support it — the gate is credited
# only when EVERY ablated run fails.
NEGATIVE_RUNS=${NEGATIVE_RUNS:-3}
ARGS=()
for a in "$@"; do
  case "$a" in
    --negative=*) NEGATIVE=1; NEGATIVE_RUNS="${a#*=}" ;;
    --negative) NEGATIVE=1 ;;
    --positive) POSITIVE=1 ;;
    *) ARGS+=("$a") ;;
  esac
done

case "${ARGS[0]:-}" in
  --fast) SET="$FAST_SET" ;;
  --all)  SET="$ALL_SET" ;;
  "")     echo "usage: run-scenario.sh <scenario>|--fast|--all [--negative[=N]]"
          echo "  --negative[=N]  ablate the whole gate; require the behaviour to disappear in all N runs (default 3)"
          echo "  --positive      remove only POSITIVE_PATTERN (one rule); require FAIL without it and PASS with it"
          echo "scenarios: $ALL_SET"; exit 1 ;;
  *)      SET="${ARGS[0]}" ;;
esac

# --negative doubles the number of claude -p runs, so it is opt-in.
fail=0; errored=0; ran=0
for s in $SET; do
  # Positive control first: it is one run, and a rule that cannot flip its own
  # case is not worth spending three ablated runs on.
  if [ $POSITIVE -eq 1 ]; then
    run_one "$s" noline; prc=$?
    if [ $prc -eq 2 ]; then errored=1; echo "   stopping: infrastructure failure"; break; fi
    if [ $prc -eq 1 ]; then fail=1; continue; fi
  fi

  run_one "$s" gate; rc=$?
  if [ $POSITIVE -eq 1 ] && [ $rc -eq 0 ]; then
    echo "✓ $s positive control OK — fails without the rule, passes with it"
  fi
  [ $rc -eq 1 ] && fail=1
  [ $rc -eq 2 ] && { errored=1; echo "   stopping: infrastructure failure makes every later verdict meaningless"; break; }
  # Counted as verified only where the evidence actually reaches. Under --negative
  # that means AFTER the ablated runs agree; a gate run passing on its own says
  # nothing, and counting it there printed "2 scenario(s) genuinely verified"
  # directly beneath "NOT SENSITIVE" and "never ran" — the exact false-success
  # report this harness exists to catch.
  if [ $rc -eq 0 ] && [ $NEGATIVE -eq 0 ]; then ran=$((ran + 1)); fi
  if [ $NEGATIVE -eq 1 ] && [ $rc -eq 0 ]; then
    leaked=0; nerr=0
    for _n in $(seq 1 "$NEGATIVE_RUNS"); do
      run_one "$s" nogate; nrc=$?
      [ $nrc -eq 1 ] && leaked=$((leaked + 1))
      [ $nrc -eq 2 ] && { nerr=1; break; }
    done
    if [ $nerr -eq 1 ]; then
      errored=1; echo "   stopping: infrastructure failure"; break
    elif [ $leaked -eq $NEGATIVE_RUNS ]; then
      fail=1
      echo "✗ $s NOT DISCRIMINATING — the behaviour survived every one of $NEGATIVE_RUNS ablated runs."
      echo "   The model produces it unaided; this scenario measures the model, not the gate."
    elif [ $leaked -gt 0 ]; then
      fail=1
      echo "✗ $s SUPPORTED, NOT DEMONSTRATED — behaviour absent in $((NEGATIVE_RUNS - leaked)) of"
      echo "   $NEGATIVE_RUNS ablated runs, present in $leaked. Removing the rule shifts the outcome"
      echo "   but does not decide it, so unanimity is unreachable here. Use --positive: it asks"
      echo "   whether one rule flips a case that fails without it, which this separation suggests."
    else
      ran=$((ran + 1))
      echo "✓ $s negative control OK — behaviour absent in all $NEGATIVE_RUNS ablated runs"
    fi
  fi
done

echo "── $ran scenario(s) genuinely verified$([ $NEGATIVE -eq 1 ] && echo ' (with negative control)')"
[ $errored -eq 1 ] && { echo "⚠ run incomplete — infrastructure, not gates. Re-run when resolved."; exit 3; }
exit $fail
}

# Run only when executed, not when sourced for testing.
[ "${BASH_SOURCE[0]}" = "${0}" ] && main "$@"
