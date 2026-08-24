---
name: to-tickets
description: Break a plan, spec, or the current conversation into vertical tracer-bullet tickets, each declaring the tickets that block it — written as one file per ticket under plans/<plan-dir>/tickets/, or published as issue-tracker sub-tasks under a parent issue on explicit opt-in. Use when a plan needs slicing into independently shippable units, when work is handed to parallel agents or devs, or when a wide refactor needs an expand–contract sequence. Triggers on "break this into tickets", "slice the plan", "chia task", "tách ticket", "/ck:tickets".
category: Planning & Delivery
status: active
metadata:
  version: "1.0.0"
  adapted_from: "matt-pocock skills — engineering/to-tickets"
  paired_with:
    command: .claude/commands/ck/tickets.md
    agent: .claude/agents/engineering/ticket-slicer.md
---

# To Tickets

Turn one plan into a set of **tickets**: vertical tracer-bullet slices, each declaring the tickets that **block** it. A ticket with no blockers can start immediately; the set of open tickets whose blockers are all done is the **frontier**.

This is the missing link between [`/ck:plan`](../../../commands/ck/plan.md) and [`/ck:cook`](../../../commands/ck/cook.md). A plan's `phase-*.md` files are *sequential implementation detail*; tickets are *delivery units with an explicit dependency graph* — which is what you need to parallelize work, hand a slice to a fresh context, or sequence a refactor that cannot land in one commit.

Distinct from `[[plans-kanban]]`, which organizes *whole plans* into board columns. This skill cuts *inside* one plan.

## Where tickets go

| Mode | Target | When |
|---|---|---|
| **Local** (default) | `plans/<YYMMDD-HHmm-slug>/tickets/NN-<slug>.md`, one file per ticket, numbered from `01` in dependency order (blockers first) | always, unless the user asks for the tracker |
| **Tracker** (opt-in) | sub-tasks under a named parent issue, linked with the tracker's native `Blocks` / `is blocked by` relationship | only when the user names a parent issue **and** approves the publish |

Local is the default on purpose. An issue tracker is usually **business-facing** — PMs, clients and testers read it — so a fan of dev-internal slices posted there is noise the user has to clean up. Local tickets sit beside the plan they came from, next to `STATE.md` (`[[run-state]]`), and cost nothing to throw away.

Plan dir names are `YYMMDD-HHmm-<slug>` — 6-digit date from `bash -c 'date +%y%m%d-%H%M'` (PowerShell: `Get-Date -UFormat "%y%m%d-%H%M"`), never from model knowledge. This is the `[[planning]]` dir contract; an 8-digit `YYYYMMDD` dir is a different name and `/ck:cook` will not find it.

## Who runs which step

Steps 1–3 are drafting work and belong in a subagent — [`ticket-slicer`](../../../agents/engineering/ticket-slicer.md) — because reading a plan plus its phase files plus the touched code is the expensive part. Step 4 is a **user gate**, so it runs in the main session, and step 5 (every write: files, tracker) runs there too, behind that gate. Invoked directly in the main session with no agent, the split collapses but the gate does not: nothing is written before approval.

## Process

### 1. Gather context

Work from what is already in context. When given a reference, read it in full first:

- a plan dir or `plan.md` → read `plan.md` **and** every `phase-*.md`; the tickets replace neither, they index them
- an issue key (`PROJ-123`) → fetch the issue with the Atlassian MCP (`getJiraIssue`), body **and** comments; see `[[use-mcp]]` when the server is not connected
- a spec path → read the file
- nothing → the current conversation is the source

### 2. Explore the codebase

Skip only if the current context already covers the touched area. Otherwise run [`/ck:scout`](../../../commands/ck/scout.md) or read `./docs/codebase-summary.md`, `./docs/code-standards.md`, `./docs/system-architecture.md` when the project has them.

Two things come out of this: ticket titles that use the project's own vocabulary, and **prefactoring opportunities** — "make the change easy, then make the easy change". Prefactoring is always its own ticket, and always a blocker of the tickets it makes easy.

### 3. Draft vertical slices

Each ticket is a **tracer bullet**:

- cuts a narrow but **complete** path through every layer it touches (schema → API → UI → tests) — vertical, never a horizontal slice of one layer
- is demoable or verifiable on its own; "done" is observable behaviour, not "the repository method exists"
- fits in a single fresh context window — roughly one `/ck:cook` wave
- names its blockers: the tickets that genuinely gate it, not everything vaguely related

Give each ticket its blocking edges. A chain that is entirely linear is a signal to re-cut: either the slices are horizontal, or the work genuinely is one ticket.

#### Wide refactors are the exception

A **wide refactor** is one mechanical change — rename a column, retype a shared symbol, change a DTO the whole app consumes — whose blast radius fans across the codebase, so a single edit breaks hundreds of call sites and no vertical slice can land green. Do not force it into a tracer bullet. Sequence it **expand–contract**:

