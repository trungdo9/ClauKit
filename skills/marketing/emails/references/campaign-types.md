# One-Shot Campaign Types

Playbooks for single sends. Each entry: what triggers it, the one job, what goes in the body, timing, and the metric that judges it.

Anything below that needs a *triggered* multi-step flow belongs to `email-sequence`, not here. Where a type has both shapes, the boundary is stated.

## Contents
- Product update / feature announcement
- Launch announcement
- Promo / seasonal offer (and the campaign burst)
- Newsletter / roundup
- Pricing or policy change
- Event / webinar invite
- Review ask
- Referral ask
- Milestone or usage recap
- NPS / survey send
- Content repurpose (article → send)

---

## Product update / feature announcement

**Trigger:** a release ships.
**Job:** get the relevant users to try the new thing.
**Body:** what's new in plain language → why it matters (benefit, not changelog) → how to use it, as a direct link into the feature → who asked for it, if the community did.
**Segment:** the users it helps most. A feature announcement to people it does not apply to is a relevance tax on the whole list.
**Sizing:** major release → its own send. Medium (integration, UI improvement) → targeted send to the segment that cares. Minor (fixes, tweaks) → changelog and the next roundup, not a send.
**Metric:** feature-page clicks, then adoption among recipients vs non-recipients.

## Launch announcement

**Trigger:** launch day.
**Job:** traffic and signups in the first 24 hours.
**Body:** lead with the thing itself, not with the story of building it → one sentence on who it is for → the single strongest proof point available → CTA to the launch page or listing.
**Segment:** waitlist and existing customers get different emails. The waitlist opted in for exactly this — say so in the first line. Customers need "and here is what changes for you".
**Timing:** send early in the recipient's day; a launch email that lands after the launch-day conversation is over gets a fraction of the clicks.
**Coordinate with:** blog post, social, in-app announcement, website banner — the email is one touchpoint of the `launch` playbook, not the whole launch.
**Follow-up:** carry the announcement into the next roundup for the people who missed the send. That is a second broadcast, not a sequence.
**Metric:** clicks, signups attributable to the send.

## Promo / seasonal offer (and the campaign burst)

**Trigger:** a calendar moment (new year, fiscal year-end, Black Friday, an industry season) or a deliberate offer window.
**Job:** redemptions inside the window.
**Body:** the offer stated in the first line → what it applies to → the deadline → one CTA. No preamble.
**Burst shape:** announce (open) → reminder (midpoint) → last chance (final hours). Three scheduled broadcasts, each written standalone because many recipients will only see one.
**Suppress:** anyone who already redeemed, and recent full-price purchasers.
**Urgency must be real.** A deadline that quietly extends teaches the list that deadlines are fake, permanently. Same principle as the `cro` framework's genuine-urgency rule.
**Metric:** conversion and revenue in the window; watch unsub rate as the cost side.

## Newsletter / roundup

**Trigger:** a fixed cadence, held consistently.
**Job:** stay welcome in the inbox; keep the list warm enough that the sends that matter get opened.
**Body:** a mix — product notes, a customer story, one useful piece of content, company news — but **one primary CTA** carrying the rest as in-text links.
**Format:** scannable. Headers, short blocks, the best item first, not the newest.
**Consistency beats volume:** a predictable monthly send outperforms a sporadic weekly one.
**Unsubscribes here are fine** — a roundup is where a disengaged subscriber self-selects out, which protects the deliverability of everything else.
**Metric:** click-to-open rate, unsub rate.

## Pricing or policy change

**Trigger:** a change to price, terms, plan structure, or data handling.
**Job:** everyone affected knows before it happens, and stays.
**Body:** the change, the date, the effect on *their* account, stated in the first three lines. Then the why — value delivered or costs risen, honestly. Then their options: grandfathered rate, annual lock-in, downgrade path.
**Timing:** announce 30-60 days out, remind at 14 days, final notice at 7. For a large change, that is three scheduled broadcasts.
**Tone:** direct, no spin, no burying it below a marketing preamble. Advance notice is what builds trust here; discovering it on a card statement is what destroys it.
**Segment:** only the accounts affected. Never send a price-increase notice to people whose price is not increasing.
**Metric:** churn in the notice window vs baseline; support-ticket volume as the early signal.

