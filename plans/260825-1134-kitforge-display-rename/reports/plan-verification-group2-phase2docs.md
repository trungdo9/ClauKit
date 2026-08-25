# Verify — Phase 2 repo brand docs (group 2), 5 files

Read-only fact-check. No edits made. Repo: ClauKit, cwd root.

## Counts

| # | Claim (total/frozen) | Verdict | Evidence | Impact if wrong |
|---|---|---|---|---|
| 1 | MARKETING.md 1/0 | CONFIRMED | `grep -o -i claukit`→1; `grep -oE FROZEN`→0 | low, 1-line file section |
| 2 | CLAUDE.md 3/2 | CONFIRMED | total=3 frozen=2 | shipped file, wrong count risks bad edit-count assumption in phase gate |
| 3 | guide/SKILLS.md 3/1 | CONFIRMED | total=3 frozen=1 | repo-only doc |
| 4 | guide/COMMANDS.md 6/2 | CONFIRMED | total=6 frozen=2 | repo-only doc |
| 5 | skills/marketing/README.md 6/1 | CONFIRMED | total=6 frozen=1 | shipped file (in `files` via `skills/`) |

All 5 baselines match plan claim exactly. Ran verbatim FROZEN regex from plan.md/phase-02 (backticks + quoted literal + trailing `ClauKit/`).

## Line-number spot-check (phase-02-repo-brand-docs.md cites lines for every file — checked all, not just 2-3)

| File:Line | Phase claims | Actual (grep/sed) | Match |
|---|---|---|---|
| MARKETING.md:1 | `# 🎯 ClauKit Marketing Kit — Guide` | same | yes |
| CLAUDE.md:20 | `ClauKit supports multiple installable kits via ...` | same | yes |
| CLAUDE.md:33 | `.../docs/clauKit-registry.md` ... (frozen) | same, contains `clauKit-registry` | yes |
| CLAUDE.md:63 | `├── clauKit-registry.md ...` (frozen) | same | yes |
| guide/SKILLS.md:1 | `# ClauKit Skills Guide` | same | yes |
| guide/SKILLS.md:3 | `This guide documents available skills in ClauKit. Skills extend Claude's capabilities…` | same (full sentence continues, matches "rest of sentence unchanged" note) | yes |
| guide/SKILLS.md:303 | `Repository: https://github.com/trungdo9/ClauKit` (frozen) | same | yes |
| guide/COMMANDS.md:1 | `# ClauKit Commands Reference` | same | yes |
| guide/COMMANDS.md:3 | `A comprehensive guide to all available slash commands in ClauKit.` | same | yes |
| guide/COMMANDS.md:23 | `…trigger specialized AI agents and workflows in ClauKit. They follow the simple syntax:` | same | yes |
| guide/COMMANDS.md:534 | `ClauKit also provides a CLI tool:` | same | yes |
| guide/COMMANDS.md:538 | `npm install -g https://github.com/trungdo9/ClauKit.git` (frozen) | same | yes |
| guide/COMMANDS.md:552 | `Repository: https://github.com/trungdo9/ClauKit` (frozen) | same | yes |
| skills/marketing/README.md:1 | `# ClauKit Marketing Kit` | same | yes |
| skills/marketing/README.md:19 | `- 2 ClauKit-authored: ...` | same | yes |
| skills/marketing/README.md:169 | `... ClauKit-native port of a production n8n workflow ...` | same | yes |
| skills/marketing/README.md:233 | `- CLAUDE.md (root) — ClauKit master instructions` | same | yes |
| skills/marketing/README.md:237 | `- docs/clauKit-registry.md — full resource catalog` (frozen) | same | yes |
| skills/marketing/README.md:246 | `- Custom ClauKit — workflows, MCP wrappers, ...` | same | yes |

All 19 cited line/content pairs across the 5 files verified verbatim (went beyond requested 2-3 spot-checks per file since count was small — full coverage, no extra cost).

## Verdict summary

All 5 baseline claims CONFIRMED. All line-content claims in phase-02-repo-brand-docs.md CONFIRMED verbatim.

No discrepancies found.

## Unresolved questions

None — every claim checked against live grep/sed output, no ambiguity encountered.
