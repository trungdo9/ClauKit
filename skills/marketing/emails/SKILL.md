---
name: emails
description: One-shot broadcast email campaigns — a single send to a list or segment. Announcement, product update, launch email, promo or seasonal offer, newsletter/roundup, pricing-change notice, webinar invite, review ask, referral ask, milestone or usage recap. Covers subject line + preview text craft, single-email structure, one primary CTA, segment selection, send timing, list hygiene and deliverability, and open/click/unsub measurement. Triggers on "write an email campaign", "announcement email", "promo email", "newsletter", "email blast", "subject lines for this send", "our open rates dropped". For multi-email automated flows (welcome, onboarding, nurture, win-back) use email-sequence; for cold outbound to strangers use cold-email.
allowed-tools: Read, Write, Glob, Grep
---

# Emails — One-Shot Campaign Sends

> One email, one job, one CTA, one send. A broadcast gets a single pass through the inbox: the subject line earns the open, the first line earns the scroll, and one link earns the click. Everything that needs a second and third touch belongs in a sequence, not here.

## When this skill activates

**Implicit:** "write an announcement email", "we're launching Tuesday, email the list", "promo email for Black Friday", "monthly newsletter", "email our users about the price change", "give me subject lines for this send", "our open rates tanked".
**Explicit:** "Use the emails skill to [task]."
**Routed from:** `/mk:email campaign` (paired with [[copywriting]]), `/mk:cro email` (subject/CTA/click-through audit, paired with [[cro]]), `/mk:growth launch` (launch-day announcement, alongside [[launch]]), `.claude/workflows/seo-workflow.md` Phase 5 (repurpose a published article into a send).

## Scope

Covers:
- Writing one email to be sent once, to a list or a segment, on a chosen date.
- Subject line + preview text craft, and A/B variants of them.
- Single-email structure: hook, context, value, one primary CTA, sign-off.
- Segment selection, send timing, suppression, list hygiene, deliverability basics.
- Auditing an existing send for conversion (subject, CTA, click-through) and diagnosing open-rate decline.
- A **campaign burst**: 2-4 calendar-scheduled broadcasts around one offer (announce → reminder → last chance). Each is a one-shot send; the calendar is not an automation.
- Measurement: open, click, click-to-open, unsub, conversion for the send.

Does NOT cover:
- Multi-email automated flows triggered by a user action — welcome, onboarding, nurture, re-engagement, failed-payment dunning, trial expiry, win-back → [[email-sequence]].
- Cold outbound to people who never opted in, and its follow-up steps → [[cold-email]].
- SMS sends and their compliance rules → [[sms]].
- In-product onboarding that email merely supports → [[user-onboarding]].
- Email capture (the form/popup that builds the list) → [[popup]], [[signup]].
- The landing page the email links to → [[copywriting]], [[cro]].

**Boundary test:** if the email is scheduled for a date, it is here. If it is scheduled for "2 days after the user does X", it is [[email-sequence]].

## The send brief (fill before writing a word)

Load `plans/marketing-context.md` first — ICP, positioning, brand voice, forbidden words. Then pin down:

| Field | Why it decides the copy |
|---|---|
| **Audience segment** | Who receives it, and who is suppressed. "Everyone" is a decision, not a default. |
| **What they already know** | A launch email to a waitlist and to a cold-ish house list are different emails. |
| **One job** | The single action this send exists to produce. If you can name two, write two sends. |
| **Primary CTA + destination** | Button text and the exact URL. If the destination is not ready, the send is not ready. |
| **Send date/time + timezone** | Local-time sending is the default assumption. |
| **Success metric** | The number that would make this send worth having sent. |

If any field is unknown, ask before drafting. Do not invent a segment size, a discount, a date, or a result.

## Campaign types

Each type has its own trigger, structure, and metric. Full playbooks in `references/campaign-types.md`.

| Type | Job | Primary metric |
|---|---|---|
| Product update / feature announcement | Adoption of the new thing | Feature-page clicks, activation |
| Launch announcement | Traffic + signups on launch day | Clicks, signups |
| Promo / seasonal offer | Redemptions inside a window | Conversion, revenue |
| Newsletter / monthly roundup | Engagement, list warmth | CTOR, unsub rate |
| Pricing-change notice | Transparent notice, minimal churn | Churn in the notice window |
| Event / webinar invite | Registrations | Registration rate |
| Review ask | Public social proof | Reviews published |
| Referral ask | Shares from happy customers | Referral link clicks |
| Milestone / usage recap | Reminder of value delivered | Opens, return visits |
| Content repurpose (article → send) | Distribution of a published piece | Clicks to the article |

