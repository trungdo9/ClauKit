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
ALL_SET="verify-plan-fires tdd-red-first scope-lock resume-from-ledger iron-law guard-tier-b"

# Minimum plausible transcript. A real run of any scenario is far larger; the
# infrastructure notices we have seen are ~100 bytes.
MIN_TRANSCRIPT_BYTES=400

command -v claude >/dev/null || { echo "✗ claude CLI not on PATH"; exit 1; }

# Returns 0 when the transcript shows the run never really happened.
infra_failure_reason() {
  local t="$1"
  [ -s "$t" ] || { echo "empty transcript — claude produced no output"; return 0; }
  local bytes; bytes=$(wc -c <"$t")
  if grep -qiE 'spend limit|usage limit|rate limit|quota exceeded|/usage-credits' "$t"; then
    echo "spend/usage limit reached — the scenario never ran"; return 0
  fi
  if grep -qiE 'invalid api key|not authenticated|please run .claude login|authentication_error' "$t"; then
    echo "claude CLI not authenticated"; return 0
  fi
  if grep -qiE '^(api error|error: )(5[0-9]{2}|overloaded)|529|internal server error' "$t"; then
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

  # scratch repo + kit install (hooks, skills, workflows all live)
  git -C "$work" init -q
  git -C "$work" config user.email t@t && git -C "$work" config user.name t
  ( cd "$work" && node "$REPO_ROOT/bin/ck.js" init --kit engineer >/dev/null 2>&1 )

  # Each scenario redefines these; unset first so a previous scenario's
  # definitions can never leak into one that forgot to declare its own.
  unset -f setup assert_transcript 2>/dev/null || true
  unset GATE_FILE PROMPT ALLOWED_TOOLS 2>/dev/null || true
  # shellcheck source=/dev/null
  source "$scenario"      # defines: GATE_FILE, PROMPT, ALLOWED_TOOLS, setup(), assert_transcript()
  for required in GATE_FILE PROMPT ALLOWED_TOOLS; do
    [ -n "${!required:-}" ] || { echo "✗ $name: scenario does not define $required"; rm -rf "$work"; return 1; }
  done
  declare -F setup >/dev/null && declare -F assert_transcript >/dev/null || {
    echo "✗ $name: scenario must define setup() and assert_transcript()"; rm -rf "$work"; return 1; }

  ( cd "$work" && setup ) || { echo "✗ $name: setup failed"; rm -rf "$work"; return 1; }
  # fixture commit — only when the scenario didn't manage its own commits/dirty state
  if ! git -C "$work" rev-parse HEAD >/dev/null 2>&1; then
    git -C "$work" add -A >/dev/null 2>&1 && git -C "$work" commit -qm "scenario fixture" >/dev/null 2>&1
  fi

  if [ "$mode" = nogate ]; then
    [ -f "$work/$GATE_FILE" ] || { echo "✗ $name: gate file not found in scratch install: $GATE_FILE"; rm -rf "$work"; return 1; }
    : >"$work/$GATE_FILE"   # blank the gate — the assertion must now fail
  fi

  ( cd "$work" && timeout 600 claude -p "$PROMPT" --allowedTools "$ALLOWED_TOOLS" --permission-mode acceptEdits ) >"$transcript" 2>&1

  local reason
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
    echo "✓ $name PASS"
    rm -rf "$work"
    return 0
  fi

  if [ "$mode" = nogate ]; then
    echo "✓ $name negative control OK (fails without its gate, as required)"
    rm -rf "$work"
    return 0
  fi
  echo "✗ $name FAIL — transcript kept at $transcript"
  return 1
}

NEGATIVE=0
ARGS=()
for a in "$@"; do
  case "$a" in
    --negative) NEGATIVE=1 ;;
    *) ARGS+=("$a") ;;
  esac
done

case "${ARGS[0]:-}" in
  --fast) SET="$FAST_SET" ;;
  --all)  SET="$ALL_SET" ;;
  "")     echo "usage: run-scenario.sh <scenario>|--fast|--all [--negative]"; echo "scenarios: $ALL_SET"; exit 1 ;;
  *)      SET="${ARGS[0]}" ;;
esac

# --negative doubles the number of claude -p runs, so it is opt-in.
fail=0; errored=0; ran=0
for s in $SET; do
  run_one "$s" gate; rc=$?
  [ $rc -eq 1 ] && fail=1
  [ $rc -eq 2 ] && { errored=1; echo "   stopping: infrastructure failure makes every later verdict meaningless"; break; }
  [ $rc -eq 0 ] && ran=$((ran + 1))
  if [ $NEGATIVE -eq 1 ] && [ $rc -eq 0 ]; then
    run_one "$s" nogate; nrc=$?
    [ $nrc -eq 1 ] && fail=1
    [ $nrc -eq 2 ] && { errored=1; echo "   stopping: infrastructure failure"; break; }
  fi
done

echo "── $ran scenario(s) genuinely verified$([ $NEGATIVE -eq 1 ] && echo ' (with negative control)')"
[ $errored -eq 1 ] && { echo "⚠ run incomplete — infrastructure, not gates. Re-run when resolved."; exit 3; }
exit $fail
