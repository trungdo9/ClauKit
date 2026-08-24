---
description: ⚡⚡ Slice a plan or spec into vertical tracer-bullet tickets with blocking edges
argument-hint: [plan-path | PROJ-NNN | spec-path | (empty)] [--jira PROJ-NNN] [--dry-run]
---

Delegate the slicing to the [`ticket-slicer`](../../agents/engineering/ticket-slicer.md) agent, which runs the [`to-tickets`](../../skills/software/to-tickets/SKILL.md) skill — the single source of truth for slicing rules, the expand–contract sequence, the ticket templates, and the guardrails. Don't restate methodology here.

**Split of duties.** The agent reads the source and returns the breakdown; **this session runs the approval gate and does every write** (files, tracker). The agent never publishes — approval lives here, and so do its side effects.

<source>$ARGUMENTS</source>

## Purpose

Turn one plan (or spec, or this conversation) into **tickets**: vertical tracer-bullet slices, each declaring what blocks it. Fills the gap between [`/ck:plan`](plan.md), which produces sequential `phase-*.md` detail, and [`/ck:cook`](cook.md), which executes one wave at a time — tickets are the dependency graph that says which waves exist and what may run in parallel.

## Variables

SOURCE: `$1` — resolved per the table below
TARGET: local files (default) · `--jira PROJ-NNN` publishes sub-tasks under that parent issue
DRY_RUN: `--dry-run` — present the breakdown and stop; write nothing anywhere
OUTPUT: `plans/<YYMMDD-HHmm-slug>/tickets/NN-<slug>.md`

| SOURCE | Resolves to |
|---|---|
| *(empty)* | this conversation — the work already discussed in context |
| a plan dir, or a path ending `plan.md` | that plan: read `plan.md` **and** every `phase-*.md` in the dir |
| an issue key (`PROJ-123`) | that issue, body + comments, via Atlassian MCP `getJiraIssue` |
| any other `.md` path | that spec file |

An unrecognized first arg → treat as a path when it resolves, otherwise **ask**. Never guess the source.

**Plan dir for a non-plan source.** When SOURCE is a conversation, a spec or an issue, there is no plan dir yet — create `plans/<YYMMDD-HHmm>-<slug>/` (timestamp via `bash -c 'date +%y%m%d-%H%M'`, PowerShell `Get-Date -UFormat "%y%m%d-%H%M"`, matching the [`planning`](../../skills/software/planning/SKILL.md) dir contract) and write `tickets/` into it. Do not invent a `plan.md` that nobody wrote.

## Workflow

1. **Resolve SOURCE** per the table. Unresolvable → ask, never guess.
2. **Scout first when the area is cold** — [`/ck:scout`](scout.md), or `./docs/codebase-summary.md` + `./docs/code-standards.md` when the project has them. The agent cannot spawn subagents, so scouting is this session's job; hand it the report path. Skip when context already covers the touched code.
3. **Spawn `ticket-slicer`** with: the resolved SOURCE path or key, any scout report path, and the plan dir to use. It reads the source in full, cuts the slices, runs its five cutting tests, and returns the breakdown — graph, tickets, frontier, blockers to slicing.
4. **Gate — present and quiz.** Relay the breakdown as a numbered list: title · blocked by · what it delivers. Ask about granularity and whether each blocking edge is real. Re-invoke the agent with the objections when the user wants a re-cut. **Nothing is written before approval.** Stop here on `--dry-run`.
5. **Publish** in dependency order, blockers first, using the skill's templates — local files by default, tracker sub-tasks under `--jira`'s parent (issue type via `getJiraProjectIssueTypesMetadata`, edges via `createIssueLink` after checking `getIssueLinkTypes`). Report the paths or issue keys created.

## Guardrails

- **Approval is the gate**, not a formality — no file, no tracker call before step 4 clears.
- **The tracker is opt-in and English-only.** A board read by PMs, clients and testers gets dev-internal slices only when the user names a parent. Business-readable prose, no file paths, no code.
- **Never modify the parent issue** — no transition, no close, no re-label, no comment, while publishing its children.
- **This command plans; it does not implement.** Same rule as `/ck:plan`. Execution is `/ck:cook <ticket-path>`.
- **Local tickets are working notes, not shared state.** `plans/` may be gitignored — check before assuming a teammate can open the path you just wrote. A ticket someone else must see goes to the tracker, on purpose, with approval.

## Relationship to other commands

- [`/ck:plan`](plan.md) — produces the plan this command slices. Plan first, then slice; if slicing shows the design is wrong, go back to `/ck:plan` instead of encoding it into twelve tickets.
- [`/ck:cook`](cook.md) — executes one ticket per run (`/ck:cook plans/<dir>/tickets/03-*.md`). Its wave scheduling *is* the frontier: tickets with no unmet blocker run together.
- [`/ck:refactor`](refactor.md) — executes a migrate batch from an expand–contract sequence, with its atomic-commit + rollback gates.
- [`/ck:git cm`](git.md) — one ticket, one commit.

## Notes
- Concise grammar, list unresolved questions at end.
