---
description: Finance — financial model, budget & variance (FP&A), month-end close & controls, tax planning memo, investment research
argument-hint: model|budget|close|tax|invest <company-or-goal>
---

## Pre-flight (soft)

`/mk:finance` is **exempt** from the marketing-context hard-fail (.claude/workflows/marketing-rules.md § 1). Read `plans/marketing-context.md` if it exists (company, business model, ICP, marketing spend) — do not require it.

## Variables

ACTION: $1 (default: model)
REST: $2..$n (company or engagement slug + free-text goal)

## Workflow

Read the action's skill file below **before** starting — it is the method, not a suggestion. These skills are grouped, so they are read by path, not invoked with the `Skill` tool. Main context does the work; no agent is required.

### Actions

- **`model`** — 3-statement model, scenarios, sensitivity, decision memo
  - Read [.claude/skills/finance/financial-model/SKILL.md](../../skills/finance/financial-model/SKILL.md)
- **`budget`** — annual budget, variance analysis, rolling forecast, department + hiring plan
  - Read [.claude/skills/finance/fpa/SKILL.md](../../skills/finance/fpa/SKILL.md)
- **`close`** — month-end close calendar, reconciliations, internal controls, audit readiness
  - Read [.claude/skills/finance/close-controls/SKILL.md](../../skills/finance/close-controls/SKILL.md)
- **`tax`** — tax planning memo for a licensed advisor to review (jurisdiction + year + cited authority)
  - Read [.claude/skills/finance/tax-strategy/SKILL.md](../../skills/finance/tax-strategy/SKILL.md)
- **`invest`** — equity / private-market research report, due diligence, valuation, bear case
  - Read [.claude/skills/finance/investment-research/SKILL.md](../../skills/finance/investment-research/SKILL.md)

## Output

Results written to `plans/finance/<slug>/<artifact>.md` (each skill's § Output names the artifact).

## Notes

- **Not professional advice.** `tax` and `invest` produce research memos, not tax, legal or personalized investment advice; every output says so and names what a licensed professional must confirm.
- Every figure is sourced and dated, or `[NEEDS DATA]` — no rates, thresholds or benchmarks from memory.
- No account numbers, bank details, tax IDs or personal financial data in committed files.
- Concise grammar in reports. List unresolved questions at end.
- Cross-references: `.claude/workflows/marketing-rules.md`, `.claude/skills/marketing/README.md`.

## Examples

```
/mk:finance model acme "3 scenarios for a price increase"
/mk:finance budget fy27 "marketing at 18% of revenue — does payback hold?"
/mk:finance tax acme "US + NO entities, R&D credit eligibility"
```