## Subject line and preview text

The subject is the only part most of the list will ever read. Draft five, ship the two best as an A/B.

- **Clear beats clever.** Specific beats vague. Curiosity is a tactic, not a strategy — it burns trust if the body does not pay it off.
- **40-60 characters.** Mobile clients truncate past that; front-load the meaning.
- **Emoji are polarizing.** Test them for your list rather than assuming.
- **No false urgency, no fake "Re:", no misleading personalization.** Deceptive subjects are an auto-reject (marketing-rules §7) and a spam-complaint generator.

Patterns that carry a one-shot send:

| Pattern | Shape | Fits |
|---|---|---|
| Direct | "[Thing] is live" | Launches, product updates |
| Question | "Still doing [painful thing] by hand?" | Promo, re-activation of an idea |
| Number | "3 ways to [outcome]" | Newsletter, roundup |
| Personal-data | "[Name], your [thing] is ready" | Milestone, usage recap |
| Story tease | "The mistake we made with [topic]" | Article repurpose, newsletter |
| Plain notice | "A change to your plan on [date]" | Pricing, policy, renewal |

**Preview text** is a second headline, not a repeat. 90-140 characters, completes the thought the subject opened. Left empty, most clients render the first line of the body or an unsubscribe link.

## Email structure

1. **Hook** — first line, visible in the preview pane. Never a greeting-only opener.
2. **Context** — why this matters to *this* segment, in one or two sentences.
3. **Value** — the substance: what shipped, what the offer is, what the article argues.
4. **CTA** — one primary action, as a button, above the point where a phone screen ends.
5. **Sign-off** — a human name. Broadcasts from `noreply@` read as broadcasts.

Formatting: 1-3 sentence paragraphs, whitespace between blocks, bullets for scannability, bold sparingly, mobile-first. Tone: conversational, second person, active voice — read it aloud; if it does not sound like a person, rewrite.

Length by type: 50-125 words for a pure notice; 150-300 words for an announcement or educational send; 300-500 words when the story *is* the value. Long is allowed only when long is better.

**CTA rules:** one primary CTA, repeated at most twice (once mid-body, once at the end) pointing at the *same* URL. Secondary items stay as in-text links. Button text is action + outcome ("Start your first project"), never "Click here" or "Learn more" (marketing-rules §7). Every link is tracked and every link is checked before send.

## Segment, timing, hygiene

- **Segment before you write.** A relevant send to 20% of the list beats a generic send to 100% — on clicks and on unsub rate.
- **Suppress** anyone the send would insult: recent purchasers on a "buy now" promo, users already on the feature, cancelled accounts on a renewal notice, anyone in an active sequence covering the same message.
- **Timing:** B2B weekdays, B2C worth testing weekends; send at the recipient's local time. Your own list's history outranks any published "best time".
- **Frequency:** each extra send costs list health. If a broadcast has to fight a running sequence for the same inbox, one of them is postponed.
- **Hygiene:** never send to a purchased or scraped list. Prune hard bounces immediately and long-term non-openers on a stated sunset policy — the deliverability gain outweighs the list-size vanity.
- **Compliance:** honest sender identity, working one-click unsubscribe, physical address, honoured opt-outs. Unsubscribes are healthy; complaints are not.
- **PII:** never write real subscriber emails, names, or addresses into `plans/marketing/**` (automation-rules R4). Use merge tokens and redacted examples.

## Diagnosing a bad send

Open rate fell? Do not start with subject lines — they are one of five causes and rarely the biggest.

1. **Deliverability / sender reputation** — spam-folder placement, authentication (SPF/DKIM/DMARC), a shared IP gone bad, a recent complaint spike.
2. **List decay** — dead addresses and long-term non-openers dragging the denominator; a sunset policy fixes it.
3. **Frequency fatigue** — the cadence rose and relevance did not.
4. **Segmentation** — broadcasts going to people the content does not fit.
5. **Subject/preview quality** — real, but test it after the four above are ruled out.

Note that open rate is a degraded signal since mail-privacy image proxies inflate it. Judge sends on **click-to-open** and conversion; use opens for trend only.

## Auditing an existing send

For `/mk:cro email`, score the send and return ranked fixes, highest-impact first:

subject + preview (clarity, length, promise kept) · first line (does it work in a preview pane) · one-job test (count the asks) · CTA (button, placement, copy, single destination) · mobile render · link integrity · segment fit · sender identity · unsubscribe present. Cross-check the CTA against the [[cro]] 25-point framework (`.claude/workflows/cro-framework.md`) — a broadcast CTA obeys the same rules as a landing-page CTA.

