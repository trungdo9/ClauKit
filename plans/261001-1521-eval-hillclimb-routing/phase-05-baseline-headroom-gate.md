# Phase 05 — Baseline + headroom gate (STOP POINT)

**Goal**: an honest number for implicit routing on the current surface, with its interval and noise floor; decide whether climbing is worth anything.

## **Interfaces**

**Consumes**: `run-routing-eval.sh`, `routing-report.cjs` (phase 04); `routing-guard.cjs bytes` (phase 01); frozen `cases.jsonl` (phase 03); phase 02 already merged (byte count final).
**Produces**: results labels `baseline` (both splits, 3 runs); `reports/baseline.md` (committed, ids + numbers only) with: model id, surface sha256, `SIZE_BASELINE` = bytes of `skill-activation.md` + `development-rules.md`, per-split `acc [lo, hi]`, noise floor per split, per-gate slice, flaky count, ERROR count, total cost, and the decision line `DECISION: CLIMB | STOP-HEADROOM | STOP-DATASET`.

## Tasks

1. Pre-flight: `git status --porcelain .claude/workflows` empty; record `git rev-parse HEAD`.
2. `ROUND_BUDGET_USD=<agreed> run-routing-eval.sh --split all --runs 3 --label baseline`. Exit 3 ⇒ no verdict; resolve the cause (budget, 429) and re-run the **missing** rows only via `--only` into the same label — never mix models.
3. `routing-report.cjs baseline` → copy numbers into `reports/baseline.md`.
4. `node tests/behavior/routing/routing-guard.cjs bytes .claude/workflows/skill-activation.md .claude/workflows/development-rules.md` → record `SIZE_BASELINE`.
5. Look at the per-gate slice for the scope-lock shape (`expected[0] == "cook"`): record its pass rate separately (brainstorm success metric: ≥ 2/3 → 3/3).
6. **Decide**:
   - overall accuracy ≥ 0.90 ⇒ `STOP-HEADROOM`: phase 06 skipped; the result is that routing is already reliable on this model — report it, do not climb.
   - transcript cases < 40 (phase 03) ⇒ `STOP-DATASET`.
   - else `CLIMB`.
   - Also note if `noise ≥ 0.10` on train: climbing is still allowed but only gains > noise are claimable; say so.

**Exit gate:** `grep -cE '^DECISION: (CLIMB|STOP-HEADROOM|STOP-DATASET)$' plans/261001-1521-eval-hillclimb-routing/reports/baseline.md` → `1` · `node tests/behavior/routing/routing-report.cjs baseline` → exit 0 (meta `complete:true`) · `grep -c 'SIZE_BASELINE=' plans/261001-1521-eval-hillclimb-routing/reports/baseline.md` → `1`.
