# Phase 02 impl — negative-control hygiene

Status: DONE

## Files changed
- tests/behavior/run-scenario.sh — NONDISC_RATE default 0.5 (after NEGATIVE_RUNS); usage text; `--negative` block: infra-stop first, then Wilson CI line (via stats.cjs), rate test via `node -e` replaces `leaked -eq N`, ⚠ line on leaked==0 && hi >= rate. SUPPORTED branch unchanged.
- tests/behavior-harness.test.js — `sweep()` gains `env` param; 4 new tests (TDD: all 4 failed first, `# fail 4`).
- .claude/workflows/development-rules.md — one bullet (2 lines) in § Behavioural-Skill Governance, before the "Where neither control" bullet.

## Gate output (tails)
- `node --test tests/behavior-harness.test.js` → `# tests 44 / # pass 44 / # fail 0`
- `bash -n tests/behavior/run-scenario.sh` → exit 0
- `node --test tests/installer-packaging.test.js` → `# tests 23 / # pass 23 / # fail 0`
- `npm test` → `# tests 407 / # pass 406 / # fail 0 / # skipped 1` (baseline 402/1 + 4)

## Deviations
- Fixed-width ≥ char used in messages/tests (brief's literal). Existing `[0,1,0]` SUPPORTED test unchanged and green.
- NOT DISCRIMINATING message reworded to "survived $leaked of N ablated runs (ablated pass rate ≥ $NONDISC_RATE)"; "measures the model, not the gate" kept.
- Added 4th-plus test is exactly 4 new: [1,1,0]; [0,0,0] CI+warn; NONDISC_RATE=0.3; plus `--negative=5` [0,0,0,0,0] CI [0.00, 0.43] no warning.

## development-rules.md size
12277 -> 12489 bytes (+212).

## Unresolved
- None.
