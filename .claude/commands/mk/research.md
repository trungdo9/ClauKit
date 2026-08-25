---
description: Market research — market sizing, competitors, customer interviews, ICP refinement
argument-hint: market|competitor|customer|icp <topic>
---

## Pre-flight (HARD FAIL)

**If `plans/marketing-context.md` is missing, refuse to run and direct user to `/mk:plan`.**

Per .claude/workflows/marketing-rules.md, every `/mk:` command requires the marketing context hub. The only exception is `/mk:plan` itself.

## Variables

ACTION: $1 (default: market)
REST: $2..$n (action-specific arguments)

## Workflow

Activate market-researcher agent + action-specific skills.

### Actions

- **`market`** — Market sizing (TAM/SAM/SOM) + trends
  - skills: `market-sizing`, `customer-research`, `marketing-ideas`
- **`competitor`** — Competitor deep-dive (positioning, pricing, channels, weaknesses)
  - skills: `competitor-profiling`, `competitors`, `competitor-alternatives`
- **`customer`** — Customer research (interviews, surveys, jobs-to-be-done)
  - skills: `customer-research`
- **`icp`** — ICP refinement + persona synthesis
  - skills: `customer-research`, `product-marketing`

## Output

Results written to `plans/marketing/<research>/report.md`

## Notes

- Concise grammar in reports. List unresolved questions at end.
- PII redaction enforced for all customer/lead data (see .claude/workflows/automation-rules.md).
- Idempotency: re-runs must not duplicate resources (emails, leads, video assets).
- Cross-references: `.claude/workflows/marketing-rules.md`, `.claude/workflows/automation-rules.md`, `.claude/skills/marketing/README.md`.

## Examples

```
market|competitor|customer|icp market <example-target>
```
