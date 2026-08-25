---
name: paywalls
description: In-product paywalls and upgrade moments — feature gates, usage-limit screens, trial-expiration flows, upsell modals, in-app pricing. Use when the user says "paywall", "upgrade screen", "upgrade modal", "upsell", "feature gate", "limit reached", "trial expiration screen", "free to paid conversion", "freemium conversion", "trial-to-paid", "plan upgrade prompt", or "free users won't upgrade". Distinct from public pricing pages and general landing-page CRO.
allowed-tools: Read, Write, Glob, Grep
---

# Paywalls — In-Product Upgrade Moments

> A paywall is not a wall, it is a timed ask. It converts when the user has already felt the value, and it burns trust when it arrives before they have.

## When this skill activates

**Implicit:** "design our upgrade screen", "our limit-reached modal converts badly", "free users won't upgrade", "improve trial-to-paid", "what should we gate?", "write the upsell modal copy".
**Explicit:** "Use the paywalls skill to [task]."
**Routed from:** `.claude/workflows/sales-workflow.md` Phase 4 (Convert), alongside [[signup]] and [[cro]]. No `/mk:` command routes here directly today — reach it via `/mk:cro` with an in-product target, or by naming the skill.

## Scope

Covers:
- Gating model choice — hard gate, soft gate, metered limit, freemium tier, time-boxed trial.
- Trigger design: which moment fires the prompt, and the frequency/cool-down rules around it.
- Paywall screen anatomy + copy — headline, value demonstration, plan comparison, CTA, escape hatch.
- Trial mechanics — length, card-vs-no-card, expiration sequence, grace period, downgrade path.
- Upgrade-path friction from paywall click to payment confirmed, and the post-upgrade moment.
- Paywall experiment design + the metrics that judge it.

Does NOT cover:
- The general 25-point conversion framework, public landing pages, public pricing pages → [[cro]] (owns the framework; this skill applies it to the in-product surface).
- Signup/registration flow and form friction → [[signup]].
- Exit-intent, time-delay and scroll-trigger overlays for anonymous visitors → [[popup]]. A paywall targets a logged-in user who has used the product; a popup targets a visitor who has not.
- Getting the user to the aha moment in the first place → [[user-onboarding]].
- Instrumentation and funnel reporting → [[analytics]].

## Core principles

1. **Value before ask.** The user must have experienced real value first. Upgrade should read as the natural next step, not a toll booth. Timing: after the aha moment, never before.
2. **Show, do not just tell.** Demonstrate the paid feature — preview it, screenshot it, state what they could do with it. Abstract feature lists convert worse than a visible artifact.
3. **Friction-free path.** Easy to upgrade the moment they decide. Do not make them hunt for pricing or leave the context they were in.
4. **Respect the no.** No traps, no pressure. Continuing on free must stay easy — a declined user is a future conversion, and a cornered one is a churned one.

## Gating models

| Model | Mechanic | Fits when | Main risk |
|---|---|---|---|
| **Hard gate** | Feature cannot be used at all without paying | The feature is the product's core paid value and is cheap to explain | Blocks before value is felt; highest trust cost |
| **Soft gate** | Feature is previewed/demoed, action is gated | The value is visible in one screen (export, share, report) | Preview too thin = feels like a tease |
| **Metered limit** | Free up to N (projects, seats, runs, messages) | Usage correlates with value received | Limit set wrong: too low reads as bait, too high kills urgency |
| **Freemium tier** | Free plan is permanently useful; paid adds scale/depth | Free users create network or content value | Free tier absorbs the paying segment |
| **Time-boxed trial** | Full access for N days, then downgrade | Value takes multiple sessions to accumulate | Trial ends before the aha moment |

Pick by asking where the value is actually felt. Gate the *scale* of a value the user already gets, not the first taste of it.

## Trigger points

**Feature gate** — user clicks a paid-only feature. Explain plainly why it is paid, show what the feature does, give a one-click path to unlock, and an option to continue without.

**Usage limit** — user hits the metered ceiling. Indicate the limit clearly, show what upgrading provides, and never block abruptly mid-task. Offer the non-paying resolution too (delete/archive something).

**Trial expiration** — warn early: 7 days, 3 days, 1 day. State exactly what happens on expiration, and summarize the value already received (what they built, what they used).

**Time-based prompt** — after X days of free use. Gentle, highlights paid features they have not touched, trivially dismissible.

### When NOT to fire
- During onboarding — too early, no value delivered yet.
- Mid-flow, when the user is executing a task they came to do.
- Repeatedly after a dismissal.

### Frequency rules
Cap prompts per session. Cool-down after a dismiss measured in days, not hours. Track annoyance signals (repeat dismisses, session drop-off after the prompt) and treat them as a conversion metric, not noise.

## Paywall screen anatomy

1. **Headline** — what they get, not what they hit: "Unlock [feature] to [benefit]".
2. **Value demonstration** — preview, before/after, or a usage-personalized "with Pro you could…".
3. **Feature comparison** — key differences only, current plan marked.
4. **Pricing** — clear and simple; monthly vs annual explicit.
5. **Social proof** — a customer quote or adoption count, placed at the decision point.
6. **CTA** — specific and value-oriented ("Start getting [benefit]"), not "Submit" or "Upgrade".
7. **Escape hatch** — a visible "Not now" / "Continue with Free".

