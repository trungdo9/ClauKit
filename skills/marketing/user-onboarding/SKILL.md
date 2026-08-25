---
name: user-onboarding
description: Post-signup activation and first-run experience — aha moment definition, minimum path to value, onboarding checklists, empty states, guided tours, drop-off diagnosis, stalled-user recovery. Use when the user says "onboarding flow", "activation rate", "user activation", "first-run experience", "empty states", "onboarding checklist", "aha moment", "new user experience", "time to value", "users aren't activating", "nobody completes setup", or "users sign up but don't use the product". For the registration form itself see signup; for the email half of onboarding see email-sequence.
allowed-tools: Read, Write, Glob, Grep
---

# User Onboarding — Activation & Time-to-Value

> Signups are not the win. The win is the moment a new user experiences enough value to decide "this is for me" — and 40–60% of free-trial signups abandon after a single session, so that moment has to arrive inside the first one.

## When this skill activates

**Implicit:** the task involves what happens *after* an account exists — first session, setup completion, activation rate, aha moment, empty screens, in-product guidance, users who signed up and never came back.
**Explicit:** "Use the user-onboarding skill to [task]."
**Routed from:** `/mk:nurture` (default action, alongside `crm-specialist` + `email-specialist`), `/mk:email drip` (paired with [[email-sequence]] — this skill owns the in-product half), `.claude/workflows/sales-workflow.md` Phase 3 (Nurture) and Phase 5 (Retain), `.claude/workflows/crm-workflow.md` via the `crm-specialist` agent (which lists this skill first).

## Scope

Covers:
- Defining activation — picking the aha moment, the activation event, and the metrics around it.
- Choosing an activation model (freemium, free trial, paid trial, money-back, consultation) before designing the flow.
- Minimum Path to Value — inventory, remove, reconstruct the steps between signup and first value.
- In-product onboarding patterns: checklists, empty states, tooltips/tours, progressive disclosure, first-30-seconds approach.
- Drop-off diagnosis — funnel step analysis, stall detection, in-app recovery.
- Segmentation of the onboarding path by role, goal, or product type.
- Experiment design for activation (see `references/experiments.md`).

Does NOT cover:
- **The registration flow itself** — form fields, social auth, signup-page copy, verification → [[signup]]. That skill hands off the moment an account exists; this one takes over there.
- **The email half of onboarding** — welcome series, onboarding drip, trial-conversion and re-engagement *emails* → [[email-sequence]]. See the boundary rule below; it is the easiest one in the kit to get wrong.
- Converting free users to paid at the paywall → [[paywalls]].
- Instrumentation and event tracking setup → [[analytics]].
- Landing-page and general conversion auditing → [[cro]] (and `.claude/workflows/cro-framework.md`).
- Sentence-level copy craft for onboarding UI strings → [[copywriting]] / [[copy-editing]].

### The in-product / inbox boundary

`/mk:email drip` runs both skills together. Split them like this:

| | [[user-onboarding]] (this skill) | [[email-sequence]] |
|---|---|---|
| Surface | Inside the product | Inbox |
| Owns | Checklists, empty states, tours, setup steps, in-app prompts, the activation event itself | Triggers, delays, per-email specs, subject lines, exit conditions |
| Defines | *What* counts as activated and *which* in-product step is stalled | *When* an email fires and *what* it says |

The rule: **email reinforces in-app actions, it never duplicates them.** Every onboarding email should drive back into the product with one specific CTA tied to a step this skill defined. If an email tries to deliver the value itself, the boundary has been crossed. This skill supplies the trigger vocabulary (activation event reached, step N incomplete at 24h/72h, stalled) — [[email-sequence]] turns those triggers into a sequence.

## Core principles

1. **Time-to-value is everything.** Remove every step between signup and experienced value.
2. **One goal per session.** The first session aims at one successful outcome. Advanced features wait.
3. **Do, don't show.** Interactive beats tutorial. Doing the thing beats learning about the thing.
4. **Progress creates motivation.** Show advancement, celebrate completion, make the path visible.

## Defining activation

