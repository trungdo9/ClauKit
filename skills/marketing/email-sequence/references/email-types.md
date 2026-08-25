# Lifecycle Email Types

Catalogue of the recurring lifecycle emails and mini-sequences beyond the four blueprints in `sequence-templates.md`. Each entry gives its trigger, goal, and shape. Doubles as an audit checklist for an existing email program — the checklist is at the end.

Scope note: **campaign email** (newsletters, seasonal promotions, product-update announcements, pricing-change announcements) is *not* here. Those are one-shot broadcasts on a calendar, not trigger-driven flows — see [[emails]].

Contents:
- Onboarding
- Retention
- Billing
- Usage
- Win-back
- Audit checklist

---

## Onboarding

### New users series
**Trigger:** user signs up (free or trial). **Goal:** activate, reach the aha moment. **Shape:** 5–7 emails over 14 days.
Welcome + single next step (immediate) -> quick win (day 1) -> key feature (day 3) -> success story (day 5) -> check-in + offer help (day 7) -> advanced tip (day 10) -> upgrade prompt or next milestone (day 14).
**Watch:** activation rate, feature adoption.

### New customers series
**Trigger:** user converts to paid. **Goal:** reinforce the purchase, drive adoption, cut early churn. **Shape:** 3–5 emails over 14 days.
Thank you + what's next (immediate) -> setup checklist for full value (day 2) -> pro tips for paid features (day 5) -> success story from a similar customer (day 7) -> check-in + support resources (day 14).
**Distinct from the new-user series:** they already committed. Reinforce and expand; do not keep selling.

### Key onboarding step reminder
**Trigger:** critical setup step still incomplete after X time (integration not connected after 48h, no teammate invited after 3 days, profile incomplete after 24h). **Goal:** nudge one high-value action. **Shape:** single email or a 2–3 email mini-sequence.
Remind them what they started, say why the step matters, link directly to completing it, offer help if stuck.

### New user invite
**Trigger:** existing user invites a teammate. **Recipient:** the invitee. **Goal:** activate them.
You've been invited (immediate) -> reminder if not accepted (day 2) -> final reminder (day 5). Personalize with the inviter's name, explain what they're joining, single CTA to accept.

---

## Retention

### Upgrade to paid
**Trigger:** engaged free user, or trial nearing its end. **Goal:** free -> paid. **Shape:** 3–5 emails.
Trigger options: time-based (trial day 10/12/14), behavior-based (hit a usage limit, touched a premium feature), engagement-based (highly active free user).
Structure: value summary of what they've accomplished -> what they're missing (feature comparison) -> social proof -> urgency (trial ending / limited offer) -> last chance with an easy path.

### Upgrade to higher plan
**Trigger:** approaching plan limits (80% of seats, 90% of storage), attempted a higher-tier feature, power-user pattern. **Goal:** upsell. **Shape:** single email or 2–3 emails.
Frame their growth positively, show what the next tier unlocks, quantify value against cost, make the upgrade one click.

### Ask for review
**Trigger:** milestone (30/60/90 days, key achievement, resolved support ticket). **Goal:** social proof on review sites. **Shape:** single email.
Best after a positive support interaction, a measurable result, or a renewal. **Never** after a billing problem or an outage. Keep it short — it is an ask. Thank them, cite the specific value if you can, explain why reviews matter, link straight to the platform.

### Proactive support offer
**Trigger:** signs of struggle — usage dropped week-over-week, repeated failed actions, help docs viewed repeatedly, stuck at the same onboarding step. **Goal:** save an at-risk user. **Shape:** single email.
Genuine concern, specific ("I noticed you...") where the data supports it, offer direct help rather than a docs link, send from a human (support or CSM). No pitch.

### Product usage report
**Trigger:** time-based (weekly / monthly / quarterly). **Goal:** demonstrate delivered value. **Shape:** recurring single email.
Key metrics, comparison to the previous period, achievements, one suggestion, light CTA. Must reflect real usage — an empty report is worse than no report.

### NPS survey
**Trigger:** quarterly, or post-milestone. **Goal:** measure satisfaction, find promoters and detractors. **Shape:** single email.
Ask only the NPS question first; follow up on the "why" based on score. Send from a person (founder, CSM). Say how you'll use the answer.
Follow-up by score: promoters (9–10) -> review or referral ask; passives (7–8) -> what would make it a 10; detractors (0–6) -> personal outreach.

