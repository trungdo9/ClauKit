---
description: Finance for marketing & growth — financial model (unit economics, scenarios) and FP&A (budget, variance, marketing spend allocation)
argument-hint: model|budget <company-or-goal>
---

## Pre-flight (soft)

`/mk:finance` is **exempt** from the marketing-context hard-fail (.claude/workflows/marketing-rules.md § 1). Read `plans/marketing-context.md` if it exists (company, business model, ICP, marketing spend) — do not require it.

## Variables

ACTION: $1 (default: model)
REST: $2..$n (company or engagement slug + free-text goal)

## Workflow

Read the action's skill file below **before** starting — it is the method, not a suggestion. These skills are grouped, so they are read by path, not invoked with the `Skill` tool. Main context does the work; no agent is required.

### Actions

- **`model`** — 3-statement model, unit economics (CAC, LTV, payback), scenarios, sensitivity, decision memo
  - Read [.claude/skills/finance/financial-model/SKILL.md](../../skills/finance/financial-model/SKILL.md)
- **`budget`** — annual budget, variance analysis, rolling forecast, marketing spend allocation, hiring plan
  - Read [.claude/skills/finance/fpa/SKILL.md](../../skills/finance/fpa/SKILL.md)

Out of scope for this kit: bookkeeping / month-end close, tax planning, investment research — use the finance team, a licensed advisor, or dedicated tooling.

## Output

Results written to `plans/finance/<slug>/<artifact>.md` (each skill's § Output names the artifact).

## Notes

- Every figure is sourced and dated, or `[NEEDS DATA]` — no rates, thresholds or benchmarks from memory.
- No account numbers, bank details, tax IDs or personal financial data in committed files.
- Concise grammar in reports. List unresolved questions at end.
- Cross-references: `.claude/workflows/marketing-rules.md`, `.claude/skills/marketing/README.md`.

## Examples

```
/mk:finance model acme "3 scenarios for a price increase"
/mk:finance budget fy27 "marketing at 18% of revenue — does payback hold?"
```
