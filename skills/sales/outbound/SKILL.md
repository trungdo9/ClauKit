---
name: outbound
description: Signal-based outbound prospecting system — falsifiable ICP with disqualifiers, buying-signal tiers and speed-to-signal routing, Tier 1/2/3 account engagement, multichannel sequence architecture (email, LinkedIn, phone, video) matched to persona, SDR operating model, and the metrics that measure pipeline rather than activity. Use for "outbound strategy", "prospecting plan", "SDR playbook", "account tiering", "target account list", "ABM tiers", "buying signals", "intent signals", "multichannel sequence", "cadence across LinkedIn and phone", "why isn't outbound producing pipeline". The email copy itself (subject lines, openers, CTAs, breakup email) belongs to cold-email; lifecycle drips to email-sequence.
allowed-tools: Read, Write, Glob, Grep, WebSearch, WebFetch
---

# Outbound — Signal-Based Prospecting

> Outreach is triggered by evidence, not by quota. If you cannot say why this person, at this company, right now — you are not ready to send.

## When this skill activates

**Implicit:** "build our outbound motion", "who should we be prospecting", "tier our target accounts", "what signals should trigger outreach", "design a multichannel cadence", "our SDRs book meetings that never convert", "spray and pray isn't working".
**Explicit:** "Use the outbound skill to [task]."
**Routed from:** `/mk:sales outbound`, `.claude/workflows/sales-workflow.md` Phase 1 (Generate — this skill supplies who and when; [[cold-email]] supplies what the email says), `/mk:leads`.

## Scope

Covers:
- ICP definition that excludes — firmographic filters, behavioral qualifiers, disqualifiers.
- Buying-signal taxonomy, ranking, sourcing, and routing.
- Account tiering and per-tier engagement depth.
- Multichannel sequence architecture: channel per persona, touch count and spacing, a new value angle per touch.
- The SDR operating model and outbound metrics.

Does NOT cover:
- Writing the emails — subject lines, opening lines, body, CTA, follow-ups, breakup, deliverability → [[cold-email]].
- Nurture drips for leads who opted in → [[email-sequence]].
- Offer and lead-magnet design (what you are inviting people to) → [[offer-design]].
- Owning the ICP record for the whole company → [[product-marketing]] writes `plans/marketing-context.md`; this skill sharpens it into a prospecting filter.
- Qualifying the meeting once booked → [[discovery]], [[deal-strategy]].

## 1. ICP that excludes

A useful ICP is falsifiable: if it does not exclude companies, it is a market-size slide.

```
FIRMOGRAPHIC FILTERS
- 2–4 specific verticals (not "enterprise")
- Revenue or headcount band
- Geography (if it constrains go-to-market)
- Required technology already in place

BEHAVIORAL QUALIFIERS
- What business event makes them a buyer now?
- What pain can they not ignore, and who feels it most?
- What is their current workaround?

DISQUALIFIERS (equally important)
- What looks good on paper but never closes? (from closed-lost history)
- Segments where the user's own win rate is poor
- Company stages where the product is premature or overkill
```

Disqualifiers come from the user's closed-lost data. If none exists, mark `[NEEDS DATA]` and treat the first quarter's outbound as the experiment that produces it.

## 2. Buying signals

Rank by intent strength:

| Tier | Signal type | Examples |
|---|---|---|
| **1 — Active buying** | Direct intent | Review-site category research, pricing/comparison page visits, RFP or vendor-evaluation announcements, job posts that name an evaluation |
| **2 — Organizational change** | New priorities or budget | New leader in the buying function, funding with stated growth goals, hiring surge in the served department, M&A (tool consolidation) |
| **3 — Technographic / behavioral** | Fit and interest | Stack changes (job posts, tech-detection tools), conference talks on adjacent topics, content engagement, discoverable competitor renewal timing |

**Speed-to-signal.** A signal's value decays fast. Route it to the owning rep by signal type and territory — never to a shared queue — and set a response-time target the team can actually staff. Measure signal-to-first-touch time as a first-class metric.

**Signal hygiene.** Record the source and capture date of every signal. A signal you cannot cite in the opening line is not a signal, it is a guess.

## 3. Account tiering

| | Tier 1 — deep | Tier 2 — semi-personalized | Tier 3 — automated, light |
|---|---|---|---|
| Size of list | Small enough for weekly per-account strategy | Mid | Remaining ICP-fit |
| Research | Annual reports, earnings calls, stated initiatives | Industry + one account-level hook | Industry + role tokens |
| Contacts | Multi-threaded: economic buyer, champion, influencer, user | Primary buyer + one stakeholder | One primary contact |
| Plays | Custom per-persona messaging, warm intros, events, direct mail | Signal-triggered sequence, persona-matched | Signal-triggered enrollment only |
| Review | Weekly | Quarterly promote/demote | Engagement score surfaces promotions |

List sizes depend on rep capacity: Tier 1 count ≈ accounts one rep can genuinely research and work weekly. Derive it from the team, not a template.

## 4. Multichannel sequence architecture