## Measuring and testing

- **Test one variable per send.** Subject lines carry the most upside; then send time, CTA copy, length, personalization depth.
- A split needs enough recipients to separate signal from noise. On a small list, treat a result as a hint and re-run it.
- **Track:** delivered, open, click, click-to-open, unsub, complaint, and the conversion the send existed to cause.
- Upstream rules of thumb — 20-40% open, 2-5% click, unsub under 0.5% — vary enormously by industry and list source. Use your own last 10 sends as the baseline, and record it; do not report a benchmark as a result.
- Write learnings back so the next send starts ahead. No invented numbers (marketing-rules §2).

## Repurposing an article into a send

Phase 5 of `.claude/workflows/seo-workflow.md`. The email is not the article:
pick the single most useful idea in the piece → state it in the body in ~120 words so the email stands alone → one CTA to the full article → subject from the idea, not the SEO title (the H1 was written for a SERP, the subject is written for an inbox).

## Key concepts

- **One email, one job** — a second CTA does not add a second conversion, it splits the first.
- **Value before ask** — a list that only hears from you when you want something stops opening.
- **Relevance over volume** — fewer, better-targeted sends beat more sends, on every metric including revenue.
- **Campaign burst ≠ sequence** — 3 calendar-scheduled sends around one offer are three broadcasts; a triggered flow is [[email-sequence]].
- **Deliverability is earned** — reputation is built by engagement and destroyed by sending to people who do not want it.

## Output

- `plans/marketing/<campaign>/emails/<send-slug>.md` — the send: segment + suppression, send date/time, subject A/B, preview text, full body, CTA + destination URL, success metric.
- `plans/marketing/<campaign>/emails/<send-slug>-audit.md` — for audit runs: ranked findings with the current copy and the proposed fix.
- Inline subject-line variants and quick rewrites in conversation.

Sending is out of scope for the skill itself — ClauKit's send path is the `mcp-sendgrid` / `mcp-resend` wrappers with a manual fallback (`.claude/workflows/automation-rules.md`). Draft-default: never send without explicit confirmation echoing segment, size, and subject.

## Cross-references

- `plans/marketing-context.md` — required hub (ICP, positioning, brand voice, forbidden words)
- [[email-sequence]] — multi-email automated flows (the other half of the split)
- [[cold-email]] — cold outbound to non-subscribers
- [[copywriting]] — paired with this skill on `/mk:email campaign`; also the landing page the CTA points at
- [[cro]] — CTA and click-through audit; `.claude/workflows/cro-framework.md` 25-point checklist
- [[copy-editing]] — pass every draft through before send
- [[launch]] — launch mechanics that the announcement email is one touchpoint of
- [[social-content]] — the same announcement, adapted for rented channels
- [[sms]] — the SMS equivalent of a broadcast
- [[analytics]] — instrumenting the destination so the click is attributable
- `.claude/workflows/marketing-rules.md` — §2 (no fluff, no invented metrics), §3 quality gates, §7 anti-patterns
- `.claude/workflows/automation-rules.md` — send wrappers, idempotency, PII redaction
- `.claude/skills/marketing/README.md` — full kit overview

## Provenance

Imported from `coreyhaines31/marketingskills` and adapted for ClauKit. Upstream ships one `emails` skill that is entirely **sequence** design; ClauKit splits email three ways (`emails` broadcast / [[email-sequence]] flows / [[cold-email]] outbound), so this file keeps only what a single send needs — subject-line and preview-text craft, the hook→context→value→CTA→sign-off structure, copy length and CTA rules, testing method, metric rules of thumb — plus the single-send email types from upstream's `references/email-types.md` (campaign, review ask, referral, usage recap, pricing update, renewal notice). All sequence architecture — lengths, delays, per-flow email maps, `references/sequence-templates.md` — was left to [[email-sequence]]. Launch-day touchpoints come from upstream's `launch` skill.

Upstream mechanisms ClauKit does not have, and what replaced them: the `.agents/product-marketing.md` context file → `plans/marketing-context.md`; the `tools/REGISTRY.md` ESP integration table (Customer.io, Mailchimp, Nitrosend, Kit) → ClauKit ships only the `mcp-sendgrid` / `mcp-resend` wrappers; related skills `lead-magnets`, `churn-prevention`, `ab-testing`, `revops`, `marketing-psychology` do not exist in this kit. Deliverability diagnosis, suppression, sunset policy, campaign-burst framing, and the open-rate-inflation caveat are ClauKit additions — upstream covers them only glancingly, inside its re-engagement sequence.
