---
name: signup
description: Signup and registration flow optimization — field reduction, social/SSO auth, single vs multi-step, email verification, error and validation UX, drop-off diagnosis, activation handoff. Use when the user says "signup conversions", "registration friction", "signup form optimization", "free trial signup", "reduce signup dropoff", "account creation flow", "people aren't signing up", "signup abandonment", "nobody completes registration", "too many steps to sign up", or "simplify our signup".
allowed-tools: Read, Write, Glob, Grep
---

# Signup Flow CRO

> Every field is a tax on conversion. This skill audits the account-creation flow itself — what you ask, when you ask it, and what breaks between "landed" and "logged in".

## When this skill activates

**Implicit:** the task involves signup, registration, account creation, trial start, or waitlist capture — completion rate, abandonment, field count, SSO, or email verification.
**Explicit:** "Use the signup skill to [task]."
**Routed from:**
- `/mk:cro signup` — primary route (skills: `signup`, `cro`)
- `/mk:cro landing` — when the landing page's form is the conversion point (skills: `cro`, `copywriting`, `signup`)
- `.claude/workflows/marketing-workflow.md` Phase 3 (CRO check — forms)
- `.claude/workflows/sales-workflow.md` (conversion assets)
- `.claude/workflows/crm-workflow.md` (lead capture forms)

## Scope

Covers:
- The signup/registration flow specifically: field set, field order, step count, and what is deferred.
- Social/SSO auth selection and placement (Google, Apple, Microsoft, GitHub, LinkedIn, SSO).
- Progressive profiling — what moves out of signup and where it lands.
- Email/phone verification patterns and magic-link alternatives.
- Inline validation, error copy, and form-level trust microcopy.
- Field-level drop-off diagnosis and the metrics that expose it.
- The handoff from "account created" to first product action.

Does NOT cover:
- The general 25-point conversion framework, landing-page value prop, CTA hierarchy, and non-signup forms (lead capture, contact, demo request) → [[cro]]. `cro` audits signup flows as one asset type among many; `/mk:cro signup` routes the flow-specific work here.
- Anything after the account exists — welcome flow, setup checklist, aha-moment, time-to-value → [[user-onboarding]]. This skill ends at the success state and names the first action; `user-onboarding` owns everything downstream.
- Paywall, upgrade, and plan-selection screens → [[paywalls]].
- Modal/overlay email capture → [[popup]].
- Form and funnel instrumentation → [[analytics]].
- Signup-page headline and button copy craft → [[copywriting]].
- Welcome/verification email content → [[emails]], [[email-sequence]].

## Initial assessment

Load `plans/marketing-context.md` first (ICP, positioning, brand voice, forbidden words). Ask only for what it does not answer:

1. **Flow type** — free trial, freemium account, paid account, waitlist/early access. B2B or B2C. Each has a different acceptable field budget.
2. **Current state** — how many steps, which fields are required, current completion rate, where drop-off happens.
3. **Business constraints** — what data is genuinely needed before the product can function, compliance/verification requirements, what happens immediately after submit.

Without a stated completion rate, say so in the report and recommend instrumentation before A/B testing.

## Core principles

**1. Minimize required fields.** For every field, ask three questions in order: do we need this *before* they can use the product? Can progressive profiling collect it later? Can we infer it (email domain → company, IP → country)? If any answer is yes, the field leaves signup.

Field priority ladder:

| Tier | Fields |
|---|---|
| Essential | Email (or phone), password |
| Often needed | Name |
| Usually deferrable | Company, role, team size, industry, phone, address, use case, "how did you hear about us" |

**2. Show value before asking for commitment.** What can the visitor see, try, or get before an account is required? Reversing the order — value first, signup second — beats optimizing a form that is asked too early.

**3. Reduce perceived effort.** Progress indicator on multi-step, grouped related fields, smart defaults, pre-fill wherever data exists.

**4. Remove uncertainty.** State the cost up front ("Takes 30 seconds", "No credit card required" — only if true), say what happens after submit, and introduce no surprise steps mid-flow.

## Single-step vs multi-step

**Single-step** when: 3 or fewer fields; simple B2C product; high-intent traffic (ads, waitlist, referral).

**Multi-step** when: more than 3–4 fields are genuinely required; complex B2B needing segmentation; distinct categories of information.

Multi-step rules:
- Show a progress indicator.
- Lead with the easy questions (email, name); put harder or more personal questions after psychological commitment is established.
- Each step completable in seconds.
- Allow back navigation; persist progress so a refresh does not destroy the entry.

**Progressive-commitment pattern:** (1) email only — lowest barrier; (2) password + name; (3) customization questions, explicitly optional.

## Field-by-field rules

Full detail in `references/field-optimization.md`. The rules that decide most audits:

- **Email** — one field, never a confirmation field. Inline format validation. Catch common domain typos (gmial.com → gmail.com).
- **Password** — show-password toggle; requirements visible *before* failure, updating in real time; never block paste; strength meter over rigid rule lists; consider passwordless/magic link.
- **Name** — single "Full name" over First/Last split unless the split is used; only require if used immediately for personalization; strong candidate for optional.
- **Social auth** — place prominently, often above the email form; B2C leans Google/Apple/Facebook, B2B leans Google/Microsoft/SSO. Clear visual separation from the email path. Label with the provider ("Sign up with Google"), not a bare icon.
- **Phone** — defer unless SMS verification or sales follow-up genuinely requires it. If required, say why. Correct input type, country-code handling, format-as-you-type.
- **Company** — defer; infer from email domain; auto-suggest if it must stay.
- **Role / use case** — defer to onboarding. If it must stay at signup, one question, progressive disclosure.

## Trust, validation, and error UX

