---
name: account-expansion
description: Post-sale account growth — land-and-expand plans, living stakeholder maps, account health scoring, forward-looking QBRs, mutual action plans, and churn-save playbooks, all optimized for net revenue retention rather than bookings. Use for "account plan", "expansion plan", "upsell", "cross-sell", "land and expand", "QBR", "quarterly business review", "stakeholder map", "multi-thread the account", "NRR", "net revenue retention", "churn risk on an account", "save plan", "renewal strategy". For new-logo deal qualification use deal-strategy; for opportunity pipeline and forecast use pipeline-forecast; for lifecycle email nurture use email-sequence.
allowed-tools: Read, Write, Glob, Grep
---

# Account Expansion — Land, Expand, Retain

> The best time to sell more is when the customer is winning with what they already bought — and the worst time is any other time.

## When this skill activates

**Implicit:** "how do we grow this account", "prep the QBR", "map the stakeholders", "we're single-threaded", "renewal is in 90 days", "usage is dropping", "where's the whitespace", "build a save plan".
**Explicit:** "Use the account-expansion skill to [task]."
**Routed from:** `/mk:sales account`, `.claude/workflows/sales-workflow.md` Phase 5 (Retain).

## Scope

Covers:
- Account expansion plans: footprint, whitespace, opportunities with trigger signal + business case.
- Stakeholder mapping and multi-threading across organizational levels.
- Account health scoring and the play each health band permits.
- QBR design as a forward-looking planning session, ending in a mutual action plan.
- Churn early-warning signals and save playbooks.
- RACI for expansion motions across AE, CS, product, and leadership.

Does NOT cover:
- New-logo qualification and competitive win planning → [[deal-strategy]].
- Portfolio-level pipeline math and forecast categories → [[pipeline-forecast]].
- Writing the expansion proposal document itself → [[proposal]].
- Lifecycle/onboarding email flows → [[email-sequence]], [[user-onboarding]]; lead scoring and lifecycle stages → the `crm-specialist` agent.
- Pricing and packaging redesign → [[product-marketing]] and the pricing work in [[cro]] / `paywalls`.

## Core rules

1. **Signal + context + timing + stakeholder, or it is not an opportunity.** A usage spike is an observation. It becomes an opportunity only when you can say why it is happening, why now, and who on the customer side cares.
2. **Never run an expansion play on an unhealthy account.** Selling more into an account that is not yet succeeding accelerates churn. Fix value first.
3. **Readiness is not intent.** "They could buy more" (readiness) converts far less reliably than "they want to buy more" (intent). Qualify for intent.
4. **NRR over bookings.** Net revenue retention captures expansion, contraction, and churn in one number. A big upsell that triggers a downgrade next year is a loss.
5. **The business case is written from the customer's chair.** "Cuts manual reporting time for the ops team" — not "grows our ARR".
6. **No surprise asks.** If the customer is surprised by the expansion conversation, the groundwork was not done.
7. **Candor about limitations.** Overselling buys one deal and costs the relationship.

## Health bands → permitted plays

| Band | Meaning | Permitted play | Forbidden |
|---|---|---|---|
| **Green** | Adoption healthy, sponsor engaged, sentiment positive | Expansion: upsell, cross-sell, new department | — |
| **Yellow** | One or two warning signals | Stabilization: re-onboarding, value review, sponsor re-engagement | Expansion asks |
| **Red** | Multiple signals or champion lost | Save: executive involvement, remediation plan, contract review | Any commercial ask beyond renewal |

Health score inputs (weight them for your business; the weights are an assumption to state, not a fact): product usage vs. entitlement, core-feature adoption, support sentiment and escalation pattern, stakeholder engagement recency, executive sponsor activity, contract timeline.

**Intervene at the signal, not the symptom.** Leading churn indicators: declining active usage, sponsor departure or role change, champion loss, rising escalations, silence from the economic buyer.

## Stakeholder mapping and multi-threading

