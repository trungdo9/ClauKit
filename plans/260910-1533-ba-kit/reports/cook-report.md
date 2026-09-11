# Cook report — BA kit (plans/260910-1533-ba-kit)

Run: 2026-09-11, `/ck:cook plan.md` (auto `--from-plan`, autonomous — no user gates reachable), session daa2b6c5 as driver per the user ruling in STATE.md; session 2d17922d as support (D-13 revision, verify-plan on 08.x, final Review + Docs).
Base 744c271 → 1c59c23 (phase 10) plus one closing commit. Every gate's verbatim evidence is in `STATE.md`; per-phase detail in `reports/phase-*-report.md`. **Status: Implement complete, 14/14 acceptance criteria evidenced; final Review + Docs handed to session 2d17922d per the user ruling — not yet run.**

## Closing gate — acceptance criteria → evidence (cook skill § Closing gate)

| # | Criterion (plan § Success metrics) | Evidence | Met |
|---|---|---|---|
| 1 | **Chain runs end to end** — prd → spec → qc gap → compose → `/ck:tickets <SRS>` yields ≥ 3 tickets, each with ≥ 1 AC tracing to an `AC-###.#` in the spine | phase 08 Gate 1–2: `gap` → `✓ no gaps — 18 node(s) reachable` exit 0 · COMPOSED · 3 tickets in `plans/260911-1439-demo-srs-tickets/tickets/` · ac=3/3/1, blocked-by=1/1/1 · `comm -23 tickets-ac spine-ac` → empty (AC-007.1, AC-007.2, AC-008.1) | ✅ |
| 2 | **`/ck:cook <ticket> --from-plan` reaches Stage 0.5 with `[ASSUMED]` only for touchpoints** (`grep -c` = 1, naming touchpoints) | phase 08 Gate 3: items 1–4 present in ticket 01; `**Touches:** module/booking, api/appointments` (no file:line) → 1 `[ASSUMED]` line naming touchpoints; ledger reached Stage 0.5 | ✅ |
| 3 | `ck --kit list` shows `ba` | phase 01 Gate 1: `ba  v0.1.0  BA Kit — …` | ✅ |
| 4 | `ck init --kit ba` installs clean in one step, incl. `scenario` via `requires.shared`, CLAUDE.md reads "Business analysis rules" | phase 01 Gate 2 (run after 08.3): exit 0, 17/17 declared targets present, NO-ROOT-SKILLS-OK, label ×1 | ✅ |
| 5 | Two-kit project (`ba` + `engineer`) unions idempotently | phase 01 Gate 3: both installs exit 0, both command trees present, hooks 2→2, re-run leaves settings.json / CLAUDE.md / .gitignore byte-identical, 0 rules added | ✅ |
| 6 | `installer-packaging` / `installer-claude-md` / `esm-host` green **and actually looking at `ba`** | phase 09 Gates 1–3: `packagedKits()` → `ba,both,engineer,marketing`; literal grep → none; probe kit `zzprobe` enters the loops (`true`) and packaging stays 19/0; per-guard packaging 19/0, claude-md 11/0, esm-host 10/0; suite 366/364/1/1 | ✅ |
| 7 | Spine round-trips: 13 entities ⇒ 2 planted orphans, 0 false positives, negative control | phase 02 Gates 1–2: `✓ indexed 13 node(s), 11 edge(s), 2 orphan(s)`; `gap --json` → exactly FR-009 unparented + FR-010 dangling; fixed → `✓ no gaps — 13 node(s) reachable` exit 0 | ✅ |
| 8 | 0 orphans / 0 unsourced / 0 broken edges on generated output; every EPIC carries `out_of_scope` | phase 05 Gate 1: `PRD=1 EPIC=3 orphans=0 unsourced=0 epics-missing-scope=0`; phase 06 Gate 1: `broken-edges=0 orphans=0 unsourced=0` | ✅ |
| 9 | `compose` emits D-4's block verbatim, ACs nested under their US, all five Stage-0 labels per FR block | phase 06 Gates 3–4: FR-012 actor line 1 / source line 1; `AC=3 under US=2`; Actor / Out of scope / Constraints / Touches = 2/2/2/2 = FR count | ✅ |
| 10 | Deliverables byte-stable and committable; only the index ignored | phase 06 Gate 5 `BYTE-STABLE`, timestamps 0; phase 08.1 Gate 8: entities + deliverables tracked (`git ls-files -o --exclude-standard` 22 files), `traceability.derived.json` ignored | ✅ |
| 11 | 100 % of diagrams compiled **or** `[UNRENDERED]` — no third state | phase 07 Gate 2: `renderer=absent`, 4 files, 4 labelled; Gate 3 unquoted diacritic labels 0 | ✅ |
| 12 | All 55 capability names resolve; ≤ 8 `/ba:` dispatchers (→ ≤ 9 after D-13); ≥ 5 redirect rows | phase 03 Gate 3 `rows=55 unmapped=0 no-gloss=0`, redirect 5, cut 4; after 08.2: dispatchers 9, D-rows 13 | ✅ |
| 13 | 0 new duplicate registry entries — as a written decision | phase 10 Gate 2: `docs/clauKit-registry.md` § 4b two BA rows (cross-pool, intentional) + § 4f "Capabilities cut (2026-09-11, BA kit wave 0)" — the four cut proposal names each mapped to an existing `/ck:` command; Counts 142 skills · 30 agents · 63 commands = 235 entries = disk | ✅ |
| 14 | Wave 1.5 (D-13): CR kind + derived change log; `/ba:deliver` six documents in two classes; `/ba:spec bp` owned document; spine kinds 10, suite 366 | phases 08.1–08.3 gates all PASS; `changelog` → 2 rows ordered; `deliver all` → 6 docs, owned re-seed refused exit 1; BP cites 4 spine ids, 8 sections; `kinds=10 last=CR bp=false`; suite 366/364/1/1 | ✅ |

