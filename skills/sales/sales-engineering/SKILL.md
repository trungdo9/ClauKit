---
name: sales-engineering
description: Pre-sales engineering — technical discovery, impact-first demo design, tightly scoped POCs with written success criteria and a GO/NO-GO gate, FIA (Fact-Impact-Act) technical battlecards, technical objection decoding, and per-deal evaluation notes. Use for "plan the demo", "tailor the demo", "scope a POC", "proof of concept", "pilot success criteria", "technical evaluation", "they asked if we support SSO", "build a technical battlecard", "can it handle our scale", "they want to build it in-house". For commercial deal qualification use deal-strategy; for the business discovery call use discovery; for the written proposal use proposal.
allowed-tools: Read, Write, Glob, Grep
---

# Sales Engineering

> You cannot get the sales win without the technical win — but the technology is your toolbox, not your storyline. A technical point that does not connect to a business outcome is a feature dump.

## When this skill activates

**Implicit:** preparing a demo for a specific buyer, scoping or rescuing a POC/pilot, answering a security or architecture question in a deal, building a technical competitive comparison, decoding "do you support X?".
**Explicit:** "Use the sales-engineering skill to [task]."
**Routed from:** `/mk:sales demo`, and `.claude/workflows/sales-workflow.md` Phase 4 (Convert) — demos and POCs are conversion assets.

## Scope

Covers:
- Technical discovery: stack, integration points, security and compliance constraints, scale, the real technical decision criteria.
- Demo design: impact-first narrative, audience tailoring, the planned "aha moment".
- POC scoping and execution: problem statement, success criteria, in/out scope, timeline, decision gate.
- Technical competitive positioning: FIA battlecards, technical landmines, technical zones.
- Technical objection handling and per-deal evaluation notes.

Does NOT cover:
- Commercial qualification (MEDDPICC), deal verdict, commercial battlecard → [[deal-strategy]].
- Business-pain discovery call → [[discovery]].
- RFP narrative and compliance matrix → [[proposal]].
- Building the product or writing integration code — this skill designs the evaluation, it does not implement the product.

## Technical discovery

Uncover, before any demo:
- **Environment** — languages, frameworks, infrastructure, hosting model.
- **Integration points** — APIs, databases, middleware, identity provider.
- **Security & compliance** — SSO/SCIM, certifications the buyer requires, data residency, encryption, audit logging.
- **Scale** — users, data volume, throughput, peak patterns.
- **Technical decision makers** — by role: what each cares about, current disposition.
- **The unwritten criteria** — what will actually decide it, which is rarely just the published RFP.

## Demo craft — impact first

A demo is a narrative in which the buyer watches their problem get solved, not a product tour.

1. **Quantify the problem first.** Restate their pain with specifics from discovery, in their numbers: "You told us the team spends [N hours/week] reconciling three systems. Here's that automated."
2. **Show the outcome** — the dashboard, report, or workflow result — before how it works.
3. **Reverse into the how.** Once they react, walk back through configuration and architecture. Now they learn with intent.
4. **Close with proof** — a reference or benchmark that mirrors their situation, **cited** (named customer with permission, or published case study with date). No proof available → say so; do not improvise a figure.

Tailoring is non-negotiable:
- Map the buyer's top three pains to specific capabilities.
- Split by audience: technical evaluators want architecture and API depth; business sponsors want outcomes and timelines.
- Prepare two paths: the planned narrative and a deep-dive for "show me how that works under the hood".
- Use the buyer's vocabulary and data model, not yours.
- Follow the room. Rigid demos lose rooms.

**Aha-moment test:** identify in advance the one capability that will land hardest for this audience and build the arc to peak there. If it did not happen, the demo failed — debrief why.

**Honesty rule:** "We don't do that natively today. Here's how customers solve it." Never demo vapourware as shipped; roadmap items are labelled roadmap with no committed date unless product has committed one in writing.

## POC scoping — where deals are won or lost

A POC is a structured evaluation with a binary outcome, not a free trial.

- **Problem statement in one sentence:** "This POC proves [product] can [capability] in [buyer's environment] within [timeframe], measured by [criteria]." Cannot write it → not scoped.
- **Success criteria agreed in writing before any setup.** Ambiguous criteria produce "we need more time to evaluate", which means you lost.
- **Scope aggressively.** One critical use case proven conclusively beats many proven partially. "Can we also test X?" → "Yes — phase two, once the core decision is clear."
- **Hard timeline.** A fixed end date agreed in writing, set from the buyer's decision timeline; open-ended evaluations breed fatigue and competitor counter-moves.
- **Midpoint checkpoint** to catch shifted criteria before the readout.
- **Decision gate** at the readout: GO / NO-GO against the written criteria.

