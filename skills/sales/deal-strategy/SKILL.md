---
name: deal-strategy
description: Deal-level qualification and win planning for complex B2B sales — MEDDPICC scoring with evidence per element, winning/battling/losing zones per competitor, landmine questions, Challenger commercial teaching, Command-of-the-Message value framing, deal inspection questions, pre-meeting deal prep, and blameless loss debriefs. Use for "qualify this deal", "MEDDPICC", "is this deal real", "deal review", "win plan", "competitive battlecard", "how do we beat <competitor> in this deal", "prep me for the exec meeting", "why did we lose", "happy ears". For portfolio-level pipeline health and forecast roll-up use pipeline-forecast; for running the discovery call itself use discovery; for the written RFP response use proposal.
allowed-tools: Read, Write, Glob, Grep
---

# Deal Strategy

> A deal you cannot score on evidence is a deal you do not understand. The loss is usually locked in at qualification; you just have not found out yet.

## When this skill activates

**Implicit:** "is this deal going to close", "score this opportunity", "we're up against <competitor>", "build a win plan", "prep the EB meeting", "the champion went quiet", "debrief the loss", "review my top deals".
**Explicit:** "Use the deal-strategy skill to [task]."
**Routed from:** `/mk:sales deal`, and `.claude/workflows/sales-workflow.md` Phase 2 (Qualify) for opportunities past lead stage.

## Scope

Covers:
- One opportunity at a time: MEDDPICC assessment, verdict, gap-closing actions with owner and date.
- Competitive positioning inside a live deal: zones, landmines, trap handling, battlecards.
- Value framing (Challenger teaching sequence, Command of the Message pillars).
- Deal-level coaching: inspection questions, pre-meeting deal prep, blameless loss debrief.

Does NOT cover:
- Pipeline coverage, velocity, stage conversion, forecast categories and roll-up, rep coaching cadence → [[pipeline-forecast]].
- Running the discovery conversation, question design, call structure, objection handling → [[discovery]].
- Technical evaluation, demo, POC, technical battlecards → [[sales-engineering]].
- RFP response and proposal narrative → [[proposal]].
- Post-sale expansion → [[account-expansion]].
- Market-level competitor teardowns (not tied to one deal) → [[competitor-profiling]] / [[competitors]].

## MEDDPICC — scored on evidence

Score each element 0–5. **The score is worth what its evidence column is worth** — "the rep thinks so" is a 1 at most.

| Element | Question it answers | Evidence that earns a 4–5 | Common false positive |
|---|---|---|---|
| **Metrics** | What quantified business outcome does the buyer need? | Buyer stated a number and a baseline, in their words ("onboarding from 14 days to 3") | A feature request ("better reporting") |
| **Economic Buyer** | Who can spend the money when everyone else says no? | Direct conversation with the person who can reallocate budget | The PO signer; a title match |
| **Decision Criteria** | What will they evaluate against? | Written criteria / eval matrix shared with you | Criteria you guessed |
| **Decision Process** | What steps from shortlist to signature, who at each, by when? | Every step mapped with names and dates | "They'll decide next month" |
| **Paper Process** | Legal, procurement, security review, DPA, vendor risk | Steps known, owners named, started in parallel | Not discussed — the classic quarter-killer |
| **Identify Pain** | What does the status quo cost? | Cost of inaction quantified by the buyer | "They want to modernise" |
| **Champion** | Who sells for you when you are not in the room? | Has power + access + personal stake, **and passed a hard ask** | A friendly contact who takes calls (that is a coach) |
| **Competition** | Who else, including build-it-ourselves and do-nothing? | Named alternatives, their positioning in this deal | "No competition" — there is always do-nothing |

Element tests worth running every time:
- **EB test** — can this person move budget from another initiative to fund this? If not, keep looking.
- **Champion test** — ask them to do something hard (broker the EB meeting, share the eval matrix). Refusal downgrades them to coach.
- **Pain test** — can the buyer state the cost of doing nothing? If not, there is no urgency and the deal will stall.
- **Paper test** — "Has legal reviewed agreements like ours before? What does security review look like?" A long procurement cycle discovered late kills the quarter.

**Verdict bands** (on the 0–40 total, but read the gaps, not the sum): a single 0–1 on EB, Pain, or Paper Process is a stop-and-fix regardless of total. Verdicts: **WINNING** · **BATTLING** (winnable if named gaps close by a date) · **LOSING** · **QUALIFY OUT**.

## Competitive positioning inside a deal

### Winning / battling / losing zones
For each competitor in the deal, sort the buyer's evaluation criteria:

- **Winning zone** — your differentiation is clear and the buyer values it. Amplify; work to have it weighted heavier.
- **Battling zone** — both are credible. Shift to adjacent factors where you can separate: implementation speed, total cost of ownership, ecosystem fit.
- **Losing zone** — the competitor is genuinely stronger. Do not attack and do not overclaim. Reposition: "They're strong at X. For your situation, Y matters more at scale because…" (claim what other customers found only with a real, citable reference) The move is to shrink the criterion's weight, never to misstate your capability.

### Landmine questions
Legitimate business questions, asked during discovery, that surface requirements where you are strongest. Example shape: if you consolidate multi-entity data natively and the competitor needs middleware — "How are you handling consolidation across subsidiaries today? What breaks when you add an entity?" A landmine that feels planted backfires; ask it because the answer genuinely shapes the solution.

