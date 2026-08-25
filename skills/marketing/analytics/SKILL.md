---
name: analytics
description: Marketing measurement methodology — tracking plans, event taxonomy and naming, funnel models, attribution models, UTM conventions, dashboards and reporting cadence, and reading the numbers. Use when the user says "set up tracking", "GA4", "conversion tracking", "event tracking", "tracking plan", "UTM parameters", "GTM", "tag manager", "which channel gets credit", "our numbers don't match", "are my events firing", "how do I measure this", or asks how to know whether something is working.
allowed-tools: Read, Write, Glob, Grep
---

# Analytics — Marketing Measurement

> Most analytics setups collect everything and answer nothing. This skill starts from the decision, works backwards to the event, and stops there.

## When this skill activates

**Implicit:** "set up tracking for X", "what should we measure", "our conversion numbers don't match the database", "which channel should get credit", "build a tracking plan", "what UTMs should we use", "why is this event firing twice".
**Explicit:** "Use the analytics skill to [task]."
**Routed from:** `/mk:campaign` (Phase 9 — Measure; skill listed in the command's skill set), `/mk:growth referral` (referral tracking design), and the `campaign-manager` agent when it closes the measure → optimize loop.

## Scope

Covers:
- Tracking plans — the event/property/trigger table that a dev team can implement from.
- Event taxonomy and naming conventions (object_action), property standards, PII exclusion.
- Funnel modelling — step sequences, per-step drop-off, where to instrument.
- Attribution models — what each model over- and under-credits, and when to switch.
- UTM conventions and campaign taxonomy.
- Dashboards + reporting cadence — which number is looked at daily, weekly, quarterly.
- Interpreting the numbers: discrepancies between tools, consent/adblock gaps, duplicate events.
- Instrumentation design for GA4 + GTM (what to fire, with what parameters) — see `references/`.

Does NOT cover:
- Conversion-rate diagnosis and fixes → [[cro]] (this skill supplies the data CRO acts on).
- Ad-platform reporting and bid decisions → [[ads]].
- Organic search performance analysis → [[seo-audit]], ranking drift → [[seo-drift]].
- Launch-metric goal setting → [[launch]].
- Statistical A/B test design and significance calls — **no ClauKit skill owns this.** This skill can define the events an experiment needs; it will not declare a winner. Flag the gap rather than improvising a stats verdict.

**Boundary with the data-access skills.** This skill owns *methodology* — what to measure, how to model it, how to read it. It does not fetch data:
- `skills/automation/mcp-ga4/` — GA4 reads through `mcp__ga4__*` tools, with manual CSV-export fallback.
- `skills/automation/mcp-gsc/` — Search Console reads through `mcp__gsc__*` tools, same fallback.
- [[seo-google]] — direct REST against Google's own APIs (PSI/CrUX, GSC, Indexing API, GA4 Data API) when the MCP wrappers don't expose what's needed.

Rule: this skill decides *which* report to pull and what the result means; those skills pull it. Don't duplicate their auth, tool-call, or export instructions here.

## Core principles

1. **Track for decisions, not data.** Every event must map to a decision someone will actually make. If no decision changes, don't instrument it.
2. **Start from the question.** What do you need to know → what action follows → what event proves it. Work backwards, never forwards from "what can we capture".
3. **Name things once.** Conventions get set before the first event ships; renaming after the fact splits history.
4. **Clean data beats more data.** Validate, monitor, and prune. A trusted small set outperforms a large unaudited one.

## Tracking plan framework

The deliverable is a table a developer can implement without asking follow-ups:

| Event name | Description | Properties | Trigger | Decision it informs |
|---|---|---|---|---|
| `signup_completed` | User finishes signup | `method`, `plan`, `source` | Success page / API 201 | Channel budget allocation |

Event types to cover:

| Type | Examples |
|---|---|
| Pageviews | Automatic, enriched with content metadata |
| User actions | CTA clicks, form submits, feature usage |
| System events | Signup completed, purchase, subscription changed |
| Custom conversions | Goal completions, funnel-stage transitions |

Full event lists by business type (marketing site, product, monetization, e-commerce, B2B/SaaS): `references/event-library.md`.

## Event naming

Format: **object_action**, lowercase, underscores.

```
signup_completed
cta_hero_clicked
form_submitted
checkout_payment_completed
```

- Be specific — `cta_hero_clicked` beats `button_clicked`.
- Context belongs in properties, not in the event name (don't create `cta_hero_clicked_pricing`).
- No spaces, no special characters, no camelCase mixed with snake_case.
- Document every naming decision; the plan is the contract.

## Essential events

**Marketing site**

| Event | Properties |
|---|---|
| `cta_clicked` | `button_text`, `cta_location`, `page` |
| `form_submitted` | `form_name`, `form_location` |
| `signup_completed` | `method`, `plan`, `source` |
| `demo_requested` | `company_size`, `industry` |

**Product / app**

| Event | Properties |
|---|---|
| `onboarding_step_completed` | `step_number`, `step_name` |
| `first_key_action_completed` | `action_type` |
| `feature_used` | `feature_name`, `feature_category` |
| `purchase_completed` | `plan`, `value`, `currency`, `transaction_id` |
| `subscription_cancelled` | `plan`, `reason`, `tenure` |

## Event properties

| Category | Properties |
|---|---|
| Page | `page_title`, `page_location`, `page_referrer` |
| User | `user_id`, `user_type`, `account_id`, `plan_type` |
| Campaign | `source`, `medium`, `campaign`, `content`, `term` |
| Product | `product_id`, `product_name`, `category`, `price`, `quantity` |

Rules: consistent names across events; don't re-send what the platform already collects automatically; **never put PII in a property** (no emails, names, phone numbers, raw addresses — use opaque IDs).

## Funnel modelling

A funnel is an ordered event sequence plus the drop-off between each pair. Instrument every step, not just the endpoints — an endpoint-only funnel tells you that you lost people, not where.

**Signup funnel:** `signup_started` → `signup_step_completed` (per step) → `signup_completed` → `onboarding_started` → `first_key_action_completed`

**Purchase funnel:** `pricing_viewed` → `plan_selected` → `checkout_started` → `payment_info_entered` → `purchase_completed`

**E-commerce funnel:** `product_viewed` → `product_added_to_cart` → `cart_viewed` → `checkout_started` → `shipping_info_entered` → `payment_info_entered` → `purchase_completed`

Reading it:
- **Step conversion rate** = step N+1 count ÷ step N count. Rank steps by absolute users lost, not by rate — a 40% drop late in a thin funnel may cost fewer users than a 10% drop at the top.
- **Segment before concluding.** A flat overall rate often hides one device, one channel, or one plan tier collapsing.
- The largest absolute-loss step is the handoff to [[cro]].

## Attribution models

Attribution assigns conversion credit across the touchpoints that preceded it. No model is correct; each is a different question.

| Model | Credit | Over-credits | Use when |
|---|---|---|---|
| Last click / last non-direct | 100% to final touch | Bottom-funnel, branded search, retargeting | Short cycles; a baseline everyone understands |
| First click | 100% to first touch | Top-funnel discovery channels | Judging awareness spend |
| Linear | Split evenly | Long, noisy paths | Long B2B cycles with many assisting touches |
| Time decay | Weighted toward recent | Closing channels | Cycles where recency genuinely drives the close |
| Position-based (40/20/40) | First + last emphasized | Discovery and closing, ignores the middle | You care about "who found them, who closed them" |
| Data-driven (platform) | Modelled from observed paths | Whatever the platform can see | Enough conversion volume; accept it's a black box |

Practical rules:
- **Pick one model as the reporting default** and state it on every dashboard. Switching models mid-quarter creates fake trends.
- **Compare two models to find assist value** — a channel that looks weak on last-click and strong on first-click is a discovery channel; don't cut it on last-click alone.
- Platform-reported conversions (ad platforms self-attributing) will exceed analytics-reported conversions. That's a definitional gap, not a bug — see below.
- Click-based attribution cannot see dark social, word of mouth, or offline. Where those matter, pair the model with a self-reported-attribution field ("how did you hear about us?") on the signup form and reconcile directionally.

## UTM strategy

| Parameter | Purpose | Example |
|---|---|---|
| `utm_source` | Specific origin | `google`, `linkedin`, `newsletter` |
| `utm_medium` | Channel class | `cpc`, `paid-social`, `email`, `organic-social` |
| `utm_campaign` | Campaign identifier | `spring_sale_2026` |
| `utm_content` | Variant/placement | `hero_cta`, `footer_banner` |
| `utm_term` | Paid search keyword | `running+shoes` |

- Lowercase everything — `Google` and `google` become two rows forever.
- Pick underscores *or* hyphens and never mix.
- Specific but short: `blog_footer_cta`, not `cta1`.
- Keep a single UTM registry file so two people don't invent two spellings of the same campaign.
- Never UTM-tag internal links — it restarts the session and destroys the original source.

## Dashboards and cadence

Build three tiers; one metric owner each. If a number has no owner and no decision attached, cut it.

| Tier | Cadence | Contents | Question answered |
|---|---|---|---|
| Health | Daily / on-alert | Traffic, conversions, error rate, spend pacing | Is anything broken right now? |
| Performance | Weekly | Channel × conversions, funnel step rates, CAC, cost per conversion | What do we change this week? |
| Strategic | Monthly / quarterly | Cohort retention, LTV:CAC, channel mix trend, attribution-model comparison | Is the mix still right? |

Rules: annotate every dashboard with the attribution model and date range; log releases and campaign launches as annotations so spikes are explainable later; compare like-for-like windows (28-day, not "this month vs last month" with unequal weekday counts).

## Validation and debugging

Validation checklist before a tracking plan is called done:

- [ ] Events fire on the intended trigger, once.
- [ ] Property values populate (no `undefined`, no `(not set)`).
- [ ] No duplicate events (double containers, double-bound listeners).
- [ ] Works on mobile and in at least two browsers.
- [ ] Conversions register with the intended counting method.
- [ ] No PII in any property.

| Symptom | Check first |
|---|---|
| Event not firing | Trigger condition; container actually loaded; consent state blocking it |
| Wrong or empty values | Property path; data-layer shape; push happening after the tag reads it |
| Duplicate events | Two containers; trigger matching twice; SPA route change firing again |
| Analytics < platform/database | Consent denials, ad blockers, client-side loss, session-timeout and lookback-window definitions differing |
| Analytics ≠ ad platform | Self-attribution + view-through windows on the platform side vs click-based last-touch in analytics |

When two tools disagree, reconcile **definitions first, implementation second**: same date range, same timezone, same conversion definition, same attribution window. Most "broken tracking" is a definition mismatch.

## Privacy and consent

- Cookie consent is required in the EU/UK and under several other regimes — collect it before analytics storage is granted.
- Consent mode (or equivalent conditional loading) means a real, measurable share of traffic is modelled or missing. Report the consent rate alongside the numbers, never silently.
- No PII in event properties, ever. Use hashed or opaque IDs.
- Set data retention deliberately and support user-deletion requests.
- Only collect what a decision needs — the smallest defensible dataset is also the cheapest to keep compliant.

## Key concepts

- **Track for decisions** — an event with no downstream decision is cost without value.
- **Object_action naming** — one convention, set before implementation, never renamed in place.
- **Step drop-off** — the funnel's value is between the steps, not at the ends.
- **Model choice, not model truth** — attribution answers a question you chose; state which one.
- **Definition mismatch** — most tool-to-tool discrepancies are date/timezone/window/definition differences, not bugs.
- **Consent gap** — the modelled/missing share of traffic that must be quoted with every consent-affected number.

## Output

- `plans/marketing/<campaign>/analytics-plan.md` — tracking plan (event table, properties, conversions, custom dimensions).
- `plans/marketing/<campaign>/measurement-report.md` — funnel + channel readout with the attribution model stated.
- `plans/marketing/<campaign>/utm-registry.md` — campaign UTM taxonomy.
- Inline recommendations for quick checks.

Tracking-plan document skeleton:

```markdown
# <Site/Product> Tracking Plan
Tools: <GA4, GTM, ...> · Attribution default: <model> · Updated: <YYMMDD>

## Events
| Event | Description | Properties | Trigger | Decision |

## Custom dimensions
| Name | Scope | Parameter |

## Conversions
| Conversion | Event | Counting |
```

## Cross-references

- `references/event-library.md` — full event taxonomy by business type + funnel sequences
- `references/ga4-implementation.md` — GA4 configuration, custom events, conversions, dimensions, audiences, debugging
- `references/gtm-implementation.md` — GTM container structure, data-layer patterns, tag configs, consent mode
- `plans/marketing-context.md` — required hub (ICP, positioning, goals)
- `.claude/workflows/marketing-rules.md` — quality gates
- `.claude/workflows/automation-rules.md` — MCP usage policy, PII redaction
- `skills/automation/mcp-ga4/SKILL.md`, `skills/automation/mcp-gsc/SKILL.md` — data access (GA4 / GSC)
- [[seo-google]] — direct Google API access when the MCP wrappers fall short
- [[cro]] — acts on the drop-off this skill locates
- `.claude/skills/marketing/README.md` — full kit overview

## Provenance

Imported from `coreyhaines31/marketingskills` (MIT, © 2025 Corey Haines) and adapted for ClauKit: ClauKit frontmatter, `/mk:` routing, `plans/marketing/` outputs, explicit boundary against the `mcp-ga4`/`mcp-gsc`/`seo-google` data-access skills; funnel-reading, attribution-model, and dashboard-cadence sections added because ClauKit has no separate `attribution` skill; upstream `ab-testing`, `revops`, and tools-registry references dropped (no ClauKit equivalent).
