---
name: popup
description: Popup, modal, overlay, slide-in, and banner conversion mechanics — trigger selection (exit intent, scroll depth, time delay, click, page count, behavior), audience targeting, frequency capping, offer design, mobile constraints, dismissal UX, and accessibility/compliance. Use for "exit intent", "email popup", "lead capture popup", "modal optimization", "announcement banner", "sticky bar", "notification bar", "slide-in", "our popups are annoying people".
allowed-tools: Read, Write, Glob, Grep
---

# Popup

> A popup is an interruption you have to earn — the offer must be worth more to the visitor than the sentence they were reading.

## When this skill activates

**Implicit:** "add an exit-intent popup", "our popup converts badly", "should we show a discount overlay", "announcement banner for the launch", "popups are annoying our users", "when should the modal fire".
**Explicit:** "Use the popup skill to [task]."
**Routed from:** nothing routes here today. No `/mk:` command, marketing agent, or workflow references this skill — the only inbound pointers are skill-level wikilinks from [[copywriting]] (popup/modal copy) and the popup line in [[cro]]'s scope. Activation is implicit or explicit only. Closing that gap (a `/mk:cro popup` action, or a `cro` audit hand-off) is open work.

## Scope

Covers:
- **Trigger selection and configuration** — exit intent, scroll depth, time delay, click-triggered, page count, behavior-based; the mobile substitutes for triggers that do not exist on touch.
- **Targeting and frequency rules** — new vs. returning, traffic source, page type, exclusion lists, session/dismissal capping, cool-down windows, multi-popup conflict rules.
- **Format and offer design per popup type** — email capture, lead magnet, discount, exit save, announcement banner, slide-in.
- **Dismissal UX, sizing, and mobile constraints** — close affordance, tap targets, bottom sheets vs. full-screen overlays.
- **Popup-specific measurement** — impression, close, engagement, and conversion rates; what to instrument.
- **Accessibility and compliance of the overlay itself** — focus trap, Esc, consent language.

Does NOT cover:
- The general conversion framework, page-level headline/CTA/social-proof work, form-field reduction, and A/B test discipline → [[cro]]. **The boundary:** `cro` owns the 25-point framework and audits popups *as one of the assets it scores* — including the form inside the popup. This skill owns the popup as a *delivery mechanism*: when it fires, to whom, how often, in what format, and how it is dismissed. A "too many fields in the modal" finding is `cro`'s. A "this fires 3 seconds after load on mobile" finding is this skill's.
- Signup/registration flow design after the email is captured → [[signup]].
- Paid content gates, metering, and hard/soft paywall modals → [[paywalls]].
- What happens after conversion (welcome sequence, nurture) → [[emails]], [[email-sequence]].
- Mobile page-experience and interstitial-related technical SEO → [[seo-technical]].
- Event instrumentation and dashboards → [[analytics]].
- Popup headline/CTA wordsmithing at depth → [[copywriting]] (formulas below are the popup-shaped subset).

## Core principles

1. **Timing is everything.** Too early is an interruption; too late is a missed moment. The right time is a relevant offer at a point of demonstrated interest.
2. **Value must be obvious.** Immediate, concrete benefit, relevant to the page the visitor is on. If the offer needs explaining, it is not popup material.
3. **Respect the user.** Easy to dismiss, no dark patterns, remember the choice. A popup that traps costs more in brand damage than it earns in emails.

## Trigger strategies

| Trigger | Configure as | Signals | Best for |
|---|---|---|---|
| **Time-based** | 30–60s, not 5s | Nothing on its own — weakest signal | Broad list-building, low-effort baseline |
| **Scroll depth** | 25–50% (blog: 50–70%) | Content engagement | Blog posts, long-form |
| **Exit intent** | Cursor toward browser chrome | Leaving without converting | E-commerce, lead gen |
| **Click-triggered** | User clicks a CTA/link | Explicit intent — zero annoyance | Lead magnets, gated content, demo requests |
| **Page count / session** | After N pages | Research or comparison behavior | Multi-page journeys, consideration stage |
| **Behavior-based** | Cart abandon, pricing-page visit, repeat visit | High intent, specific | Segmented high-value offers |