## Commits (one per phase, on `main`)

| phase | sha | tests |
|---|---|---|
| 01 manifest + plan ledger | a60655c | 349/347/1/1 |
| 03 rules + README + capability map | c5c827b | 349/347/1/1 |
| 02 traceability spine | 26d879d | 358/356/1/1 |
| 04 `/ba:plan` + ba-context | d608d31 | 358 |
| 05 `/ba:prd` | 7e41066 | 358 |
| 06 `/ba:spec` + compose | 3ec8f78 | 358 |
| 07 `/ba:diagram` | 6331527 | 358 |
| 08 `/ba:qc gap` + handoff chain | edcfc36 | 358 |
| 08.1 CR kind + changelog (fixture tracked) | b63a5dc | 362/360/1/1 |
| 08.2 `/ba:deliver` | f47ef78 | 366/364/1/1 |
| 08.3 `/ba:spec bp` | 1ece676 | 366 |
| 09 test wiring (derived kit loops) | 1185be8 | 366/364/1/1 |
| 10 defect record + docs | 1c59c23 | 366/364/1/1 |
| closing — ledger, this report, three doc-cite fixes | *(next commit)* | 366/364/1/1 |

The one failing test throughout is `tests/protected-branch-guard.test.js:196`, pre-existing at the baseline (plan § Repo baseline); never touched.

## How to use the kit

```
ck init --kit ba                 # one step; add --kit engineer (or both) for /ck:tickets + /ck:cook
/ba:plan                          # writes plans/ba-context.md (the hub; no hard-fail on itself)
/ba:prd  [prd|roadmap] <slug>     # PRD-001 + EPIC-*, every EPIC with out_of_scope
/ba:spec fr|nfr|uc|us|ac|tc|cr|bp|compose <slug>
/ba:qc gap <slug>                 # exit 0 = handover gate
/ba:spec compose <slug>           # deliverables/{PRD-001,SRS-001}.md — COMMITTED, byte-stable
/ba:deliver scope|uat|acceptance|release-notes|golive|handover|all <slug> [--force]
/ba:diagram sequence|flow|state|erd <FR-###|text> <slug>
/ck:tickets plans/ba/<slug>/deliverables/SRS-001.md   # engineer kit
```
Helper CLI (exit 0 clean · 1 findings · 2 usage): `node .claude/scripts/ba/traceability.cjs index|gap|validate|compose|changelog|deliver <project-dir> [--json]`.
No env vars, no keys. Optional: a mermaid renderer (`mmdc`) — absent ⇒ diagrams ship labelled `[UNRENDERED]`. Rules: `.claude/workflows/business-analysis-rules.md` (11 sections; § 9 is the standard chain).

