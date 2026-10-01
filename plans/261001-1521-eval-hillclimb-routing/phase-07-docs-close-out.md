# Phase 07 — Docs + close-out

**Goal**: the routing eval is discoverable and its rules (privacy, hygiene, accept rule, model pinning) are written where the next person running it will look.

## **Interfaces**

**Consumes**: `reports/baseline.md`, `reports/climb-log.md` (if phase 06 ran), `reports/dataset-summary.md`, phase 02 runner output format.
**Produces**: doc sections only — no code.

## Tasks

1. `tests/behavior/README.md` — new section `## Routing eval (implicit skill routing, 2026-10)` (≤ 60 lines): what is graded (first SKILL.md Read / `ck:` invoke before first mutation), the commands (`run-routing-eval.sh`, `routing-report.cjs`, `routing-guard.cjs`), data is local + git-ignored + scrubbed, labelling rule (two labellers, keep on intersection, expected = union), split frozen (seed 1729), accept rule verbatim, max 5 test evaluations, re-baseline on model change, baseline numbers + decision with a link to `reports/baseline.md` (relative link from `tests/behavior/README.md`: `../../plans/261001-1521-eval-hillclimb-routing/reports/baseline.md`).
2. `tests/behavior/README.md` § "The negative control": add the Wilson interval + `NONDISC_RATE` rule (phase 02) and the 0/3 ⇒ upper bound 0.56 fact.
3. `docs/codebase-summary.md`: one line under the tests area naming `tests/behavior/routing/` and that its data dir is git-ignored.
4. `STATE.md` in the plan dir: final line with decision, accepted rounds, test Δ, cost.
5. Do **not** edit `development-rules.md` here (frozen after phase 02; byte metric).

**Exit gate:** `grep -c '^## Routing eval' tests/behavior/README.md` → `1` · `grep -c 'NONDISC_RATE' tests/behavior/README.md` → ≥ 1 · `npm test` → 0 fail · `git status --porcelain tests/behavior/routing/data` → empty · `node .claude/scripts/ck/plan-lint.cjs plans/261001-1521-eval-hillclimb-routing` → `✓ plan-lint PASS`.