Rules of thumb:
- **"On page load" is not a trigger strategy.** It has no signal and takes the worst of the SEO and UX trade-off. If someone asks for load-time, counter with 30–60s, 50% scroll, or exit intent.
- **Exit intent does not exist on mobile.** Cursor tracking has no touch equivalent. Substitutes: back-button interception, sharp scroll-up, inactivity timeout, or simply a bottom slide-in instead. Say which substitute you chose and why — do not pretend exit intent ported.
- **Click-triggered converts highest because it is self-selected.** When a lead magnet can be moved behind a button instead of an overlay, it usually should be.

## Format, sizing, and mobile

- **Desktop:** 400–600px wide is the usual band. Do not cover the whole viewport.
- **Mobile:** bottom sheet or centered card, full-width but not full-screen. Full-screen overlays before content read as aggressive and are the exact pattern search engines flag (see Compliance).
- **Close affordance:** visible X, conventionally top-right, plus click-outside and Esc. A "No thanks" text link as a second exit. A visitor who cannot find the close control bounces the page, not just the popup — the dismissal path is a conversion feature, not a concession.
- **Decline copy stays polite.** "No thanks" / "Maybe later". Never confirm-shaming ("No, I don't want to save money").
- **Tap targets** sized for thumbs; dismissal gestures should work the way the platform's do.
- **Visual hierarchy:** headline → value prop → form/CTA → close. In that order of prominence.
- **Imagery is optional.** A product preview or a face raises trust; anything that delays paint does not. Copy alone works.

Per-type playbooks (email capture, lead magnet, discount, exit save, announcement banner, slide-in), copy formulas, and vertical stacks live in `references/popup-types.md`.

## Frequency, targeting, and page rules

**Frequency capping**
- Once per session, maximum.
- Persist dismissals (cookie / localStorage) and honor them for 7–30 days.
- A dismissal is an answer. Re-asking on the next pageview is how a popup program generates complaints.

**Audience targeting**
- New vs. returning — different offer, different message.
- By traffic source, so paid ad message matches the overlay.
- By page type, so the offer matches context.
- **Exclusions are as important as inclusions:** already-converted users, existing subscribers, active trials, anyone who dismissed recently.

**Page rules**
- Never during checkout or any in-progress conversion flow.
- Blog and product pages take different offers; match the offer to what the page is about.

**Multi-popup conflict rules.** When more than one popup is live, write the precedence explicitly: which one wins on a shared page, what suppresses what, and the global cap per session. Undeclared precedence is how visitors get two overlays in a row.

## Compliance and accessibility

**Search engines and intrusive interstitials.** Google treats intrusive interstitials as a negative page-experience signal, with mobile the sensitive case: content hidden behind a full-screen overlay immediately on arrival from search is the pattern at issue. Legally required or conventional notices — cookie consent, age verification, and reasonably sized non-blocking banners — are not the target. Design around it by avoiding full-screen mobile overlays before the visitor has seen content, and by preferring scroll/exit/click triggers over load-time ones. For the wider mobile and page-experience picture, and for measuring whether an overlay is hurting search performance, see [[seo-technical]]. No specific ranking-loss magnitude is claimed here; treat it as a signal to design against, not a penalty to price in.

**Privacy (GDPR and equivalents)**
- Explicit consent language on the form; no pre-checked opt-ins.
- Link the privacy policy from the popup itself.
- Honor unsubscribe and preference choices downstream.

**Accessibility**
- Keyboard navigable: Tab through, Enter to submit, **Esc to close**.
- Focus trap while open; focus returns to the triggering element on close.
- Screen-reader announced (role/dialog semantics, labelled).
- Sufficient contrast; never signal state by color alone.

