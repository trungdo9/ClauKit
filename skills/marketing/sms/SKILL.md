---
name: sms
description: SMS and MMS marketing — opt-in mechanics, TCPA/carrier compliance, flow design (welcome, abandoned cart, post-purchase, win-back, replenishment), segment/character budgeting, cadence and frequency caps, platform selection, and revenue-per-send measurement. Use for "SMS marketing", "text message campaign", "SMS sequence", "abandoned cart text", "SMS compliance", "A2P 10DLC", "TCPA", "short code vs toll-free", "MMS campaign", "Klaviyo SMS", "Postscript", "Attentive", "Twilio", or "SMS vs email". For email sequences use email-sequence or emails; for phone-number capture on-site use popup.
allowed-tools: Read, Write, Glob, Grep
---

# SMS Marketing

> SMS earns the right to interrupt only because someone opted in. Every send costs money, spends attention, and carries legal exposure — so if the message could wait 24 hours, it is an email.

## When this skill activates

**Implicit:** planning, writing, or fixing an SMS/MMS program — welcome and opt-in confirmation texts, abandoned-cart and browse-abandonment flows, post-purchase and replenishment, win-back, promotional/flash sends, transactional and auth messages, opt-in disclosure copy, STOP/HELP handling, quiet-hours and frequency policy, "should we do SMS at all", "our opt-out rate is spiking".
**Explicit:** "Use the sms skill to [task]."
**Routed from:** `/mk:email sms` (the `sms` action names this skill directly), the `email-specialist` agent (email + SMS owner), and `.claude/workflows/crm-workflow.md` lifecycle stages that fire SMS alongside email.

## Scope

Covers:
- SMS/MMS flow design: trigger, delay, exit condition, copy, and segmentation per send.
- Opt-in mechanics and disclosure copy; STOP/HELP keyword handling; quiet hours.
- US compliance posture — TCPA consent tiers, A2P 10DLC registration, carrier expectations — plus non-US pointers.
- Segment/character budgeting (GSM-7 vs UCS-2), MMS trade-offs, cost-per-send discipline.
- Cadence, frequency caps, suppression, and sunset rules.
- Platform selection and the SMS-vs-email channel decision.
- Measurement: opt-in rate, CTR, revenue per send, opt-out rate per send.

Does NOT cover:
- Lifecycle/drip **email** nurture → [[email-sequence]].
- One-shot broadcast email campaigns to an owned list → [[emails]].
- Cold outbound to people with no relationship → [[cold-email]]. Cold SMS to non-consented numbers is out of scope entirely — it is not a copy problem, it is a consent problem.
- On-site phone-number capture popups and their design → [[popup]]; signup-flow field capture → [[signup]].
- Long-form copy the SMS links to → [[copywriting]].
- Attribution plumbing and UTM/event instrumentation → [[analytics]].

## Before writing

Load `plans/marketing-context.md` first (ICP, positioning, brand voice, forbidden words). Then confirm only what it does not answer:

1. **Geography** — US, EU/UK, Canada, or mixed. This changes the compliance approach entirely, not marginally.
2. **A2P 10DLC status (US)** — registered or not. Unregistered 10DLC traffic gets throttled or filtered; messages can show "delivered" and never arrive.
3. **Number type** — short code, toll-free, or 10DLC long code.
4. **List state** — email list size, SMS opt-in rate, current opt-out rate, revenue per send if any.
5. **Business model** — DTC/ecom, mobile app, B2B SaaS, services. SMS economics differ sharply.
6. **Goal** — revenue (promo, cart recovery, post-purchase), activation (welcome, milestone nudges), or transactional (order, auth, alerts).

If compliance blockers exist, surface them before designing anything. A beautiful flow on an unregistered number is wasted work.

## When SMS beats email

| Use case | Channel | Why |
|---|---|---|
| Abandoned cart recovery | SMS first | Read within minutes; email recovery lags by hours |
| Order / shipping updates | SMS | Wanted immediately, on the phone |
| Flash sale, limited drop | SMS | Urgency channel |
| Auth codes / 2FA | SMS or app | Latency-sensitive |
| Welcome series | Email primary, SMS layer | Email carries the long-form content |
| Educational nurture | Email | Too much text for SMS; segment costs stack |
| Newsletter | Email | Wrong channel for SMS |
| Win-back | Both | SMS for the nudge, email for the offer detail |
| Post-purchase upsell | SMS | Rides purchase momentum |

