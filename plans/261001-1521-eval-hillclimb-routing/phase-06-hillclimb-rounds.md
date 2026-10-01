# Phase 06 — Hillclimb rounds on the surface

**Run only if** `reports/baseline.md` says `DECISION: CLIMB`. Otherwise mark skipped in `STATE.md` and go to phase 07.

**Goal**: ≤ 5 attributable, one-change rounds on `.claude/workflows/skill-activation.md`; keep only changes that move held-out test accuracy without growing the always-loaded files.

## **Interfaces**

**Consumes**: `run-routing-eval.sh`, `routing-report.cjs --vs` (phase 04); `routing-guard.cjs leak|bytes` (phase 01); `baseline` label + `SIZE_BASELINE` (phase 05).
**Produces**: one results label `r<N>` per round (train rows, then test rows appended); `BEST` = label of the current comparison base (starts as `baseline`); `reports/climb-log.md` (committed) one row per round: `| round | hypothesis (one line, no case text) | diff stat | train Δ | noise | test Δ | bytes | verdict |`; accepted rounds as separate commits on branch `feat/routing-eval-hillclimb`.

## Round procedure (repeat, max 5 test evaluations)

1. **Diagnose from TRAIN only**: read FAIL transcripts of `BEST`'s train rows (`data/results/<label>/<case>-r*/`). Never open test transcripts or test prompts. Cluster failures by `why` (`no-route` · `wrong-route:<tok>` · `mutation-first`).
2. **One hypothesis, one change** to `skill-activation.md` — a mechanism, not emphasis (development-rules: "a rule that names an intent instead of a mechanism can be obeyed and still not happen"). Candidate shapes: a row in the rule-5 table, a sharper trigger column, deleting a rationalization row that costs bytes, moving rule 5 above rule 1. Links stay `../skills/software/<name>/SKILL.md`.
3. **Guards** (no spend if either fails):
   - `node tests/behavior/routing/routing-guard.cjs leak tests/behavior/routing/data/cases.jsonl .claude/workflows/skill-activation.md` → exit 0.
   - `routing-guard.cjs bytes …` ≤ `SIZE_BASELINE`.
4. Train sweep: `run-routing-eval.sh --split train --runs 3 --label r<N>`. `routing-report.cjs r<N> --vs $BEST` → exit 1 REVERT now (train Δ ≤ train noise; no test spend, does **not** count toward the 5) or exit 4 PENDING-TEST.
5. Test sweep: `run-routing-eval.sh --split test --runs 3 --label r<N>`; `routing-report.cjs r<N> --vs $BEST --size-ok --leak-ok` ⇒ exit 0 ACCEPT / 1 REVERT per plan Accept rule. Counts toward the 5.
6. ACCEPT ⇒ commit `feat(workflows): <one-line mechanism>`; `BEST=r<N>`. REVERT ⇒ `git checkout -- .claude/workflows/skill-activation.md`.
7. Append the climb-log row. Stop early when two consecutive train sweeps show no gain > noise.

## Close-out of the climb

- If any round was accepted: run load-bearing scenarios once each — `bash tests/behavior/run-scenario.sh scope-lock`, `… verify-plan-fires`, `… fan-out-concurrency` → `✓ <name> PASS` each (Behavioural-Skill Governance; the surface feeds `scope-lock`). FAIL ⇒ revert the last accepted round and re-check.
- `npm test` (includes `installer-packaging.test.js` link guard).
- Claim of improvement in `climb-log.md` only if cumulative test Δ > test noise floor; otherwise state "no claimable gain".

**Exit gate:** `grep -cE '^\| r[0-9]+ ' plans/261001-1521-eval-hillclimb-routing/reports/climb-log.md` → ≥ 1 and ≤ number of rounds run · `node tests/behavior/routing/routing-guard.cjs leak tests/behavior/routing/data/cases.jsonl .claude/workflows/skill-activation.md` → exit 0 · `npm test` → 0 fail · (if a round was accepted) `bash tests/behavior/run-scenario.sh scope-lock` → `✓ scope-lock PASS`.
