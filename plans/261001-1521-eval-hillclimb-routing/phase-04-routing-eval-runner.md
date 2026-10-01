# Phase 04 — Routing eval runner + CLI probe

**Goal**: one command runs a split × N runs within a hard budget and writes graded rows; ERROR never masquerades as FAIL.

## **Interfaces**

**Consumes**: `route-grade.cjs` (`gradeRoute`, `commandAliases`, CLI), `tool-sequence.cjs --render`, `run-scenario.sh` `infra_failure_reason` (sourced; `main` does not run when sourced), `data/cases.jsonl` (phase 03).
**Produces**:
- `tests/behavior/routing/run-routing-eval.sh --split train|test|all --label <name> [--runs 3] [--only <id,id>]`
  - env: `ROUND_BUDGET_USD` (required), `PER_RUN_USD` (default 0.50), `JOBS` (default 3), `CK_BEHAVIOR_MODEL` (optional)
  - **appends** to `data/results/<label>.jsonl` (rows per phase 01 shape; an existing label is extended, so a second split or re-run of missing rows lands in the same label) + `data/results/<label>.meta.json` `{ model, surfaceSha, surfaceBytes, cliVersion, startedAt, budgetUsd, complete: bool }`
  - keeps each run's `events.jsonl` under `data/results/<label>/<case>-r<run>/`
  - exit 0 complete · 3 INCOMPLETE (budget hit or ERROR) · 1 usage
- `tests/behavior/routing/routing-report.cjs <label> [--vs <baseLabel>] [--size-ok] [--leak-ok]` → prints per-split `acc [lo, hi] n= noise= errors= cost=$`, per-gate table, flaky count; with `--vs` compares split by split and prints `ACCEPT|REVERT|PENDING-TEST — <why>` (`PENDING-TEST` = train passes, label has no test rows yet); exit 0 ACCEPT · 1 REVERT · 2 incomplete input · 4 PENDING-TEST.

## Tasks

1. **CLI probe** (one run each, ~$0.05): confirm on CLI 2.1.286 that (a) `--max-budget-usd` stops the run and what the stream shows when it does, (b) a denied `Edit` emits a `tool_use` + `is_error` result under `--permission-mode default` with Edit absent from `--allowedTools`, (c) whether `--max-turns` exists (not in `--help`). Record findings in `reports/cli-probe.md`. If (b) fails (tool hidden instead of denied) switch to allowing Edit/Write in the throwaway workdir — the grader is order-based, so the verdict is unchanged; update Global Constraints run flags accordingly.
2. **Template install** once per sweep: `mktemp -d` → `git init` → `node bin/ck.js init --kit engineer` → generic fixture (`package.json` with `"test": "node --test"`, `src/index.js`, `test/index.test.js`, `README.md`) → commit. Per run: `cp -a template work`.
3. **Run loop**: cases filtered by split/`--only`, each × `--runs`, `JOBS` in parallel via `xargs -P`. Each job: exact Global Constraints run flags, prompt from `cases.jsonl`, `cd work`. After: render with `tool-sequence.cjs --render`; zero tool calls or `infra_failure_reason` ⇒ row `verdict:"ERROR"` and create `data/results/<label>/STOP`; else `route-grade.cjs --expected <csv> --commands work/.claude/commands` ⇒ PASS/FAIL row. Cost = `total_cost_usd` of the `result` event (0 if absent, flagged in `why`).
4. **Budget**: before launching each job, sum `costUsd` in the results file; if ≥ `ROUND_BUDGET_USD` or `STOP` exists, launch nothing more; meta `complete:false`; exit 3. Overshoot bounded by `JOBS × PER_RUN_USD` — document it in the usage text.
5. `routing-report.cjs` (~120 lines): thin CLI over `routing-stats.cjs`; refuses (exit 2) when either meta has `complete:false` or models differ.
6. **Smoke**: `ROUND_BUDGET_USD=1 run-routing-eval.sh --split train --label smoke --runs 1 --only <2 ids>`.

**Exit gate:** `bash -n tests/behavior/routing/run-routing-eval.sh` → exit 0 · `test -f plans/261001-1521-eval-hillclimb-routing/reports/cli-probe.md` → exit 0 · `ROUND_BUDGET_USD=1 bash tests/behavior/routing/run-routing-eval.sh --split train --label smoke --runs 1 --only <id1>,<id2>` → exit 0 and `wc -l < tests/behavior/routing/data/results/smoke.jsonl` → `2` · `node tests/behavior/routing/routing-report.cjs smoke` → exit 0, prints one `train` line · `bash tests/behavior/routing/run-routing-eval.sh --split train --label x` (no budget env) → exit 1 with a message naming `ROUND_BUDGET_USD`.
