# Closing gate — Stage-0 acceptance criteria → evidence (HEAD 3b0f793, 2026-09-11 16:45)

| # | Criterion (plan.md § Success metrics / D-1..D-13) | Command | Result | Met |
|---|---|---|---|---|
| 1 | `ck --kit list` shows `ba` | `node bin/ck.js init --kit list` | ` ba v0.1.0 BA Kit — business analysis, /ba: namespace. PRD → SRS → spine → tickets` | ✅ |
| 2 | Suite 366/364/1/1 (1 pre-existing fail at protected-branch-guard:196) | `node --test "tests/*.test.js"` | `366 364 1 1 ` | ✅ |
| 3 | 55 names map 1:1 + 13 D-rows resolved | awk on capability-map.md | `rows=55 unmapped=0 no-gloss=0 · d-rows=13 unresolved=0` | ✅ |
| 4 | ≤ 9 dispatchers in map; 6 command files shipped | ls + grep | `files=6 distinct-in-map=9` | ✅ |
| 5 | Command description bytes ≤ 1536 | awk over commands/ba/*.md | `474` | ✅ |
| 6 | Spine: validate 0, gap 0 orphans on demo | traceability.cjs validate/gap | `✓ validate clean · ✓ no gaps — 20 node(s) reachable` | ✅ |
| 7 | Change Log = derived view, 2 fixture CRs | `changelog --json` | `rows=2 ids=CR-001,CR-002` | ✅ |
| 8 | Deliverables committed, 0 timestamps, class header on each | ls/grep | `9 files; timestamped=0; class-header=9` (re-checked after 947d854; was 7) | ✅ |
| 9 | entities tracked (1), deliverables tracked (1), index ignored (0) — `check-ignore -q` | git check-ignore -q | `entity=1 deliverable=1 index=0` | ✅ |
| 10 | `ck init --kit ba` installs clean; every backticked .claude/ path exists post-install | scratch install | `15 paths copied; missing-backtick-paths=0` | ✅ |
| 11 | Shipped ba prose never says "Activate the x skill" | grep | `hits=0` | ✅ |
| 12 | Kit-guard loops derived from .claude/kits/*.json (no hardcoded 3-kit literal) | grep | `hardcoded-literals=0` | ✅ |

Not machine-checkable here (evidence in STATE.md): D-4 block verbatim (phase-06 Gate 3, STATE:61) · byte-stable compose/deliver (phase-06 Gate 5, 08.2 Gate 3 — compose/deliver write, not re-run in this read-only pass) · BA→dev chain `/ck:tickets` → `/ck:cook --from-plan` [ASSUMED]=1 touchpoints (phase-08 Gates, run by daa2b6c5 — see STATE phase 8 lines).

## Finding CG-8 (from criterion 8)
The two phase-06 deliverables `deliverables/PRD-001.md` and `SRS-001.md` (composed by `spine-compose.cjs`) carry the do-not-hand-edit header but **not** the D-13 class line `<!-- ba-deliverable: compose · class: derived · nguồn: … -->` that 08.2's seven files carry. Plan § Global Constraints (post-D-13) says *every* deliverable declares its class, and wave-2 `qc drift` skips `owned` by grepping that line — a `derived` file without it is ambiguous to drift. Fix = ≤ 3 lines in `spine-compose.cjs` `HEADER` + re-compose + re-run phase-06 Gate 5 (byte-stable). Routed to the Review fix loop; severity for the reviewers to set (likely Medium: spec gap, no runtime break today).

## Re-run on HEAD 3e1f6d5 (17:07): 12/12 ✅ · compose+deliver byte-stable vs committed on a scratch copy

## Final re-run on HEAD c97482d (18:19) after fix cycle 3: 13/13 ✅ (criterion 13 = byte-stability added)
