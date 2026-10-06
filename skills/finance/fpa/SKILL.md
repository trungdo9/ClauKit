---
name: fpa
description: Financial planning and analysis — annual operating plan, driver-based department and hiring budgets, budget-vs-actual variance analysis with forward impact, monthly business review, rolling quarterly re-forecast, and marketing budget allocation (spend, CAC, payback). Use for "budget", "annual plan", "AOP", "operating plan", "variance analysis", "budget vs actual", "BvA", "re-forecast", "rolling forecast", "monthly business review", "MBR", "headcount plan", "hiring plan cost", "how much should we spend on marketing", "marketing budget", "should we approve this spend". For a three-statement model, valuation or one-off investment decision use financial-model; for closing the books use close-controls.
allowed-tools: Read, Write, Glob, Grep
---

# FP&A — Planning, Budgeting, Variance, Forecast

> A budget nobody owns is a budget nobody follows, and a variance without a forward impact is an obituary. Tie every line to a driver and an owner, then keep re-forecasting.

## When this skill activates

**Implicit:** "build next year's budget", "why did we miss plan", "explain this month's variances", "update the forecast", "prep the MBR", "can we afford these hires", "how should we split the marketing budget", "approve doubling paid spend?".
**Explicit:** "Use the fpa skill to [task]."
**Routed from:** `/mk:finance budget`.

## Scope

Covers:
- Annual operating plan (AOP): top-down targets, bottom-up department builds, gap reconciliation, scenarios, risks.
- Driver-based budgets: revenue per rep, cost per hire, CAC per channel, cost per unit — spend tied to an outcome.
- Headcount and hiring plans with fully loaded cost and timing.
- Budget-vs-actual and forecast-vs-actual variance, decomposed (volume / price-mix / timing / permanent) with forward impact.
- Monthly business review package and rolling quarterly re-forecast with a bridge from the prior forecast.
- Marketing budget allocation: spend by channel against CAC, payback and capacity.

Does NOT cover:
- Integrated three-statement model, DCF, one-off investment cases, the LTV / unit-economics model → [[financial-model]]. This skill owns channel spend allocation and marginal CAC.
- Producing the actuals — close, reconciliations, journal entries → [[close-controls]].
- Tax provision and structure → [[tax-strategy]].
- Deal-level sales forecast and pipeline coverage → [[pipeline-forecast]]; this skill consumes its output as the revenue driver.

## Rules

1. **Every budget line has a driver and a named owner.** "Last year + 10%" is inflation, not planning.
2. **Variance explains the future.** Every variance row states its cause and its impact on the full-year outlook.
3. **Make trade-offs visible.** A request for more budget comes with what gets cut, deferred, or the revenue required to fund it.
4. **Re-forecast at least quarterly.** The plan is the baseline; the forecast is the current best estimate. Track forecast accuracy against actuals and fix the process when it drifts.
5. **Scenarios for major decisions.** Any spend or headcount request above the threshold the business sets gets base / upside / downside.
6. **Translate for the audience.** Sales hears pipeline and quota, engineering hears capacity, the board hears margin and cash.
7. **Partner, don't police.** The goal is department heads who understand their own numbers.

## Annual planning cycle

1. **Strategic alignment** — priorities and financial targets with leadership.
2. **Top-down targets** — revenue and profitability with the CEO/CFO.
3. **Bottom-up build** — department expense and headcount plans with each owner.
4. **Gap reconciliation** — bridge top-down to bottom-up; document every closing move.
5. **Scenarios** — upside, downside, stress.
6. **Approval** — board-ready package.
7. **Load and communicate** — budgets into the planning system, each owner gets their lines.

## Monthly rhythm (business days after close)

| Days | Step |
|---|---|
| 1–3 | Collect closed actuals (from [[close-controls]]) and operational KPIs |
| 3–5 | Variance analysis — revenue, expense, headcount, KPIs, with root causes |
| 5–7 | Review variances with department heads; confirm forward outlook |
| 7–8 | Update rolling forecast |
| 8–10 | MBR package to leadership; archive |

Day ranges are a starting cadence, not a benchmark — set them from when actuals actually close and when leadership needs the package.

## Template — annual operating plan

