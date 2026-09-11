# Verify-Plan — phases 08.1 / 08.2 / 08.3 (D-13 block) — merged verdict

**Run** 2026-09-11 by session 2d17922d (support role per user ruling; ac3691da drives Implement). Three read-only `debugger` groups, one per phase file, concurrent with phase 06/07 implementation. Full tables: `plan-verification-08.1.md` (48 claims) · `plan-verification-08.2.md` (28) · `plan-verification-08.3.md` (28). **104 claims · 3 load-bearing REFUTED · 0 REFUTED about existing behaviour that survives amendment.**

| Phase | CONFIRMED | UNVERIFIABLE-until-prior-phase | REFUTED (load-bearing) |
|---|---|---|---|
| 08.1 | most `file:line` (spine-parse/index/traceability), suite counts, `.gitignore` history, one-directional sync test | — | **2** |
| 08.2 | `installer-packaging.test.js:292`, `docs.md:40`, `ba-spine.test.js`=216L, map `rows=55 unmapped=0 no-gloss=0`, desc bytes 248/3 files, compose writes into `deliverables/`, demo `gap` clean | everything keyed to 08.1 (`CR_STATUS`, `changelog`, 5th/6th subcommand) — arithmetic internally consistent | **1** |
| 08.3 | all cross-refs into 08.1/08.2/02/07/08; renderers absent (`[UNRENDERED]` expected); `:72` covers `BP-*.md`; `index --json` `nodes[].id` live | phase-07 output; 08.1/08.2 state (`kinds=9 last=TC`, 8 dispatchers, 3 commands, 358 tests) | 0 |

## Load-bearing REFUTED → rulings (plan text, not code)

**R-VP1 (08.1 task 8.1.6 + Gate 1).** Hard-codes `CR-001 parents:[FR-002]`, `CR-002 parents:[FR-003]`; the demo tree holds `FR-011`/`FR-012` only (file set changed between two `ls` calls — live edits by the other session). **Ruling:** use `FR-011`/`FR-012`, and carry Gate 4's existing caveat ("substitute any id the demo tree actually holds") on Gate 1 too.

**R-VP2 (08.1 Gate 8).** `git check-ignore -v` exits **0** for a path matched by a `!` allowlist pattern — it reports "a pattern matched", not "the path is excluded" — so `entity-ignored=1` / `deliverable-ignored=1` can never be observed with `-v`. Reproduced independently (below). **Ruling:** exit-code checks use `git check-ignore -q` (no `-v`); `-v` is display only. Phase 06 Gate 5 used `-q` and was read correctly.

**R-VP3 (08.2 Gate 4).** Claims a deliverable is `TRACKED` in a fresh install "via `.gitignore:72`". False mechanism: `:72` is ClauKit's own repo file; consumers get `bin/lib/gitignore-wire.js` `PLAN_RULES`, which has no deliverables allowlist. The gate passes only because a fresh consumer never ignores `plans/**`; a consumer that already does would silently ignore the billing document (breaks D-11). **Ruling:** reword Gate 4 to the true mechanism; add to 08.2 a 3-line stderr warning in the `deliver` CLI when its output path is ignored (`git check-ignore -q`), and the same in `compose` under 08.1 (which already edits `traceability.cjs`). `PLAN_RULES` stays untouched (one-directional sync test, consumers' `plans/` not ignored by default).

## Non-load-bearing, fix in passing
- 08.1: `spine-compose.cjs:138-146` → `143-147` (FR/NFR/UC/US/TC kind list).
- 08.3: "Depends on" omits 08.1 though Gate 4 needs the `CR` kind — add it (STATE order already enforces it).
- 08.3: `entity-bodies.md` not cited anywhere in 08.3 text — "not found", no claim.
- `gitignore-wire.js` docstring names a subset-assertion test grep cannot find — pre-existing, out of scope.

## R-VP2 reproduction (session 2d17922d, scratch repo, `.gitignore` = `plans/**/*` · `!plans/**/` · `!plans/**/entities/*.md`)
```
$ git check-ignore -v plans/x/entities/FR-001.md
.gitignore:3:!plans/**/entities/*.md	plans/x/entities/FR-001.md
exit=0
$ git check-ignore -q plans/x/entities/FR-001.md
exit=1
$ git check-ignore -q plans/x/idx.json   # control, truly ignored
exit=0
$ git add -n plans/x/entities/FR-001.md
add 'plans/x/entities/FR-001.md'
```

**Gate verdict:** FAIL on first pass (3 load-bearing REFUTED) → back to planner for the three text amendments above → re-gate is a re-read of the amended lines, no re-verification of the other 101 claims needed.