## Deviations and waivers (all in STATE.md)

- **Three implementers died on the org spend limit (HTTP 429, sonnet)** — phases 02, 06, 08. The orchestrator finished each inline (cook § Implement "never inline" waived, same cause each time); phases 08.1–10 ran on `haiku` with near-complete briefs, each re-verified gate by gate by the orchestrator; two haiku defects were fixed inline (duplicate skip output; a missing engineer-kit prerequisite).
- **Two orchestrators on one tree.** Session 2d17922d appended the D-13 revision, ran a duplicate phase-06 implementer during the phase-06 commit, and verified 08.x in parallel. Coordinated through the ledger; the user's ruling (STATE.md) made this session the driver. No shipped file was ever edited by both.
- **Plan-internal defects found by verify-plan and closed by rulings R1–R22** rather than re-planning (interface gap `out_of_scope`, stale phase ordering, wrong gate columns / exit-code semantics / fixture ids, stale section numbering). All recorded, none load-bearing about the codebase.
- **Phase 10 (haiku) needed three doc-cite fixes after its gates passed:** a nonexistent `bin/lib/manifest-resolveSourcePath.js` cite (→ `kit-resolver.js:109-118`), "29 agents" ×2 (→ 30), registry total 227 (→ 235). Found by sweeping every path/command/skill/number the phase's diff added against the tree; all other names resolve.
- Stage 5 Docs beyond phase 10 and the **final whole-branch Review** are assigned to 2d17922d by the user ruling — see § Unresolved.

## Review — cycle 1 (2d17922d reviews, daa2b6c5 fixes)

The support session's review returned 1 security High (path traversal through a user-typed project slug), 1 standards High (bare `fs` calls behind a "never throws" CLI contract), 5 Mediums, 4 Lows and 1 failed closing criterion (composed deliverables lacked the class marker). Both Highs were reproduced before fixing (a relative `../` path wrote deliverables outside the repo; a missing dir threw raw ENOENT). All were fixed in one cycle — details and evidence in `STATE.md` under `review: fix cycle 1`. Net: the CLI refuses climbing relative paths, maps I/O errors to exit 2, always returns JSON on `--json`, stamps every deliverable with its class; the six command files validate the slug; the deliver tests are concurrency-safe. Suite unchanged at 366/364/1/1. Re-review pending.

## Unresolved questions

1. **Final Review + Docs handoff.** The user ruling assigns the whole-branch `code-reviewer` (opus) pass and Stage-5 Docs to session 2d17922d. If that session does not pick it up, run `/ck:review` on `744c271..HEAD`; sonnet/opus dispatches from this session hit the org limit today (weekly reset Sep 14 09:00 ICT). Parked findings for that review: `deliver <owned> --json` prints nothing to stdout on a skipped-only run (traceability.cjs:131-145); `tests/ba-spine.test.js` is 333 lines (over the 200-line guidance, accepted by the plan).
2. **Command `argument-hint` convention** — a bare leading literal was consumed by the Skill runner (`$1` bound to the project slug); `qc.md` now brackets `[gap]`. `spec.md`/`diagram.md`/`deliver.md` use unbracketed alternatives — `[UNVERIFIED]`; settle with a fresh session: `Skill(ba:spec, "fr demo")` should show `ACTION: fr`.
3. **`plans/ba-context.md` stays git-ignored** (ruling R21) while the demo entities and deliverables are tracked; the coordinator's "fully tracked" ruling named entities only. Decide whether the hub joins the fixture.
4. Recorded, not fixed (phase 10 `docs/known-defects.md`): missing `LICENSE` vs `package.json` MIT; npm name `@trungdo9/ClauKit` unpublishable (rename collides with `plans/260825-1134-kitforge-display-rename/phase-05…:52`); `npm test` runs 0 tests on Node ≥ 24; `resolveSourcePath` `path.join` rebase (R17 of the plan).
5. Two implementers ran `ck init` against this repo by accident (cwd fallback) and self-reverted; the installer has no "refuse to run inside a kit source repo" guard — a candidate defect entry.

Review package for the hand-off: `node .claude/scripts/ck/review-package.cjs 744c271 HEAD --plan plans/260910-1533-ba-kit` (git-ignored output under `reports/`).
