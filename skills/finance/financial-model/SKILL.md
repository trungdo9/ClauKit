---
name: financial-model
description: Financial modeling for a decision — integrated three-statement model (income statement, balance sheet, cash flow), base/upside/downside scenarios, sensitivity tables, unit economics, break-even, and DCF/comps valuation, with every assumption sourced and every forecast labelled. Use for "financial model", "3-statement model", "cash flow forecast", "runway", "scenario analysis", "sensitivity analysis", "unit economics", "CAC/LTV/payback", "break-even", "DCF", "valuation model", "should we make this investment", "model this decision". For the annual budget, budget-vs-actual and rolling forecast use fpa; for TAM/SAM/SOM use market-sizing; for equity research on another company use investment-research.
allowed-tools: Read, Write, Glob, Grep, WebSearch, WebFetch
---

# Financial Model

> A model is a set of assumptions with arithmetic attached. Ship the assumptions where a reader can see and challenge them — the formulas are the least interesting part.

## When this skill activates

**Implicit:** "build a model for…", "what's our runway", "model three scenarios", "is this investment worth it", "what happens to cash if growth slows", "what are our unit economics", "when do we break even", "value this business".
**Explicit:** "Use the financial-model skill to [task]."
**Routed from:** `/mk:finance model`.

## Scope

Covers:
- Integrated three-statement models (income statement → balance sheet → cash flow, dynamically linked).
- Revenue builds (top-down and bottom-up, cohort, pricing impact), cost builds (fixed/variable, step costs, operating leverage), working capital (DSO, DPO, inventory turns, cash conversion cycle), CapEx and depreciation, headcount cost.
- Scenario analysis (base / upside / downside, with the drivers that differ), sensitivity tables, tornado ranking of drivers.
- Unit economics (CAC, LTV, payback, contribution margin) and break-even.
- Valuation for a decision: DCF (WACC, terminal value method stated), trading and transaction comps.
- Decision memos that turn the model into a recommendation with trigger points.

Does NOT cover:
- Annual operating plan, department budgets, budget-vs-actual, monthly business review, rolling re-forecast → [[fpa]].
- Recording transactions, reconciliations, month-end close → [[close-controls]]. The model consumes closed actuals; it does not produce them.
- Tax structuring and effective-tax-rate analysis → [[tax-strategy]]. The model takes a tax rate as a sourced input.
- Researching an external company as an investment → [[investment-research]].
- Market size (a ceiling, not a forecast) → [[market-sizing]]. A TAM never substitutes for a revenue build.
- Sales pipeline coverage and forecast-by-deal → [[pipeline-forecast]], which is the best near-term revenue input this model can take.
- Marketing channel spend allocation and marginal CAC by channel → [[fpa]]. This skill owns the LTV / unit-economics model those allocations are judged against.

## Rules

1. **Assumptions before conclusions.** Every model opens with its assumptions table. A stakeholder who cannot see an assumption cannot challenge it.
2. **No single-point forecast.** Base, upside and downside, each defined by which drivers move and by how much.
3. **Separate facts from projections.** Historical actuals and forecasts never share a column unlabelled. Mark actuals `(A)` and estimates `(E)`.
4. **Validate inputs first.** Reconcile historical inputs to the trial balance or filed statements before modeling. Record data lineage — which system, which report, which date.
5. **Build for someone else.** Inputs, calculations and outputs separated; no hard-coded numbers inside formulas; error checks (balance sheet balances, cash ties) visible.
6. **Sensitivity-test the recommendation.** If the conclusion flips when one key assumption moves within its plausible range, say so: the recommendation is fragile, and that is the finding.
7. **No false precision.** A rough input cannot produce a precise output. Round to what the inputs support.
8. **Version every change.** Each model version gets a number, a date and a one-line change note. Never overwrite without a trail.

## Workflow

### Phase 1 — Purpose and data

1. State the decision the model supports, its audience, and its horizon. A runway model, an investment case and a board plan need different structures.
2. Gather actuals from the ledger or management accounts (e.g. QuickBooks, Xero, NetSuite exports). Reconcile to the trial balance or filed statements; log every discrepancy.
3. List missing inputs. Each one is either sourced, estimated with a stated method, or written `[NEEDS DATA]`.

### Phase 2 — Architecture and assumptions

1. Inputs sheet → calculation sheets → output sheets. One driver, one cell.
2. Document every assumption with source and confidence (high / medium / low).
3. Link the three statements: net income flows to retained earnings and to the cash flow; working capital changes come from the balance sheet; the cash flow's ending cash equals the balance sheet's cash. Add the checks.

### Phase 3 — Scenarios and sensitivity

1. Run base, upside, downside. Name the trigger that would move reality from base to each other case.
2. Sensitivity table on the two drivers that dominate the output (usually revenue growth and margin, or price and volume).
3. Rank drivers by impact (tornado). Report the output at the low and high plausible value of the top driver.
4. Stress-test: what breaks first — cash, a covenant, a hiring plan?

### Phase 4 — Decision support

1. Lead with the "so what": the decision, the recommended option, and the single assumption to monitor.
2. Present ranges, not points. State limitations and areas needing management judgment.

## Template — three-statement model summary