Judge activation by lead→customer conversion plus 90-day retention, **not** signup volume. More signups mean nothing if they neither convert nor stick.

**Pick the activation model first** — freemium, free trial, paid trial, money-back guarantee, or consultation. The model shapes the entire onboarding path, and the credit-card decision alone moves signup volume and conversion in opposite directions. Full treatment, including Model-Market Fit and the Evernote-vs-Notion lesson: `references/activation-models.md`.

**Find the aha moment** — the action correlating most strongly with retention:
- What do retained users do that churned users don't?
- What is the earliest indicator of future engagement?

| Product type | Typical aha moment |
|---|---|
| Project management | Create first project + add a team member |
| Analytics | Install tracking + see the first report |
| Design tool | Create first design + export/share it |
| Marketplace | Complete first transaction |

**Activation metrics:** % of signups reaching activation, time to activation, steps to activation, activation broken out by cohort and acquisition source.

## Minimum Path to Value (MPTV)

The least number of steps to experience *enough* value to make a confident decision — not the fastest path to any value, and not a feature tour. Every step, field and option is another decision, and Hick's Law says decision cost grows with the number of choices.

Build or repair it in three passes: **inventory** every screen, field, click, permission and empty state between signup and value; **remove** anything the user does not have to do *right now* (cut, defer, pre-fill, or make skippable — default to removal); **reconstruct** in value-first order, then measure and cut again. Benchmarks, abandonment numbers and the Stripe/Calendly/Notion patterns: `references/minimum-path-to-value.md`.

## Onboarding psychology

The mechanisms behind why progress mechanics work:

