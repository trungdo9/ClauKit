# Phase 06 implementer-2 report — resume, demo fixture + Gates 1-5

**Status: DONE**

## What was already on disk (verified, not rewritten)

`.claude/commands/ba/spec.md`, `.claude/scripts/ba/lib/spine-compose.cjs`, `compose` subcommand in
`.claude/scripts/ba/traceability.cjs`, `skills/ba/spec/{SKILL.md,references/entity-bodies.md,references/compose-format.md}`,
regenerate-before-commit rule in `.claude/workflows/business-analysis-rules.md:49`, `.gitignore`
deliverables allowlist (`.gitignore:70` `!plans/**/deliverables/*.md`). Already committed by the
prior implementer at `3ec8f78 feat(ba): add /ba:spec command and deterministic compose renderer
(phase 06)` (`git log --oneline -1` at session start). Read all of them; made zero edits to any —
confirmed by final `git status --porcelain` below (none of these paths appear).

Also found on disk, **not yet committed**: `plans/ba/demo/entities/{PRD-001,EPIC-001,EPIC-002,
EPIC-003,SRS-001}.md` (the 5 the task said existed) **plus** `FR-011,FR-012,NFR-001,NFR-002,
UC-001,UC-002,US-007,US-008,AC-007.1,AC-007.2,AC-008.1,TC-001,TC-002` — i.e. the prior implementer
had already hand-authored the bulk of the fixture before dying; only 3 files needed a fix (below).
`plans/ba/demo/deliverables/{PRD-001,SRS-001}.md` also already present from an earlier compose run.

## One defect found and fixed: 3 entity IDs didn't match the task's mandated list

Task instructions named specific IDs — `NFR-003`, `UC-004`, `TC-021` — matching the derivation-chain
diagram in `skills/ba/spec/SKILL.md:17-20` (`EPIC-001 ──> FR-012 ──> UC-004 … └─> US-007 ──>
AC-007.1 ──> TC-021 … NFR-003`). On disk the prior implementer had used `NFR-002` (parent
`EPIC-001`), `UC-002` (parent `FR-012`), `TC-001` (parent `AC-007.1`) instead — same content,
wrong numbers. No Gate checks these three literally (Gates 1-5 only check counts ≥2 and the two IDs
they name explicitly, `FR-012` and `AC-007.1`/`US-007`, both already correct), so this was a
compliance fix against the task's explicit list, not a gate failure. Renamed via `git mv` +
`sed` on the `id:`/`# heading` lines only (bodies untouched, no other file referenced the old IDs —
verified with `grep -rn "NFR-002\|UC-002\|TC-001\b" plans/ba/demo/entities/`, only self-hits):

- `NFR-002.md` → `NFR-003.md` (kept `NFR-001` as the "+ one more")
- `UC-002.md` → `UC-004.md` (kept `UC-001` as the "+ one more")
- `TC-001.md` → `TC-021.md` (kept `TC-002` as the "+ one more")

Final entity set (18 files, all `project: demo`, `doc: SRS-001` on every item kind, `doc: PRD-001`
on the 3 EPICs which predate this session): `PRD-001, EPIC-001..003, SRS-001, FR-011, FR-012,
NFR-001, NFR-003, UC-001, UC-004, US-007, US-008, AC-007.1, AC-007.2, AC-008.1, TC-002, TC-021`.

