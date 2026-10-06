---
name: proposal
description: Proposal and RFP response strategy — win themes (buyer need → differentiator → proof), three-act proposal narrative, one-page executive summary, win-theme integration map, compliance matrix with strategic overlay, value-before-price rationale, and black-hat / color-team reviews. Use for "write the proposal", "respond to this RFP", "RFP response", "win themes", "executive summary for the bid", "proposal outline", "tender response", "SOW narrative", "why are we losing bids", "review this proposal draft". For qualifying whether to bid use deal-strategy; for technical approach detail use sales-engineering; for line-level copy polish use copywriting.
allowed-tools: Read, Write, Glob, Grep
---

# Proposal

> A proposal is a persuasion document, not a compliance exercise. When capabilities converge, the clearer argument wins — and a proposal that would still read correctly with another buyer's name swapped in is already losing.

## When this skill activates

**Implicit:** an RFP/RFI/tender lands, a proposal or SOW narrative is due, an executive summary needs writing or rescuing, a draft needs a strategy review, a team keeps losing formal bids.
**Explicit:** "Use the proposal skill to [task]."
**Routed from:** `/mk:sales proposal`, and `.claude/workflows/sales-workflow.md` Phase 4 (Convert).

## Scope

Covers:
- Opportunity analysis: explicit requirements, implicit preferences, evaluation weighting.
- Win themes: drafting, stress-testing, mapping to sections.
- Narrative architecture (three acts), executive summary, pricing rationale as value narrative.
- Compliance matrix with a strategic overlay.
- Review gates: black-hat (simulate competitors), color-team reviews.
- Reusable content library organised by win theme.

Does NOT cover:
- Bid / no-bid and deal qualification → [[deal-strategy]] (run it first; a well-written proposal for an unqualified deal is wasted effort).
- Technical architecture, demo, POC content → [[sales-engineering]] (its evaluation notes feed the technical approach section).
- Sentence-level copy craft → [[copywriting]] / [[copy-editing]].
- Pricing *strategy* (what to charge) → [[product-marketing]] / `paywalls`; offer framing (bonuses, guarantees, risk reversal) → [[offer-design]]. This skill presents the price, it does not set it.
- Legal terms and contract drafting — flag to counsel.

## Win themes

Three to five per proposal. Not slogans — the argument's backbone, woven through every section.

A strong win theme:
- names **this buyer's** challenge, not an industry generality;
- connects a concrete capability to a measurable outcome;
- differentiates without naming a competitor;
- is provable — case study, metric, methodology, named framework.

| | Example shape |
|---|---|
| **Weak** | "We have deep experience in digital transformation." |
| **Strong** | "Our migration approach stages critical workloads in parallel to cut cutover risk — the approach used on [cited comparable engagement, with its measured result]." |

**Stress test each theme:** specific to this buyer? Provable with evidence we hold? Differentiating? Could a competitor claim it just as easily? Fail any → rewrite or drop.

Themes must appear in the executive summary, the solution narrative, case studies, and the pricing rationale. An isolated theme is an invisible theme.

## Three-act narrative

- **Act I — Understanding the challenge.** Show you understand their world better than they expected: their language, constraints, stakes. Trust is built here; losing proposals skip it or fill it with boilerplate.
- **Act II — The solution journey.** Each capability answers a challenge raised in Act I. Methodology as a sequence of decisions, not a wall of process diagrams. Themes do their heaviest work here.
- **Act III — The transformed state.** A specific future: outcomes, milestones, risk reduction — each one sourced or framed as a projection with stated assumptions. The evaluator should finish thinking about implementation, not evaluation.

## Executive summary

The proposal's closing argument, placed first; write it assuming a senior evaluator reads only this. One page.

1. **Mirror the situation** in the buyer's own language (2–3 sentences that prove you listened).
2. **Central tension** — the cost of inaction or the opportunity at risk.
3. **Thesis** — how your approach resolves it; win themes surface here.
4. **Proof** — one or two concrete, cited evidence points.
5. **Transformed state** — the specific outcome they can expect, tied to their stated goals.

Write it **first** — it forces the argument to be clear before details proliferate.

## Rules

