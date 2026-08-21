---
description: Lifecycle nurture sequence based on lead stage (5-phase — calendar → forms → tasks → gmail → bigquery)
argument-hint: <lead-stage>
---

## Pre-flight (HARD FAIL)

**If `plans/marketing-context.md` is missing, refuse to run and direct user to `/mk:plan`.**

Per .claude/workflows/marketing-rules.md, every `/mk:` command requires the marketing context hub. The only exception is `/mk:plan` itself.

## Variables

ACTION: $1 (default: default)
REST: $2..$n (action-specific arguments)

## Workflow

Activate crm-specialist agent. Execute .claude/workflows/crm-workflow.md (5 phases). Idempotency required.

### Actions

- **`default`** — 5-phase lifecycle automation
  - skills: `crm-specialist`, `email-specialist`, `user-onboarding`

## Output

Results written to `plans/marketing/<campaign>/nurture/<sequence>.md`

## Notes

- Concise grammar in reports. List unresolved questions at end.
- PII redaction enforced for all customer/lead data (see .claude/workflows/automation-rules.md).
- Idempotency: re-runs must not duplicate resources (emails, leads, video assets).
- Cross-references: `.claude/workflows/marketing-rules.md`, `.claude/workflows/automation-rules.md`, `.claude/skills/marketing/README.md`.

## Examples

```
<lead-stage> <example-target>
```