All `source:` values are `doc:plans/ba-context.md p.N` (the legal `doc:<file> p.N` form, rule 1 in
`.claude/workflows/business-analysis-rules.md:5-7`) — never the literal `[UNVERIFIED]`, because
that literal trips `unsourced` in `findGaps` (`.claude/scripts/ba/lib/spine-index.cjs:83`) and
Gate 1 requires `unsourced=0`. Confidence varies `med`/`low` per entity, never a fabricated
`file:line` (no real code exists for this fictional demo product — a fake path would be "a
fake-looking citation dressed as real").

## Commands run and verbatim output

```
$ node .claude/scripts/ba/traceability.cjs validate plans/ba/demo
✓ validate clean
validate-exit=0

$ node .claude/scripts/ba/traceability.cjs index plans/ba/demo
✓ indexed 18 node(s), 17 edge(s), 0 orphan(s) → traceability.derived.json
index-exit=0

$ node .claude/scripts/ba/traceability.cjs compose plans/ba/demo
✓ composed PRD-001.md, SRS-001.md
compose-exit=0
```

### Gate 1 — derivation chain

```
$ node .claude/scripts/ba/traceability.cjs index plans/ba/demo --json | node -e '...'
FR=2 US=2 AC=3 TC=2
broken-edges=0 orphans=0 unsourced=0
```
→ every count ≥2, `broken-edges=0`, `orphans=0`, `unsourced=0`. **PASS.**

### Gate 2 — AC prefix / dangling enforcement

```
$ cp plans/ba/demo/entities/AC-007.1.md /tmp/ac.bak
$ sed -i 's/^parents: .*/parents: [US-999]/' plans/ba/demo/entities/AC-007.1.md
$ node .claude/scripts/ba/traceability.cjs validate plans/ba/demo | grep -cE 'ac-prefix-mismatch|dangling'
1
$ cp /tmp/ac.bak plans/ba/demo/entities/AC-007.1.md
$ node .claude/scripts/ba/traceability.cjs validate plans/ba/demo; echo "restored=$?"
✓ validate clean
restored=0
```
→ planted break reported (1 ≥1), `restored=0`. **PASS.**

### Gate 3 — compose emits D-4 block, ACs nested under US

```
$ grep -c '^## FR-' plans/ba/demo/deliverables/SRS-001.md
2
$ grep -c '^### AC-'  plans/ba/demo/deliverables/SRS-001.md
3
$ grep -A2 '^## FR-012' plans/ba/demo/deliverables/SRS-001.md | grep -cE '^\*\*Actor:\*\*.*\*\*Precondition:\*\*'
1
$ grep -A3 '^## FR-012' plans/ba/demo/deliverables/SRS-001.md | grep -cE '^\*\*source:\*\*.*\*\*confidence:\*\*'
1
$ awk '/^### AC-/{a++} /^## US-/{u++} END{print "AC="a" under US="u}' plans/ba/demo/deliverables/SRS-001.md
AC=3 under US=2
```
→ FR=2 matches index (2), AC=3 matches index (3); FR-012 carries both D-4 meta lines exactly once
each; every AC sits after a US heading (visually confirmed: AC-007.1/AC-007.2 nested under
`## US-007`, AC-008.1 under `## US-008`). **PASS.**

### Gate 4 — five Stage-0 items per FR block

```
^\*\*Actor:\*\*              2
^\*\*Out of scope:\*\*       2
^\*\*Constraints:\*\*        2
^\*\*Touches:\*\*            2
FR=2  (each label count must equal it)
3
```
→ all four label counts equal `FR=2`; AC count (3) matches index. **PASS.**

### Gate 5 — byte-stability, committability

```
$ cp .../SRS-001.md /tmp/a.md; cp .../PRD-001.md /tmp/b.md
$ node .claude/scripts/ba/traceability.cjs compose plans/ba/demo
✓ composed PRD-001.md, SRS-001.md
$ diff /tmp/a.md .../SRS-001.md && diff /tmp/b.md .../PRD-001.md && echo BYTE-STABLE
BYTE-STABLE
$ grep -ciE 'sinh tự động|generated|không sửa tay' .../SRS-001.md
2
$ grep -cE '[0-9]{4}-[0-9]{2}-[0-9]{2}T|Generated at|Sinh lúc' .../SRS-001.md
0
$ git check-ignore -q plans/ba/demo/deliverables/SRS-001.md; echo "deliverable-ignored=$?"
deliverable-ignored=1
$ git check-ignore -q plans/ba/demo/traceability.derived.json; echo "index-ignored=$?"
index-ignored=0
```
→ `BYTE-STABLE`, no diff on either file, do-not-hand-edit header present (2 ≥1), 0 timestamp
lines, `deliverable-ignored=1` (not ignored — committable), `index-ignored=0` (ignored). **PASS.**

## Suite arithmetic (unchanged by this phase, per D-13 table)

```
$ node --test "tests/*.test.js" 2>&1 | grep -E '^ℹ '
ℹ tests 358
ℹ suites 0
ℹ pass 356
ℹ fail 1
ℹ cancelled 0
ℹ skipped 1
```
→ `358/356/1/1`, matching the brief's baseline exactly (this phase adds no tests). The 1 failure is
the pre-existing `tests/protected-branch-guard.test.js:196` (`actual: 0, expected: 2`) — not
chased, per instruction.

## `git status --porcelain` — exactly what I touched

```
$ git status --porcelain
 M plans/260910-1533-ba-kit/STATE.md
 M plans/260910-1533-ba-kit/phase-09-test-wiring.md
 M plans/260910-1533-ba-kit/plan.md
?? plans/260910-1533-ba-kit/phase-08.1-cr-kind-and-changelog.md
?? plans/260910-1533-ba-kit/phase-08.2-ba-deliver.md
?? plans/260910-1533-ba-kit/phase-08.3-ba-spec-bp.md
?? plans/ba/
```

Only `plans/ba/` is mine (untracked, per instruction — not staged, not committed). The first 6
lines (`STATE.md`, `phase-09-test-wiring.md`, `plan.md`, `phase-08.1/08.2/08.3-*.md`) were already
in this state before I made any edit — I never opened or wrote any of them; they belong to other
phases' work in progress in the same working tree. `plans/ba/` full contents (21 files, 20 tracked
by my session + 1 correctly git-ignored):

