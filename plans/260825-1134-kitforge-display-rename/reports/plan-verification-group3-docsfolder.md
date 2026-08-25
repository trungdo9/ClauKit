# Plan verification — Group 3 (docs/ folder), read-only fact-check

Scope: 8 files under docs/. All greps run fresh against current repo state (main, clean).

## Baseline totals/frozen

| # | Claim | Verdict | Evidence | Impact if wrong |
|---|---|---|---|---|
| 1 | codebase-summary.md 16/14 | CONFIRMED | total=16 frozen=14 | plan phase-03 §3.1 target math relies on this |
| 2 | project-roadmap.md 9/4 | CONFIRMED | total=9 frozen=4 | §3.2 target math |
| 3 | project-overview-pdr.md 11/6 | CONFIRMED | total=11 frozen=6 | §3.3 target math |
| 4 | system-architecture.md 7/3 | CONFIRMED | total=7 frozen=3 | §3.4 target math |
| 5 | code-standards.md 6/0 | CONFIRMED | total=6 frozen=0 | §3.5 target math (total=0 frozen=0 after edit) |
| 6 | deployment-guide.md 4/2 | CONFIRMED | total=4 frozen=2 | §3.6 target math |
| 7 | design-guidelines.md 3/1 | CONFIRMED | total=3 frozen=1 | not detailed in excerpt read, but grep matches claim |
| 8 | clauKit-registry.md 16/2 | CONFIRMED | total=16 frozen=2 | not detailed in excerpt read, but grep matches claim |

Grep cmds used exactly as specified:
- total: `grep -o -i 'claukit' <file> | wc -l`
- frozen: `grep -oE 'trungdo9/ClauKit|clauKit-registry|260730-1359-clauKit-upgrade|ClauKit-CLI|`+"`"+`claukit`+"`"+`|"claukit"|ClauKit/' <file> | wc -l`

## Specific line checks

| # | Claim | Verdict | Evidence | Impact if wrong |
|---|---|---|---|---|
| 9 | project-roadmap.md L5 = `**Repository**: https://github.com/trungdo9/ClauKit` | CONFIRMED | sed -n '5p' matches exactly | frozen-line identity wrong → plan edits a real URL |
| 10 | codebase-summary.md L5 = same repo line | CONFIRMED | sed -n '5p' matches exactly | same |
| 11 | codebase-summary.md L285 = same repo line | CONFIRMED | sed -n '285p' matches exactly | same |
| 12 | project-overview-pdr.md L7 = same repo line | CONFIRMED | sed -n '7p' matches exactly | same |
| 13 | deployment-guide.md L17 = `git clone https://github.com/trungdo9/ClauKit.git your-project` | CONFIRMED | sed -n '17p' matches exactly | same |

## Dated historical changelog entries (project-roadmap.md)

| # | Claim | Verdict | Evidence | Impact if wrong |
|---|---|---|---|---|
| 14 | L89 dated/historical, mentions "ClauKit shipped that exact file" | CONFIRMED | L89 (inside "0a. Worktree fleet retired — 2026-08-05" section): `...only where a content digest proves ClauKit shipped that exact file, and only after refreshing the docs that invoke it.` | if wrong, phase-03's rewrite-anyway rationale (vs frozen CHANGELOG) targets wrong line |
| 15 | L194 dated/historical, "Recent Additions (2026-06-03)", mentions "on ClauKit primitives" | CONFIRMED | L194 under "### Recent Additions (2026-06-03)": `... controllable recreation of Claude Code's dynamic-workflow model on ClauKit primitives (markdown recipes + Agent-tool fan-out/pipeline, 4-axis inheritance, gated + cost-previewed)...` | same |
| 16 | L205 dated/historical, "Recent Changes (2026-08-11)", mentions "no ClauKit pipeline ever routed to it" | CONFIRMED | L205 under "### Recent Changes (2026-08-11)": `...no agent, no command, no runtime code, and no ClauKit pipeline ever routed to it, so it was auto-discoverable activation surface...` | same |

## Additional note (not asked but relevant)

project-roadmap.md L89 sits inside a dated section header "0a. Worktree fleet retired — 2026-08-05" (not itself L89, but immediately above at what's shown as part of context). The three dated entries (89/194/205) are indeed each nested under their own dated `###`/section headers (2026-08-05 area, 2026-06-03, 2026-08-11 respectively), consistent with the plan's framing that this is "a living, agent-read document" with historical dated entries mixed into current-state prose — supports the plan's stated rationale for rewriting vs. freezing.

## Unresolved questions

- None from the assigned checks — all 16 claims (8 baseline pairs + 5 line-content + 3 dated-entry) verified CONFIRMED against current repo state, no discrepancies found.
- Not independently verified: the full line-by-line edit tables in phase-03-docs-folder.md for every occurrence (e.g. all mixed-line calls in §3.1–§3.8) — only the specific baseline totals/frozen counts and the explicitly named lines were checked, per task scope.
