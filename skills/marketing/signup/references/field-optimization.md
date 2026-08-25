# Field-by-field optimization

Reference for [[signup]]. Applies to the account-creation form only; non-signup forms → [[cro]].

## Decision test for any field

Ask in order. First "yes" removes the field from signup:

1. Can the product function for this user without it?
2. Can it be collected later via progressive profiling (onboarding, in-app prompt, first invoice)?
3. Can it be inferred (email domain → company, IP → country/timezone, referrer → channel, plan choice → segment)?

Fields that survive all three get a stated justification in the audit.

## Email

- One field. No "confirm email" field — it doubles typing and catches almost nothing that inline validation misses.
- Inline format validation on blur, not on submit.
- Typo correction for common domains: `gmial.com` → `gmail.com`, `hotmial.com`, `yaho.com`, `outlok.com`. Suggest, don't auto-replace.
- `type="email"`, `autocomplete="email"`, `inputmode="email"`.
- Error copy must be recoverable: "That address is already registered — sign in or reset your password" with both links live.

## Password

- Show-password toggle (eye icon). Default hidden.
- Requirements visible **before** the user types, and indicators update in real time as each is satisfied. Never reveal a rule only on failure.
- Never block paste — it breaks password managers and pushes users to weaker passwords.
- Prefer a strength meter over a rigid rule list. Rigid rules produce predictable passwords and more failed submits.
- Passphrase hint where the meter is used ("three unrelated words beats one clever substitution").
- `autocomplete="new-password"` so managers offer to generate.
- Consider removing the field entirely: magic link or social auth (see below).

## Name

- Single "Full name" field unless the app actually uses given/family separately (invoicing, formal correspondence, CJK ordering). Test the split before assuming.
- Require only if used immediately — a personalized welcome or an avatar initial counts; "we might mail-merge it someday" does not.
- Strong candidate for optional, or for deferral into onboarding.

## Social auth / SSO

- Place prominently. In most flows the social path converts better than the email form; treat it as the primary path unless data says otherwise.
- Audience match:
  - **B2C** — Google, Apple, Facebook. Apple is mandatory on iOS if any other social login is offered.
  - **B2B** — Google, Microsoft, plus SAML/OIDC SSO for enterprise tiers. GitHub for developer tools, LinkedIn for sales/recruiting tools.
- Clear visual separation from the email form — a divider with "or" is the convention; without it users hunt.
- Label with the provider name and action ("Sign up with Google"), not a bare icon row.
- Do not offer more than 3–4 providers. Choice paralysis plus the "which one did I use last time?" problem on return visits.
- Show which provider the account was created with on the sign-in screen if you can (returning-user friction is a signup problem too).
- Side benefits worth stating in an audit: pre-verified email (skips the verification gate entirely), no password to reset, faster mobile completion.

## Phone number

- Defer unless SMS verification, a calling motion, or a compliance requirement genuinely needs it at signup.
- If required, state the reason inline ("for two-factor codes only").
- `type="tel"`, country-code selector defaulted from IP, format as they type.
- Phone is one of the highest-abandonment fields in B2C signup — always test removing it before optimizing it.

## Company / organization

- Defer. Infer from the email domain in most B2B cases.
- If it must stay: auto-suggest as they type, and never require an exact match against a directory.
- Company *size* and *industry* are segmentation data, not operating data — those belong in onboarding or enrichment.

## Role / use case / "how did you hear about us"

- Defer to onboarding, where the answer can steer the experience and therefore justifies itself to the user.
- If one must stay at signup: exactly one question, progressive disclosure (a short list with "other"), and explicitly optional.
- Attribution questions at signup are a common third-step killer. Move them to a post-activation survey.

## Terms and consent

- Implicit acceptance with a visible link ("By creating an account you agree to…") converts better than a required checkbox, where the jurisdiction allows it.
- Where an explicit checkbox is legally required, keep it single-purpose. Never bundle marketing opt-in with terms acceptance — bundle both and you risk the consent and annoy the user.
- Marketing opt-in is a separate, unchecked box, or is deferred entirely.

## CAPTCHA and bot gates

- Every CAPTCHA costs completion. Use invisible/risk-based challenges first; escalate to an interactive challenge only for flagged traffic.
- Measure it: run the flow with the gate off for a slice and compare completion against the abuse volume it actually prevents.

## Validation and error handling

- Validate on blur, per field. Submit-time-only validation makes users re-scan the whole form.
- Never clear the form — or any field — on a failed submit.
- Move focus to the first field with an error and announce it for screen readers.
- Error text lives adjacent to its field, not in a summary banner alone.
- One error message per problem, specific, no blame, with the recovery path when one exists.

## Microcopy

- **Labels stay visible.** Placeholder-as-label disappears the moment typing starts and leaves the user unsure what they are filling in. This is the single most common avoidable defect in modern signup forms.
- Placeholders carry examples only (`you@company.com`), never the field name.
- Help text sits next to the field it explains, and only where a question is actually likely.
- Button copy describes the outcome ("Start free trial", "Create account"), not the mechanism ("Submit").

## Mobile

- Touch targets 44px+ tall, full-width inputs and CTA.
- Correct keyboard per field: `email`, `tel`, `numeric` for codes.
- `autocomplete` attributes on every field so the OS can fill them; one-time-code autofill (`autocomplete="one-time-code"`) for SMS/email codes.
- Single column, always. Two-column forms break at mobile widths and confuse tab order everywhere.
- Sticky submit button when the form scrolls.
- Minimize typing: social auth first, pre-fill anything known from the referring context.
- Test on real devices — emulated viewports hide keyboard-overlap and autofill behavior.

## Accessibility (also a conversion lever)

- Every input has a programmatically associated `<label>`.
- Errors linked via `aria-describedby`; error state via `aria-invalid`.
- Logical tab order; the form is completable by keyboard alone.
- Color is never the only error signal.
