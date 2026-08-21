---
description: AI video production (6-phase — script → voiceover → visuals → edit → render → distribute)
argument-hint: <video-concept>
---

## Pre-flight (HARD FAIL)

**If `plans/marketing-context.md` is missing, refuse to run and direct user to `/mk:plan`.**

Per .claude/workflows/marketing-rules.md, every `/mk:` command requires the marketing context hub. The only exception is `/mk:plan` itself.

## Variables

ACTION: $1 (default: default)
REST: $2..$n (action-specific arguments)

## Workflow

Activate video-producer agent. Execute .claude/workflows/video-workflow.md (6 phases).

### Actions

- **`default`** — 6-phase AI video pipeline
  - skills: `video-producer`, `copywriting`, `ai-multimodal`, `ai-artist`, `remotion`

## Output

Results written to `plans/marketing/<campaign>/video/<asset>.<ext>`

## Notes

- Concise grammar in reports. List unresolved questions at end.
- PII redaction enforced for all customer/lead data (see .claude/workflows/automation-rules.md).
- Idempotency: re-runs must not duplicate resources (emails, leads, video assets).
- Cross-references: `.claude/workflows/marketing-rules.md`, `.claude/workflows/automation-rules.md`, `.claude/skills/marketing/README.md`.

## Examples

```
<video-concept> <example-target>
```
