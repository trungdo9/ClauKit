# Phase 06 report — `/ba:spec` + `compose`

STATUS: DONE_WITH_CONCERNS

Implementer (sonnet) died on the org monthly spend limit after writing all shipped files and the SRS-001 fixture entity; orchestrator authored the remaining 12 fixture entities and ran every gate. Second inline finish this run (see phase 02). No shipped file was written by the orchestrator.

## Files
- CREATE `.claude/commands/ba/spec.md` (84 lines; description 77 chars; actions fr|nfr|uc|us|ac|tc|compose)
- CREATE `.claude/scripts/ba/lib/spine-compose.cjs` (182 lines) — deterministic renderer (ruling R7), no Date anywhere, validates first
- EDIT `.claude/scripts/ba/traceability.cjs` (92 lines) — 4th action `compose`
- CREATE `skills/ba/spec/SKILL.md` (90), `references/compose-format.md` (56), `references/entity-bodies.md` (73)
- EDIT `.claude/workflows/business-analysis-rules.md` § 8 — one bullet: deliverables committed, regenerate before commit, never hand-edit (section count stays 9)
- EDIT `.gitignore:70-72` — `!plans/**/deliverables/*.md` re-include (implementer); repo-local; `PLAN_RULES` untouched so `installer-packaging.test.js:144` sync test unaffected; coordinator ruling STATE:48 builds on it
- Fixture (`plans/ba/demo/entities/`, orchestrator): SRS-001 (implementer) + FR-011 FR-012 NFR-001 NFR-002 UC-001 UC-002 US-007 US-008 AC-007.1 AC-007.2 AC-008.1 TC-001 TC-002 → 18 entities incl. phase-05's PRD/EPICs. Deliverables composed to `plans/ba/demo/deliverables/{PRD-001,SRS-001}.md` — NOT committed this phase (ruling R11)

## Gates (verbatim)
- Exit gate: `validate` → exit 0; `grep -c '^\*\*source:\*\*' SRS-001.md` → 8 = FR+NFR+UC+US (2+2+2+2)
- Gate 1: `FR=2 US=2 AC=3 TC=2` · `broken-edges=0 orphans=0 unsourced=0`
- Gate 2: AC-007.1 parents → [US-999] ⇒ `validate | grep -cE 'ac-prefix-mismatch|dangling'` → 1; restored → exit 0
- Gate 3: `FR-headings=2 AC-headings=3` (= index) · FR-012 actor line 1, source line 1 (on lines 2 and 3 of the block) · `AC=3 under US=2`
- Gate 4: `**Actor:** 2 · **Out of scope:** 2 · **Constraints:** 2 · **Touches:** 2` = FR=2 · AC=3 (ruling R10: labels FR-only)
- Gate 5: compose ×2, 1 s apart → `BYTE-STABLE` (both files, no diff) · header-lines=2 · timestamp-lines=0 · scratch `ck init --kit ba` project: `deliverable-ignored=1` `index-ignored=0`
- Installed link walk (scratch install, all ba .md + rules): broken=0; every backticked `.claude/…` path present
- Hygiene: activate-hits=0 · rules `##` sections 9 · hard-fail string 1× in spec.md · every `.cjs` < 200 lines
- Suite `node --test "tests/*.test.js"` → tests 358 / pass 356 / fail 1 / skipped 1 (fail = pre-existing tests/protected-branch-guard.test.js:196)

## Concerns
1. Fixture deliverables are visible (`?? plans/ba/`) because of `.gitignore:72` but entities are still ignored; committing them now would compose a committed file from ignored inputs → deferred to 08.1 task 8.1.9 (ruling R11). `plans/ba-context.md` is also still ignored and the coordinator's "fully tracked" ruling names only `entities/*.md` — 08.1 should decide.
2. The five new shipped files were found already `git add`-ed by an actor other than the implementer (who was told not to stage). Harmless; commit is scoped by path anyway.
3. FR `**Actor:**` line is taken from the entity body; an FR body without it renders `**Actor:** [UNKNOWN]   **Precondition:** [UNKNOWN]` — a visible gap, never a dropped label (Gate 4 stays honest).

## Unresolved questions
- Should `plans/ba-context.md` join the tracked fixture at 08.1? (coordinator ruling STATE:48 names entities only)
