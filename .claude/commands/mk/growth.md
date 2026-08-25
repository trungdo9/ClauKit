---
description: Growth tactics — product launches, referral programs, free tools, community
argument-hint: launch|referral|free-tool <goal>
---

## Pre-flight (HARD FAIL)

**If `plans/marketing-context.md` is missing, refuse to run and direct user to `/mk:plan`.**

Per .claude/workflows/marketing-rules.md, every `/mk:` command requires the marketing context hub. The only exception is `/mk:plan` itself.

## Variables

ACTION: $1 (default: launch)
REST: $2..$n (action-specific arguments)

## Workflow

Activate content-strategist + action-specific skills.

### Actions

- **`launch`** — Product launch playbook (pre-launch, launch day, post-launch)
  - skills: `launch`, `copywriting`, `ads`
- **`referral`** — Referral program design (incentives, sharing mechanics, tracking)
  - skills: `marketing-ideas`, `analytics`
- **`free-tool`** — Free tool / lead magnet strategy (build, distribute, convert)
  - skills: `marketing-ideas`, `content-strategy`

## Output

Results written to `plans/marketing/<campaign>/growth-<tactic>.md`

## Notes

- Concise grammar in reports. List unresolved questions at end.
- PII redaction enforced for all customer/lead data (see .claude/workflows/automation-rules.md).
- Idempotency: re-runs must not duplicate resources (emails, leads, video assets).
- Cross-references: `.claude/workflows/marketing-rules.md`, `.claude/workflows/automation-rules.md`, `.claude/skills/marketing/README.md`.

## Examples

```
launch|referral|free-tool launch <example-target>
```
