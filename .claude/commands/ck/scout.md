---
description: ⚡⚡ Scout codebase for files needed (parallel Explore subagents)
argument-hint: [user-prompt] [scale]
---

## Purpose

Search the codebase for files needed to complete the task using fast, token-efficient parallel subagents.

## Variables

USER_PROMPT: $1
SCALE: $2 (defaults to 3)
REPORT_OUTPUT_DIR: `plans/<plan-name>/reports/scout-report.md`

## Workflow — internal Explore subagents

- Spawn `SCALE` `Explore` subagents in parallel via the `Task` tool to search the codebase based on the user's prompt.

**How to prompt the agents:**
- IMPORTANT: Kick these agents off in parallel using the `Task` tool; analyze and divide folders so each agent scouts a distinct scope — no overlap, complete coverage.
- IMPORTANT: Instruct the agents to quickly locate the files needed for the task — a targeted search, not a full-blown crawl.
- Use a 3-minute timeout per agent. Skip any agent that doesn't return within the timeout; do NOT restart it.
- Deduplicate and synthesize the returned paths into an organized list; note any coverage gaps from timeouts.

## Multi-repo mode

When the task names **more than one repository** (a cross-repo trace: core/api/web, backend + frontend checkouts, etc.):

- Dispatch **one read-only `scout` agent per repo, concurrently in a single message** — never one agent roaming several checkouts, never serial tracing through the main context.
- Each agent returns `file:line` **plus the data shape it observes at that boundary** (parameter/return/payload types as actually seen — the shape is what makes cross-repo mismatches visible; a bare `int[]` where an object was expected is a real defect class).
- The main agent reconciles into **one cross-repo trace table**: where the value originates, each hop (`repo → file:line → shape`), and where it diverges from expectation. This table feeds `verify-plan`'s evidence column directly.
- Constraint: the main session performs **zero `Read`/`Bash` calls against the non-primary repos** — everything arrives through the per-repo scouts.

## How to write reports

- **IMPORTANT:** Sacrifice grammar for the sake of concision when writing reports.
- **IMPORTANT:** In reports, list any unresolved questions at the end, if any.

**Related skills** (look up `docs/clauKit-registry.md`): `find-skills`, `ck-graphify`, `gkg`, `research`.
