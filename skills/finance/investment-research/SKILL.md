---
name: investment-research
description: Investment research and due diligence on a company or asset — falsifiable thesis, bull and mandatory bear case, catalysts, thesis breakers, valuation shown (DCF scenarios, comps), financial/operational/market/legal DD checklist, red-flag log — every figure sourced and dated (filings first) or marked [NEEDS DATA]. Research, not personalized investment advice. Use for "investment research", "due diligence", "DD", "research this company", "investment thesis", "bull/bear case", "is this company a good investment", "evaluate this acquisition target", "value this company", "comps", "red flags in this business". For modeling your own company's decisions use financial-model; for market size use market-sizing; for competitor marketing teardowns use competitor-profiling.
allowed-tools: Read, Write, Glob, Grep, WebSearch, WebFetch
---

# Investment Research & Due Diligence

> The bull case is easy to write; the risk hides in the bear case. State the thesis, state what would break it, and source every number.

## When this skill activates

**Implicit:** "research [company] as an investment", "run DD on this target", "what's the bear case", "is this acquisition worth it", "value this private company", "what red flags should we look for".
**Explicit:** "Use the investment-research skill to [task]."
**Routed from:** `/mk:finance invest`.

## Guardrails (mandatory)

1. **Research, not personalized investment advice.** Every output opens with: *"Research for informational purposes. Not investment, legal or tax advice, and not a recommendation to buy, sell or hold any security for your account."*
2. **No buy / sell / hold directed at the user's own money**, no position sizing for their portfolio, no "you should invest". The output assesses the asset; the decision belongs to the reader and their licensed advisor. For corporate M&A or an investment committee, the output is an assessment with conditions, not an instruction.
3. **Every figure sourced and dated.** Primary sources first: regulatory filings (annual/quarterly reports, prospectuses, proxy statements), earnings transcripts, audited statements, official registries. Secondary sources labelled as such. Anything else is `[NEEDS DATA]`.
4. **Bear case is required** and gets at least the rigor of the bull case. An output without one is incomplete.
5. **No price target or implied value without a shown valuation** — the method, inputs, sources and scenario weights on the page.
6. **Separate fact, estimate and opinion.** Reported figures `(A)`, estimates `(E)`, judgments labelled as judgments.
7. **Do not use or solicit material non-public information.**

## Scope

Covers:
- Public-company and private-company research reports.
- Acquisition-target and investment due diligence (financial, operational, market, legal checklists).
- Thesis construction: core arguments, catalysts with timing, thesis breakers.
- Valuation: DCF scenarios, trading and transaction comps, sum-of-parts — shown, not asserted.
- Quality checks: revenue quality and concentration, earnings quality and cash conversion, balance-sheet and off-balance-sheet items, management incentives and capital-allocation record, governance.
- Monitoring plan for an existing thesis.

