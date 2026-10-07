# Port report — tuanductran/hr-skills → ClauKit `hr` kit

Source `tuanductran/hr-skills` (local copy `../hr-skills-main`, no SHA; pkg 1.4.0) · MIT © 2026 Tuan Duc Tran · decisions (user, 2026-10-07): new `hr` kit `/hr:` · consolidate to ~12 domain skills, re-authored · keep Vietnam w/ not-legal-advice guardrail.

## Added
- `.claude/kits/hr.json` (standalone, not in `both`; shares `development-rules.md` for hook docs)
- `.claude/workflows/hr-rules.md` — 9 rules: jurisdiction · no statutory figures from memory/[VERIFY] + counsel line · employee data (pseudonym-beside-unique-role = identifying; per-person drafts are working drafts → HRIS) · no invented benchmarks · fairness · human-in-loop · read-not-activate · hard-fail pre-flight · output paths
- `.claude/commands/hr/` (11): plan · recruit · people · perform · reward · learn · org · workforce · comply · culture · tech
- `skills/hr/` (13 + README): context (original hub) · recruiting · tech-hiring · people-ops · performance · rewards · learning · org-change · workforce-analytics · employee-relations · culture · technology · global (+ references/vietnam.md, 63 [VERIFY] tags)

## Modified
- `bin/lib/cli-parser.js` (help: `hr`), `bin/lib/claude-md-wire.js` (label "HR rules")
- `tests/installer-packaging.test.js` — hr install test (13 grouped, `name: hr-<dir>`, rules + plan cmd); hr leak check; `hr-` prefix reserved
- `skills/THIRD_PARTY_NOTICES.md` — MIT block
- Docs: registry (§1 HR 13, §3 hr 11, totals 244), CLAUDE.md (kits, `hr-` reserved, 139), README (counts, kit list, HR section), codebase-summary, system-architecture, project-overview-pdr (some pre-existing stale counts corrected)

## Refactors
- 146 prompt-library skills → 12 method skills; `content/`+`examples/` distilled, `prompts/` used only for coverage; overlaps merged; 20 tech-hiring skills → 1 skill + role primers
- Unsourced figures stripped (benchmarks, SLAs, fees, ratios, thresholds) → [NEEDS DATA]; statutory → [VERIFY: law]; vendor names removed
- Not ported: Bun/Turborepo CLI, registry, planner, evals, web app, discord bot

## Review (code-reviewer, 21 findings, all applied)
- HIGH: investigation details out of plans/ (process plan only, report in case system); new `/hr:comply exit` (RIF/redundancy/termination) — previously routed by 5 skills to an owner with no section
- MED: one special-category standard; accommodation log → OH file; no individual survey data as model input; pseudonym+unique role rule; classification → hr-global; single owner for mobility, merit matrix, vendor selection, tech scorecard; recruiting output paths
- LOW: phrasing, four-fifths wording (rule of thumb, 29 CFR 1607.4(D)), Kotter 1996 steps, canonical counsel lines, dangling automation-rules ref removed, "most common" claims → hypotheses
- Vietnam law ids: 31 confirmed by reviewer; PDP Law 91/2025 plausible; successor leads noted (Decree 219/2025, 158/2025, Employment Law 74/2025) under [VERIFY]

## Verify
- 139 SKILL.md on disk; 13 hr, names == hr-<dir>; wikilinks only the 13 hr names; relative links resolve at install position
- Scratch `ck init --kit hr`: 13 skills · 11 commands · hr-rules + development-rules · CLAUDE.md wired
- `npm test`: 462 pass / 0 fail / 1 skip (baseline 461/0/1 + 1 new)

## Deps / env
None.

## Unresolved
- Vietnam law currency needs a human with current VN law access (successor decrees)
- `hr` in `both`? left out
- `claude-md-wire.js` now 205 LOC (>200 hook threshold) — one table entry, not split