- **Endowed progress effect** — a checklist that opens already partly complete (a step pre-done on the user's behalf) drives roughly +40% completion vs. starting at zero. Give a head start.
- **Peak-end rule** — users remember the most intense moment and the ending, not the average. Engineer a clear high point and end each session positively.
- **Goldilocks rule** — motivation peaks when a task sits just at the edge of ability. Early steps should be achievable but not trivial.
- **BJ Fogg behavior model** — behavior happens only when Motivation × Ability × Prompt converge. A step that isn't happening is missing one of the three.
- **Boosters and blockers** (Ramli John's Mario Kart framing) — add accelerants (pre-filled data, templates, quick wins, celebrations), remove friction (required fields, dead ends, confusing empty states).

## Onboarding toolkit

Assemble from the fewest components that reach value:

| Component | Purpose |
|---|---|
| Welcome forms | Capture role/goal to personalize the path — keep short (Hick's Law) |
| Initial screens | Orient and point at one clear action |
| Drip emails | Multi-touch nurture, one concept per email → specified by [[email-sequence]] |
| Skippable tutorials | Optional guidance; never trap the user |
| Videos | Show complex workflows visually |
| Docs / help center | Self-serve reference for when users stall |
| Onboarding calls | Human touch for complex or high-value accounts |
| Data inputs | Get real data in so the value feels real |
| Checklists | Ordered, value-first steps with visible progress |
| Empty states | Guided first-action opportunities, not dead ends |

## Flow design

### First 30 seconds after signup

| Approach | Best for | Risk |
|---|---|---|
| Product-first | Simple products, B2C, mobile | Blank-slate overwhelm |
| Guided setup | Products needing personalization | Friction before value |
| Value-first (demo data) | Products where a seeded example lands | May not feel "real" |

Whatever the choice: one clear next action, no dead ends, progress indication if multi-step.

### Checklists

Use when setup has several required steps, the product has features to discover, or it is self-serve B2B. Best practice: 3–7 items; ordered by value with the quick win first; visible progress bar or completion %; celebration on completion; always dismissible.

### Empty states

Empty states are onboarding surface, not dead ends. A good one explains what the area is for, shows what it looks like populated, gives a clear primary action to add the first item, and optionally seeds example data.

### Tooltips and guided tours

For complex UI, non-obvious features, and power features users would otherwise miss. Max 3–5 steps, dismissible at any point, never repeated for returning users.

### Patterns by product type

| Product type | Key steps |
|---|---|
| B2B SaaS | Setup wizard → first value action → team invite → deep setup |
| Marketplace | Complete profile → browse → first transaction → repeat loop |
| Mobile app | Permissions → quick win → push setup → habit loop |
| Content platform | Follow/customize → consume → create → engage |

### Segmenting the path

Personalize by role, stated goal, industry, or experience level — using the welcome form's answers to pick the default view, template, and checklist. Branching is only worth its complexity when the segments genuinely need different first actions; otherwise one strong path beats three weak ones.

## Diagnosing drop-off

Track step-by-step completion and find the biggest single drop:

```
Signup → Step 1 → Step 2 → Activation → Retention
100%      80%       60%       40%         25%
```

Fix the largest drop first; everything downstream is throttled by it.

**Stalled users.** Define "stalled" explicitly (X days inactive, setup incomplete at N hours). Recovery has three levers: an email sequence that restates value and addresses the blocker (owned by [[email-sequence]], triggered by criteria defined here); in-app recovery — welcome back, resume where they left off, show what changed; and human outreach for high-value accounts.

**Measurement set:** activation rate, time to activation, onboarding completion %, step completion rate, drop-off points, return rate, day 1/7/30 retention, feature adoption, support volume during onboarding.

## Experiments

Test one variable at a time. Families of tests, with hypotheses, in `references/experiments.md`: flow simplification (step count, ordering, required vs. optional, skip options), progress and motivation mechanics (bars, checklist length, starting at 20% vs. 0%, celebrations), guided experience (tooltip vs. modal, tour length, trigger), personalization (role-based paths, dynamic content), quick wins, support availability, email/multi-channel coordination, stalled-user recovery, and technical/mobile/accessibility factors.

## Key concepts

- **Aha moment** — the single action that best predicts retention; the target of the whole flow.
- **Activation event** — the instrumented, measurable proxy for the aha moment.
- **MPTV** — minimum path to value: fewest steps to enough value for a confident decision.
- **Endowed progress** — pre-completing a step so the user starts above zero and finishes more often.
- **Empty state** — a screen with no data yet, treated as a first-action prompt rather than a dead end.
- **Progressive disclosure** — reveal features as they become needed instead of up front.
- **Stalled user** — a signed-up user meeting an explicit inactivity/incompletion threshold, eligible for recovery.

## Output

- Routed from `/mk:nurture`: `plans/marketing/<campaign>/nurture/<sequence>.md` (the in-product half of the lifecycle sequence).
- Routed from `/mk:email drip`: the in-product step definitions and trigger vocabulary feeding `plans/marketing/<campaign>/emails/<sequence>.md`.
- Standalone: `plans/marketing/<campaign>/onboarding-audit.md` — findings as Finding → Impact → Recommendation → Priority; or `plans/marketing/<campaign>/onboarding-flow.md` — activation goal, step-by-step flow, checklist items, empty-state copy, email trigger points, metrics plan.

## Cross-references

- `plans/marketing-context.md` — required hub (ICP, positioning, brand voice)
- [[signup]] — owns everything up to account creation; hands off to this skill
- [[email-sequence]] — owns the inbox half of onboarding; paired with this skill by `/mk:email drip`
- [[paywalls]] — converting to paid during or after onboarding
- [[analytics]] — instrumenting the activation event and funnel steps
- [[cro]] — conversion auditing and A/B test hypothesis discipline (one variable at a time)
- `.claude/workflows/crm-workflow.md`, `.claude/workflows/sales-workflow.md` — pipelines that route here
- `.claude/workflows/marketing-rules.md` — quality gates (no invented metrics, brand voice)
- `.claude/skills/marketing/README.md` — full kit overview

## Provenance

Imported from `coreyhaines31/marketingskills` (`onboarding`, MIT, © 2025 Corey Haines) and adapted for KitForge — renamed `onboarding` → `user-onboarding` to match the KitForge skill directory. Adaptations: KitForge frontmatter and `/mk:` routing, explicit in-product vs. email boundary with [[email-sequence]], `plans/marketing-context.md` as the context hub in place of upstream's `.agents/product-marketing.md`; upstream's eval harness and its cross-reference to an `ab-testing` skill (not shipped by KitForge) were dropped.