**Rule:** if it could wait 24 hours, send it by email.

## Compliance — read before designing

Compliance is the foundation, not a footer. The guidance below is **US-centric** — it reflects US federal law and US carrier practice as described by the upstream source, and does not transfer to the EU/UK, Canada, or Australia, each of which has its own consent regime (see `references/compliance.md`). This skill states operational practice, **not legal advice**, and does not determine whether a specific program is lawful.

**US — TCPA, the load-bearing rules:**

1. **Express written consent** is required for marketing SMS. An existing business relationship is not consent.
2. **Disclosure at the point of opt-in** must state: program/brand name, frequency expectation, STOP and HELP instructions, "Msg & data rates may apply", and a link to terms and privacy. Place it adjacent to the phone field, not in a footer.
3. **Consent is not a condition of purchase** — say so in the disclosure.
4. **Honor STOP within seconds**, every time, on every variant (STOP, END, CANCEL, UNSUBSCRIBE, QUIT, STOPALL, OPTOUT). Never require a login or a website visit to opt out.
5. **Honor HELP** with brand name, support contact, and STOP instructions.
6. **Quiet hours** — federal floor is 8am–9pm recipient-local; several US states and carrier guidance are stricter. Default to 9am–8pm recipient-local. Time zone inferred from area code is unreliable (people move); confirm the platform handles it.
7. **Keep auditable consent records** — timestamp, source, and the exact disclosure text shown.

**US — A2P 10DLC.** Sending marketing SMS over a 10-digit long code requires brand + campaign registration through The Campaign Registry via your platform. Registered sample message text must match what you actually send; mismatches get campaigns flagged. Register before you plan a launch date.

**Transactional messages** (order status, shipping, auth codes) sit in a separate consent bucket when directly tied to a transaction the user initiated — but they are still subject to registration and carrier rules, and must not carry marketing content riding along.

Full jurisdiction detail, opt-in disclosure template, and STOP/HELP response templates: `references/compliance.md`.

**PII:** phone numbers are PII. Per `.claude/workflows/automation-rules.md` §4, never write real subscriber numbers, names, or addresses into `plans/marketing/` files or summaries — design flows against tokens (`[FirstName]`, `[short.link]`) and keep subscriber data in the platform.

## Numbers and throughput (US)

| Type | Throughput | Relative cost | Fits |
|---|---|---|---|
| Short code (5–6 digit) | Highest | High monthly + setup | High-volume marketing; carrier-vetted, highest trust |
| Toll-free (1-8XX) | Moderate | Low monthly | Mid-volume B2C marketing and support |
| 10DLC long code | Low to moderate, trust-score dependent | Lowest monthly | SMB, conversational, transactional — requires A2P registration |

Rough sizing: list under ~10K → 10DLC; ~10K–100K → toll-free; 100K+ → short code. Confirm current pricing and throughput with the platform; both move.

## Message structure and segment budget

Every message: **sender ID → hook → value → single CTA + short link → compliance footer.** Recipients cannot see a "from" name — the brand must be inline ("From Acme: ...").

- **160 characters (GSM-7) = 1 segment.** Aim here.
- **Any emoji, accented character, or curly quote forces UCS-2 → 70 characters per segment.** One smart quote pasted from a doc can double the bill on a 100K send.
- **161–306 chars = 2 segments**, billed as two. Acceptable when the message earns it.
- **MMS** (image + longer body) costs several times an SMS. Reserve for high-impact moments.
- **One CTA, one link**, always shortened and UTM-tagged.
- **Compliance footer** — required on the opt-in confirmation and on a recurring basis thereafter; carrier guidance favors every promotional send.

**Voice:** conversational, no marketing-speak, no formatting, no subject-line thinking. Emoji sparingly and deliberately (they cost characters). ALL CAPS only for codes. First-name personalization when real; never fake intimacy.

## Flows and cadence

Priority order for DTC/ecom, highest return first: abandoned cart → welcome/opt-in → post-purchase → browse abandonment → win-back → replenishment → promotional sends.