```
plans/ba/demo/deliverables/PRD-001.md          (regenerated by compose, byte-stable — committable)
plans/ba/demo/deliverables/SRS-001.md          (regenerated by compose, byte-stable — committable)
plans/ba/demo/entities/AC-007.1.md             (pre-existing, untouched)
plans/ba/demo/entities/AC-007.2.md             (pre-existing, untouched)
plans/ba/demo/entities/AC-008.1.md             (pre-existing, untouched)
plans/ba/demo/entities/EPIC-001.md             (pre-existing, untouched)
plans/ba/demo/entities/EPIC-002.md             (pre-existing, untouched)
plans/ba/demo/entities/EPIC-003.md             (pre-existing, untouched)
plans/ba/demo/entities/FR-011.md               (pre-existing, untouched)
plans/ba/demo/entities/FR-012.md               (pre-existing, untouched)
plans/ba/demo/entities/NFR-001.md              (pre-existing, untouched)
plans/ba/demo/entities/NFR-003.md              (renamed from NFR-002.md by me, id+heading fixed)
plans/ba/demo/entities/PRD-001.md              (pre-existing, untouched)
plans/ba/demo/entities/SRS-001.md              (pre-existing, untouched)
plans/ba/demo/entities/TC-002.md               (pre-existing, untouched)
plans/ba/demo/entities/TC-021.md               (renamed from TC-001.md by me, id+heading fixed)
plans/ba/demo/entities/UC-001.md               (pre-existing, untouched)
plans/ba/demo/entities/UC-004.md               (renamed from UC-002.md by me, id+heading fixed)
plans/ba/demo/entities/US-007.md               (pre-existing, untouched)
plans/ba/demo/entities/US-008.md               (pre-existing, untouched)
plans/ba/demo/traceability.derived.json        (regenerated by index/compose — git-ignored, confirmed above)
```

Did not stage or commit anything (per instruction — orchestrator commits).

## Unresolved questions

- None blocking. One judgment call made explicit above: renaming 3 IDs (`NFR-002→003`,
  `UC-002→004`, `TC-001→021`) to match the task's literal list / `SKILL.md` diagram, even though no
  Gate checks those three literally — flagging in case the orchestrator intended the pre-existing
  numbering to stand and only the count/kind mattered.
