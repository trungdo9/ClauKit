---
description: Lead generation pipeline (5-phase — generate → qualify → nurture → convert → retain)
argument-hint: <icp-description>
---

## Pre-flight (HARD FAIL)

**If `plans/marketing-context.md` is missing, refuse to run and direct user to `/mk:plan`.**

Per .claude/workflows/marketing-rules.md, every `/mk:` command requires the marketing context hub. The only exception is `/mk:plan` itself.

## Variables

ACTION: $1 (default: default)
REST: $2..$n (action-specific arguments)

## Workflow

Activate email-specialist + crm-specialist agents. Execute .claude/workflows/sales-workflow.md (5 phases). PII redaction enforced.

### Actions

- **`default`** — Full 5-phase lead pipeline
  - skills: `cold-email`, `email-specialist`, `crm-specialist`, `customer-research`

## Output

Results written to `plans/marketing/<campaign>/leads.csv (PII-redacted)`

## Notes

- Concise grammar in reports. List unresolved questions at end.
- PII redaction enforced for all customer/lead data (see .claude/workflows/automation-rules.md).
- Idempotency: re-runs must not duplicate resources (emails, leads, video assets).
- Cross-references: `.claude/workflows/marketing-rules.md`, `.claude/workflows/automation-rules.md`, `.claude/skills/marketing/README.md`.

## Examples

```
<icp-description> <example-target>
```