1. **Expand** — add the new form beside the old one. Nothing breaks; one ticket, blocks everything below.
2. **Migrate** — move call sites over in batches sized by blast radius (per project, per directory, per feature). Each batch is its own ticket, blocked by the expand, and green on its own because the old form still exists.
3. **Contract** — delete the old form once no caller remains. One ticket, blocked by every migrate batch.

When even a batch cannot stay green alone (a shared contract flips mid-batch), keep the sequence but let those batches share an integration branch and all block one final **integrate-and-verify** ticket. Green is promised only there — say so in the ticket, so nobody reports a red batch as a failure.

The mechanical execution of a migrate batch is `[[refactor]]`'s job (atomic-commit + rollback gates); this skill only decides where the batch boundaries fall.

### 4. Quiz the user — gate

Present the breakdown as a numbered list **before writing anything**. Per ticket: **title** · **blocked by** · **what it delivers** (the end-to-end behaviour, one line).

Then ask:

- Is the granularity right — too coarse, too fine?
- Are the blocking edges real? Does each ticket depend only on what genuinely gates it?
- Should any be merged or split?

Iterate until the user approves. Nothing is written to disk, and nothing at all is sent to the tracker, before that approval.

### 5. Publish

Write in dependency order, blockers first, so every ticket can reference identifiers that already exist.

**Local** — one file per ticket, never one combined file:

```markdown
# NN: <ticket title>

**What to build:** the end-to-end behaviour this ticket makes work, from the user's
perspective — not a layer-by-layer implementation list.

**Blocked by:** `NN-<slug>`, `NN-<slug>` — or "None (can start immediately)".

**Status:** ready

**Covers:** `phase-XX-<name>.md` (when the parent plan has phase files), else omit.

## Acceptance criteria

- [ ] criterion 1
- [ ] criterion 2
```

**Tracker** — one sub-task per ticket under the named parent. Before the first create: confirm the issue type with `getJiraProjectIssueTypesMetadata` and confirm a blocking link type exists with `getIssueLinkTypes`; wire edges with `createIssueLink`, and only fall back to a `Blocked by` line in the description when the project has no such link type. Body:

```markdown
## What to build

The end-to-end behaviour this ticket makes work, from the user's perspective.

## Acceptance criteria

- [ ] criterion 1
- [ ] criterion 2

## Blocked by

- <parent-relative reference to each blocking ticket>, or "None (can start immediately)".
```

Tracker content is **English only** and business-readable — a PM, a client or a tester is the reader, not the implementer. Never transition, close, edit or comment on the **parent** issue while publishing its children.

## Working the frontier

Take any ticket whose blockers are all closed — for a linear chain that is top to bottom. Hand one ticket to one run: `/ck:cook plans/<dir>/tickets/03-<slug>.md` works because cook treats any `.md` path as a plan, but its Stage-0 gate then reads *this file*, so a ticket handed to cook must carry its acceptance criteria and link its parent `plan.md` for the rest. Multi-ticket runs keep the ledger in `plans/<dir>/STATE.md` per `[[run-state]]`.

## Guardrails

- **Draft, then publish.** The step-4 approval is the gate. No files written, no tracker call made, before it.
- **No file paths or code snippets in a tracker ticket** — they go stale within a sprint. Local tickets point at the `phase-*.md` that holds the paths instead of repeating them. One exception: a snippet that encodes a decision more precisely than prose can (a state machine, a schema, a type shape). Inline the decision-rich part only, and say where it came from.
- **Don't touch the parent.** Publishing children never closes, re-scopes or re-labels the issue they came from.
- **No invented labels or statuses.** The tracker project's own vocabulary only — read it, don't assume it. Nothing here needs an agent-grabbable label to work.
- **Tickets are not a plan.** If the breakdown reveals the plan itself is wrong, stop and say so; re-plan with [`/ck:plan`](../../../commands/ck/plan.md) rather than encoding a broken design into twelve tickets.
- **YAGNI applies to the graph.** Twelve tickets where five would do is over-engineering the delivery plan.

## Related

- [`/ck:tickets`](../../../commands/ck/tickets.md) — the command that runs this skill
- [`ticket-slicer`](../../../agents/engineering/ticket-slicer.md) — the agent that drafts the breakdown (steps 1–3) and its five cutting tests
- `[[planning]]` — the plan this skill slices; plan dir contract + phase-file spec
- `[[cook]]` — executes a slice; its waves are the frontier
- `[[run-state]]` — durable ledger across a multi-ticket run
- `[[plans-kanban]]` — the board *above* this skill: whole plans, not slices inside one
- `[[refactor]]` — executes an expand–contract migrate batch
