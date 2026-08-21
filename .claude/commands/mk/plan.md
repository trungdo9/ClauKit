---
description: Marketing plan — bootstrap or update plans/marketing-context.md (ICP, positioning, voice)
argument-hint: [fast|full] [-o md|html]
---

## Pre-flight (HARD FAIL)

**If `plans/marketing-context.md` is missing, refuse to run and direct user to `/mk:plan`.**

Per .claude/workflows/marketing-rules.md, every `/mk:` command requires the marketing context hub. The only exception is `/mk:plan` itself.

## Variables

ACTION: $1 (default: fast)
REST: $2..$n (action-specific arguments)

## Workflow

Activate the `product-marketing` skill (.claude/skills/marketing/product-marketing/SKILL.md). It is the hub for marketing context.

### Actions

- **`fast`** — Skip interview, scaffold context from existing docs (README, docs/)
  - skills: `product-marketing`
- **`full`** — Full interview mode (default) — 8 questions, one at a time
  - skills: `product-marketing`, `customer-research`

## Output

Results written to `plans/marketing-context.md`

## Output format (`-o`) — orthogonal to action

Strip `-o md|html` from arguments before action dispatch. Default (no `-o`, or `-o md`) = markdown only (current behavior).

If `-o html`: after `marketing-context.md` is written, render a self-contained `plans/marketing-context.html` view from it. Follow the **non-phase document** rules in the planning skill reference [html-output.md](../../skills/software/planning/references/html-output.md) (single source of truth — omits progress bar/phase badges, renders `##` headings as collapsible sections). Markdown stays source-of-truth; html is a one-directional snapshot (re-run `-o html` to refresh). Every `/mk:` command reads the markdown only — html is a human-facing view.

**Convert mode:** `/mk:plan <path-to-marketing-context.md> -o html` → skip the interview/scaffold, just (re)render the `.html` from the existing markdown.

## Notes

- Concise grammar in reports. List unresolved questions at end.
- PII redaction enforced for all customer/lead data (see .claude/workflows/automation-rules.md).
- Idempotency: re-runs must not duplicate resources (emails, leads, video assets).
- Cross-references: `.claude/workflows/marketing-rules.md`, `.claude/workflows/automation-rules.md`, `.claude/skills/marketing/README.md`.

## Examples

```
[fast|full] fast <example-target>
```
