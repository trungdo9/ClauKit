# SMS Sequence Templates

_Ported for ClauKit from `coreyhaines31/marketingskills` (MIT, © 2025 Corey Haines)._

> Character counts assume GSM-7 encoding (160 chars per segment). Any emoji, accented character, or curly quote forces UCS-2 at 70 chars per segment — recount after every edit. Tokens: `[Brand]`, `[FirstName]`, `[product]`, `[short.link]`. Timings are starting points, not universal optima; test them. Compliance footers follow `references/compliance.md`. Never substitute real subscriber data into a template stored in `plans/marketing/` — see `.claude/workflows/automation-rules.md` §4.

---

## Welcome / opt-in confirmation

**Send 1 — immediate on opt-in** (footer required on this send)
```
From [Brand]: Welcome! Here's your 10% off code: WELCOME10. Shop now: [short.link]
Reply STOP to opt out, HELP for help. Msg & data rates may apply.
```
~155 chars / 1 segment — tight; re-count if the brand name is long.

**Send 2 — +24h (optional)**
```
From [Brand]: Don't forget your code WELCOME10 — expires in 48hrs. Top picks: [short.link]
```
~108 chars / 1 segment.

**Send 3 — +7d (optional, only if no purchase)**
```
From [Brand]: Last chance for 10% off with WELCOME10. Expires tonight at midnight: [short.link]
```
~107 chars / 1 segment.

Exit on purchase or opt-out.

---

## Abandoned cart (highest-return ecom flow)

**Send 1 — +30 min**
```
From [Brand]: Hey [FirstName], you left something behind! Your cart's here: [short.link]
```
~95 chars / 1 segment.

**Send 2 — +4h if no purchase**
```
From [Brand]: Items in your cart are selling fast. Reserved for you for 24hrs: [short.link]
```
~98 chars / 1 segment. Only claim reservation if it is true.

**Send 3 — +24h if no purchase, discount only if margin allows**
```
From [Brand]: Still thinking? Here's 10% off to seal the deal: SAVE10. Shop: [short.link]
```
~99 chars / 1 segment.

Rules:
- No discount on send 1 — it trains customers to abandon deliberately.
- Exclude low cart values and repeat abandoners gaming the discount.
- Exit on purchase, opt-out, or 48h elapsed.

---

## Browse abandonment

**Send 1 — +1h after a meaningful browse signal**
```
From [Brand]: Still thinking about [product]? Take another look: [short.link]
```
~84 chars / 1 segment.

Trigger on real intent (several product views, or sustained time on a product page), never a single pageview. Suppress if a different product was purchased.

---

## Post-purchase

**Send 1 — immediate (transactional)**
```
From [Brand]: Order #12345 confirmed! We'll text shipping updates here. Track: [short.link]
```
~95 chars / 1 segment.

**Send 2 — on shipment (transactional)**
```
From [Brand]: Your order's on the way. Estimated delivery: [date]. Track: [short.link]
```
~92 chars / 1 segment.

**Send 3 — on delivery (transactional)**
```
From [Brand]: Your order should arrive today! Questions? Reply or visit [short.link]
```
~88 chars / 1 segment.

**Send 4 — +2d after delivery (marketing consent required)**
```
From [Brand]: How are you liking your [product]? Share a review for 15% off next order: [short.link]
```
~108 chars / 1 segment.

**Send 5 — +14d after delivery (cross-sell, marketing consent required)**
```
From [Brand]: Goes great with your [product]: [related-item]. 10% off bundle: [short.link]
```
~99 chars / 1 segment.

Sends 1–3 are transactional; sends 4–5 are marketing and need marketing consent. Do not fold a promotion into sends 1–3 — that converts them into marketing messages.

---

## Win-back (lapsed customers)

**Send 1 — 60–90 days after last purchase, no offer**
```
From [Brand]: [FirstName], we miss you! Picks we think you'll love: [short.link]
```
~84 chars / 1 segment.

**Send 2 — +14d if no purchase**
```
From [Brand]: Come back for 15% off your next order: COMEBACK15. Expires in 7 days: [short.link]
```
~106 chars / 1 segment.

**Send 3 — +14d, final**
```
From [Brand]: Last chance — 20% off ends tonight: COMEBACK20. We'll stop texting if you'd rather: reply STOP. [short.link]
```
~130 chars / 1 segment.

After send 3 with no engagement, suppress for 90 days. After two full cycles, sunset the subscriber.

---

## Re-engagement (cold subscribers, 60+ days no engagement)

**Send 1 — soft**
```
From [Brand]: We've missed you, [FirstName]! Here's what's new: [short.link]
```
~80 chars / 1 segment.

**Send 2 — confirm interest**
```
From [Brand]: Want to keep hearing from us? Reply YES to stay on the list, or STOP to opt out.
```
~98 chars / 1 segment.

No reply → suppress 60 days, then remove from the active list. This protects the opt-out rate and stops paying for dead numbers.

---

## Replenishment (consumables)

**Send 1 — just before the expected reorder window**
```
From [Brand]: Running low on [product]? Reorder in one tap: [short.link]
```
~73 chars / 1 segment.

**Send 2 — +7d if no purchase**
```
From [Brand]: Don't run out! 10% off your reorder of [product]: REFILL10 [short.link]
```
~92 chars / 1 segment.

Window comes from actual usage cycle (a 30-day supply nudged around day 28), not a generic delay.

---

## Promotional / campaign

**Flash sale — single send**
```
From [Brand]: 24-HOUR FLASH: 25% off everything with FLASH25. Ends midnight: [short.link]
```
~94 chars / 1 segment.

**Drop / launch**
```
From [Brand]: New drop just landed: [product-name]. Limited stock, members get early access: [short.link]
```
~115 chars / 1 segment.

**Peak-season two-send**
```
From [Brand]: Black Friday is LIVE — up to 50% off sitewide. Shop now: [short.link]
From [Brand]: Last 6 hours of savings. Don't miss out: [short.link]
```
~92 and ~66 chars / 1 segment each. Second send lands the evening of expiry.

Urgency claims must be real — a countdown that resets destroys the channel faster than any opt-out rate.

---

## Transactional / account notifications

```
[Brand]: Order #12345 confirmed. Total $XX.XX. Track at [short.link]. Reply HELP for help.
[Brand]: Your order #12345 shipped! Track: [short.link]. ETA [date].
[Brand]: Order #12345 delivered. Enjoy! Issues? Reply or [support-link].
[Brand] verification code: 123456. Expires in 10 min. Do not share.
[Brand]: Sign-in from new device in [location]. Wasn't you? Secure: [short.link]
```

Auth codes carry no marketing content and no links beyond the security action.

---

## VIP / loyalty

Higher frequency is tolerated; quiet hours and STOP are not optional for VIPs either.

```
From [Brand]: VIPs get the new drop 24hrs early. Yours now: [short.link]
From [Brand]: You've reached Gold status! Your perks: 15% off + free shipping. [short.link]
```
~72 and ~95 chars / 1 segment each.

---

## Segmentation rules that apply to every flow

- **Suppress** subscribers inside an active automated flow from promotional sends — no double-tap.
- **Suppress** opt-outs everywhere (the platform enforces this; verify after any migration).
- **Frequency cap:** 4–6 marketing sends per week per subscriber, lower for new subscribers.
- **Quiet hours:** 9am–8pm recipient-local.
- **Cool-off:** after a discount-driven purchase, no promotional sends for ~14 days.
- **Stagger against the email calendar** — SMS and email hitting the same person the same hour reads as one brand shouting twice.
