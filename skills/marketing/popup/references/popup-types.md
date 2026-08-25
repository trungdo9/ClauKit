# Popup Types, Copy Formulas, and Vertical Stacks

Per-type playbooks for the six formats in scope, the copy formulas that fill them, and the standard multi-popup stacks by business model. Referenced from `SKILL.md`.

## The six formats

### Email capture

**Goal:** newsletter / list subscription.

- Lead with the value proposition, never the word "Subscribe" alone — nobody wants a subscription, they want what it delivers.
- State the specific benefit and the cadence ("weekly", "twice a month") so the ask is bounded.
- One field. Email. Name only if the downstream sequence actually personalizes.
- An incentive (discount, resource) lifts conversion but changes who joins — expect a softer list.

**Copy structure:** headline = benefit or curiosity hook · subhead = what they get and how often · CTA = the specific action ("Get Weekly Tips").

### Lead magnet

**Goal:** trade a concrete asset for an email.

- Show the thing — cover image, first-page preview, table of contents.
- Promise something tangible and narrow. "The 12-point pre-launch checklist" beats "our marketing guide".
- Email, maybe name. Nothing else.
- Set the delivery expectation explicitly ("in your inbox in under a minute").

This is the format that most often belongs behind a click rather than an overlay — see the click-trigger note in `SKILL.md`.

### Discount / promotion

**Goal:** first purchase or a stalled conversion.

- State the discount concretely: 10%, $20, free shipping. Vagueness reads as a catch.
- A real deadline creates urgency; a fake countdown that resets on reload destroys trust permanently.
- One use per visitor, and make the code trivially easy to apply — auto-apply if the platform allows.
- Exclude anyone already in checkout; a discount overlay mid-flow is a cart-abandonment machine.

### Exit intent / exit save

**Goal:** last-chance conversion for someone already leaving.

- Acknowledge the moment. The visitor knows they were leaving.
- Offer something *different* from the entry popup — repeating the declined offer is a second no.
- Address the likely objection rather than restating the pitch.

Working openers: "Wait — before you go…" · "Forget something?" · "Get 10% off your first order" · "Questions? Chat with us."

Desktop only as a cursor trigger. On mobile use the substitutes named in `SKILL.md`.

### Announcement banner

**Goal:** site-wide communication (launch, outage, event, policy change).

- Top of page, sticky or static. One message. One link.
- Always dismissable, and the dismissal sticks.
- Time-limit it and actually take it down — a permanent banner becomes invisible and then becomes clutter.
- Target it. A feature announcement is for the users who would benefit, not for every first-time visitor.

The least intrusive format in this list, and the one that survives the intrusive-interstitial constraint on mobile intact.

### Slide-in

**Goal:** engagement without interruption.

- Enters from a corner or the bottom edge; never blocks the content column.
- Easy to dismiss or minimize; minimized state should persist.
- The right home for chat, support prompts, and secondary CTAs.
- The default de-escalation when a modal is generating complaints but converting well — same offer, lower cost.

## Copy formulas

**Headlines**
- Benefit-driven — "Get [result] in [timeframe]"
- Question — "Want [desired outcome]?"
- Command — "Don't miss [thing]"
- Social proof — "Join [X] people who…"
- Curiosity — "The one thing [audience] always get wrong about [topic]"

**Subheadlines**
- Expand the promise with one concrete detail.
- Pre-empt the objection — "No spam, ever."
- Set the expectation — "Weekly tips, 5-minute read."

**CTA buttons**
- First person converts: "Get My Discount" over "Get Your Discount".
- Specific over generic: "Send Me the Guide" over "Submit".
- Value-focused: "Claim My 10% Off" over "Subscribe".

**Decline options**
- Polite and neutral: "No thanks" · "Maybe later" · "I'm not interested".
- Never confirm-shaming. "No, I don't want to save money" is a brand cost paid for a rounding error in opt-ins.

Deeper headline and CTA craft is [[copywriting]]'s; these are the popup-shaped subset.

## Vertical stacks

Standard multi-popup programs. Each needs explicit precedence and a global per-session cap.

**E-commerce**
1. Entry or scroll — first-purchase discount.
2. Exit intent — larger discount, or a plain reminder of what is in the cart.
3. Cart abandonment behavior — complete-your-order.

**B2B SaaS**
1. Click-triggered — demo request, lead magnets.
2. Scroll — blog/newsletter subscription.
3. Exit intent — trial reminder or a content offer.

**Content / media**
1. Scroll-based — newsletter after demonstrated engagement (50–70%).
2. Page count — subscribe after multiple visits.
3. Exit intent — don't-miss-future-content.

**Lead generation**
1. Time-delayed — general list building.
2. Click-triggered — specific lead magnets.
3. Exit intent — final capture attempt.

## Discovery questions

Ask before speccing, skipping anything `plans/marketing-context.md` already answers:

1. Primary goal for this popup?
2. Current popup performance, if any?
3. Which traffic sources are being optimized for?
4. What incentive can actually be offered?
5. Compliance requirements (GDPR, sector rules)?
6. Mobile vs. desktop traffic split?
