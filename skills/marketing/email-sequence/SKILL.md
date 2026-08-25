---
name: email-sequence
description: Design multi-email automated flows — welcome series, onboarding drips, lead nurture, re-engagement, win-back, trial-conversion, failed-payment recovery. Use when the user says "email sequence", "drip campaign", "nurture sequence", "onboarding emails", "welcome series", "re-engagement emails", "email automation", "lifecycle emails", "trigger-based emails", "email funnel", "email workflow", "email cadence", or asks "what emails should I send". Any flow of two or more emails on a trigger + delay. For one-shot broadcasts see emails; for cold outbound see cold-email; for in-app activation see user-onboarding.
allowed-tools: Read, Write, Glob, Grep
---

# Email Sequence Design

> A sequence is not a pile of emails on a timer. It is a state machine: a trigger puts someone in, each email has exactly one job, and an exit condition takes them out the moment the goal is met. Most broken "drips" are broken because nobody defined the exit.

## When this skill activates

**Implicit:** the task involves more than one email tied to a trigger and a delay — welcome series, onboarding drip, lead nurture, trial conversion, re-engagement, win-back, dunning, renewal runway.
**Explicit:** "Use the email-sequence skill to [task]."
**Routed from:** `/mk:email drip` (paired with [[user-onboarding]]), `/mk:campaign` Phase 6, `/mk:nurture` via `.claude/workflows/crm-workflow.md`, `.claude/workflows/sales-workflow.md` Phase 3 (drip sequences by tier). Agents: `email-specialist` (owner), `crm-specialist` (lifecycle stages + scoring triggers), `campaign-manager` (channel coordination).

## Scope

Covers:
- Sequence architecture — trigger, entry criteria, email count, delays, branches, exit conditions.
- The lifecycle catalogue: welcome, onboarding, nurture, trial-to-paid, plan upgrade, usage report, NPS, review ask, renewal, failed payment, cancellation, win-back, re-engagement.
- Per-email specs: subject, preview text, body, one CTA, segment conditions.
- Cadence/timing tables per sequence type and audience (B2B vs B2C).
- Suppression and overlap rules when several sequences can fire at once.
- Sequence-level measurement — what to instrument, where sequences leak.

Does NOT cover:
- **One-shot broadcasts** (announcement, launch, promo, newsletter, seasonal burst) → [[emails]]. Rule of thumb: no trigger and no delay logic means it is a campaign, not a sequence.
- **Cold outbound to people who never opted in** → [[cold-email]]. Different consent basis, different deliverability posture, different personalization budget. Never reuse nurture copy for cold.
- **In-app activation** (checklists, tooltips, empty states, product-side aha) → [[user-onboarding]]. Email supports in-app onboarding; it must not duplicate it.
- Body-copy craft at the sentence level → [[copywriting]] / [[copy-editing]]. This skill specifies each email; those write the prose.
- Landing pages the emails point at → [[cro]].
- SMS cadence and compliance → [[sms]].
- List capture mechanics → [[popup]], [[signup]].

## Four rules that govern every sequence

1. **One email, one job.** One purpose, one primary CTA. An email that asks for two things gets neither.
2. **Value before ask.** Lead with usefulness; earn the right to sell. The ask lands late in the sequence, not in email 1.
3. **Relevance over volume.** Fewer, better, segmented emails beat a longer cadence. Length is a consequence of what you have to say, not a target.
4. **Clear path forward.** Every email moves the reader somewhere specific. If you cannot name the next state, cut the email.

## Sequence architecture

Define these six fields before writing a single subject line. A sequence missing any of them is not ready to build.

| Field | What it fixes |
|---|---|
| **Trigger** | The event that enrolls someone (signup, lead-magnet download, trial start, payment failure, N days inactive, plan-limit hit). |
| **Entry criteria** | Filters on top of the trigger (plan tier, ICP segment, locale, not already in sequence X). |
| **Goal** | The single conversion this sequence exists to produce. One goal. |
| **Length + cadence** | Email count and the delay between each. |
| **Branches** | Behavior forks — opened/not, completed step/not, high vs low engagement. |
| **Exit conditions** | Goal reached, converted, entered a higher-priority sequence, unsubscribed, hard-bounced. |

**Exit conditions are the part people skip.** Someone who upgrades on email 3 must never receive emails 4–7 asking them to upgrade. Write exits as explicit rules, not as an afterthought.

**Overlap and suppression.** When several sequences can fire on one person, set a priority order (transactional and billing outrank lifecycle, lifecycle outranks campaign), cap total sends per week, and suppress lower-priority enrollments while a higher-priority sequence runs.

## Length and cadence