### Battlecard
Template in [references/templates.md](references/templates.md) § Battlecard. Encounter rate and win rate fields come from your CRM, not from memory — `[NEEDS DATA]` if unknown.

## Value framing

### Challenger commercial teaching (six steps)
1. **Warmer** — show you understand their world; pattern recognition, not flattery.
2. **Reframe** — an insight that challenges a current assumption.
3. **Rational drowning** — quantify the status quo's cost with *the buyer's own numbers* plus cited benchmarks.
4. **Emotional impact** — who feels this daily; what is at stake for the owner of the number.
5. **A new way** — the approach that solves it, before your product.
6. **Your solution** — the product as the conclusion of steps 1–5, not a pitch.

### Command of the Message — three pillars
- **What problems do we solve?** In this buyer's context. Generic value props signal no discovery.
- **How do we solve them differently?** Provable and relevant. "We have AI" is not differentiation; a specific mechanism tied to a specific outcome is — and the outcome figure needs a source.
- **What outcomes do customers achieve?** Reference customers at their scale, with results you can cite.

## Deal inspection (deal-level coaching)

Ask, do not tell. The first move in any review is a question:

- What has changed since last review — progress, or just activity?
- When did we last speak to the economic buyer? (access, or assumption)
- What does the champion say happens next?
- Who else is the buyer evaluating?
- What happens if they do nothing?
- What is the paper process and has it started?
- What specific event drives the timeline? (compelling event, or our quarter-end)
- What has the buyer **done**, not said, that shows this is moving?

Challenge happy ears: "they loved the demo" → what did they commit to, who said it, by when?

### Red flags
- Single-threaded to someone who is not the EB.
- No compelling event, no cost of inaction.
- Champion will not grant EB access.
- Decision criteria mirror a competitor's strengths (they helped write them).
- "We just need a demo" with no discovery done.
- Procurement timeline unknown.
- Inbound buyer who cannot state the business problem.

### Pre-meeting deal prep
Before every important meeting: objective · what the buyer needs to hear · our ask · three most likely objections and the answer to each · what a good outcome looks like. Template in [references/templates.md](references/templates.md) § Deal prep.

### Blameless loss debrief
Classify the loss before coaching it — each class needs a different fix:
- **Qualification** — we should not have been there.
- **Execution** — we were there and did not perform (missed EB, late paper process, weak demo).
- **Competition** — we performed and they were better for this buyer.

Coach the behaviour, not the outcome: a disciplined loss is worth more than a lucky win, because process compounds.

## Guardrails

- **No invented metrics.** Every number in Metrics, Pain, proof points and battlecards carries its source (buyer statement + date, CRM report, cited case study) or is written `[NEEDS DATA]`. This is the no-hallucinated-metrics rule in `.claude/workflows/marketing-rules.md`. Win-rate claims about a methodology are not evidence for this deal.
- **No disparagement.** Competitor facts must be true and checkable; repositioning beats attacking.
- **PII.** Use roles and redacted handles (EB, Champion-1, "VP Ops") in committed files. Full names and contact data live in the CRM only — `.claude/workflows/automation-rules.md` R4.
- **Honest verdicts.** Never soften a losing position; every gap gets a next step, an owner, and a date.

## Output

`plans/sales/<deal-slug>/deal-assessment.md` — MEDDPICC table (score · evidence · gap/risk), verdict, competitive zones, next actions (owner + date). Optional siblings in the same dir: `battlecard-<competitor>.md`, `deal-prep-<meeting>.md`, `loss-debrief.md`. Templates: [references/templates.md](references/templates.md).

## Before proceeding

1. Which opportunity, what stage, what value and close date does the CRM show?
2. What evidence exists per MEDDPICC element — notes, call recordings, emails, eval matrix?
3. Who are the known competitors (including build and do-nothing)?
4. What decision is this for — forecast call, exec review, meeting prep, loss debrief?

Read `plans/marketing-context.md` if present — its ICP and positioning feed the Metrics and value framing. Skip whatever it already answers.

## Cross-references

- [[discovery]] — fills the Pain, Metrics and Champion evidence this skill scores
- [[pipeline-forecast]] — rolls deal verdicts up into forecast categories and coverage
- [[sales-engineering]] — technical win, POC, technical battlecard layer
- [[proposal]] — carries the win themes into the written response
- [[competitor-profiling]] — market-level competitor research to seed battlecards
- `.claude/workflows/sales-workflow.md` — Phase 2 (Qualify)
- `.claude/workflows/marketing-rules.md` — no-hallucinated-metrics

## Provenance

Adapted from `msitarzewski/agency-agents` → `sales/sales-deal-strategist.md` and the deal-coaching parts of `sales/sales-coach.md` (MIT, © 2025 AgentLand Contributors). ClauKit adaptations: persona converted to skill format; `sales-coach` folded in (deal inspection, deal prep, blameless loss debrief here; forecast categories, pipeline review cadence and rep coaching plans moved to [[pipeline-forecast]]); unsourced statistics removed (methodology win-rate/deal-size uplift claims, coaching attainment figures, "Success Metrics" targets); templates moved to `references/`, example figures replaced with placeholders; PII, anti-fabrication and output-path rules added; routed via `/mk:sales deal`.
