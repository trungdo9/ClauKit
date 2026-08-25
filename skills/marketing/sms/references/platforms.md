# SMS Platforms & Benchmarks

_Ported for ClauKit from `coreyhaines31/marketingskills` (MIT, © 2025 Corey Haines)._

> Pricing, throughput, and feature sets change constantly and vary by contract, volume, and country. Every figure here is as reported by the source at the time of writing — directional only. Confirm at the vendor before committing. ClauKit ships **no SMS-platform MCP wrapper**: whichever platform is chosen, the build happens in the vendor UI/API by the user, and this skill produces the spec (`.claude/workflows/automation-rules.md` §6, manual fallback).

---

## Klaviyo SMS

**Best for:** DTC ecom already on Klaviyo for email.

- Shared subscriber profile and flow builder across email and SMS — one segmentation model, not two.
- A2P 10DLC registration handled in-platform; toll-free and short-code provisioning available.
- Quiet hours enforced per recipient time zone (configurable).
- Direct Shopify / WooCommerce / BigCommerce / Magento integrations, plus API.
- Watch: combined email + SMS billing scales fast on large lists; short-code overhead only pays off at high subscriber counts.

## Postscript

**Best for:** Shopify-native DTC brands wanting SMS-specific tooling.

- Deepest Shopify integration of the SMS platforms; strong cart and browse-abandonment automations.
- Conversational SMS with live agent; AI auto-reply trained on brand voice.
- A2P handled in-platform; solid opt-in tooling (popup builder, keyword opt-in); quiet hours enforced.
- Watch: cost steps up sharply above the entry tier; limited value off Shopify.

## Attentive

**Best for:** mid-market and enterprise DTC wanting a managed program.

- Full service — dedicated CSM, copy and strategy support, concierge SMS selling.
- Strong analytics/attribution and identity resolution; short-code provisioning typically included.
- Best-in-class compliance tooling and audit support; A2P fully managed.
- Watch: custom annual contracts with real lock-in; rarely justified below a large subscriber base.

## Twilio

**Best for:** custom builds, transactional SMS, B2B SaaS embedding SMS in a product.

- Raw API, pay-per-send, very broad global coverage; voice, WhatsApp, RCS alongside.
- Studio gives a visual flow builder for non-code automation.
- A2P registration is in-platform but self-served — brand fee plus a per-campaign monthly cost.
- Watch: **compliance plumbing is yours** — quiet hours, STOP/HELP, suppression, consent records. No segmentation or marketing UI; usually paired with Customer.io, Segment, or a custom orchestration layer.

## Plivo

**Best for:** cost-sensitive custom builds.

- Twilio-shaped API at a lower per-send price point; Powerpack for bulk sending across number pools with a sticky sender.
- A2P handled in-platform; WhatsApp and voice available.
- Watch: same responsibility model as Twilio (you own STOP/HELP and quiet hours); smaller ecosystem and fewer integrations.

## Brevo

**Best for:** EU-first SMB running email + SMS together.

- Combined email, SMS, WhatsApp, and CRM on one platform; EU-headquartered, GDPR-native.
- Direct Shopify / WooCommerce / WordPress / Magento integrations, plus API.
- Watch: US SMS feature depth lags the US-focused platforms; A2P support is less polished.

## SimpleTexting

**Best for:** SMB and local services — gyms, salons, real estate.

- Easy UI, keyword opt-in for grassroots list building, built-in opt-in landing pages, simple automation.
- A2P handled; basic TCPA tooling.
- Watch: shallow automation compared with Klaviyo/Postscript; US-focused.

## AudienceTap

**Best for:** DTC brands wanting AI-forward creative tooling or on-pack QR opt-in as an acquisition channel.

- SMS + email combined; AI copy/creative generation; QR insert-card opt-in driving list growth from shipped orders.
- Ecom integrations and webhooks; A2P handled in-platform.
- Watch: newer entrant — confirm what is GA versus beta, and verify compliance depth before running a large list on it.

## Customer.io

**Best for:** product-led SaaS and apps with real event tracking.

- SMS triggered off product events (signup, milestone, churn risk); strong segmentation and workflow builder; email and push alongside.
- Granular subscription and consent management; SMS delivered via Twilio or native depending on setup.
- Watch: less ecom-tailored than Klaviyo/Postscript.

---

## Quick selection

| Stack / goal | Pick | Why |
|---|---|---|
| Shopify ecom, already on Klaviyo | Klaviyo SMS | One platform, one subscriber profile |
| Shopify ecom, SMS-first | Postscript | Deepest Shopify + SMS-specific features |
| Mid-market ecom, wants concierge support | Attentive | Full-service team and tooling |
| Custom platform, B2B SaaS, transactional | Twilio | API-first, full control |
| Custom build, cost-sensitive | Plivo | Lower per-send cost, same model as Twilio |
| DTC wanting AI creative or on-pack QR opt-in | AudienceTap | Insert-card opt-in is unusual leverage |
| EU-based SMB | Brevo | GDPR-native, EU-friendly pricing |
| Local services SMB, simple campaigns | SimpleTexting | Easy UI, low overhead |
| Product-led SaaS with event tracking | Customer.io | Behavior-based triggers |

---

## Platform capability checklist

Whatever the pick, confirm it handles all of these before migrating a list onto it:

- [ ] Brand and campaign registration with TCR (US)
- [ ] Registered sample message text kept aligned with actual sends
- [ ] Opt-in flow documentation submitted to carriers
- [ ] Trust-score visibility and a path to improve it
- [ ] Throughput appropriate to list size and send frequency
- [ ] STOP/HELP keyword handling across all variants
- [ ] Quiet hours by recipient time zone
- [ ] Suppression-list management
- [ ] Consent records with timestamps, exportable

The managed platforms cover all of these. Twilio and Plivo cover the registration and delivery layers and push the rest onto the implementer — budget engineering time for it.

---

## Benchmark ranges (directional)

Vendor-reported ranges for DTC ecom, as stated by the source. Not independently verified, not stable over time, and not a promise to make in copy. Use them to sanity-check a program, never as a target handed to a client.

| Metric | Reported range | Read it as |
|---|---|---|
| Opt-in rate (share of email subscribers) | 5–25% | Top-of-funnel health; quality beats volume |
| CTR per send | 8–15% | Materially above email; weak targeting hides here early |
| Conversion rate per promotional send | 1–5% | Revenue impact |
| Revenue per send | $0.20–$2.00 | The number that justifies the channel |
| Opt-out rate per send | under ~2%, lower for promotional | Fatigue alarm — watch the trend |
| Cost per SMS (US) | ~$0.0075–$0.04, MMS several times higher | Plus carrier surcharges and number/lease fees |
| List growth | 5–15%/month early, 1–3% steady-state | Net of opt-outs |

Cost per send is the one figure to compute for real rather than assume: multiply actual segment count (after encoding check) by the platform's current per-segment price plus carrier surcharge, times list size.
