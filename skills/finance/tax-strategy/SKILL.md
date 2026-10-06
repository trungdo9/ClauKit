---
name: tax-strategy
description: Tax planning research — structured tax planning memos (facts, issues, cited law, analysis, position strength, risks), entity-structure and transaction tax implications, effective-tax-rate waterfall, multi-jurisdiction nexus and filing-obligation mapping, transfer-pricing documentation outline — for review by a licensed tax advisor, never as final advice. Every position names jurisdiction, tax year and cited authority, or is marked [NEEDS DATA]. Use for "tax planning", "tax implications of", "entity structure", "which entity type", "tax memo", "effective tax rate", "nexus", "where do we have to file", "transfer pricing", "R&D credit", "VAT/GST on cross-border sales", "asset vs stock deal tax". For bookkeeping and tax-liability reconciliation use close-controls; for the tax line inside a model use financial-model.
allowed-tools: Read, Write, Glob, Grep, WebSearch, WebFetch
---

# Tax Strategy

> Compliance is the floor. Every planning position is legal, documented, and defensible under audit — and every rate, threshold and deadline is retrieved and dated, never remembered.

## When this skill activates

**Implicit:** "what are the tax implications of…", "should we be an LLC or a corporation", "do we owe sales tax in that state/country", "can we claim the R&D credit", "why is our effective tax rate so high", "structure this acquisition", "do we need transfer pricing documentation".
**Explicit:** "Use the tax-strategy skill to [task]."
**Routed from:** `/mk:finance tax`.

## Guardrails (mandatory — read before anything else)

1. **Not professional tax advice.** Every output opens with: *"Research memo for review by a licensed tax advisor in [jurisdiction]. Not tax, legal or accounting advice. Do not file or act on it without that review."* The output is a memo that makes the advisor's review faster, not a substitute for it.
2. **Every position names jurisdiction + tax year + cited authority.** Authority means statute, regulation, official guidance, ruling or case, with its citation. A position without all three is written `[NEEDS DATA]`, not stated.
3. **Never state a rate, threshold, limit or deadline from memory.** Tax law changes yearly. Retrieve it from the tax authority's own site or the statute (WebSearch / WebFetch), record the URL and the retrieval date, or write `[NEEDS DATA]`. This applies to "well-known" figures too — a headline corporate rate, a filing deadline, an election window.
4. **Legal planning only.** No concealment, no structures without economic substance, no sham transactions, no positions you would not disclose to the authority, no advice on evading reporting obligations. If a request reads as evasion, decline that part and say why; offer the compliant alternative.
5. **Quantify uncertainty.** Uncertain positions carry their authority level (e.g. in the US: substantial authority / more likely than not / reasonable basis) and exposure including penalties and interest — the advisor confirms the standard for the jurisdiction.
6. **Multi-jurisdiction view.** A saving in one jurisdiction that creates exposure in another is a shift, not a saving. Map all touched jurisdictions.
7. **Cash flow over cleverness.** A deferral that creates a liquidity problem is a bad plan.

## Scope

Covers:
- Tax planning memos with authority analysis and position-strength assessment.
- Entity structure comparison (corporate vs pass-through vs partnership and local equivalents) and holding structures — as implications to discuss, not a selection.
- Transaction tax implications (asset vs share deal, reorganizations) at issue-spotting level.
- Effective tax rate waterfall and optimization-opportunity list.
- Nexus / permanent-establishment and filing-obligation mapping across jurisdictions; indirect tax (sales/use, VAT/GST) exposure.
- Credits and incentives to investigate (e.g. R&D), with eligibility questions.
- Transfer pricing: intercompany flow map and documentation outline; arm's-length method to discuss with the advisor.
- Equity compensation tax events to flag (grants, elections, exercises) with their time-critical deadlines retrieved and dated.

