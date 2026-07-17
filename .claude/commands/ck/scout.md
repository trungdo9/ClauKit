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

## How to write reports

- **IMPORTANT:** Sacrifice grammar for the sake of concision when writing reports.
- **IMPORTANT:** In reports, list any unresolved questions at the end, if any.

**Related skills** (look up `docs/clauKit-registry.md`): `find-skills`, `ck-graphify`, `gkg`, `research`.
