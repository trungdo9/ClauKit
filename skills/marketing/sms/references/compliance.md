# SMS Compliance Reference

_Ported for ClauKit from `coreyhaines31/marketingskills` (MIT, © 2025 Corey Haines)._

> **Operational guidance, not legal advice.** Every rule, figure, and date below is as stated by the source and reflects the regime at the time it was written. Statutes, state rules, and carrier policy all change. Nothing here determines whether a specific program is lawful. For any program at meaningful scale or revenue, have counsel with SMS/telecom experience review the consent flow, the disclosure text, and the records.

---

## United States — TCPA

The Telephone Consumer Protection Act regulates marketing calls and texts. The FCC enforces it; private plaintiffs also sue under it. The source states statutory damages of **$500–$1,500 per message**, which is what makes class exposure the real risk rather than any single send. Verify the current figure and the current interpretation before relying on it.

### Consent tiers

| Type | Covers | Captured how |
|---|---|---|
| Express written consent | Marketing SMS — sales, promotions, offers | Checkbox or keyword opt-in with full disclosure, recorded electronically with timestamp |
| Express consent (non-written) | Informational / transactional — delivery, account alerts | Number provided during a transaction, with awareness it will be used to text |
| Established business relationship | **Not sufficient for marketing SMS** | Does not apply |

### Express written consent — what the opt-in must capture

1. The recipient agreed to receive marketing SMS from your brand specifically.
2. The recipient was told consent is **not a condition of purchase**.
3. The disclosure shown included: frequency expectation, message-and-data-rates notice, STOP and HELP instructions, and links to terms and privacy.
4. The agreement was recorded electronically with a timestamp.

### Opt-in disclosure template

```
By signing up via text, you agree to receive recurring automated promotional and
personalized marketing text messages (e.g., cart reminders) from [Brand] at the
cell number used when signing up. Consent is not a condition of any purchase.
Reply HELP for help and STOP to cancel. Msg frequency varies. Msg & data rates
may apply. View [Terms](link) and [Privacy](link).
```

Place it **directly adjacent** to the phone-number field and the submit button. Not in a page footer, not behind a link.

### Quiet hours (US)

- **Federal floor:** 8am–9pm in the recipient's local time.
- **Stricter states named by the source:** Florida, Oklahoma, Washington (8am–8pm). Other states have since added or amended rules — check current state law for your send geography.
- **Carrier guidance:** 9am–8pm recipient-local.
- **Practical default:** 9am–8pm recipient-local.

Time zone is usually inferred from area code, and area codes lie — people keep numbers when they move. Major platforms handle recipient-local scheduling; verify yours does rather than assuming.

### STOP / HELP handling

**STOP variants to honor:** STOP, END, CANCEL, UNSUBSCRIBE, QUIT, STOPALL, OPTOUT.

STOP response:
```
You're unsubscribed from [Brand] alerts. No more messages will be sent. Reply HELP for help.
```

**HELP variants:** HELP, INFO.

HELP response:
```
[Brand] alerts: For help, visit [URL] or email [support@brand.com]. Msg & data rates may apply. Reply STOP to cancel.
```

Rules:
- Honor STOP within seconds, every time, on every variant.
- Never require a login, a website visit, or a reply-with-reason to opt out.
- One STOP confirmation is allowed. Nothing after it.
- HELP responses are not marketing messages and are not bound by quiet hours.

### Footer language by message type

- **Opt-in confirmation:** "Reply HELP for help, STOP to cancel. Msg & data rates may apply." — required.
- **Recurring promotional:** "Reply STOP to opt out" — required on a recurring basis (the source states a quarterly minimum); carrier guidance favors every send.
- **Transactional:** not required by TCPA per the source, but carriers expect it — include it.

---

## United States — A2P 10DLC

Application-to-Person registration for 10-digit long codes, run through The Campaign Registry (TCR), required for business SMS over 10DLC since 2022. Carriers enforce it; unregistered traffic is throttled or blocked, and messages can report "delivered" while never arriving.

**Registration has three parts:**

1. **Brand** — legal entity name, EIN, business type. A trust score is assigned; higher trust means better throughput.
2. **Campaign** — one per use case (Marketing, Account Notification, Customer Care, 2FA, Delivery Notification, …), with sample message text, opt-in flow description and screenshot, opt-out language, help language, and volume estimate.
3. **Number assignment** — phone numbers attached to campaigns.

**Throughput** scales with trust score and use case: verified brands get materially higher per-second throughput than standard brands; unregistered traffic is effectively unusable. Exact tiers vary by carrier and change — get current numbers from the platform.

**Common rejections:**
- Sample message text does not match actual sends.
- Opt-in screenshot does not show the required disclosure language.
- SHAFT content (sex, hate, alcohol, firearms, tobacco) without an explicit use case.
- Vague campaign descriptions.

**Lead time:** the source states 1–7 business days. Plan registration before committing to a launch date.

---

## EU / UK — GDPR + ePrivacy

- **Explicit opt-in** by clear affirmative action; no pre-checked boxes.
- **Specific** to marketing SMS, separate from generic terms acceptance.
- **Informed** — the data subject knows who is processing and why.
- **Freely given** — not bundled with access to the service.
- Sender identity and an easy opt-out in every message.
- Data-subject rights apply: access (DSARs) and deletion.
- Consent records retained for the duration of processing plus the applicable limitation period.

The source states GDPR exposure of up to €20M or 4% of global annual revenue, whichever is higher. This is the general GDPR ceiling, not an SMS-specific penalty.

---

## Canada — CASL

- **Express consent** — explicit opt-in, comparable in standard to US express written consent.
- **Implied consent** — an existing business relationship within 24 months; limited and expiring.
- Every message carries: sender identification (legal and operating names), mailing address, a contact method, and a working unsubscribe honored within 10 business days.
- The source states penalties up to CAD $10M per violation, enforced by the CRTC.

---

## Australia — Spam Act 2003

- Express or inferred consent (inferred applies narrowly).
- Sender ID required.
- Functional unsubscribe required.
- Enforced by ACMA.

---

## Multi-jurisdiction programs

Sending across regions at once:

- Default to the **strictest** applicable standard rather than per-region branching logic that will drift.
- Track consent jurisdiction per subscriber, not per campaign.
- Quiet hours at 9am–8pm recipient-local everywhere.
- Include every required identifier in every message.

---

## Audit-ready checklist

- [ ] A2P 10DLC registration complete (US, if sending over 10DLC)
- [ ] Opt-in flow shows all required disclosures adjacent to the phone field
- [ ] Disclosure text matches the A2P-registered sample messages
- [ ] Opt-in event captures timestamp, source/page URL, and the exact disclosure shown
- [ ] STOP and HELP honored across all keyword variants
- [ ] Quiet hours enforced at platform level, recipient-local
- [ ] Privacy policy has an SMS section; terms have SMS terms
- [ ] Consent records retained per applicable law
- [ ] Process in place for consent revocation and, in the EU/UK, DSARs
- [ ] Sender identity inline in every message
- [ ] Compliance footer on promotional sends
- [ ] STOP/HELP tested from a real handset on a recurring schedule (and after every platform change)

---

## ClauKit notes

- Phone numbers, names, and addresses are PII under `.claude/workflows/automation-rules.md` §4 — never write subscriber data into `plans/marketing/` files, logs, or summaries. Design against tokens.
- Consent records live in the SMS platform, not in this repo.
- ClauKit ships no SMS-platform MCP wrapper; compliance configuration is done by the user in the platform (§6 manual fallback).
