---
description: Email & SMS campaigns — campaign strategy, cold outreach, drip sequences, SMS
argument-hint: campaign|cold|drip|sms <goal>
---

## Pre-flight (HARD FAIL)

**If `plans/marketing-context.md` is missing, refuse to run and direct user to `/mk:plan`.**

Per .claude/workflows/marketing-rules.md, every `/mk:` command requires the marketing context hub. The only exception is `/mk:plan` itself.

## Variables

ACTION: $1 (default: campaign)
REST: $2..$n (action-specific arguments)

## Workflow

Activate email-specialist agent + the action-specific skills.

### Actions

- **`campaign`** — One-shot email campaign (announcement, launch, promo)
  - skills: `emails`, `copywriting`
- **`cold`** — Cold outreach sequence (3-7 emails, personalization, follow-up)
  - skills: `cold-email`
- **`drip`** — Lifecycle drip sequence (onboarding, education, conversion)
  - skills: `email-sequence`, `user-onboarding`
- **`sms`** — SMS marketing campaign (compliance + segmentation + cadence)
  - skills: `sms`

## Output

Results written to `plans/marketing/<campaign>/emails/<sequence>.md`

## Notes

- Concise grammar in reports. List unresolved questions at end.
- PII redaction enforced for all customer/lead data (see .claude/workflows/automation-rules.md).
- Idempotency: re-runs must not duplicate resources (emails, leads, video assets).
- Cross-references: `.claude/workflows/marketing-rules.md`, `.claude/workflows/automation-rules.md`, `.claude/skills/marketing/README.md`.

## Examples

```
campaign|cold|drip|sms campaign <example-target>
```