Does NOT cover:
- Preparing or filing returns. Out of scope — licensed preparer.
- Tax accruals and liability reconciliation in the books → [[close-controls]].
- The tax rate input to a forecast → [[financial-model]] (takes this skill's sourced rate).
- Personal tax advice on an individual's own situation beyond issue-spotting — refer to an advisor.
- Investment selection → [[investment-research]].

## Workflow

1. **Facts.** Entities, ownership, jurisdictions of incorporation/operation/customers/employees, revenue streams, intercompany flows, historical filings, open elections, loss carryforwards. Missing facts listed.
2. **Issues.** Each tax question stated precisely, one per line.
3. **Law.** For each issue: retrieve the governing authority for the named jurisdiction and year. Record citation, URL, retrieval date.
4. **Analysis.** Apply law to facts. State the position, its authority level, and the counter-argument.
5. **Options.** Compare alternatives on after-tax outcome, cash timing, compliance burden, and risk. Savings quantified only from sourced rates and the client's own figures; otherwise `[NEEDS DATA]`.
6. **Risks and documentation.** What an authority would challenge, the exposure, and the contemporaneous documentation that defends it.
7. **Advisor handoff.** Open questions for the licensed advisor, ranked by exposure.

## Template — tax planning memo

```markdown
# Tax Planning Memo — [Subject]
> Research memo for review by a licensed tax advisor in [jurisdiction(s)]. Not tax, legal or accounting advice. Do not file or act on it without that review.

**Entity**: [Name / role]  **Jurisdiction(s)**: [ ]  **Tax year(s)**: [ ]  **Date**: [ ]

## 1. Facts & Background
[Entities, ownership, operations, transactions — facts only; unknowns listed]

## 2. Issues Presented
1. [Precise question]
2. [Precise question]

## 3. Applicable Law
| Issue | Jurisdiction | Year | Authority (citation) | Source URL | Retrieved |
|---|---|---|---|---|---|
| 1 | | | | | |

## 4. Analysis
[Per issue: law applied to facts; position; counter-argument]

### Position Strength
| Position | Jurisdiction / year | Authority level | Risk | Exposure (tax + penalty + interest) |
|---|---|---|---|---|

## 5. Options & Recommendation for Advisor Review
| Option | After-tax effect | Cash timing | Compliance burden | Risk |
|---|---|---|---|---|
**Implementation steps (if approved by advisor)**: [step · owner · deadline (retrieved, dated)]

## 6. Risks & Mitigation
| Risk | Probability | Impact | Mitigation (documentation / disclosure / alternative) |
|---|---|---|---|

## 7. Documentation Required
- [ ] [Contemporaneous support needed]

## 8. Questions for the Advisor
1. [Ranked by exposure]
```

## Template — effective tax rate analysis

```markdown
# Effective Tax Rate Analysis — [Entity] [Year]
> Research memo for advisor review. Not tax advice.

| Component | Amount | Rate | Source |
|---|---|---|---|
| Pre-tax income | | — | [closed books, period] |
| Statutory tax at [jurisdiction] rate | | [retrieved rate] | [authority URL, retrieved date] |
| Sub-national taxes | | | |
| Foreign rate differential | | | |
| Credits | | | |
| Permanent differences | | | |
| **Total provision / ETR** | | | |

## Year-over-Year Bridge
| Component | Prior ETR | Current ETR | Change | Driver |
|---|---|---|---|---|

## Opportunities to Investigate
| Opportunity | Eligibility questions | Estimated effect ([NEEDS DATA] until sourced) | Effort | Owner |
|---|---|---|---|---|
```

## Anti-fabrication rules

1. No rate, threshold, deadline, form number or citation without a retrieved source and date. Remembered tax figures are treated as wrong until retrieved.
2. No savings estimate built from an unsourced rate.
3. No invented case names, ruling numbers or code sections. If the authority cannot be found, the position is `[NEEDS DATA]`.
4. Jurisdiction and year on every figure.

## Output

`plans/finance/<slug>/tax-memo.md`, `plans/finance/<slug>/etr-<year>.md`, `plans/finance/<slug>/nexus-map.md`.

**Sensitive data — strict:** never write tax IDs, social security / national ID numbers, bank details, individual income figures by name, or copies of returns into committed files. Refer to entities and individuals by role.

## Before proceeding

1. Which jurisdiction(s) and which tax year(s)?
2. Entity facts: type, ownership, where incorporated, where it has people, customers, assets?
3. Is a licensed advisor engaged, and what decision or deadline is driving this?
4. Risk appetite — conservative or willing to take documented uncertain positions?

Read `plans/marketing-context.md` if present (company, business model, markets) and skip what it answers. It is not required.

## Cross-references

- [[close-controls]] — tax accruals and liability reconciliations in the books
- [[financial-model]] — consumes the sourced tax rate; models after-tax outcomes of options
- [[fpa]] — tax lines in the plan and forecast
- [[investment-research]] — tax diligence items in a transaction

## Provenance

Adapted from `msitarzewski/agency-agents` → `finance/finance-tax-strategist.md` (MIT, © 2025 AgentLand Contributors). ClauKit adaptations: persona voice, tool roster and self-scored success metrics removed; hard-coded statutory rate and illustrative savings/deadline figures removed (rule: retrieve and date, never recall); US-only form and code-section catalogue generalized to any named jurisdiction; mandatory not-advice disclaimer, advisor-review handoff, legal-planning-only rule, sensitive-data rule, sibling routing and `plans/finance/` output added.
