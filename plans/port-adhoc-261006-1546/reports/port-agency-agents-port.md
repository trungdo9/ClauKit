# Port report — agency-agents sales + finance → marketing kit

Source `msitarzewski/agency-agents` (local copy, no SHA) · MIT © 2025 AgentLand Contributors · decisions (user, 2026-10-06): skills + 2 commands · consolidate to 13 · `/mk:finance` exempt from hub hard-fail.

## Scope cut (2026-10-07, user)
Dropped `close-controls`, `tax-strategy`, `investment-research` — off-topic for a marketing kit. Finance = `financial-model` + `fpa` only; `/mk:finance model|budget`. Final: 10 skills, 126 total, 220 entries. Already committed in `bd86955` → 3 RETIRED + 1 STALE (`commands/mk/finance.md`) in `bin/lib/retired-files.js`; upgrade from bd86955 simulated: 1 refreshed · 3 removed; npm test 461/0/1.

## Added
- `skills/sales/` (8): deal-strategy (+refs/templates) · discovery (+refs/call-debrief) · sales-engineering (+refs/templates) · proposal (+refs/templates) · account-expansion · pipeline-forecast · outbound · offer-design
- `skills/finance/` (2): financial-model · fpa
- `.claude/commands/mk/sales.md` (8 actions) · `.claude/commands/mk/finance.md` (2 actions, soft pre-flight)

## Modified
- `.claude/kits/marketing.json`, `both.json` — + `.claude/skills/sales/`, `.claude/skills/finance/`; marketing description counts
- `.claude/workflows/marketing-rules.md` § 1 — `/mk:finance` second exception
- `.claude/workflows/sales-workflow.md` — Ph1 outbound · Ph2 discovery+deal-strategy · Ph4 sales-engineering+proposal · Ph5 account-expansion, pipeline-forecast
- `.claude/commands/mk/leads.md` — names per-phase sales skills
- `skills/THIRD_PARTY_NOTICES.md` — agency-agents MIT block
- Docs/counts: registry (§1 new groups, §3 mk 14, §6 totals, Last Updated), README, MARKETING.md, CLAUDE.md, codebase-summary, system-architecture, project-overview-pdr, skills/marketing/README.md

## Refactors applied
- Persona → skill format (When activates / Scope + Does-NOT-cover / method / Output / Before proceeding / Cross-refs / Provenance footer)
- sales-coach folded: deal coaching → deal-strategy, call coaching → discovery, forecast/review cadence → pipeline-forecast
- outbound email copy delegated to existing `cold-email`; variance template owned by `fpa` only
- Unsourced stats stripped (~100: win-rate lifts, reply-rate tiers, coverage multiples, success-metric targets, example $ figures, US 21% rate, filing deadlines) → `[NEEDS DATA]` or user-derived
- Guardrails added: tax (not advice, jurisdiction+year+authority, no rates from memory, legal planning only), invest (not personalized advice, bear case, no target w/o valuation, no MNPI), close-controls asks GAAP/IFRS/local, PII roles-only (automation-rules R4), consent/opt-out in outbound+discovery
- Branded "Grand Slam Offer / Core Four / Rule of 100" → plain terms (source did not attribute)

## Deps / env
None added. No env vars referenced.

## Review (code-reviewer, 23 findings, all applied)
- HIGH fixed: pipeline-forecast coverage double-discounted (weighted pipeline ÷ win rate) → raw (need ≈ 1/win rate) vs weighted (need ≈ 1.0) split
- MEDDPICC unified on deal-strategy's 0–5 scale (pipeline-forecast was 0–2)
- Leftover unsourced figures labelled or removed (outbound touch count, POC length, thread count, call minutes, FP&A day ranges, "teams like yours" talk tracks)
- Ownership: proposal pricing → product-marketing; close-controls tax filings → licensed preparer; cold-email narrowed to email touches, multichannel → outbound; competitor-profiling battlecards split (market / deal / technical); financial-model ↔ fpa CAC pointers; unbacked "routed from crm-specialist / /mk:growth" claims dropped
- marketing-rules § 6–7 + sales-workflow: `plans/sales/`, `plans/finance/` output + PII rules
- Doc drift: README 116/57, MARKETING.md, pdr, system-architecture, registry Marketing (50→59); ck/ command files 27→28 (pre-existing, from /ck:diagram port) → 48 files

## Verify
- 129 SKILL.md on disk; name == dir for all 13; all wikilinks resolve; relative .md links resolve
- Scratch `ck init --kit marketing`: 13 skills + 2 commands installed, 0 depth-1 skills
- `npm test`: 461 pass / 0 fail / 1 skip (= baseline), before and after review fixes

## Unresolved
- No upstream SHA (local copy without .git) — provenance names repo + path only
- Hormozi credit for offer-design value equation: source didn't attribute; left unattributed