- Maintain a **living** map: decision-makers, budget holders, influencers, end users, champions, **detractors**. People get promoted, leave, lose budget — a stale map is a dangerous map.
- **Multiple independent threads per account**, across more than one organizational level (the target count is the user's call, set by account size). If the champion leaves tomorrow, active conversations must remain.
- Map informal influence, not just the org chart. The budget holder is not always the opinion that matters most.
- Track detractors as carefully as champions — an unknown detractor kills expansion at the last mile.
- Use the QBR to validate the map: who attended, who should have and did not, who is new.

## Expansion motion

1. **Account intelligence** — baseline usage and health; current footprint vs. whitespace; the customer objectives the product supports and the ones it does not yet touch; who else inside the account holds adjacent budget.
2. **Relationship development** — multi-thread across levels; arm champions with an internal business case, ROI evidence, and peer references so they can sell when you are not in the room; neutralize detractors by resolving their actual problem.
3. **Qualify the expansion** — signal + timing + stakeholder + business case. Align AE, CS, and product on the play *before* engaging the customer.
4. **Execute like a new deal** — mutual evaluation plan, explicit decision criteria, dated next steps. Expansion is not a formality; the paper process still applies (see [[deal-strategy]]).
5. **Measure and learn** — account- and portfolio-level NRR monthly; a short retrospective after each expansion (what the customer needed to hear, where it nearly stalled).

Common segment patterns (heuristic, verify against your own history): enterprise expands through executive alignment, mid-market through champion enablement, SMB through usage triggers.

## QBR — forward-looking, not a status report

Agenda (adjust to length; the proportions matter more than the minutes):

1. **Value delivered** — quantified outcomes from the customer's own data. Measured numbers only; anything modeled is labelled `[estimated]`.
2. **Their roadmap** — where the business is going over the next two quarters, what challenges are ahead. Customer talks most here.
3. **Alignment** — how the product evolves with *their* priorities.
4. **Mutual action plan** — commitments from both sides, owners, dates.

Questions that surface expansion without pitching:
- "What are the top three business priorities for the next two quarters?"
- "Where is the team spending time on manual work that should not need a person?"
- "Who else in the organization is trying to solve a similar problem?"
- "What would make you confident enough to extend this to another team?"

## Deliverable templates

### Account expansion plan

```markdown
# Account Expansion Plan: <account-slug>

## Overview
- Current ARR: [value + currency] · Renewal: [date + terms]
- Health: [Green/Yellow/Red] — rationale: [signals]
- Footprint: [products/modules deployed] · Whitespace: [not yet adopted]

## Stakeholder map (roles, not names, in committed files)
| Role ID | Function / level | Role in deal | Influence | Sentiment | Last contact |
|---|---|---|---|---|---|
| S1 | [e.g. VP Ops] | Champion | High | Positive | [date] |
| S2 | [e.g. CFO office] | Economic buyer | High | Neutral | [date] |
| S3 | [e.g. team lead] | Detractor | Medium | Negative | [date] |
Threads active: [N] across [N] levels (target: [user-set])

## Expansion opportunities
| Opportunity | Trigger signal | Customer business case | Why now | Owner | Stage |
|---|---|---|---|---|---|

## RACI
| Activity | Responsible | Accountable | Consulted | Informed |
|---|---|---|---|---|
| Champion enablement | | | | |
| Usage monitoring | | | | |
| QBR facilitation | | | | |
| Contract negotiation | | | | |

## Mutual action plan
| Action | Owner (us) | Owner (customer) | Due | Status |
|---|---|---|---|---|
```

### QBR prep

```markdown
# QBR Prep: <account-slug> — <quarter>
- Usage trend: [metrics, adoption curve, capacity vs. entitlement]
- Support history: [volume, sentiment, escalation themes]
- Value delivered: [measured outcomes + source] / [NEEDS DATA]
- Customer context: [market pressures, strategic shifts — cited]
- Attending / missing / new faces: [roles]
- Expansion hypothesis to test: [one sentence, falsifiable]
```

### Churn save plan

```markdown
# Save Plan: <account-slug>
| Signal | Current | Threshold (yours) | Severity |
|---|---|---|---|
| Active users | | | |
| Core-feature adoption | | | |
| Sponsor last engaged | | | |
| Support sentiment | | | |
| Champion status | Active / at risk / departed | | |

- This week: [stabilizing actions]
- 30 days: [rebuild engagement, demonstrate value]
- 90 days: [re-establish strategic alignment]
- Revenue at risk: [value] · Save difficulty: [L/M/H] · Investment to save: [hours, exec time]
- Churn likelihood: [qualitative band + evidence] — no invented percentage
```

Thresholds are the user's to set from their own history; leave `[NEEDS DATA]` rather than importing a generic benchmark.

## Guardrails

- **No invented metrics** (`.claude/workflows/marketing-rules.md` §2). ROI figures in a QBR come from the customer's measured data or are labelled `[estimated]` with the assumption shown. A fabricated ROI number in front of an economic buyer is a relationship-ending event.
- **No invented health thresholds or NRR targets.** Ask for the user's own baselines; otherwise mark `[NEEDS DATA]`.
- **PII stays out of the repo** (`.claude/workflows/automation-rules.md` §4). Stakeholder maps in committed files use role IDs and functions; real names live in the CRM.
- **Falsifiable expansion thesis** — state what observation would show the opportunity is not real (e.g. "if the second team has no budget line for this before renewal, drop to nurture").

## Output

`plans/sales/<account-slug>/` —
- `account-plan.md` (expansion plan + RACI + MAP)
- `qbr-<quarter>.md` (prep + post-QBR action plan)
- `save-plan.md` when health is Red

## Before proceeding

1. Which account, current ARR, renewal date, and what is deployed?
2. What usage, support, and engagement data exists — and from which system?
3. Who are the known stakeholders (by role), and how many threads are active?
4. Is the ask expansion, a QBR, or a save? (Health band decides which is allowed.)

Read `plans/marketing-context.md` if present for positioning and product lines; skip what it already answers.

## Cross-references

- [[deal-strategy]] — qualification rigor for the expansion deal itself (MEDDPICC, paper process)
- [[pipeline-forecast]] — expansion pipeline in the portfolio forecast
- [[proposal]] — the expansion proposal document
- [[customer-research]] — interview the account's users when the value story is unclear
- [[email-sequence]], [[user-onboarding]] — re-onboarding and adoption flows for Yellow accounts
- `crm-specialist` agent — lifecycle stages and retention flows across the base
- `.claude/workflows/sales-workflow.md` — Phase 5 (Retain)
- `.claude/workflows/marketing-rules.md`, `.claude/workflows/automation-rules.md` — metrics and PII rules

## Provenance

Adapted from `msitarzewski/agency-agents` → `sales/sales-account-strategist.md` (MIT, © 2025 AgentLand Contributors). ClauKit adaptations: persona voice converted to skill format; health-band → permitted-play table and falsifiable thesis added; stakeholder templates switched to role IDs (PII rule); unsourced targets removed (NRR > 120%, 3x expansion coverage, 80% license-consumption trigger, 50% adoption / 60-day / 3.5-sentiment thresholds, "90 days before renewal") — thresholds are now user-supplied or `[NEEDS DATA]`; outputs routed to `plans/sales/`.