Channel per persona (starting hypothesis — validate with the user's reply data):

| Persona | Primary | Secondary | Tertiary |
|---|---|---|---|
| C-suite | Warm intro / referral | Short direct email | Social (LinkedIn) |
| VP | Email | LinkedIn | Phone |
| Director | Email | Phone | LinkedIn |
| Manager / IC | Email | LinkedIn | Short personalized video |
| Technical buyer | Email with technical substance | Community channels | LinkedIn |

**Structure:** a multi-touch, multi-channel sequence — the skeleton below is a *starting hypothesis*, not a benchmark; set touch count and spacing from the user's own reply data. **Every touch adds a new value angle** — re-sending the same ask in new words is nagging, not a sequence.

Skeleton (angles, not copy — the copy is written with [[cold-email]]):

```
T1  Day 1   Email     Signal-based reason for reaching out + one relevant outcome + soft ask
T2  Day 3   LinkedIn  Connection with a personal note, no pitch
T3  Day 5   Email     Insight tied to their situation (cited)
T4  Day 8   Phone     Call; voicemail references the email thread
T5  Day 10  LinkedIn  Engage with their content / share something relevant
T6  Day 14  Email     Comparable-customer story (real, permissioned) + clear ask
T7  Day 17  Video     Short personalized walkthrough of something specific to them
T8  Day 21  Email     New angle: different pain or different stakeholder
T9  Day 24  Phone     Final call
T10 Day 28  Email     Breakup — brief, honest, door open
```

Rules:
- Automate what should be automated (Tier 3 enrollment, scheduling); personalize what should be personal (Tier 1 openings). Know which is which.
- **Test one variable at a time.** Change subject, opener, and CTA together and you have learned nothing.
- Respect opt-outs immediately and completely, on every channel. Comply with the user's jurisdiction's outreach and consent rules — ask which apply.

## 5. SDR operating model

- **Smaller book, deeper ownership** — accounts owned, not lists dialed.
- **Signal monitoring is a core skill**, not an ops afterthought.
- **Channel chosen by buyer**, not by playbook.
- **Measured on pipeline quality** — conversion of booked meetings to qualified opportunity — not meetings booked.
- Document what works in a shared playbook; a playbook in one rep's head is not a playbook.

## 6. Metrics that matter

| Metric | Tells you | Target |
|---|---|---|
| Signal-to-first-touch time | Whether signals are acted on while warm | User-set; track trend |
| Reply rate (by tier, by signal type) | Relevance | Baseline from the user's own sends, then improve |
| Positive reply rate | Real interest | Baseline → improve |
| Reply → meeting | Handling of interest | Baseline → improve |
| Meeting → qualified opportunity | Meeting quality — the one that matters | Baseline → improve |
| Sequence completion | Are reps finishing sequences | Baseline → improve |
| Pipeline per rep | Revenue impact | Depends on ACV |
| Channel × persona effectiveness | Where each persona actually answers | Review monthly |

No target in this table is a benchmark — they are baselines the user establishes in the first cycle. Cite a published benchmark only with source and date, and label it third-party.

## Guardrails

- **No invented benchmarks or lift claims** (`.claude/workflows/marketing-rules.md` §2). Reply-rate ranges and "signal-based converts N× better" figures are not stated as fact.
- **No fabricated personalization.** Every account-specific claim in an opener traces to a captured signal with its source. A wrong "I saw you just…" is worse than no personalization.
- **No fake social proof.** Comparable-customer stories must be real and permissioned; otherwise `[NEEDS DATA]`.
- **PII** — prospect lists in committed files are redacted (`.claude/workflows/automation-rules.md` §4); full contact data lives in the CRM. Re-runs must not duplicate outreach (§5 idempotency).

## Output

`plans/sales/<motion-slug>/` —
- `icp-and-signals.md` (ICP filters, disqualifiers, signal tiers with sources, routing rules)
- `account-tiers.md` (tier criteria + counts; account list redacted or referenced from CRM)
- `sequences/<tier>-<persona>.md` (touch skeleton per tier × persona; copy via [[cold-email]])
- `metrics.md` (baselines and review cadence)

## Before proceeding

1. What does the product solve, at what ACV, and which segments close today (and which never do)?
2. What signal sources does the team have access to (CRM, intent data, job boards, tech-detection, web analytics)?
3. How many reps, and how much research time per rep per week?
4. Which channels are allowed and staffed (phone? LinkedIn? video?) and which outreach/consent rules apply in the target regions?

Read `plans/marketing-context.md` first for the ICP and positioning; this skill narrows, it does not replace.

## Cross-references

- [[cold-email]] — all email copy, follow-up wording, deliverability
- [[offer-design]] — what the outreach offers (lead magnet, audit, sample)
- [[discovery]] — what happens on the meeting outbound books
- [[pipeline-forecast]] — when the creation gap is what outbound must close
- [[customer-research]] — buyer language for openers; closed-lost interviews for disqualifiers
- [[competitor-profiling]] — competitor-displacement signals
- `.claude/workflows/sales-workflow.md` Phase 1 · `.claude/workflows/automation-rules.md` §4–5

## Provenance

Adapted from `msitarzewski/agency-agents` → `sales/sales-outbound-strategist.md` (MIT, © 2025 AgentLand Contributors). ClauKit adaptations: the cold-email anatomy section (subject lines, opener, value prop, CTA) was dropped as a duplicate of [[cold-email]], which now owns copy; unsourced figures removed — "signal-triggered converts 4–8×", reply-rate tiers (1–3% / 5–8% / 12–25% / 30–50%), metric target ranges (12–25%, 5–10%, 40–60%, 50%+, 80%+), "<15% win-rate" disqualifier, fixed response windows (30 min / 24 h / 72 h), and fixed tier sizes (50–100 / 200–500 / 50–80 accounts) — replaced with user-derived baselines; named commercial tools generalized; consent/opt-out and PII rules added.