| Sequence | Length | Span | Typical delay |
|---|---|---|---|
| Welcome (post-signup) | 5–7 | 12–14 days | Immediate, then 1–2 days |
| Onboarding (product users) | 5–7 | 14 days | Immediate, then 1–3 days |
| Lead nurture (pre-sale) | 6–8 | 2–3 weeks | 2–4 days |
| Re-engagement | 3–4 | 2 weeks | 2–5 days |
| Trial → paid | 3–5 | trial runway | Tightens toward expiry |
| Failed payment (dunning) | 3–4 | 7–14 days | Day 0, 3, 7, 10–14 |
| Win-back (cancelled) | 2–3 | 90 days | Day 30, 60, 90 |

Adjust for: sales-cycle length, product complexity, relationship stage. Longer sales cycle and higher price tolerate more emails; a simple self-serve product does not.

Send-time notes: B2B avoids weekends; B2C is worth testing on weekends. Send at the recipient's local time where the platform supports it. Behavior-triggered sends beat time-based sends on relevance whenever the event data exists — prefer "hit the plan limit" over "day 10".

## Per-email structure

Every email in a sequence is specified as:

```
Email <n>: <name / purpose>
Send:      <delay from trigger or from previous email>
Subject:   <40-60 chars>
Preview:   <90-140 chars, extends the subject, never repeats it>
Body:      Hook -> Context -> Value -> CTA -> human sign-off
CTA:       <button text: action + outcome> -> <destination>
Segment:   <conditions, if this email is branch-only>
```

**Subject lines.** Clear beats clever; specific beats vague. Working patterns: question ("Still stuck on X?"), how-to ("How to [outcome] in [timeframe]"), number ("3 ways to [benefit]"), direct ("[First name], your [thing] is ready"), story tease ("The mistake I made with [topic]"). Emoji are polarizing — test, do not assume.

**Body shape.** Short paragraphs (1–3 sentences), white space between sections, bullets for scanability, bold sparingly, mobile-first layout. Conversational tone, first and second person, active voice. Length by intent: 50–125 words transactional, 150–300 educational, 300–500 story-driven.

**CTA.** Buttons for the primary action, in-text links for secondary. Exactly one primary CTA. Button text names the action and the outcome ("Connect your inbox"), not "Click here".

Detail: `references/copy-guidelines.md`.

## Lifecycle sequence blueprints

Full email-by-email templates live in `references/sequence-templates.md`. The four load-bearing ones:

**Welcome (post-signup)** — 5–7 emails / 12–14 days. Goal: activate, build trust, convert.
Welcome + deliver what was promised (immediate) -> quick win (day 1–2) -> story/why (day 3–4) -> social proof (day 5–6) -> objection handler (day 7–8) -> core feature (day 9–11) -> conversion ask (day 12–14).

**Onboarding (product users)** — 5–7 emails / 14 days. Goal: reach the aha moment, then expand.
Welcome + one critical first step (immediate) -> getting-started help if step 1 incomplete (day 1) -> feature highlight (day 2–3) -> success story (day 4–5) -> check-in (day 7) -> advanced tip (day 10–12) -> upgrade/expand (day 14+).
Coordinate with [[user-onboarding]]: the in-app flow owns the activation path; email nudges people who dropped out of it. Emails 2 and 5 are branch-only — send them to non-completers.

**Lead nurture (pre-sale)** — 6–8 emails / 2–3 weeks. Goal: trust, then preference, then offer.
Deliver lead magnet + intro (immediate) -> expand on the topic (day 2–3) -> problem deep-dive (day 4–5) -> solution framework (day 6–8) -> case study (day 9–11) -> differentiation (day 12–14) -> objection handler (day 15–18) -> direct offer (day 19–21).

**Re-engagement** — 3–4 emails / 2 weeks, triggered at 30–60 days of inactivity. Goal: win back or clean the list.
Check-in, genuine ("Is everything okay?") -> value reminder + what's new -> incentive, time-boxed -> last chance, one click to stay or go. If email 4 gets no response, suppress. A smaller engaged list outperforms a large dead one on both deliverability and revenue.

Beyond these four, the lifecycle catalogue — trial conversion, plan upgrade, review ask, proactive support, usage reports, NPS, referral, annual switch, dunning, cancellation survey, renewal reminder, milestone notifications, expired-trial and cancelled-customer win-back — is specified in `references/email-types.md`, which doubles as an audit checklist for an existing email program.

## Branching and segmentation

Branch on data you actually have. Three axes, cheapest first:

- **Behavior** — opened / clicked / neither; completed the step / did not; active / dormant. Drives the highest-value branches (skip email 2 for people who already did the thing).
- **Lifecycle stage** — trial vs paid, new vs tenured, engaged vs at-risk. Owned by `crm-specialist`; this skill consumes the stage definitions rather than inventing them.
- **Profile** — role/industry, use case, company size. Cheap to collect at signup, useful for swapping the case study and the proof point.

Personalization: merge fields need fallbacks (first name -> "there"). Dynamic blocks per segment beat separate sequences until the copy genuinely diverges. Never personalize with data the recipient would be unsettled to learn you hold; strip PII from anything written to `plans/` (see `.claude/workflows/automation-rules.md`).

## Measurement

Instrument per email and per sequence, not just per send.