Template: [references/templates.md](references/templates.md) § POC plan.

## Technical competitive positioning

### FIA — Fact, Impact, Act
- **Fact** — an objectively true, checkable statement about the competitor's approach (with source and date). Credibility is the SE's most valuable asset; one wrong "fact" ends the technical evaluation.
- **Impact** — why it matters to *this* buyer. "Requires a separate ETL layer" is trivia; "that's another integration your team maintains, which lengthens implementation" is impact.
- **Act** — the talk track, question, or demo moment that lands it.

### Reposition, never attack
"They're strong for [acknowledged strength]. Teams with [your buyer's requirement] need [different thing] because [business reason — cite a real, permissioned reference or omit] — that's where our approach differs."

### Technical landmines
"How do you handle [scenario where your architecture is strong] today?" · "What happens when [edge case you handle natively]?" · "How will [requirement mapped to your differentiator] scale as you grow?" Ask because the answer improves the solution design; the competitive advantage is a side effect. Planted-sounding questions backfire.

### Technical zones
Same winning / battling / losing logic as [[deal-strategy]], applied to architecture, performance, and integration criteria. Losing zone: acknowledge, then reframe around the buyer's primary driver.

## Technical objections — decode the real question

| They say | They often mean | Response |
|---|---|---|
| "Does it support SSO?" | "Will this pass our security review?" | Walk the full security architecture, not just the checkbox |
| "Can it handle our scale?" | "We've been burned before" | Benchmark or reference at equal or greater scale — cited |
| "We need on-prem" | Security policy, or sunk cost in data centres | Find out which; the conversations differ completely |
| "Your competitor showed us X" | "Match this" or "convince me" | Do not react to their framing; reground in the buyer's requirements |
| "We'll build it internally" | Vendor-dependency distrust, or engineering wants the project | Quantify build cost (team, time, maintenance) vs. buy, with the buyer's own rates |

## Guardrails

- **No invented benchmarks or customer results.** Every performance figure, reference outcome, or certification claim is sourced (benchmark report, signed reference, published case study, trust centre) or marked `[NEEDS DATA]` — `.claude/workflows/marketing-rules.md`.
- **No unverified security claims.** Certifications and compliance statements come from the vendor's current documentation; never assert one from memory.
- **PII and buyer data.** Evaluation notes use roles; POC environments use buyer-approved test data only. Contact details stay in the CRM — `.claude/workflows/automation-rules.md` R4.

## Output

In `plans/sales/<deal-slug>/`:
- `evaluation-notes.md` — technical environment, decision makers by role, findings, technical competitive landscape, demo/POC strategy.
- `demo-plan.md` — pains → capabilities map, audience, narrative arc, aha-moment target, deep-dive path, proof points with sources.
- `poc-plan.md` — problem statement, success criteria table, scope in/out, timeline, checkpoint, decision gate.
- `battlecard-tech-<competitor>.md` — FIA entries, landmines, zones.

Templates: [references/templates.md](references/templates.md).

## Before proceeding

1. What did business discovery establish (pains, metrics, stakeholders)? If nothing → run [[discovery]] first.
2. Who is in the room — technical evaluators, business sponsor, both?
3. What is the buyer's environment and their hard technical constraints?
4. Demo, POC, battlecard, or objection response?
5. Which competitors are in the technical evaluation?

Read `plans/marketing-context.md` if present for positioning and differentiators.

## Cross-references

- [[discovery]] — business pain and metrics the demo must restate
- [[deal-strategy]] — commercial qualification and commercial battlecard
- [[proposal]] — technical approach section reuses the evaluation notes
- [[competitor-profiling]] — public competitor research to seed FIA facts
- `.claude/workflows/sales-workflow.md` — Phase 4 (Convert)

## Provenance

Adapted from `msitarzewski/agency-agents` → `sales/sales-engineer.md` (MIT, © 2025 AgentLand Contributors). ClauKit adaptations: persona converted to skill format; unsourced statistics removed (example "40% reduction" proof line, the source's "Success Metrics" win/conversion-rate targets and median time-to-decision); proof points and security claims now require a source; demo honesty rule (no vapourware) and PII/test-data guardrails added; templates moved to `references/`; routed via `/mk:sales demo`.