```markdown
# Financial Model: [Company / Project]
**Version**: [X.X]  **Author**: [Name]  **Date**: [Date]
**Purpose**: [Decision supported]  **Horizon**: [N years, monthly/annual]
**Currency / units**: [e.g. USD thousands]

## Key Assumptions
| Assumption | Base | Upside | Downside | Source | Confidence |
|---|---|---|---|---|---|
| Revenue growth | [ ] | [ ] | [ ] | [historical trend / pipeline / NEEDS DATA] | H/M/L |
| Gross margin | [ ] | [ ] | [ ] | [ ] | |
| OpEx as % of revenue | [ ] | [ ] | [ ] | [ ] | |
| CapEx as % of revenue | [ ] | [ ] | [ ] | [ ] | |
| Working capital days (DSO/DPO) | [ ] | [ ] | [ ] | [ ] | |
| Tax rate | [ ] | [ ] | [ ] | [cited — see tax-strategy] | |

## Income Statement Summary
| Line | Y1 | Y2 | Y3 | Y4 | Y5 |
|---|---|---|---|---|---|
| Revenue | | | | | |
| COGS | | | | | |
| Gross profit / margin % | | | | | |
| Operating expenses | | | | | |
| EBITDA / margin % | | | | | |
| D&A | | | | | |
| EBIT | | | | | |
| Net income | | | | | |

## Cash Flow Summary
| Line | Y1 | Y2 | Y3 | Y4 | Y5 |
|---|---|---|---|---|---|
| Net income | | | | | |
| D&A (add back) | | | | | |
| Change in working capital | | | | | |
| Operating cash flow | | | | | |
| CapEx | | | | | |
| Free cash flow | | | | | |
| Cumulative FCF / ending cash | | | | | |

## Checks
- [ ] Balance sheet balances every period
- [ ] Cash flow ending cash = balance sheet cash
- [ ] Historical columns tie to [trial balance / filed statements, date]

## Sensitivity — [output metric, e.g. Y3 FCF]
| | Growth −Δ | Base | Growth +Δ |
|---|---|---|---|
| Margin −Δ | | | |
| Base margin | | | |
| Margin +Δ | | | |
```

## Template — decision memo

```markdown
# Decision: [Option A vs Option B]
**Recommendation**: [Option] — [one sentence why]
**Key assumption to monitor**: [driver] — recommendation flips if it crosses [threshold]

| Metric | Option A | Option B |
|---|---|---|
| NPV / IRR / payback | | |
| Peak cash need | | |
| Downside-case outcome | | |

**Trigger points**: [observable events that would change the call]
**Limitations**: [what the model cannot see]
```

Unit economics and DCF build-outs follow the same rule set: CAC from fully loaded sales and marketing spend divided by new customers in the same period; LTV from gross-margin contribution and observed (not hoped-for) retention; DCF with the WACC inputs and terminal-value method stated, and the share of value in the terminal value reported.

## Anti-fabrication rules

1. Every input carries a source and date, or is `[NEEDS DATA]`. No "industry benchmark" without a named, dated source.
2. Never present an estimate as an actual. `(E)` on every forecast column, `[estimated]` on every modeled figure quoted in prose.
3. No invented growth rates, margins, multiples or discount rates. If a peer multiple or rate is used, cite where it came from and when.
4. Any worked example in an output is labelled illustrative and never reused as data.
5. Round to the precision the inputs support.

This operationalizes the no-hallucinated-metrics rule in `.claude/workflows/marketing-rules.md`.

## Output

`plans/finance/<slug>/model.md` (summary, assumptions, scenarios, sensitivity, checks) and, when a decision is asked for, `plans/finance/<slug>/decision-memo.md`. If a spreadsheet is produced, it sits beside them and the markdown records its version.

**Sensitive data:** no bank account numbers, card numbers, tax IDs, payroll by named individual or personal financial data in committed files. Aggregate or redact.

## Before proceeding

1. What decision does this model support, for whom, by when?
2. What actuals exist, from which system, through which closed period?
3. Horizon and granularity (monthly for runway, annual for strategy)?
4. Which drivers does management already believe dominate — and which do they dispute?

Read `plans/marketing-context.md` if present (business model, ICP, pricing, marketing spend) and skip what it answers. It is not required.

## Cross-references

- [[fpa]] — budget, variance and rolling forecast; shares the revenue and headcount drivers
- [[close-controls]] — source of the closed actuals this model starts from
- [[tax-strategy]] — sourced tax inputs and structure effects
- [[investment-research]] — valuation of an external company
- [[market-sizing]] — ceiling check on revenue assumptions
- [[pipeline-forecast]] — near-term revenue input from the sales pipeline
- `.claude/workflows/marketing-rules.md` — no-hallucinated-metrics rule

## Provenance

Adapted from `msitarzewski/agency-agents` → `finance/finance-financial-analyst.md` (MIT, © 2025 AgentLand Contributors). ClauKit adaptations: persona voice, tool roster and self-scored success metrics removed; variance-report template moved to [[fpa]] (its owner); illustrative dollar figures and unsourced accuracy targets removed; anti-fabrication rules, model checks, decision-memo template, sibling routing and `plans/finance/` output added.
