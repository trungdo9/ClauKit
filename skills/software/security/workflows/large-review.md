<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/workflows/large-review.md (MIT) -->

# Large Review Workflow (LARGE mode)

Scope: >20 main-language files OR >30 total files. A >14-day commit span brings the chunking + TodoWrite resume discipline below, but does not by itself raise the agent count (SKILL.md § Step 3).
Main agent = orchestrator only. Sub-agents do the scanning.
Agent count = `min(3, ceil(files / 25))` — a 40-file scan gets 2, not a flat 3, and no agent is spawned for a chunk that does not exist.

## L1 — Setup
Create `.security-tmp/` workspace. Read `references/chunking-strategy.md` and divide files into chunks.

## L2 — Track progress
Use TodoWrite for each chunk (enables resume if interrupted).

## L3 — Spawn sub-agents
Spawn the computed number (≤3) in parallel. Each receives:
- File list for its chunk
- The active rule IDs (Core + fired gates) — not all 21 unless `--full`
- Full prompt from `references/sub-agent-prompts.md` (self-contained, no file loading)
- Output path: `.security-tmp/findings-<chunk-slug>.md`

On sub-agent failure: retry once with emphasis on output format. Persistent failure → log as "failed chunk" in final report.

## L4 — Aggregate findings
Parse all `.security-tmp/findings-*.md`. Validate against 21 canonical rule IDs. Deduplicate by (file, line, rule_id). Run global cross-checks (CSRF middleware, outdated deps across all chunks).

## L5 — Render & save
Translate to $LANG. Follow `references/output-format.md`. Write to `security-reports/scan-<timestamp>.md`.

## L6 — Cleanup
Delete `.security-tmp/` after successful aggregation. Preserve `security-reports/`.

## Performance target
~25K tokens per agent, ≤3 agents. 15 chunks → 5-10 minutes with parallel processing.
