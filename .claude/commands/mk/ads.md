---
description: Paid advertising — Google Ads, Meta Ads, ad creative, A/B testing
argument-hint: google|meta|creative|ab-test <goal>
---

## Pre-flight (HARD FAIL)

**If `plans/marketing-context.md` is missing, refuse to run and direct user to `/mk:plan`.**

Per .claude/workflows/marketing-rules.md, every `/mk:` command requires the marketing context hub. The only exception is `/mk:plan` itself.

## Variables

ACTION: $1 (default: google)
REST: $2..$n (action-specific arguments)

## Workflow

Activate content-strategist + ads skills.

### Actions

- **`google`** — Google Ads structure (Search, Display, PMax) + bidding strategy
  - skills: `ads`, `ad-creative`
- **`meta`** — Meta Ads (Facebook + Instagram) — targeting + creative variants
  - skills: `ads`, `ad-creative`
- **`creative`** — Ad creative — headlines, copy, image briefs, video scripts
  - skills: `ad-creative`, `copywriting`
- **`ab-test`** — A/B test design for ads — hypothesis + variants + measurement
  - skills: `ads`, `cro`

## Output

Results written to `plans/marketing/<campaign>/ads/<platform>.md`

## Notes

- Concise grammar in reports. List unresolved questions at end.
- PII redaction enforced for all customer/lead data (see .claude/workflows/automation-rules.md).
- Idempotency: re-runs must not duplicate resources (emails, leads, video assets).
- Cross-references: `.claude/workflows/marketing-rules.md`, `.claude/workflows/automation-rules.md`, `.claude/skills/marketing/README.md`.

## Examples

```
google|meta|creative|ab-test google <example-target>
```
