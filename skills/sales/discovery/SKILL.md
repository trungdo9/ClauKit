---
name: discovery
description: Sales discovery methodology — SPIN question sequences, Gap Selling current/future-state mapping, Sandler pain funnel, upfront contract, a 30-minute discovery call structure, AECR objection handling, and recording-based call coaching debriefs. Use for "discovery call", "prep my discovery", "what questions should I ask the prospect", "qualify on the first call", "they said it's too expensive", "objection handling", "review this call recording", "coach this rep's call", "why did the prospect go dark after the first call". For scoring the opportunity afterwards use deal-strategy; for technical discovery and demos use sales-engineering; for JTBD/customer research interviews (not sales calls) use customer-research.
allowed-tools: Read, Write, Glob, Grep
---

# Discovery

> Discovery is where deals are won or lost — not the demo, not the proposal. You are not ready to pitch until you can describe the buyer's situation back to them better than they described it.

## When this skill activates

**Implicit:** preparing or reviewing a first/second sales call, designing question sequences, handling objections, "they keep saying no budget", coaching a rep from a call transcript or recording.
**Explicit:** "Use the discovery skill to [task]."
**Routed from:** `/mk:sales discovery`, and `.claude/workflows/sales-workflow.md` Phase 2 (Qualify) — discovery produces the evidence the qualification score rests on.

## Scope

Covers:
- Pre-call research and question plan for a specific buyer.
- Three complementary frameworks (SPIN, Gap Selling, Sandler pain funnel) and when to use each.
- Call structure: upfront contract → current state and pain → tailored response → explicit next steps.
- Objection handling (AECR) and decoding what the objection really means.
- Call coaching: one recorded call → specific, behavioural, timestamped feedback.

Does NOT cover:
- Scoring the deal, competitive zones, win plan → [[deal-strategy]].
- Technical discovery (stack, integrations, security), demo and POC → [[sales-engineering]].
- Outbound prospecting and first-touch messaging → [[outbound]] / [[cold-email]].
- Research interviews for product/ICP insight (no sale on the table) → [[customer-research]].
- Rep development plans, pipeline review cadence → [[pipeline-forecast]].

## Three frameworks — blend, do not recite

### 1. SPIN (Rackham)
| Type | Purpose | Examples | Discipline |
|---|---|---|---|
| **Situation** | Context | "Walk me through how your team handles [process] today." | Limit to 2–3. Anything you could have researched signals no preparation |
| **Problem** | Surface dissatisfaction | "Where does that break down?" "What happens when [scenario]?" | Stopping here is the common miss — not enough |
| **Implication** | Expand the cost | "When that breaks, what's the downstream impact on [team/metric]?" "If this continues another 6–12 months, what does it cost?" "Who else feels this?" | Where urgency is born — from the buyer's own realisation, not artificial deadlines |
| **Need-payoff** | Buyer states the value | "If you solved that, what would it unlock?" | The buyer's words here become your closing language |

### 2. Gap Selling (Keenan)
The sale is the gap between current and future state. Map it explicitly:

```
CURRENT STATE
├── Environment: tools, process, team structure today
├── Problems: what is broken, slow, missing
├── Impact: revenue · cost · risk · people — measurable, in buyer terms
└── Root cause: WHY the problems exist  ← the anchor; most often skipped
FUTURE STATE
├── What "solved" looks like, in measurable terms
├── Which metrics change, by how much
└── By when, and why then
THE GAP
├── Cost of staying put vs. value of arriving
└── Can they close it without you?  (yes → no deal)
```

Surface problems ("the tool is slow") do not create urgency; root causes tied to an event ("legacy architecture can't scale and three enterprise clients onboard this quarter") do.

### 3. Sandler pain funnel
- **Level 1 — surface:** "Tell me more." "Give me an example." "How long has this been going on?"
- **Level 2 — business impact:** "What has that cost?" "What have you tried, and why didn't it work?"
- **Level 3 — personal stakes:** "How does this affect you and your team day to day?" "What happens to [initiative] if this isn't resolved?"

Level 3 is the level discovery most often skips. "We need better reporting" often means "I present to the board next quarter and don't trust my numbers" — that second version drives the decision.

## The 30-minute discovery call

Segment times are a starting allocation, not a benchmark — the constant is that the buyer's current state and pain take most of the call.

| Segment | Time | What happens |
|---|---|---|
| **Upfront contract** | ~2 min | Agenda, time check, permission to ask hard questions, and a normalised "no" |
| **Current state + pain** | ~18 min | The majority of the call. Follow the signal using whichever framework fits |
| **Tailored response** | ~6 min | 2–3 capabilities mapped to what they just said — not a tour, not the standard deck |
| **Next steps** | ~4 min | Who does what by when; who else must be involved; next meeting booked before hanging up; what a "no" looks like |

Upfront contract, shape:
> "Here's what I had in mind for our 30 minutes: I'll ask questions to understand what's happening and whether there's a fit, and you ask me anything. At the end one of three things happens — we both see a fit and book a next step, we agree it isn't right and I'll say so, or we need more information. Any of those is fine. Anything you'd add?"

