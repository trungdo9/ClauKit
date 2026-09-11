# Re-review after two fix cycles — 3b0f793 → 3e1f6d5

FIXED_POINT `3b0f793`, cycle 1 `947d854`, cycle 2 `3e1f6d5` (= HEAD). Read-only recheck; live functional repro run against scratch copies only (`/tmp/.../scratchpad/demo`), nothing under the repo touched.

## Table

| item | verdict | evidence file:line |
|---|---|---|
| H1 — command-layer slug regex (6 files) | CLOSED | `.claude/commands/ba/deliver.md:59`, `diagram.md:86`, `plan.md:113`, `prd.md:140`, `qc.md:167`, `spec.md:194` — all `^[a-z0-9][a-z0-9-]*$`, refuse `/`/`..`/whitespace |
| H1 — CLI relative-path containment | CLOSED | `traceability.cjs:45-51` — `climbs` + `!resolved.startsWith(root+sep)` ⇒ `die(...,2)`; repro: `deliver ../foo` → exit 2, no files written |
| H1 — R-H1 absolute-path carve-out stated | CLOSED | `traceability.cjs:40-44` comment: "An ABSOLUTE path is the operator's explicit choice and is taken as-is (the commands never build one from a slug)" — sits immediately above `if (!path.isAbsolute(projectDir))` at :45, so the trust boundary is documented at the point of the check (not in the one-line USAGE string at :36, but that string was never the claimed location — a docstring is) |
| H2 — uncaught fs errors | CLOSED | `traceability.cjs:170-176` wraps `main()` in try/catch → `die(e.message, 2)`; docstrings at `spine-compose.cjs:163` and `spine-deliver.cjs:41` now read "Throws only on I/O errors ... the CLI maps those to exit 2" |
| H3 — class marker, real slug, no literal placeholder | CLOSED | `grep -rn "plans/ba/<" plans/ba/demo/deliverables/` → 0 matches; all 9 files (`ACCEPTANCE-001`, `GOLIVE-001`, `HANDOVER-001`, `PRD-001`, `RELEASE-NOTES-001`, `SCOPE-001`, `SRS-001`, `UAT-001`, `BP-dat-lich-hen`) carry `nguồn: plans/ba/demo/entities/`; generators at `deliver-templates.cjs:15` (`slug()`) and `spine-compose.cjs:15-17` (`marker()`) |
| H4a/4b — `--json` always `{files,skipped[,violations]}` | CLOSED | `traceability.cjs:147-148` — JSON branch runs even when `!result.ok`; live repro: `deliver all --json` on a run with 4 owned skips → `{"files":["SCOPE-001.md","RELEASE-NOTES-001.md"],"skipped":[4 files],"violations":[]}`, exit 1 |
| H4c — plain-text `deliver all` reports derived rewrites | CLOSED | `traceability.cjs:150-151` — `if (result.files && result.files.length) console.log('✓ delivered ...')` runs before the `⊘` loop; live repro confirmed: `✓ delivered SCOPE-001.md, RELEASE-NOTES-001.md` printed before the 4 `⊘` lines, exit 1 |
| Standards — SKILL.md six subcommands | CLOSED | `skills/ba/traceability/SKILL.md` "The six helper subcommands" block lists `index/gap/validate/compose/changelog/deliver` |
| Standards — business-analysis-rules.md § Cross-references lists six | **OPEN** | `business-analysis-rules.md:91` still reads `` `.claude/scripts/ba/traceability.cjs` — spine CLI (`index` / `gap` / `validate` / `compose`) `` — 4 of 6, `changelog`/`deliver` absent. Not touched by either cycle's diff (delta only changed §7's "ten kinds" line) |
| Standards — ba.json "6 skills" | CLOSED | `.claude/kits/ba.json:3` — "6 commands, 6 skills" |
| Standards — tests mkdtempSync + after() | CLOSED | `tests/ba-deliver.test.js:6` (`after`), `:14` (`fs.mkdtempSync`), `:26-28` (`after(() => made.forEach(rmSync))`) |
| Spec S3 — git-ignore warning fires on `deliver all` too | CLOSED | `spine-deliver.cjs:68` (inside the `all` loop) and `:99` (single-`what` path) both call `warnIfIgnored()` |
| Smells — duplicate `die()` removed | CLOSED | `spine-deliver.cjs` — no local `die` left (grep: 0 hits); only `warnIfIgnored` and module fns remain |
| Smells — unknown-deliverable returns violation, not usage print | CLOSED | `spine-deliver.cjs:78`, `:93` — `{ ok:false, violations:[{check:'unknown-deliverable',...}] }`, no `console.error`; confirmed unreachable from CLI (bogus `what` caught earlier, exits 2 with usage string, per live repro) |
| R-S4 downgrade — AC/TC provenance via `parents`, no regression | CLOSED (no regression) | `spine-compose.cjs` renderAC/renderTC not touched by either cycle's diff (absent from diffstat); ruling stands |

Totals: **12 CLOSED, 1 OPEN, 0 REGRESSION** of 13 tracked items (4 Highs incl. sub-checks all closed; 4 Mediums 3 closed/1 open; Spec S3 closed; 2 smells closed; R-S4 no regression).

## NEW in delta

- **Low** — `spine-deliver.cjs:78,93`: the new `unknown-deliverable` violation objects omit the `id` key that every other violation object in this codebase carries (e.g. `bad-project` violations serialize `"id":null`). Confirmed unreachable via the CLI (bogus `what` is caught earlier and exits 2), so no observed break, but a direct library caller or a future `--json` consumer keying on `id` gets an inconsistent shape.
- **Low** — `spine-deliver.cjs:68`: `warnIfIgnored()` now runs once per file inside the `all` loop (up to 6 `spawnSync('git', ['check-ignore', ...])` calls per invocation) instead of a single check — correctness fix (S3) at a minor perf cost; not worth a separate fix.
- No Critical/High/Medium new issues found.

## Unresolved questions

1. business-analysis-rules.md:91 — fix is a one-line edit (add `/changelog` `/deliver`); confirm whether this blocks close-out or gets deferred with the other known Q1/Q2 doc-reconciliation items.
