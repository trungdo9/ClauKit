---
description: ⚡ Run tests locally and analyze the summary report.
argument-hint: [ticket-path]
---

Use the `tester` subagent to run tests locally and analyze the summary report.

**With a ticket path** (`/ck:test plans/<dir>/tickets/PROJ-123.md`): pass the path to `tester`, which verifies the ticket AC by AC per the [ticket format](../../skills/software/to-tickets/references/ticket-format.md) before running the regular suites. Relay its `AC | Result | Evidence` table, and write it into the ticket's `## Verification` section only after showing it.

**IMPORTANT**: **Do not** start implementing.
**IMPORTANT:** Analyze the skills catalog and activate the skills that are needed for the task during the process.