| Level | Watch | Reads as |
|---|---|---|
| Email | Open, click, unsubscribe, spam complaint | Subject/preview strength; relevance |
| Email | Click-to-open | Body and CTA strength, independent of subject |
| Sequence | Completion rate | Cadence tolerance — where people stop reading |
| Sequence | Goal conversion + time to convert | Whether the sequence does its job at all |
| Sequence | Unsubscribes by position | The email that costs you the list |
| List | Bounce, complaint, deliverability | Sending hygiene |

Diagnostics: opens fine and clicks flat -> body/CTA problem, not subject. Unsubscribes spike at one position -> that email is mistimed or mistargeted; move or cut it. High completion and low conversion -> the sequence is pleasant and pointless; the ask is too soft or the goal is wrong.

Testing: one variable at a time, sufficient sample, document the learning. Highest-leverage variables in rough order — subject line, send timing, sequence length/cadence, CTA placement and copy, personalization depth. Hand instrumentation and reporting to [[analytics]].

## Key concepts

- **Trigger vs. schedule** — a trigger is an event about the person; a schedule is a date on your calendar. Sequences run on triggers. Anything running on your calendar belongs in [[emails]].
- **Exit condition** — the rule that removes someone mid-sequence. The single most common defect in inherited drips.
- **Aha moment** — the first time the user gets the value the product promises. Onboarding sequences aim at it; everything after it aims at habit and expansion.
- **Suppression** — deliberately not sending. Priority order plus a weekly send cap prevents lifecycle sequences from stacking on one person.
- **Branch-only email** — an email that fires only for a segment (did not complete step 1). It keeps the sequence short for people who are already succeeding.
- **List hygiene** — re-engagement ends in removal for a reason: dead addresses drag deliverability for everyone still reading.

## Output

Written to `plans/marketing/<campaign>/emails/<sequence>.md` (`/mk:email drip`), or `plans/marketing/<campaign>/nurture/<sequence>.md` when run through `/mk:nurture`.

Each file contains:
1. **Sequence overview** — trigger, entry criteria, goal, length, cadence, branches, exit conditions (the six architecture fields).
2. **Email-by-email specs** — the per-email block above, full body copy, one CTA each.
3. **Segmentation map** — which emails are branch-only and on what condition.
4. **Measurement plan** — metrics to instrument, and the decision each one would trigger.
5. **Open questions** — data or product facts needed before build.

## Cross-references

- `plans/marketing-context.md` — required hub (ICP, positioning, brand voice, forbidden words). Read it before asking the user anything it already answers.
- [[emails]] — one-shot broadcast campaigns (announcement, launch, promo, newsletter)
- [[cold-email]] — cold outbound to non-opted-in prospects
- [[user-onboarding]] — in-app activation; pair with this skill for `/mk:email drip`
- [[copywriting]], [[copy-editing]] — body-copy craft for the emails specified here
- [[cro]] — landing pages and signup flows the CTAs point at
- [[analytics]] — instrumentation and reporting for the measurement plan
- [[customer-research]] — objections and language to source nurture content from
- [[sms]] — parallel channel; coordinate cadence to avoid double-tapping the same person
- `.claude/workflows/crm-workflow.md` — `/mk:nurture` 5-phase lifecycle pipeline
- `.claude/workflows/sales-workflow.md` — Phase 3, drip sequences by lead tier
- `.claude/workflows/marketing-rules.md` — copy quality, brand voice, no-fabrication gates
- `.claude/workflows/automation-rules.md` — PII redaction, idempotency on re-runs
- `references/sequence-templates.md`, `references/email-types.md`, `references/copy-guidelines.md`
- `.claude/skills/marketing/README.md` — full kit overview

## Provenance

Imported from `coreyhaines31/marketingskills` (`skills/emails`, MIT, (c) 2025 Corey Haines) and adapted for KitForge. The upstream skill is named `emails` but its subject is email *sequence* design; ClauKit splits that surface three ways — `email-sequence` (here, lifecycle/drip), [[emails]] (one-shot broadcasts), [[cold-email]] (outbound) — so the upstream body maps to this skill and the campaign-email material moves to [[emails]].

Adaptations: ClauKit frontmatter with a trigger-rich description; `.agents/product-marketing.md` context convention replaced by `plans/marketing-context.md`; upstream "Task-Specific Questions" folded into the architecture fields and the output's open-questions section; architecture/exit-condition, suppression, branching and measurement-diagnostic sections added to fit ClauKit's sequence-spec output.

Dropped: the `evals/evals.json` harness (ClauKit has no eval runner); the tool-integration table pointing at upstream `tools/REGISTRY.md` and per-vendor integration guides (not shipped here — ClauKit's shipped integration is `skills/integrations/wordpress-rest`); cross-references to upstream skills ClauKit does not carry (`lead-magnets`, `churn-prevention`, `ab-testing`, `revops`, and upstream's `onboarding`, which maps to [[user-onboarding]]).