- **Never generic.** If the buyer's name, challenges, and context could be swapped without changing the content, rewrite.
- **Compliance is the floor, not the ceiling.** Answer every requirement completely, then add the strategic context that reinforces a theme.
- **No competitor criticism.** Create contrast through your strengths; evaluators notice negative positioning.
- **Value before price.** Quantify the problem and the value of solving it before the reader reaches a number; anchor on outcomes delivered, not cost incurred.
- **No empty adjectives.** "Robust", "cutting-edge", "best-in-class", "world-class" are noise — replace with specifics.
- **Every claim carries evidence** — metric with source, case study reference, methodology detail, or named framework.
- **Micro-stories** — 2–4 sentence real examples in section intros or sidebars make technical content memorable. Real ones only, with client permission or anonymised.
- **Visuals argue.** Every diagram has a takeaway a skimmer absorbs in seconds.

## Workflow

1. **Opportunity analysis** — deconstruct the RFP: explicit requirements, implicit preferences, evaluation criteria and weights; research the buyer's public priorities and vocabulary; map likely bidders and their predictable positioning.
2. **Win themes** — draft 3–5, stress-test, select, map to sections.
3. **Architecture** — three-act flow across sections; exec summary first; place micro-stories, case studies, proof points; build the pricing rationale as a value narrative.
4. **Draft** — themes integrated, not appended. Every paragraph passes: "does this advance our argument or just fill space?"
5. **Review gates** —
   - **Black-hat review:** write each likely competitor's best proposal outline; close the gaps it exposes.
   - **Color-team reviews:** Pink (storyline and themes, before full drafting) · Red (full draft scored as an evaluator would, against the RFP criteria) · Gold (final executive sign-off: price, commitments, risk).
   - **Compliance pass:** every requirement mapped to a section, nothing unanswered.
6. **Debrief** — after the decision (win or lose), request evaluator feedback and feed it back into the theme library.

## Guardrails

- **No invented proof.** Uptime figures, efficiency gains, customer outcomes, and team credentials are cited (case study, contract-approved reference, published report) or marked `[NEEDS DATA]` — never improvised to fill a template. If a claim is a projection, label it as one and state its assumptions. `.claude/workflows/marketing-rules.md` no-hallucinated-metrics.
- **Client confidentiality.** Named references require permission; otherwise anonymise ("a regional insurer"). Never reuse another client's confidential details.
- **Commitments are real.** Timelines, SLAs, and staffing named in the proposal must be approved by whoever delivers them — flag every commitment for Gold review.
- **PII.** Buyer contacts by role in committed files; full contact data stays in the CRM — `.claude/workflows/automation-rules.md` R4.

## Output

In `plans/sales/<deal-slug>/proposal/`:
- `win-themes.md` — theme matrix + competitive positioning table.
- `architecture.md` — narrative flow, theme integration map, compliance matrix with strategic overlay.
- `executive-summary.md` — one page.
- `review-log.md` — black-hat findings, Pink/Red/Gold outcomes, open commitments.

Templates: [references/templates.md](references/templates.md).

## Before proceeding

1. Is there an RFP/tender document? Its evaluation criteria and weights, deadline, mandatory format?
2. Has the deal been qualified (bid / no-bid)? If not → [[deal-strategy]].
3. What evidence do we hold — case studies, references with permission, certifications, team bios?
4. Who are the likely competitors and the incumbent?
5. Who must approve price and delivery commitments?

Read `plans/marketing-context.md` if present — positioning, differentiators, and brand voice. Skip what it already answers.

## Cross-references

- [[deal-strategy]] — qualification and competitive zones the themes build on
- [[sales-engineering]] — technical approach content and proof
- [[discovery]] — buyer language and quantified pain for Act I
- [[copywriting]] / [[copy-editing]] — sentence-level polish
- [[offer-design]] — offer framing (guarantee, risk reversal) the proposal presents; price itself → [[product-marketing]]
- `.claude/workflows/sales-workflow.md` — Phase 4 (Convert)

## Provenance

Adapted from `msitarzewski/agency-agents` → `sales/sales-proposal-strategist.md` (MIT, © 2025 AgentLand Contributors). ClauKit adaptations: persona converted to skill format; unsourced claims removed (example "99.97% uptime" figure replaced with a cited-engagement placeholder; "measurably higher evaluation scores" for micro-stories dropped; "Success Metrics" list dropped); color-team reviews defined (Pink/Red/Gold) instead of name-checked; confidentiality, commitment-approval, PII and anti-fabrication guardrails added; templates moved to `references/`; routed via `/mk:sales proposal`.