- **Welcome / opt-in confirmation** — immediate confirmation + the promised incentive, compliance footer mandatory. Optional reminder at 24h, last-chance at 7 days.
- **Abandoned cart** — 30 min ("you left something"), 4h (soft urgency / social proof), 24h (discount, only if margin allows). **Never discount on send 1** — it trains abandonment. Exit on purchase or opt-out.
- **Browse abandonment** — one send ~1h after a meaningful browse signal (multiple product views or sustained time on page), not on a single pageview.
- **Post-purchase** — confirmation, shipment, delivery (transactional), then review prompt ~2 days after delivery and cross-sell ~14 days (marketing consent required).
- **Win-back** — 60–90 days after last purchase (no offer), +14 days (offer), +14 days (final, with an explicit opt-out invitation). Then suppress 90 days; sunset after two failed cycles.
- **Replenishment** — fire just before the expected reorder window for consumables; one nudge, one reminder.
- **Re-engagement** — for subscribers cold 60+ days: one soft send, then a "reply YES to stay" confirmation, then suppress and remove. Protects opt-out rate and spend.
- **Promotional** — 1–2 sends per campaign. Stagger against the email calendar; never same-day double-tap.

**Frequency caps:** 4–6 marketing sends per week per subscriber maximum, lower for new subscribers. Suppress anyone in an active automated flow from promotional sends. Cool off promotional sends for ~14 days after a discount-driven purchase. Throttle bulk sends — burst traffic triggers carrier filtering.

Full copy templates with character counts and exit conditions: `references/sequence-templates.md`.

## Platform selection

| Stack / goal | Pick | Why |
|---|---|---|
| DTC ecom already on Klaviyo email | Klaviyo SMS | One subscriber profile across email + SMS |
| Shopify ecom, SMS-first | Postscript | Deepest Shopify integration, strong cart flows |
| Mid-market ecom wanting full service | Attentive | Managed strategy + compliance tooling; contract-heavy |
| Custom build, transactional, B2B SaaS | Twilio | API-first, full control, you own compliance plumbing |
| Cost-sensitive custom build | Plivo | Twilio-shaped API at lower per-send cost |
| EU-first SMB, email + SMS combined | Brevo | GDPR-native, EU pricing |
| Local services SMB, simple blasts | SimpleTexting | Low complexity, keyword opt-in |
| Product-led SaaS with event tracking | Customer.io | Behavior-triggered SMS alongside email/push |

Whatever the pick, confirm it handles: A2P registration, STOP/HELP variants, recipient-local quiet hours, suppression lists, and timestamped consent records. Detail in `references/platforms.md`.

**ClauKit has no SMS-platform MCP wrapper.** Per `.claude/workflows/automation-rules.md` §6, run the manual path: this skill generates the flow spec, copy, and segment plan; the user builds it in the platform and pastes performance data back for analysis.

## Measurement

Track per send and per flow:

- **Opt-in rate** — share of email subscribers who join SMS. Quality beats volume; a small consented list outperforms a large scraped one.
- **CTR** — relevance signal; SMS clicks materially outperform email, which is why weak targeting hides for a while.
- **Conversion rate and revenue per send (RPS)** — the only numbers that justify the channel, because every send has a hard cost.
- **Opt-out rate per send** — the fatigue alarm. Watch the trend, not one send; a rising line means cadence or targeting is wrong.
- **Cost per send** and total program cost against revenue attributed.
- **List growth rate** — net of opt-outs.

UTM-tag every link (`utm_source=sms&utm_medium=sms&utm_campaign=<campaign>`) and set attribution up front — an unattributed SMS program cannot defend its budget. Benchmark ranges reported by SMS vendors are in `references/platforms.md`; treat them as directional, not as targets to promise.

**Test queue:** send time (afternoon vs evening, recipient-local), copy length (SMS vs MMS), discount amount and which send it lands on, personalization token present vs absent, CTA wording. One variable at a time.

## Pre-send gate

Refuse to hand over a send plan until every line passes:

- [ ] Consent basis identified for every segment in the send (marketing vs transactional).
- [ ] A2P 10DLC registered (US) and registered sample text matches the actual copy.
- [ ] Opt-in disclosure live, adjacent to the phone field, matching what was registered.
- [ ] STOP/HELP variants handled and verified from a real handset.
- [ ] Quiet hours enforced recipient-local at the platform.
- [ ] Sender identity inline in every message; compliance footer where required.
- [ ] Suppression applied: opt-outs, active-flow members, recent purchasers.
- [ ] Segment count and cost per send calculated (check for stray emoji/curly quotes).
- [ ] Short links UTM-tagged; conversion attribution live.
- [ ] No real subscriber PII written into any plan file.

