# Phase 02 report — traceability spine

STATUS: DONE_WITH_CONCERNS

Implementer (sonnet) died mid-run on the org monthly spend limit after writing all code/skill files; orchestrator finished Task 2.9 (two one-line edits) inline and ran every gate. Deviation from cook § Implement logged in STATE.md.

## Files
- CREATE `.claude/scripts/ba/traceability.cjs` (75 lines), `.claude/scripts/ba/lib/spine-parse.cjs` (140), `.claude/scripts/ba/lib/spine-index.cjs` (164)
- CREATE `skills/ba/traceability/SKILL.md` (62), `references/id-scheme.md` (51), `references/entity-template.md` (193)
- CREATE `tests/ba-spine.test.js` (216 — see concerns)
- EDIT `bin/lib/gitignore-wire.js:58-62` PLAN_RULES += `"plans/**/*.derived.json"`; EDIT `.gitignore` plans block += `plans/**/*.derived.json`

## Gates (orchestrator-run, verbatim)
- Gate 1 (13-entity scratch fixture, FR-009 `parents: []`, FR-010 `parents: [EPIC-999]`): `index` → `✓ indexed 13 node(s), 11 edge(s), 2 orphan(s) → traceability.derived.json` exit 0; `gap --json` → `{"orphans":[{"id":"FR-009","reason":"unparented","detail":"no parents declared"},{"id":"FR-010","reason":"dangling","detail":"parent EPIC-999 is not in the index"}],"unsourced":[]}`; `gap` exit on a planted orphan = 1
- Node shape (EPIC): `{"id":"EPIC-001","kind":"EPIC","title":"Refund flow","file":"entities/EPIC-001.md","doc":"PRD-001","parents":["PRD-001"],"source":"doc:prd.docx p.3","confidence":"high","out_of_scope":"partial refunds","touches":null}` — ruling R1 applied; index keys `version,project,generated,generator,nodes,edges,orphans,unsourced`
- Gate 2 (negative control after fixing both parents): `✓ no gaps — 13 node(s) reachable` exit 0
- Gate 3: `DETERMINISTIC` (two runs 1 s apart, `generated` deleted)
- Gate 4: `[filename-id-mismatch] entities/FR-099.md …` · `[duplicate-id] entities/FR-099.md …` · `[ac-prefix-mismatch] entities/AC-007.1.md — AC prefix '007' disagrees with parent 'US-003'` exit 1; missing project dir → exit 2
- Gate 5: `node --test tests/ba-spine.test.js` → tests 9 / pass 9 / fail 0
- Gate 6: `grep -c 'plans/\*\*/\*\.derived\.json' .gitignore bin/lib/gitignore-wire.js` → 1 / 1; scratch `git init` + `ck init --kit ba` → exit 0; `IGNORED plans/ba/demo/traceability.derived.json` · `TRACKED …entities/FR-001.md` · `TRACKED …deliverables/SRS-001.md` · `TRACKED plans/x/reports/code-review.md`; installed CLAUDE.md `grep -c 'Business analysis rules'` → 1; `.claude/skills/software/scenario` present via requires.shared
- Gate 7: `.cjs` files 75 / 140 / 164 lines — all < 200
- Full suite `node --test "tests/*.test.js"` → tests 358 / pass 356 / fail 1 / skipped 1 (the 1 fail = pre-existing tests/protected-branch-guard.test.js:196). Matches the plan's projected 358/356/1/1 exactly.

## Concerns
1. `tests/ba-spine.test.js` is 216 lines (> development-rules' 200-line guidance for code files). Not in Gate 7's file list; kept single per the brief ("one file"). Reviewer to rule; splitting a test file buys little.
2. Scratch install has no `.claude/commands/ba/` — the dir is still empty (phases 04–08 fill it); `file-copier` skips empty dirs. Phase 01 Gate 2's `ls` targets run after phase 08 as planned.
3. Implementer's own report was never written (agent died); this report is orchestrator-authored from re-run gates, not from the agent's transcript.

## Unresolved questions
- none blocking. Reviewer: is the 216-line test file acceptable as one file?