### Referral program
**Trigger:** milestone, promoter NPS, or campaign. **Goal:** referrals. **Shape:** single email or periodic reminders.
Best after a positive NPS response, a customer result, or a renewal. Remind them of their success, state the offer clearly, give a unique link, show what's in it for them *and* the referee.

---

## Billing

### Switch to annual
**Trigger:** monthly subscriber near renewal, or a campaign. **Goal:** improve LTV, cut churn. **Shape:** 1–2 emails.
Calculate the exact saving, name any extra benefits, offer to lock the current price, make the switch one click. Best timed around the monthly renewal date, at year end, after 3–6 months of loyalty, or alongside a price-increase announcement.

### Failed payment recovery (dunning)
**Trigger:** payment fails. **Goal:** recover revenue, retain the customer. **Shape:** 3–4 emails over 7–14 days.
Day 0 friendly notice + update-payment link -> day 3 reminder, service may be interrupted -> day 7 urgent, account will be suspended -> day 10–14 final notice, what they lose.
Assume an accident (expired card). Clear, direct, no guilt, one CTA, state what happens if unresolved. **Watch:** recovery rate, time to recovery.

### Cancellation survey
**Trigger:** subscription cancelled. **Goal:** learn why; occasionally save the account. **Shape:** single email, immediate.
In-app at cancellation completes better; email follows up when they skip it; high-value accounts get personal outreach. Ask: primary reason, what you could have done better, what would change their mind, how you can help with the transition. Route the answer into a targeted save (discount, pause, downgrade, training).

### Upcoming renewal reminder
**Trigger:** 14 or 30 days before renewal. **Goal:** no surprise charges; an expansion opening. **Shape:** single email.
Renewal date and amount, what's included, how to change plan or payment method, any pricing/feature changes, optional upsell. Required for annual subscriptions and high-value contracts.

---

## Usage

### Daily / weekly / monthly summary
**Trigger:** time-based. **Goal:** engagement and demonstrated value. **Shape:** recurring single email.
Daily suits high-engagement products (notifications, quick stats); weekly carries an activity summary and suggestions; monthly is the comprehensive report with achievements and ROI where calculable. Structure: metrics at a glance -> notable achievements -> activity breakdown -> what to try next -> CTA.

### Key event / milestone notification
**Trigger:** a specific achievement (first action completed, 10th/100th thing created, goal reached, collaboration milestone, usage streak). **Goal:** celebrate, sustain engagement. **Shape:** one email per event.
Celebration tone, the specific achievement, context (versus before, versus peers), what the next milestone is.

---

## Win-back

### Expired trials
**Trigger:** trial ended without conversion. **Goal:** convert or re-engage. **Shape:** 3–4 emails over 30 days.
Day 1 post-expiry: trial ended, here's what you're missing -> day 7: what held you back (gather feedback) -> day 14: incentive (discount or extended trial) -> day 30: final reach-out, door stays open.
Segment by trial engagement: high engagement -> remove the friction blocking conversion; low engagement -> offer a fresh start with more onboarding; no engagement -> ask what happened, offer a demo.

### Cancelled customers
**Trigger:** 30 / 60 / 90 days after cancellation. **Goal:** win back. **Shape:** 2–3 emails over 90 days.
Day 30: what's new since you left -> day 60: we've addressed [their reason] -> day 90: an offer to return.
No guilt, no desperation. Personalize on the recorded cancellation reason where you have it — a churned customer returns mainly when the reason they left has actually been fixed.

---

## Audit checklist

Run against an existing email program to find the gaps.

**Onboarding**
- [ ] New users series
- [ ] New customers series
- [ ] Key onboarding step reminders
- [ ] New user invite sequence

**Retention**
- [ ] Upgrade to paid sequence
- [ ] Upgrade to higher plan triggers
- [ ] Ask for review, correctly timed
- [ ] Proactive support outreach
- [ ] Product usage reports
- [ ] NPS survey + score-based follow-ups
- [ ] Referral program emails

**Billing**
- [ ] Switch to annual
- [ ] Failed payment recovery sequence
- [ ] Cancellation survey
- [ ] Upcoming renewal reminders

**Usage**
- [ ] Recurring summaries
- [ ] Key event notifications
- [ ] Milestone celebrations

**Win-back**
- [ ] Expired trial sequence
- [ ] Cancelled customer sequence

**Cross-sequence hygiene**
- [ ] Every sequence has explicit exit conditions
- [ ] Priority order defined where sequences can overlap
- [ ] Weekly send cap per person
- [ ] Re-engagement ends in suppression, not indefinite sending

Broadcast campaigns (newsletter, seasonal promo, product updates, pricing changes) are audited under [[emails]].