```markdown
# Annual Operating Plan — [Fiscal Year]
**Version**: [X.X]  **Owner**: [CFO/VP Finance]  **FP&A lead**: [Name]  **Approved**: [Date]

## 1. Strategic Context
[How the plan supports the strategy; key initiatives; market conditions — sourced]

## 2. Key Financial Targets
| Metric | Prior Year (A) | Plan | Change | Driver |
|---|---|---|---|---|
| Revenue | | | | |
| Gross margin | | | | |
| Operating expense | | | | |
| EBITDA / margin | | | | |
| Free cash flow | | | | |
| Headcount (EOY) | | | | |

## 3. Revenue Plan
| Segment | Q1 | Q2 | Q3 | Q4 | FY | YoY |
|---|---|---|---|---|---|---|
**Revenue assumptions** (each with source): new bookings vs pipeline coverage; retention (trailing actual); pricing changes and effective date.

## 4. Expense Plan by Department
| Department | HC | Personnel | Non-personnel | Total | % of revenue | Driver |
|---|---|---|---|---|---|---|

## 5. Hiring Plan
| Department | Q1 | Q2 | Q3 | Q4 | EOY HC | Fully loaded cost |
|---|---|---|---|---|---|---|

## 6. Scenarios
| Scenario | Revenue | EBITDA | Assumption change | Trigger |
|---|---|---|---|---|
| Upside | | | | |
| **Base** | | | | |
| Downside | | | | |
| Stress | | | | |

## 7. Risks & Mitigation
| Risk | Probability | Impact on [metric] | Mitigation | Owner |
|---|---|---|---|---|
```

## Template — variance analysis / monthly business review

```markdown
# Monthly Business Review — [Month Year]

## Executive Dashboard
| Metric | Plan | Actual | Var | Var % | YTD Plan | YTD Actual | YTD Var % |
|---|---|---|---|---|---|---|---|
| Revenue | | | | | | | |
| Gross profit | | | | | | | |
| OpEx | | | | | | | |
| EBITDA | | | | | | | |
| Cash | | | | | — | — | — |
| Headcount | | | | | — | — | — |

## Revenue Variance Decomposition
| Driver | Impact | Cause | Forward impact |
|---|---|---|---|
| Volume | | | |
| Price / mix | | | |
| Timing (reverses in [period]) | | | |
| Permanent | | | |

## Department Variance
| Department | Budget | Actual | Var | Root cause | Action / owner |
|---|---|---|---|---|---|

## Forecast Update
| Metric | Plan | Prior forecast | Current forecast | Change | Driver |
|---|---|---|---|---|---|

## Actions
| # | Action | Owner | Due | Status |
|---|---|---|---|---|
```

Separate **timing** variances (a deal slipped a quarter — re-forecast, don't panic) from **permanent** ones (churn spike — investigate). Most of the value of a variance report is in that split.

## Marketing budget allocation

When the request is "how much should we spend on marketing" or "approve this channel increase":

1. Pull channel spend, new customers and revenue per customer from actuals, and the ICP, pricing and channel mix from `plans/marketing-context.md` when present.
2. Compute per channel: CAC (fully loaded spend ÷ new customers, same period), gross-margin payback (CAC ÷ monthly gross margin per customer), and the capacity ceiling — the point where more spend stops buying customers at that CAC.
3. Model the increment, not the average: incremental spend ÷ **marginal** CAC. Average CAC on a channel always flatters the next dollar.
4. Recommend with a checkpoint: approve the increment, name the metric and date at which it is re-reviewed, and the threshold that stops it.

Every input sourced from actuals or marked `[NEEDS DATA]`; no benchmark CACs from memory.

## Anti-fabrication rules

1. Every plan and forecast figure traces to a driver and a source, or is `[NEEDS DATA]`.
2. Never mix actuals and forecast in one column unlabelled.
3. No benchmark percentages (margins, CAC, retention, forecast accuracy) without a named, dated source.
4. Worked examples in outputs are labelled illustrative.

## Output

`plans/finance/<slug>/aop.md`, `plans/finance/<slug>/mbr-<YYYY-MM>.md`, `plans/finance/<slug>/forecast.md`, `plans/finance/<slug>/marketing-budget.md` — whichever the request needs.

**Sensitive data:** no individual salaries by name, bank details or personal data in committed files. Aggregate headcount cost by department or role band.

## Before proceeding

1. Which deliverable — AOP, variance/MBR, re-forecast, or a spend decision?
2. Which closed period are actuals through, and from which system?
3. Who owns each department line?
4. What approval threshold triggers scenario analysis here?

Read `plans/marketing-context.md` if present (business model, pricing, channels, marketing goals) and skip what it answers. It is not required.

## Cross-references

- [[financial-model]] — three-statement model and investment cases built on the same drivers
- [[close-controls]] — closed actuals feed every variance
- [[pipeline-forecast]] — revenue driver from the sales pipeline
- [[tax-strategy]] — tax lines in the plan
- [[market-sizing]] — ceiling check for growth targets
- `.claude/workflows/marketing-rules.md` — no-hallucinated-metrics rule

## Provenance

Adapted from `msitarzewski/agency-agents` → `finance/finance-fpa-analyst.md` (MIT, © 2025 AgentLand Contributors). ClauKit adaptations: persona voice, planning-tool roster and self-scored success metrics (forecast-accuracy and delivery targets) removed; illustrative dollar/CAC figures from the communication examples removed; variance decomposition (timing vs permanent), marketing budget allocation section, anti-fabrication rules, sibling routing and `plans/finance/` output added.
