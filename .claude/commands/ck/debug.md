---
description: ⚡⚡ Debugging technical issues and providing solutions.
argument-hint: [issues]
---

**Reported Issues:**
$ARGUMENTS

Use the `debugger` subagent to find root cause(s), then analyze and explain reports to the user.

The `debugger` agent reads the `debugging` skill file ([.claude/skills/software/debugging/SKILL.md](../../skills/software/debugging/SKILL.md)) — single source of truth for the 4-technique methodology (Systematic Debugging · Root Cause Tracing · Defense-in-Depth · Verification).

## Ticket write-up

The findings become a ticket in the [ticket format](../../skills/software/to-tickets/references/ticket-format.md), so a developer can implement it and the `tester` agent can verify it from the ticket alone:

1. **Fill** Problem (Actual · Expected · Repro · Impact), Root cause (Cause · Evidence with `file:line` · what was tried to refute it), Solution (Chosen · Rejected · Touchpoints · Out of scope · Risks) and Acceptance criteria — at least one `golden`, one `negative`, and one `regression` that replays the Repro, **each with `Verify` and `Expect`**. Case types come from the `scenario` skill ([.claude/skills/software/scenario/SKILL.md](../../skills/software/scenario/SKILL.md)).
2. **Mark it honestly** — `status: ready` only when the format's readiness rules hold; a cause without evidence, or an AC without a concrete `Expect`, keeps it `draft` with the gap listed under unresolved questions.
3. **Gate** — present the ticket; the user edits and approves. Nothing is written before that.
4. **Write** `plans/<YYMMDD-HHmm>-<slug>/tickets/<KEY or slug>.md` (timestamp via `bash -c 'date +%y%m%d-%H%M'`). When the issue came from a tracker, posting the ticket back (as a comment, tracker variant, English) happens only on explicit request — never transition, re-label or edit the issue itself.

Implementation is a separate run: `/ck:cook <ticket path>` or `/ck:fix <ticket path>`.

## Important
- **DO NOT** implement the fix automatically — investigate + report + ticket only.
- Concise grammar in outputs.
