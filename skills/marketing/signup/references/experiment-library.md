# Signup experiment library

Reference for [[signup]]. A catalog of testable variants, not a to-do list. Pick by where the funnel leaks.

**Rule:** one variable per test (`cro-framework.md` principle 16). Two changes in one variant produces a result you cannot act on. Declare the hypothesis, the primary metric, and the guardrail metric before shipping the test — a variant that lifts signup completion while tanking activation is a loss.

## Prioritization

Rank candidates by (expected effect) × (confidence) ÷ (effort). In practice:

- **Quick wins, same-day** — microcopy, label visibility, error text, show-password toggle, trust line, button copy, removing a deferrable field.
- **High-impact, week-level** — adding social auth, restructuring steps, moving the verification gate, guest checkout.
- **Test hypotheses** — anything where the direction is genuinely unknown for this audience.

Do not A/B test what is simply broken. A form that clears itself on error, or hides labels behind placeholders, gets fixed — it does not get a variant.

## Form design

**Layout and structure**
- Single-step vs multi-step.
- Multi-step with progress indicator vs without.
- One-column vs two-column field layout (one column usually wins; test only if a stakeholder insists).
- Form embedded on the landing page vs a dedicated signup page.
- Form in a modal vs inline.

**Field set**
- Cut to minimum (email + password only).
- Add/remove phone number.
- Single "Full name" vs First/Last split.
- Add/remove company or organization.
- Required vs optional balance — flip a required field to optional before deleting it.
- Field order within a step.

**Authentication**
- Add SSO options (Google, Microsoft, Apple, GitHub, LinkedIn).
- SSO prominent vs email form prominent.
- Which providers resonate — varies sharply by audience.
- SSO-only vs SSO + email.
- Magic link vs password.

**Visual**
- CTA button size and color contrast.
- Plain background vs product screenshot or context visual.
- Card container vs minimal/borderless form.
- Mobile-specific layout variants.

## Copy and messaging

**Headlines and CTAs**
- Headline variations above the form.
- CTA text: "Create account" vs "Start free trial" vs "Get started" vs outcome-phrased ("Start tracking in 2 minutes").
- Trial length surfaced in the CTA vs not.
- Value-prop restatement in the form header vs a bare "Sign up".

**Microcopy**
- Minimal vs descriptive field labels.
- Placeholder example content.
- Error message tone and specificity.
- Password requirements shown upfront vs on demand.
- Effort-setting line ("Takes 30 seconds").

**Trust**
- Social proof adjacent to the form (logo row, testimonial, user count) vs none.
- Security/compliance badges near the form.
- "No credit card required" placement — near the CTA vs in the header.
- Privacy assurance line.

## Trial and commitment

- Credit card required vs not for trial start.
- Trial length: 7 vs 14 vs 30 days.
- Freemium vs time-limited free trial.
- Feature-limited trial vs full access.
- Reverse trial (full access, then downgrade to free) vs standard trial.

## Friction gates

- Email verification: required before use vs deferred to first sensitive action vs removed (social auth).
- CAPTCHA on vs off — measure completion lift against actual abuse volume prevented.
- Terms checkbox vs implicit acceptance with visible link.
- Phone verification for high-value accounts only vs all accounts.
- Domain blocklist for free email providers (B2B) — usually costs more legitimate signups than it filters.

## Post-submit

- Auto-login after signup vs require a fresh login (auto-login is the expected default; test only to quantify the cost).
- Instant product access vs email-confirmation-first.
- Next-step messaging: single named action vs menu of options.
- Personalized welcome using data captured at signup vs generic.
- Where the user lands: empty dashboard vs guided first task vs pre-populated sample data.

Post-submit variants that reach past the first action belong to [[user-onboarding]] — coordinate so the two are not testing against each other in the same window.

## Measuring

Primary metric per stage:

| Stage | Metric |
|---|---|
| Landed → started | Form start rate |
| Started → submitted | Completion rate |
| Per field | Field-level abandon rate, error rate |
| Submitted → verified | Verification rate |
| Verified → first action | Activation rate (guardrail for every signup test) |

Segment every result by device (mobile vs desktop) and by auth path (social vs email). An aggregate that shows "no difference" often hides two opposite effects.

Instrumentation prerequisites — event on field focus, blur, and error; step progression events for multi-step; auth-path attribution. Without these, field-level tests are unmeasurable; set them up first via [[analytics]].