Opening territory: inbound — "What prompted you to take this call?"; outbound — "When I reached out I mentioned [signal]. What's happening on your end with [topic]?"

Before leaving the pain segment you must know: **what is broken · why (root cause) · what it costs · who else cares · why now (trigger) · what happens if they do nothing.**

Tailored response opener: "Based on what you described — [their problem, their words] — here's specifically how we address that…"

## Objection handling — AECR

Objections are diagnostic information. Silence is worse.

1. **Acknowledge** — validate without agreeing or arguing: "That's a fair concern."
2. **Empathise** — "If I'd been burned by [similar solution], I'd be sceptical too."
3. **Clarify** — find the objection behind the stated one: "When you say timing isn't right — budget cycle, bandwidth, or something else?"
4. **Reframe** — "What I'm hearing is [real concern]. Here's how teams in your situation have approached that…" (only with a real, citable reference — otherwise describe the approach without implying a customer)

| Category | What it usually means |
|---|---|
| **Budget / value** | "I'm not convinced the return justifies the cost" or "I don't control the budget." Rarely about budget — if the gap was quantified, it becomes arithmetic, not negotiation |
| **Timing** | "Not a priority yet" or "I can't take on another project" |
| **Competition** | "I need to justify why not [alternative]" or "you're the comparison bid" |

Track your own objection mix in CRM notes; do not assume a distribution.

## Signals

**Discovery landed:** buyer pauses and says "good question"; reveals something unplanned; starts selling internally; says "exactly" when you play it back; asks "so how would you solve this?"
**Discovery rushed:** pitching before the midpoint; one-word answers; you don't know their personal stake; you can't say why now; you leave without knowing who else decides.

## Principles

- **Not an interrogation.** Help the buyer see their situation more clearly; reflect, connect dots, make the call worth their time either way.
- **Silence is a tool.** The answer after the pause is the real one.
- **The buyer talks more than you.** If you are talking most of the time, you are pitching.
- **Qualify out fast.** No real pain, no access to power, no compelling timeline = not a deal. Saying "I don't think we're the right fit" builds trust.
- **Never ask what you could have looked up.**

## Call coaching (from a recording or transcript)

1. **Observe** actual behaviour, not reported behaviour: question depth, when the pitch started, objection handling, next-step commitment.
2. **Diagnose** skill gap (doesn't know how) vs. will gap (knows, doesn't do) vs. environment (system prevents it). Coaching fixes skill; management fixes will.
3. **Pick one behaviour** — the highest-leverage change. A session that fixes five things fixes none.
4. **Feedback is timestamped and behavioural:** not "do better discovery" but "at [mm:ss] the buyer said they're evaluating three vendors and you moved to pricing — that was the moment to ask about their criteria and who decides."
5. **Ask before telling:** "What would you do differently if you could replay that moment?"
6. **Practice assignment + follow-up date.** Coaching without follow-up is advice.

Debrief template in [references/call-debrief.md](references/call-debrief.md).

## Guardrails

- **No invented figures.** Impact numbers come from the buyer (quote + date) or a cited source; otherwise `[NEEDS DATA]` — `.claude/workflows/marketing-rules.md`.
- **PII.** Call notes committed to the repo use roles, not names; recording links and contact details stay in the CRM/call tool — `.claude/workflows/automation-rules.md` R4.
- **Consent.** Only review recordings made with the participants' consent under the applicable recording law.

## Output

- Call plan: `plans/sales/<deal-slug>/discovery-plan.md` — research summary, hypotheses, question sequence per framework, upfront contract, target next step.
- After the call: `plans/sales/<deal-slug>/discovery-notes.md` — current state, root cause, impact (sourced), stakeholders by role, trigger, cost of inaction, agreed next step. Hand to [[deal-strategy]] for scoring.
- Coaching: `plans/sales/coaching/<rep-handle>-<date>.md` per [references/call-debrief.md](references/call-debrief.md).

## Before proceeding

1. Inbound or outbound? What signal or trigger started this?
2. What do we already know about the account (research, prior notes)?
3. Which stakeholder role is on the call, and what is their likely stake?
4. Is this prep, live-call support, or post-call coaching (recording/transcript available)?

Read `plans/marketing-context.md` if present — ICP pains and positioning seed the hypotheses. Skip what it already answers.

## Cross-references

- [[deal-strategy]] — scores the evidence discovery collects (MEDDPICC)
- [[sales-engineering]] — technical discovery layer and demo
- [[customer-research]] — non-sales research interviews and VOC
- [[outbound]] — the signal that opened the conversation
- `.claude/workflows/sales-workflow.md` — Phase 2 (Qualify)

## Provenance

Adapted from `msitarzewski/agency-agents` → `sales/sales-discovery-coach.md` and the call-coaching parts of `sales/sales-coach.md` (MIT, © 2025 AgentLand Contributors). ClauKit adaptations: persona converted to skill format; `sales-coach` call-coaching loop and debrief template folded in; unsourced statistics removed (objection-category percentages, talk-ratio figure); recording-consent, PII and anti-fabrication guardrails added; output paths and routing via `/mk:sales discovery` added.