## Measurement

Track, at minimum: popup views, form focus, submission attempts, successful submissions, close-button clicks, outside clicks, Esc presses.

Derived metrics:
- **Impression rate** — share of visitors who saw it (validates the trigger).
- **Conversion rate** — impressions → submissions.
- **Close rate** — dismissed without interacting (the annoyance proxy).
- **Engagement rate** — interacted before closing.
- **Time to close** — instant dismissal means the offer failed at a glance.

Upstream's typical conversion ranges, useful as a sanity check rather than a target: email capture 2–5%, exit intent 3–10%, click-triggered 10%+ (self-selected, so not comparable to the others). Replace with the account's own history as soon as there is any. Instrumentation itself belongs to [[analytics]].

The A/B backlog — placement, format, trigger, messaging, personalization, and frequency experiments — is in `references/experiment-library.md`. Test one variable at a time, per [[cro]]'s framework.

## Key concepts

- **Trigger** — the condition that fires the popup. Its quality is the signal it carries, not its cleverness.
- **Frequency cap** — the hard ceiling on impressions per visitor per window, plus the dismissal memory that enforces it.
- **Exclusion list** — the segments that must never see this popup (converted, subscribed, recently dismissed, mid-checkout).
- **Exit intent** — cursor-toward-chrome detection; desktop-only, needs an explicit mobile substitute.
- **Intrusive interstitial** — an overlay that blocks content on arrival; a page-experience negative on mobile, and the pattern most popup mistakes converge on.
- **Dismissal path** — every way out of the popup. Under-designing it costs the pageview, not just the opt-in.

## Process

1. Load `plans/marketing-context.md` — ICP, brand voice, forbidden words, existing offers.
2. Establish purpose (capture / magnet / discount / announcement / exit save / survey), current performance if any, and the traffic mix and page types in play.
3. Pick the trigger from the signal it carries, then set targeting and exclusions.
4. Choose the format per device, with the mobile variant designed separately — not scaled down.
5. Write copy from the formulas in `references/popup-types.md`; keep fields minimal (email alone unless there is a reason).
6. Set frequency caps, cool-down, and multi-popup precedence.
7. Run the compliance and accessibility checks above.
8. Define the measurement plan and the first test hypothesis.

## Output

- `plans/marketing/<campaign>/popup.md` — the spec: type, trigger, targeting, frequency, copy (headline / subhead / CTA / decline), desktop and mobile design notes, exclusions, precedence rules, measurement plan, and ranked test hypotheses.
- Multi-popup programs get one spec per popup plus an explicit conflict-rules section.
- Inline recommendations in the conversation for quick reviews.

## Cross-references

- `plans/marketing-context.md` — required hub (ICP, brand voice, offers)
- `.claude/workflows/cro-framework.md` — the 25-point checklist; load it when the work crosses into page-level conversion or test design
- `.claude/workflows/marketing-rules.md` — copy quality and brand-voice gates
- [[cro]] · [[signup]] · [[paywalls]] · [[copywriting]] · [[emails]] · [[email-sequence]] · [[analytics]] · [[seo-technical]] · [[marketing-ideas]]
- `.claude/skills/marketing/README.md` — full kit overview

## Provenance

Ported from `coreyhaines31/marketingskills` `skills/popups/` (MIT, (c) 2025 Corey Haines) and adapted for KitForge: directory and `name` renamed plural `popups` → singular `popup` to match ClauKit's skill directory; product-marketing context file swapped for `plans/marketing-context.md`; upstream's `lead-magnets` and `ab-testing` skill pointers dropped (no ClauKit equivalents) and rerouted to [[marketing-ideas]] and [[cro]]; upstream `evals/evals.json` not shipped (ClauKit marketing skills carry no eval harness); the `cro` boundary made explicit rather than a bare "see cro".