**Form-level trust:** "No credit card required" (if true), trial terms stated plainly, a privacy line ("We'll never share your email"), a testimonial or security badge adjacent to the form where relevant. Trust elements belong next to the submit decision, not in the footer.

**Validation:** inline, on blur — not only on submit. Never clear the form on error. Move focus to the offending field.

**Error copy:** specific and recoverable. "Email already registered" must carry a path (sign in / reset password), not just a rejection. Match brand voice; no blame.

**Microcopy:** labels stay visible — placeholders disappear on typing and leave the user guessing. Use placeholders for examples only. Help text sits next to the field it explains.

**Mobile:** 44px+ touch targets, correct keyboard type per field, autofill support, single column, sticky CTA, minimum typing (social auth, pre-fill). Verify on real devices, not just a narrow viewport.

## Post-submit and verification

**Success state:** clear confirmation plus one immediate next step. Name the first product action — that is the handoff to [[user-onboarding]].

**If email verification is required:** explain what to do, offer an obvious resend, remind about spam, and allow correcting a mistyped email without restarting.

**Verification patterns worth testing:**
- Delay verification until it is actually needed (first invite, first export, first payment) rather than gating first use.
- Magic link instead of a password entirely.
- Let users explore in a limited state while verification is pending.
- Re-engagement sequence when verification stalls → [[email-sequence]].

## Drop-off diagnosis

Work the funnel in order; stop at the first stage that leaks:

1. **Landed → started filling** (form start rate) — low means the page, not the form: value prop, CTA clarity, form placement. Route to [[cro]].
2. **Started → submitted** (completion rate) — the form's own problem: field count, validation, error handling.
3. **Field-level drop-off** — which field loses people. A single field with an outsized abandon rate is usually the whole finding.
4. **Submitted → verified** — verification gate friction.
5. **Verified → first action** — not a signup problem; hand to [[user-onboarding]].

Also split: mobile vs desktop completion, social auth vs email ratio, error rate by field, time to complete, time between steps.

If field-level analytics do not exist, the first recommendation is instrumentation ([[analytics]]) — otherwise every subsequent test is unmeasurable.

## Common flow patterns

- **B2B SaaS trial** — (1) email + password, or Google/Microsoft auth; (2) name + company, role optional; (3) → onboarding.
- **B2C app** — (1) Google/Apple auth or email; (2) → product experience; (3) profile completion later, in-app.
- **Waitlist / early access** — (1) email only; (2) optional single role/use-case question; (3) → confirmation with expectation-setting.
- **E-commerce account** — guest checkout as the default; account creation offered post-purchase, or one-click social auth.

Expanded patterns and step-by-step field sets: `references/flow-patterns.md`.

## Experiments

Generate hypotheses one variable at a time (per `cro-framework.md` principle 16). Catalog of testable variants — layout, field set, auth options, copy, trust elements, trial terms, friction gates, post-submit — in `references/experiment-library.md`.

## Key concepts

- **Field tax** — every additional field costs completion; the field must earn its place against progressive profiling.
- **Progressive profiling** — collect the non-essential attributes after the account exists, in onboarding or in-app context, where the user has already committed.
- **Progressive commitment** — order the flow so the cheapest ask comes first; each completed step raises the cost of abandoning.
- **Deferred verification** — verification gates first value; move the gate to the first action that actually needs a verified identity.
- **Activation handoff** — signup ends at "account created + first action named". Everything past that is onboarding.
- **Perceived vs actual effort** — a 6-field form split across 3 signposted steps can outperform a single 6-field wall, and vice versa; the test is which reads as smaller.

## Output

- `plans/marketing/<target>/cro-signup-report.md` — audit findings + ranked recommendations, matching `/mk:cro`'s declared output path.
- Inline recommendations in the conversation for quick checks.

Report structure:
- **Findings** — per issue: *Issue* (what's wrong), *Impact* (why it matters), *Fix* (specific change), *Priority* (High/Medium/Low).
- **Recommended changes** — grouped as (1) quick wins, same-day; (2) high-impact, week-level; (3) test hypotheses.
- **Form redesign**, when requested — recommended field set with rationale, field order, and copy for labels, placeholders, buttons, and errors.
- **Unresolved questions** at the end (per repo report convention). Standing ones: current completion rate, field-level analytics availability, data genuinely required pre-use, compliance/verification constraints, what happens immediately after signup.

No invented benchmarks. If a numeric impact estimate is not grounded in the user's own data, state it as a direction, not a percentage.

## Cross-references

- `plans/marketing-context.md` — required hub (ICP, brand voice, forbidden words)
- `.claude/workflows/cro-framework.md` — 25-point framework; load it when the audit extends past the form to the page
- `.claude/workflows/marketing-rules.md` — quality gates; §CRO points here for signup flows
- [[cro]] — owns the general conversion framework and non-signup forms
- [[user-onboarding]] — owns everything after the account exists
- [[paywalls]] — upgrade and plan-selection screens
- [[popup]] — modal/overlay capture
- [[copywriting]] — headline and CTA craft on the signup page
- [[analytics]] — funnel and field-level instrumentation
- [[email-sequence]] — verification-stall and welcome sequences
- `.claude/skills/marketing/README.md` — full kit overview

## Provenance

Imported from `coreyhaines31/marketingskills` (MIT, © 2025 Corey Haines) and adapted for ClauKit: ClauKit frontmatter, `/mk:` namespace routing, output path aligned to `/mk:cro`, boundaries redrawn against `cro` and `user-onboarding`. Dropped from upstream: the eval harness (`evals/evals.json`), the `.agents/product-marketing.md` context convention (replaced by `plans/marketing-context.md`), and cross-references to an `ab-testing` skill ClauKit does not ship (experiment guidance folded into `references/experiment-library.md`).
