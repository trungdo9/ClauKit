# Popup Experiment Library

The A/B backlog for popup programs. Pick from here rather than inventing tests ad hoc; test one variable at a time per [[cro]]'s framework, and hold the trigger constant when testing copy (and vice versa) or the result is uninterpretable.

Ordering guidance: **trigger experiments move the number most**, then format/placement, then messaging, then personalization, then frequency. Run them in that order unless the complaint volume says frequency is the live problem.

## Placement and format

**Banner variations**
- Top bar vs. banner below the header.
- Sticky vs. static.
- Full-width vs. contained.
- With countdown timer vs. without (only where the deadline is real).

**Popup formats**
- Center modal vs. slide-in from a corner.
- Full-screen overlay vs. smaller modal — on mobile, weigh this against the intrusive-interstitial constraint in `SKILL.md`.
- Bottom bar vs. corner popup.
- Top announcement vs. bottom slide-out.

**Position and size**
- Popup dimensions, tested separately on desktop and mobile.
- Left vs. right corner for slide-ins.
- Visibility achieved without blocking the content column.

## Triggers

**Timing**
- Exit intent vs. 30-second delay vs. 50% scroll depth (the headline comparison — run this first).
- Time delay: 10s vs. 30s vs. 60s.
- Scroll depth: 25% vs. 50% vs. 75%.
- Page-count trigger: show after N pages viewed.

**Behavior**
- Intent-prediction-driven display.
- Trigger on specific page visits (pricing, docs, a given category).
- Returning vs. new visitor targeting.
- Trigger by referral source.

**Click**
- Click-triggered popups for lead magnets vs. the same offer as an overlay.
- Button-triggered vs. link-triggered modals.
- In-content triggers vs. sidebar triggers.

## Messaging and content

**Headlines and copy**
- Attention-grabbing vs. informational.
- "Limited-time offer" vs. "New feature alert" framing.
- Urgency-focused vs. value-focused.
- Headline length and specificity.

**CTAs**
- Button text variations (first person, specificity — see `popup-types.md`).
- Button contrast/color.
- Primary + secondary CTA vs. a single CTA.
- Decline text: friendly vs. neutral.

**Visual content**
- Countdown timer present vs. absent.
- With vs. without imagery.
- Product preview vs. generic imagery.
- Social proof inside the popup vs. not.

## Personalization

**Dynamic content**
- Personalize by known visitor data.
- Industry-specific variants.
- Content tailored to pages already visited.
- Progressive profiling — ask for less now, more later.

**Audience targeting**
- New vs. returning messaging.
- Segment by traffic source (message-match with the ad that brought them).
- Target by engagement level.
- Exclude already-converted visitors (this is usually a fix, not a test).

## Frequency and rules

- Once per session vs. once per week capping.
- Length of the cool-down after a dismissal.
- Different dismiss behaviors (X only vs. X + outside-click + Esc).
- Escalating offers across repeat visits.

## Reading the results

- Judge on **submissions per visitor**, not conversion rate on impressions — a trigger that fires less often can win on rate and lose on volume, or the reverse.
- Watch **close rate and time-to-close** alongside conversion. A variant that wins on opt-ins while doubling instant dismissals is buying emails with attention debt.
- Segment desktop and mobile results separately. They rarely agree, and a pooled result usually just reflects the traffic mix.
- Instrumentation and dashboards for all of the above belong to [[analytics]].