Does NOT cover:
- Personal portfolio construction, allocation or trade recommendations — out of scope.
- Building your own company's operating model → [[financial-model]].
- Market sizing as a standalone deliverable → [[market-sizing]] (this skill validates a target's TAM claim using it).
- Competitor marketing/positioning teardowns → [[competitor-profiling]].
- Tax structuring of a deal → [[tax-strategy]].

## Workflow

1. **Frame.** Asset, purpose (public-equity research, VC/PE DD, M&A target, credit), horizon, the 3–5 questions that decide the outcome.
2. **Primary sources.** Pull the last three years of filings or audited statements (or the data room for private targets) and earnings transcripts. Log each source with date.
3. **Business and moat.** How it makes money, unit economics, competitive position (switching costs, network effects, scale, brand), where the moat is thin.
4. **Quality checks.** Revenue: recurring vs one-time, customer concentration. Earnings: cash conversion, accruals, non-GAAP/adjusted-metric reconciliation. Balance sheet: debt covenants, contingent and off-balance-sheet items. Management: incentives, insider activity, related-party transactions.
5. **Valuation.** At least two methods, shown in full. Reconcile the gap; never average it away.
6. **Bull, bear, breakers.** Bull and bear cases with quantified drivers; thesis breakers as specific, observable thresholds.
7. **Write and set monitoring.** Report plus the list of breakers and catalysts to track, each with where the data will appear.

## Template — research report

```markdown
# Investment Research: [Company / Asset]
> Research for informational purposes. Not investment, legal or tax advice, and not a recommendation to buy, sell or hold any security for your account.

**Identifier**: [ticker / registry no. / private]  **Sector**: [ ]  **Size**: [market cap or last round — sourced, dated]
**Purpose**: [research / DD / M&A]  **Horizon**: [ ]  **Evidence quality**: High / Medium / Low  **Date**: [ ]

## Executive Summary
[Thesis in 3–4 sentences; what is mispriced or misunderstood; what would prove it wrong]

## Thesis
### Core Arguments
1. **[Driver]** — [quantified, sourced]
2. **[Driver]** — [quantified, sourced]

### Catalysts
| Catalyst | Expected timing | Effect on thesis | Likelihood | Source |
|---|---|---|---|---|

## Bear Case & Risks
1. **[Risk]** — [quantified impact, sourced] — mitigant: [ ]
2. **[Risk]** — [ ] — mitigant: [ ]

### Thesis Breakers
- If [metric] crosses [threshold] in [filing/period], the thesis is invalid
- If [event] occurs, reassess immediately

## Valuation (shown)
### DCF Scenarios
| Scenario | Revenue CAGR | Margin | Discount rate | Terminal method | Implied value | Weight |
|---|---|---|---|---|---|---|
| Bull | | | | | | |
| Base | | | | | | |
| Bear | | | | | | |
Inputs and sources: [each listed]  ·  Share of value in terminal: [ %]

### Comparables
| Peer | EV/Revenue | EV/EBITDA | P/E | Growth | Source, date |
|---|---|---|---|---|---|
| Peer median | | | | | |
| **Target** | | | | | |

### Reconciliation
[Why the methods differ; which is more credible here and why]

## Financial Summary
| Metric | FY-2 (A) | FY-1 (A) | FY0 (A) | FY+1 (E) | FY+2 (E) |
|---|---|---|---|---|---|
| Revenue / growth | | | | | |
| Gross / EBITDA / FCF margin | | | | | |
| Net debt / EBITDA | | | | | |
| ROIC | | | | | |

## Competitive Landscape
| Competitor | Share (sourced) | Advantage | Weakness |
|---|---|---|---|

## Sources
[Publisher · document · date · URL — one per line]
```

## Template — due diligence checklist

```markdown
# Due Diligence: [Company]
**Stage**: Initial / Intermediate / Final  **Date**: [ ]

## Financial
- [ ] Revenue quality — recurring vs one-time; top-customer concentration
- [ ] Earnings quality — cash conversion; accruals; adjusted-metric reconciliation
- [ ] Balance sheet — off-balance-sheet items, contingent liabilities, covenants
- [ ] Working capital trends and seasonality (DSO / DPO / DIO)
- [ ] Capital intensity — maintenance vs growth CapEx; ROIC trend
- [ ] Books quality — close discipline, reconciliations, audit history (see close-controls)

## Operational
- [ ] Customer references (n = [ ]) — satisfaction, switching likelihood, alternatives
- [ ] Supplier concentration and contract terms
- [ ] Technology — scalability, technical debt, real differentiation
- [ ] Management references (n = [ ]) — execution record, integrity

## Market
- [ ] TAM/SAM/SOM claim validated bottom-up (see market-sizing)
- [ ] Competitive position — durable advantage vs temporary lead
- [ ] Regulatory exposure — current compliance, pending rules

## Legal
- [ ] IP ownership and assignments
- [ ] Litigation — pending, settled, contingent
- [ ] Key contracts — change-of-control, exclusivity, termination
- [ ] Regulatory history — violations, consent orders

## Red Flags
| Finding | Severity | Impact | Required before proceeding |
|---|---|---|---|
```

Recurring red-flag patterns worth checking explicitly: revenue concentrated in few customers, accelerating churn, adjusted metrics diverging from reported ones, related-party transactions, founder/insider selling, auditor changes, late filings.

## Anti-fabrication rules

1. Every financial figure, multiple, share and growth rate has source and date, or `[NEEDS DATA]`.
2. No consensus estimates, price data or peer multiples from memory — retrieve and date them.
3. No invented customers, executives, lawsuits or events.
4. Estimates labelled `(E)`; scenario weights stated and justified.

## Output

`plans/finance/<slug>/research.md` and/or `plans/finance/<slug>/dd-checklist.md`.

**Sensitive data:** data-room material under NDA is summarized, not copied verbatim; no personal data of employees or customers in committed files.

## Before proceeding

1. Which asset, and is it public, private, or an acquisition target?
2. Purpose and horizon — research note, VC/PE diligence, corporate M&A, credit?
3. What sources are available — filings only, or a data room?
4. Who decides, and what decision?

Read `plans/marketing-context.md` if present (your own company and market — relevant for strategic fit in M&A) and skip what it answers. It is not required.

## Cross-references

- [[financial-model]] — build the target's model or the acquirer's pro-forma
- [[market-sizing]] — validate the target's market claims
- [[competitor-profiling]] — competitive landscape inputs
- [[close-controls]] — what clean books look like (financial DD baseline)
- [[tax-strategy]] — deal-structure tax issues for advisor review

## Provenance

Adapted from `msitarzewski/agency-agents` → `finance/finance-investment-researcher.md` (MIT, © 2025 AgentLand Contributors). ClauKit adaptations: persona voice, data-vendor roster and self-scored success metrics (return and accuracy percentages) removed; Buy/Hold/Sell rating and price-target header replaced by an evidence-quality field plus mandatory not-advice disclaimer; illustrative return/churn figures removed; shown-valuation and primary-source rules, MNPI rule, sibling routing and `plans/finance/` output added.
