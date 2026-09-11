# Review — Spec axis (744c271 → 3b0f793)

## Spec

### Critical
None.

### High

**S1 — the two signed deliverables carry no class header.** plan.md:120: *"Every file declares its class in a header line: `<!-- ba-deliverable: <action> · class: derived|owned · nguồn: … -->`"*, and plan.md:119 lists `{PRD-001.md, SRS-001.md}` as class `derived`. `spine-compose.cjs:21-24` emits a different HEADER instead; `plans/ba/demo/deliverables/PRD-001.md:1` and `SRS-001.md:1` have 0 occurrences of `ba-deliverable:`. phase-08.2:204 codified the opposite (`→ 0 on the two compose writes`) — a phase gate contradicting a priority-1 Global Constraint. Consequence is named in the diff itself: `deliver.md:51` — *"Every deliverable declares its class in its header; `qc drift` uses this"* — and plan.md:63 *"Wave-2 `qc drift` reads the class header and skips `owned`"*. Wave 2 will find no header on the two documents a client signs.

**S2 — `deliver --json` does not meet its contract, and hides writes.** phase-08.2:145: *"`--json` ⇒ `{ files, skipped }` only."* `traceability.cjs:138` emits `{ files }` — `skipped` never appears. Worse, any run with a skip takes the `!result.ok` branch (`traceability.cjs:129-136`) and exits 1 before the JSON branch, so stdout is empty. Same branch means a `deliver all` re-run **does** rewrite `SCOPE-001`/`RELEASE-NOTES-001` (`spine-deliver.cjs:62-76`) yet prints only `⊘` lines — a write reported as nothing. STATE:98 parked this as cosmetic; it is the contract at :145.

### Medium

**S3 — git-ignore warning absent on `deliver all`.** phase-08.2 task 8.2.9: *"Output path would be git-ignored ⇒ one stderr line, exit unchanged (verify-plan R-VP3)"*. `spine-deliver.cjs:105-108` runs `git check-ignore` only in the single-`what` path; the `all` branch returns at `:77` first. The command most likely to be run never warns.

**S4 — D-4 fields dropped on `AC`/`TC` blocks.** plan.md:208: *"All four D-4 fields survive verbatim in the artifact a client signs."* `spine-compose.cjs:112-115` (renderAC) and `:124-127` (renderTC) emit no `**source:** … **confidence:**` line. R10 (STATE:40) exempts only the Actor/Stage-0 labels, FR-only — not `source`/`confidence`. Documented after the fact in `skills/ba/spec/references/compose-format.md:19-22`, justified by phase-06 Gate 4's `FR+NFR+UC+US == source-line count` arithmetic: the gate shaped the contract rather than checking it. No ruling covers it.

**S5 — `ck --kit list` prints a wrong skill count.** `.claude/kits/ba.json` description: `"6 commands, 9 skills"`. `find skills/ba -name SKILL.md` → **6**, and `docs/clauKit-registry.md:3` says *"6 skills"*. phase-08.2:189 licensed only the command count (*"`deliver` makes it 6 commands and adds a skill"*); the inherited `8 skills` (phase-01:20) was already wrong. plan.md:341 permits editing these counts — so this was fixable in-block.

### Low

**S6** — all six generated deliverables emit the literal placeholder `<project>` (`deliver-templates.cjs:21,41,60,81,95,110`), while the hand-authored BP uses the real slug (`plans/ba/demo/deliverables/BP-dat-lich-hen.md:1`). Verbatim against plan.md:120, inconsistent in output.

**S7** — `die()` unused in `spine-deliver.cjs:39-42`; the unknown-`what` guard at `:80-83`/`:95-98` is unreachable (`traceability.cjs:125-127` already exits 2).

**S8** — `skills/ba/ba-context/SKILL.md:3` description says *"Activated by /ba:plan"*. Not the sentence plan.md:331 forbids ("Activate the `<x>` skill"), but it is the word rules § 5 tells the kit to avoid.

### Scope creep (b) — none found
Every non-`plans/` file in the diff maps to a phase Produces or a STATE ruling: `bin/lib/cli-parser.js`, `CLAUDE.md`, `README.md` → R22 (STATE:95); `bin/lib/gitignore-wire.js` → R3 (STATE:12); `docs/*` → phase-10:8. No file from plan.md:339-341 § *Files this plan must NOT touch* appears. 6 command files, 9 mapped dispatchers — D-1 cap (plan.md:84) respected.

### Verified correct (brief checklist)
`owned` refuses overwrite without `--force` (`spine-deliver.cjs:65,89`; exit 1 at `traceability.cjs:145`) · 0 timestamps in any deliverable · `status`/`impact` rejected on non-CR (`spine-parse.cjs:132-138`) · no conditional key in `REQUIRED_KEYS` (`spine-parse.cjs:42`) · `changelog` exits 0 always (`traceability.cjs:119`) · hard-fail pre-flight in all 5 non-`plan` commands, byte-exact · `'CR'` appended last (`spine-parse.cjs:18`) · live gates re-run: `validate` 0, `gap` 0 (20 nodes), `changelog` 2 rows exit 0, suite 366/364/1/1 = plan.md:144.

### Totals
Spec axis: **8 findings** — 0 Critical · 2 High · 3 Medium · 3 Low.
Worst: **S1** — a priority-1 Global Constraint (plan.md:120) inverted by a phase gate (phase-08.2:204), leaving the two client-signed documents unclassified for the `qc drift` consumer the diff's own prose promises.

## Unresolved questions
1. S1 — is phase-08.2:204 an intentional amendment of plan.md:120 that no ruling recorded, or a drafting slip? Either way plan.md:120 and `deliver.md:51` presently assert something false.
2. S4 — should `compose` carry `source`/`confidence` on `AC`/`TC` with phase-06 Gate 4's equality re-expressed, or should plan.md:208 be narrowed to FR/NFR/UC/US? A ruling either way closes it.
3. S5 — what is the intended skill count semantics for a manifest description: `SKILL.md` files (6), or skill paths incl. `README.md` + `capability-map.md` (8)? Neither yields 9.