## Event / webinar invite

**Trigger:** a scheduled event.
**Job:** registrations.
**Body:** what it is, who it is for, when (with timezone), what the attendee walks away with → one CTA to register. Speaker credibility if it is the draw.
**Segment:** the topic's audience, not the whole list.
**Note:** the invite is a broadcast. The confirmation, the reminders, and the replay follow-up are triggered by registering — those are `email-sequence` territory.
**Metric:** registration rate per recipient; attendance is the event's metric, not the email's.

## Review ask

**Trigger:** a customer milestone, a positive support resolution, a renewal, or a measurable result.
**Job:** one published review on the platform that matters.
**Body:** thank them, name the specific value or milestone if the data supports it, explain that reviews help other buyers decide, link directly to the review form. Keep it short — this is an ask, so do not bury it.
**Never send after:** a billing problem, an outage, or an unresolved ticket.
**Metric:** reviews published per 100 sends.

## Referral ask

**Trigger:** a promoter score, a customer result, or a deliberate campaign.
**Job:** shares from people who are already happy.
**Body:** remind them of their own result → the offer, stated plainly for both sides → their unique link, one click to share.
**Metric:** referral-link clicks, then referred signups.

## Milestone or usage recap

**Trigger:** an achievement, or a fixed period (weekly/monthly/quarterly).
**Job:** make the value delivered visible, so renewal is not a re-decision.
**Body:** the headline number → comparison to the previous period → achievements → one suggestion for what to do next.
**Hard rule:** a recap with nothing in it is worse than no recap. Suppress accounts with no activity to report, or route them to a different message entirely.
**Personalization:** real data only, with a sane fallback for every merge field. A recap with an empty token is a broken promise about how well you know them.
**Metric:** opens (an unusually high-open format), return visits.

## NPS / survey send

**Trigger:** quarterly, or after a milestone.
**Job:** one honest score.
**Body:** the single question, nothing else. From a real person — founder, CEO, or the account's CSM. Say what you will do with the answer.
**Follow-up by score is a triggered flow** (thank promoters, ask passives what would make it a 10, escalate detractors to a human) — design it in `email-sequence`.
**Metric:** response rate; the score itself is a product metric, not an email metric.

## Content repurpose (article → send)

**Trigger:** a published article worth distributing (`seo-workflow.md` Phase 5).
**Job:** clicks to the article, and a reminder that the list gets useful things.
**Body:** the single most useful idea from the piece, written out in ~120 words so the email is worth reading even if nobody clicks → one CTA to the full article.
**Subject:** written from the idea, for an inbox. The SEO title was written for a SERP; reusing it verbatim is the most common way this send underperforms.
**Anti-pattern:** pasting the article's intro. If the email is the first 200 words of the post, there is no reason to click.
**Metric:** clicks to the article; assisted sessions in analytics.

---

## Pre-send checklist

- [ ] Segment defined, and suppressions applied
- [ ] One job, one primary CTA, one destination URL
- [ ] Subject 40-60 chars; preview text written, not repeating the subject
- [ ] First line works with no images loaded
- [ ] Every link clicked and verified, tracking parameters present
- [ ] Merge fields have fallbacks; test send rendered on a phone
- [ ] Sender name is a human; reply-to reaches someone
- [ ] Unsubscribe present and working; physical address present
- [ ] No real subscriber PII written into `plans/marketing/**`
- [ ] Claims checked — no invented metric, no fake deadline, no promise the destination does not keep
- [ ] Success metric recorded before the send, so the result can be judged after
