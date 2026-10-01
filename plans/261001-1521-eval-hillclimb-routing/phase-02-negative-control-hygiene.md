# Phase 02 — D: negative-control hygiene (Wilson CI + non-discriminating rule)

**Goal**: `run-scenario.sh --negative` reports an interval, and a scenario whose behaviour survives ablation at ≥ `NONDISC_RATE` is labelled non-discriminating and never credited. Done **before** the phase-05 baseline so the `development-rules.md` byte count is final.

## **Interfaces**

**Consumes**: `tests/behavior/stats.cjs` CLI `node tests/behavior/stats.cjs wilson <k> <n>` → `p=<..> lo=<..> hi=<..>` (phase 01).
**Produces**: runner output lines (asserted by tests):
- `   ablated pass rate <leaked>/<N>, Wilson 95% CI [<lo>, <hi>]` — printed after every `--negative` loop.
- `✗ <s> NOT DISCRIMINATING — …` when `leaked / N ≥ NONDISC_RATE` (was: only when `leaked == N`).
- `   ⚠ N=<N> cannot exclude an ablated pass rate ≥ <NONDISC_RATE> (upper bound <hi>); use --negative=5 or more` when `leaked == 0` and `hi ≥ NONDISC_RATE` (informational; still credited).
- Env `NONDISC_RATE` default `0.5`.

## Tasks

1. `tests/behavior/run-scenario.sh` `main()`, in the `--negative` block after the `for _n` loop:
   - compute CI: `ci=$(node "$HARNESS_DIR/stats.cjs" wilson "$leaked" "$NEGATIVE_RUNS")`, print the CI line.
   - replace `elif [ $leaked -eq $NEGATIVE_RUNS ]` with a rate test: `node -e 'process.exit(+process.argv[1]/+process.argv[2] >= +process.argv[3] ? 0 : 1)' "$leaked" "$NEGATIVE_RUNS" "$NONDISC_RATE"`. Message: keep "measures the model, not the gate", add "(ablated pass rate ≥ $NONDISC_RATE)".
   - `0 < rate < NONDISC_RATE` keeps the existing "SUPPORTED, NOT DEMONSTRATED" branch unchanged.
   - `leaked == 0`: existing OK line, plus the ⚠ line when `hi ≥ NONDISC_RATE`.
   - Usage text: document `NONDISC_RATE`.
2. `tests/behavior-harness.test.js` — add to the existing `sweep`/`sweepSummary` stub tests:
   - `[1,1,0]` (2/3 leaked) → `/NOT DISCRIMINATING/`, `doesNotMatch /SUPPORTED/` (new rule).
   - `[0,1,0]` → still `/SUPPORTED, NOT DEMONSTRATED/` (existing test must pass unchanged).
   - `[0,0,0]` → `/Wilson 95% CI \[0\.00, 0\.56\]/` and the ⚠ `--negative=5` line; still `/── 1 scenario\(s\) genuinely verified/`.
   - `NONDISC_RATE=0.3` with `[0,1,0]` → `/NOT DISCRIMINATING/`.
3. `.claude/workflows/development-rules.md` § Behavioural-Skill Governance: **one** bullet, ≤ 2 lines: ablated pass rate ≥ 50 % ⇒ the scenario is non-discriminating and is never credited; report the Wilson interval, not a bare count; 0/3 cannot exclude 50 % — use ≥ 5 runs to claim it. Prose path `tests/behavior/` in backticks only, no link (repo-internal, not shipped).

**Exit gate:** `node --test tests/behavior-harness.test.js` → 0 fail (all existing + 4 new) · `bash -n tests/behavior/run-scenario.sh` → exit 0 · `node --test tests/installer-packaging.test.js` → 0 fail.
