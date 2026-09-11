# Phase 08 report — `/ba:qc gap` + the BA→dev handoff chain

STATUS: DONE_WITH_CONCERNS

Implementer (sonnet) died on HTTP 429 (org spend limit) before writing anything; orchestrator authored the three files and ran every gate (third inline finish this run). Per the user ruling in STATE.md, session daa2b6c5 drives Implement; 2d17922d is support.

## Files
- CREATE `.claude/commands/ba/qc.md` (59 lines) — action `gap`; redirects for `drift`/`cr` (wave 2), `dashboard` (`plans-kanban`), `kg` (`gkg`) as bare strings; description 63 chars; `argument-hint: [gap] [<project-slug>]` (bracketed after a live `Skill` invocation showed a bare `gap` token being consumed by the runner, binding `$1` to the project slug)
- EDIT `.claude/workflows/business-analysis-rules.md` (94 lines): `## 9. Quy trình chuẩn` (chain + three seam facts + engineer-kit prerequisite), `## 10. Không xây lại cái đã có` (redirects incl. the `scenario` dependency), `## 10. Cross-references` → `## 11.` (ruling R12); cross-refs gained `qc.md` + `scenario/SKILL.md` and the CLI action list was corrected from `build/gap/check` to `index/gap/validate/compose` (stale since phase 03)
- EDIT `skills/ba/README.md` (48 lines): `## Quy trình chuẩn` — the chain in one line + pointer to rules § 9; still 0 numbered-table rows (phase-03 Gate 4)
- Fixture (ignored): `plans/260911-1439-demo-srs-tickets/tickets/{01,02,03}-*.md` from `/ck:tickets plans/ba/demo/deliverables/SRS-001.md` (ticket-slicer breakdown in `reports/phase-08-ticket-breakdown.md`); measurement ledger for Gate 3 written to that plan's STATE.md, measured, then removed (tracked-visible file pointing at ignored tickets)

## Gates (verbatim)
- Gate 1: `gap` → `✓ no gaps — 18 node(s) reachable` exit 0 · `COMPOSED` (both deliverables, regenerated from the current fixture) · tickets dir `plans/260911-1439-demo-srs-tickets/tickets` count=3
- Gate 2: `01 ac=3 blocked-by=1` · `02 ac=3 blocked-by=1` · `03 ac=1 blocked-by=1`; tickets cite `AC-007.1 AC-007.2 AC-008.1`; `comm -23 tickets-ac spine-ac` → empty
- Gate 3 (cook Stage-0 on ticket 01, `--from-plan`): items 1–4 present in the ticket (heading+What to build; 3 Given/When/Then criteria incl. AC-008.1; `**Out of scope:**`; `**Constraints:** NFR-001, NFR-003`); item 5 `**Touches:** module/booking, api/appointments` — no file:line ⇒ the single `[ASSUMED]` line, naming touchpoints; `grep -c '\[ASSUMED\]'` on the ticket plan's STATE.md → 1; ledger reached Stage 0.5
- Hygiene: rules `grep -c '^## '` → 11, order 1–8, 9, 10, 11 · qc.md description 63 ≤ 110 · hard-fail string 1× · activate-hits 0 · README numbered rows 0, map refs 1
- Installed walk (scratch `ck init --kit ba` exit 0; 5 command files incl. qc.md): links broken=0; every backticked `.claude/…` path present (incl. `.claude/skills/software/scenario/SKILL.md` via requires.shared); CLAUDE.md label 1; repo shows no install side-effects
- Live command: `Skill(ba:qc, "gap demo")` loaded qc.md; executed as written → `orphans: none · unsourced: — · exit 0 · ✓ sạch — sẵn sàng bàn giao (gap = 0)`
- Suite `node --test "tests/*.test.js"` → tests 358 / pass 356 / fail 1 / skipped 1 (fail = pre-existing tests/protected-branch-guard.test.js:196)

## Concerns
1. Argument-hint convention: a bare leading literal in `argument-hint` is consumed by the runner (`$1` shifted). `spec.md`/`diagram.md` use unbracketed alternatives (`fr|nfr|…`) — not exercised via `Skill` this run; phase 10 should note the convention or test them. `[UNVERIFIED]` for those two — check: `Skill(ba:spec, "fr demo")` and confirm `ACTION: fr`.
2. The phase-08 gate's `grep -c '\[ASSUMED\]' plans/*/STATE.md` counts every plan's ledger (ours has 5); the metric is per ticket-plan ledger — measured that way.
3. Phase-03 Gate 1's "9 sections" is superseded by R12 (now 11); phase-03 Gate 2's backtick whitelist gained `qc.md` and `scenario/SKILL.md` — both shipped, recorded not edited.

## Unresolved questions
- none blocking. Whether `/ba:qc` should also print the `traceability.derived.json` path it refreshed (it does not write one; `gap` is in-memory) — wave 2.
