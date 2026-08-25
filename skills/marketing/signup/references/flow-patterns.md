# Signup flow patterns

Reference for [[signup]]. Pick the pattern that matches the business model, then justify every deviation.

## Choosing step count

**Single-step** when all hold:
- 3 or fewer fields survive the deferral test.
- Simple B2C or self-serve product.
- Traffic is high-intent (ad click on a specific offer, waitlist invite, referral link).

**Multi-step** when any hold:
- More than 3–4 fields are genuinely required before the product can function.
- Complex B2B where segmentation changes the product experience.
- The fields fall into distinct categories (identity / organization / preferences) that read better separated.

Multi-step is not automatically worse. A 6-field wall and a 3×2-field signposted flow can invert depending on how the effort *reads*. Test the perception, not the field count.

### Multi-step rules

- Progress indicator on every step ("Step 2 of 3", not a bare bar).
- Easy questions first (email, name); harder or more personal ones after commitment is established.
- Each step completable in seconds.
- Back navigation allowed, with state preserved.
- Persist entries — a refresh, a timeout, or an OAuth round-trip must not destroy typed data.
- Never introduce a step the user was not told about ("one more thing" is where flows die).

### Progressive-commitment pattern

1. **Email only** — lowest possible barrier; the account is now a real record.
2. **Password + name** — identity completion.
3. **Customization questions** — explicitly optional, skippable, and skipping must not degrade the account.

## Pattern: B2B SaaS free trial

1. Email + password, **or** Google/Microsoft auth (auth path placed above the form).
2. Name + company; role optional. Company auto-filled from the email domain where possible.
3. → onboarding ([[user-onboarding]]).

Notes:
- "No credit card required" stated at the form if true — it is the single highest-leverage trust line in this pattern.
- Trial length in the CTA ("Start 14-day free trial") sets expectation before the click.
- Company size, industry, and use case belong in onboarding, not here.
- Social auth via Google/Microsoft skips email verification outright.

## Pattern: B2C app

1. Google/Apple auth, or email.
2. → product experience immediately.
3. Profile completion later, in-app, at the moment each field becomes useful.

Notes:
- Apple sign-in is required on iOS when other social logins are offered.
- Password can be omitted entirely (social or magic link).
- Any question that is not identity is deferred by default.

## Pattern: Waitlist / early access

1. Email only.
2. Optional single question — role or use case — used for invite sequencing.
3. → confirmation that sets expectations: what they joined, when to expect contact, what happens next.

Notes:
- The optional question doubles as segmentation for the launch sequence ([[email-sequence]]).
- A position number or referral-for-priority mechanic belongs to `/mk:growth` tactics, not to the form; do not let it add fields.
- The confirmation page is the highest-attention moment — use it, don't waste it on "thanks".

## Pattern: E-commerce account

1. Guest checkout is the default path, always visible and never subordinate to "create an account".
2. Account creation offered **post-purchase** — the email and address are already captured, so it reduces to setting a password.
3. Or one-click social auth for buyers who want order history immediately.

Notes:
- Forcing account creation before checkout is one of the largest single causes of cart abandonment. Treat a mandatory pre-purchase account as a finding, not a constraint.

## Pattern: Paid account (no trial)

1. Email + password or social auth.
2. Plan selection → payment.
3. → onboarding.

Notes:
- Keep account creation and payment as distinct steps; a combined form conflates two anxieties.
- Plan selection, pricing presentation, and upgrade prompts are [[paywalls]] territory — this skill owns only the account-creation half.

## Verification placement

| Approach | Use when | Cost |
|---|---|---|
| Verify before first use | Abuse risk is high; the product sends on the user's behalf | Highest drop-off; blocks the aha-moment |
| Verify at first sensitive action | Most SaaS — invites, exports, payments, publishing | Low; the gate arrives when the user is already invested |
| Never verify explicitly | Social auth (email pre-verified) or magic-link login (verification is the login) | None |

Default recommendation: move the gate to the first action that genuinely needs a verified identity, and let the user reach value first.

If verification stays at the front:
- Explain exactly what to do and where to look.
- Obvious resend, with a visible cooldown rather than a silent no-op.
- Spam-folder reminder.
- Let the user correct a mistyped address without restarting signup.
- Trigger a re-engagement email if verification stalls ([[email-sequence]]).

## Success state and handoff

The success state must do two things:

1. **Confirm** — the account exists, and here is what it is.
2. **Name the next action** — a single, concrete first step, not a menu.

That second item is the handoff boundary. Everything after it — welcome flow, setup checklist, empty states, time-to-value, activation metrics — belongs to [[user-onboarding]]. This skill's job ends when the user has an account and knows what to do next.

Auto-login after signup is the default; requiring a fresh login immediately after account creation is a defect, not a security posture.