## Common mistakes

1. Sending before A2P 10DLC registration — messages get filtered while dashboards report success.
2. Treating SMS as email — daily blasts spike opt-outs and kill the list.
3. Discounting on the first abandoned-cart send — teaches customers to abandon.
4. No brand name in the message body — recipients see a number, not a sender.
5. Ignoring quiet hours and recipient time zones.
6. Unverified STOP/HELP handling — non-negotiable and easy to break during a platform migration.
7. Emoji everywhere — halves the segment size and doubles cost.
8. Registered sample messages that do not match real sends.
9. No conversion attribution — the channel cannot justify its cost.
10. Unthrottled bulk sends — carrier filtering.

## Key concepts

- **Consent is the asset** — the list's value is the consent record behind it, not its row count. Everything else in this skill assumes valid, documented opt-in.
- **Every send has a hard cost** — unlike email, waste is billed. Cost pressure is what forces real segmentation.
- **Segment budget** — the character count is a billing unit, not a style guide; encoding choices (emoji, smart quotes) change the price.
- **Right to interrupt** — the test for any message: would the recipient be glad they got this text? If not, it goes to email or nowhere.
- **Immediacy premium** — SMS is worth its cost only where speed changes the outcome (cart, drop, delivery, auth).
- **Opt-out rate as a fatigue meter** — the earliest reliable signal that cadence or targeting has broken, well before revenue drops.
- **Transactional/marketing boundary** — a transactional message that carries a promotion becomes a marketing message, with the consent requirements that implies.

## Output

Routed through `/mk:email sms`, which writes under `plans/marketing/<campaign>/emails/`:
- `plans/marketing/<campaign>/emails/sms-<flow>.md` — per flow: trigger, delay, exit condition, copy with segment count, CTA/link, segmentation and suppression rules.
- `plans/marketing/<campaign>/emails/sms-compliance.md` — consent basis per segment, opt-in disclosure copy, STOP/HELP response text, quiet-hours policy, and the pre-send gate with each line resolved.

For SMS-only work invoked outside `/mk:email`, `plans/marketing/<campaign>/sms/<flow>.md` is the equivalent path. Either way: copy templates and token placeholders only — no subscriber phone numbers, names, or addresses in the file.

Or inline: a channel-fit recommendation, a compliance blocker review, or a diagnosis of an underperforming flow.

## Cross-references

- `plans/marketing-context.md` — required hub (ICP, positioning, brand voice, forbidden words)
- `.claude/workflows/automation-rules.md` — §4 PII handling (phone numbers are PII), §6 manual fallback, §7 output conventions
- `.claude/workflows/marketing-rules.md` — copy quality gates, anti-patterns
- `.claude/workflows/crm-workflow.md` — lifecycle stages that trigger SMS alongside email
- [[emails]] — one-shot broadcast campaigns to an owned list
- [[email-sequence]] — lifecycle/drip email nurture; SMS layers on top of it, it does not replace it
- [[cold-email]] — cold outbound (email); cold SMS is not a supported pattern
- [[popup]] — on-site phone-number capture, where the opt-in disclosure has to live
- [[signup]] — signup-flow field capture and consent checkbox placement
- [[copywriting]] — the landing pages and long-form copy SMS links to
- [[analytics]] — attribution, UTM plumbing, revenue-per-send reporting
- [[launch]] — coordinating promotional SMS with a launch calendar
- `references/compliance.md` · `references/sequence-templates.md` · `references/platforms.md`
- `.claude/skills/marketing/README.md` — full kit overview

## Provenance

Imported from `coreyhaines31/marketingskills` (`skills/sms/`, MIT, © 2025 Corey Haines) and adapted for ClauKit: ClauKit frontmatter and wikilink cross-references, product-marketing context file replaced by `plans/marketing-context.md`, output wired to the `/mk:email sms` path, PII handling bound to `.claude/workflows/automation-rules.md` §4, upstream tools-registry/MCP columns and pointers to skills ClauKit lacks (ab-testing, churn-prevention, lead-magnets) dropped, unsourced settlement-cost claims removed, and US-specific rules explicitly marked as US-specific. The three source reference files are ported with the same adaptation.