### Screen patterns

Feature lock:
```
[Lock icon]
This feature is available on Pro
[Feature preview/screenshot]
[Feature] helps you [benefit]:
  - [capability]
  - [capability]
[Upgrade to Pro — $X/mo]
[Maybe later]
```

Usage limit:
```
You've reached your free limit
[Progress bar at 100%]
Free: 3 projects   |   Pro: Unlimited
[Upgrade to Pro]   [Delete a project]
```

Trial expiration:
```
Your trial ends in 3 days
What you'll lose:      [feature used] · [data created]
What you've accomplished:  Created X projects
[Continue with Pro]
[Remind me later]   [Downgrade]
```

The bracketed tokens above are slots to fill from the product and `plans/marketing-context.md` — never ship them literally.

## Upgrade flow

**Paywall to payment:** minimize steps, keep it in-context where the platform allows, pre-fill everything already known about the user.

**Post-upgrade:** grant access immediately, confirm and receipt it, then route straight into the feature that triggered the upgrade. The upgrade moment is the highest-intent moment the account will ever have — spend it on activation, not on a generic dashboard.

## Anti-patterns

**Dark patterns** — hidden close button, deliberately confusing plan selection, guilt-trip decline copy ("No thanks, I like wasting time"). These convert once and churn twice.

**Conversion killers** — asking before value is delivered; prompting too often; blocking a critical flow; a multi-step upgrade process; a limit the user cannot see coming.

## Metrics

- Paywall impression rate (per active free user, per session).
- Click-through from paywall to checkout.
- Checkout completion rate.
- Free-to-paid conversion, and trial-to-paid separately — they behave differently.
- Revenue per free user.
- Post-upgrade churn — a paywall that converts users who cancel in 30 days is a leak, not a win.

Judge every paywall change on the pair (conversion, post-upgrade churn). Conversion alone rewards coercion.

## Experiments

Test one variable at a time ([[cro]] principle 16). The experiment bank — triggers and timing, layout and value presentation, price framing, headline and CTA copy, objection handling, trial structure, personalization, frequency and dismiss behavior — is in `references/experiments.md`.

## Key concepts

- **Aha moment** — the first time the user gets the outcome they came for. Everything about paywall timing is measured from it.
- **Hard gate vs soft gate** — blocked entirely vs previewed-then-blocked. Soft gates trade some urgency for a lot of trust.
- **Loss framing vs gain framing** — "what you'll lose" (trial end, existing work) vs "what you'll gain" (new capability). Loss framing fits expiration screens where the user already owns something; gain framing fits feature gates.
- **Endowment** — value the user has already built inside the product (projects, data, history). Surfacing it at the upgrade moment is the strongest asset a paywall has.
- **Escape hatch** — the visible decline path. Its presence is what separates a paywall from a dark pattern.
- **Cool-down** — the enforced silence after a dismissal, measured in days.

## Process

1. Load `plans/marketing-context.md` — ICP, brand voice, forbidden words.
2. Establish the upgrade context: freemium to paid, trial to paid, tier upgrade, feature upsell, or usage limit. They need different screens.
3. Establish the product model: what is free, what is gated, what fires the prompt today, current conversion rate.
4. Establish the journey: where in the product this appears, what the user has already experienced, what they were trying to do when interrupted.
5. Choose or confirm the gating model, then the trigger point.
6. Draft the screen against the 7-part anatomy; write real copy, not slots.
7. Set frequency and cool-down rules, and the escape-hatch behavior.
8. Define the experiment and the metric pair that will judge it.

Open questions to ask when unstated: current free-to-paid rate; what fires prompts today; what sits behind the paywall; the aha moment; pricing model (per seat, usage, flat); web, mobile, or both.

## Output

- `plans/marketing/<campaign>/paywalls.md` — gating model decision, trigger map, screen copy, frequency rules, experiment plan.
- Or, in the sales workflow, into `plans/marketing/<campaign>/conversion-assets/`.
- Inline recommendations for quick reviews.

## Cross-references

- `plans/marketing-context.md` — required hub (ICP, brand voice)
- `.claude/workflows/cro-framework.md` — 25-point framework; principles 3 (CTA), 7 (bias stack), 9 (genuine urgency), 10 (price anchoring), 14 (objection preemption), 16 (one-variable testing), 17 (post-conversion momentum) apply directly here
- `.claude/workflows/sales-workflow.md` — Phase 4 (Convert)
- `.claude/workflows/marketing-rules.md` — copy quality + brand voice gates
- [[cro]] · [[signup]] · [[popup]] · [[user-onboarding]] · [[copywriting]] · [[analytics]]
- `.claude/skills/marketing/README.md` — full kit overview

## Provenance

Imported from `coreyhaines31/marketingskills` (MIT, (c) 2025 Corey Haines) and adapted for KitForge: KitForge frontmatter, `/mk:` namespace, wired to `plans/marketing-context.md` and the 25-point `cro-framework.md`; upstream's eval harness, `.agents/product-marketing.md` context convention, and cross-references to skills this kit does not ship (`churn-prevention`, `pricing`, `ab-testing`) were dropped.
