---
description: Conversion Rate Optimization — audit, landing pages, signup, email
argument-hint: audit|landing|signup|email <target>
---

## Pre-flight (HARD FAIL)

**If `plans/marketing-context.md` is missing, refuse to run and direct user to `/mk:plan`.**

Per .claude/workflows/marketing-rules.md, every `/mk:` command requires the marketing context hub. The only exception is `/mk:plan` itself.

## Variables

ACTION: $1 (default: audit)
REST: $2..$n (action-specific arguments)

## Workflow

Activate `copywriting` + `cro` skills. Reference .claude/workflows/cro-framework.md (25 points).

### Actions

- **`audit`** — Full CRO audit using 25-point framework (see .claude/workflows/cro-framework.md)
  - skills: `cro`
- **`landing`** — Landing page optimization — value prop, CTAs, social proof
  - skills: `cro`, `copywriting`, `signup`
- **`signup`** — Signup flow optimization — friction reduction, form design
  - skills: `signup`, `cro`
- **`email`** — Email conversion — subject lines, CTAs, click-through
  - skills: `emails`, `cro`

## Output

Results written to `plans/marketing/<target>/cro-<action>-report.md`

## Notes

- Concise grammar in reports. List unresolved questions at end.
- PII redaction enforced for all customer/lead data (see .claude/workflows/automation-rules.md).
- Idempotency: re-runs must not duplicate resources (emails, leads, video assets).
- Cross-references: `.claude/workflows/marketing-rules.md`, `.claude/workflows/automation-rules.md`, `.claude/skills/marketing/README.md`.

## Examples

```
audit|landing|signup|email audit <example-target>
```
