# Plan verification — plans/260910-1533-ba-kit/plan.md (Stage 0.5, --from-plan)

Run 2026-09-11, HEAD 744c271, read-only. Merged from per-group reports (evidence rows live there; this table carries verdict + pointer + the load-bearing evidence line):

- [plan-verification-tests.md](plan-verification-tests.md) — A1–A16 (tests / guards / gitignore / PLAN_RULES)
- [plan-verification-skills-docs.md](plan-verification-skills-docs.md) — C1–C20 (shipped-doc links, commands, skills, registry)
- [plan-verification-env-product.md](plan-verification-env-product.md) — D1–D12 (environment, package.json, scenario skill, phases 06/07/11)
- [plan-verification-installer.md](plan-verification-installer.md) · [plan-verification-installer-2.md](plan-verification-installer-2.md) — B (installer / kit-resolver / manifest) — *see § Installer*
- [plan-verification-spine.md](plan-verification-spine.md) — E (phases 02/05/06/07 internal consistency) — *see § Spine*
- M1–M6 below — main-session checks (grep / node -e), evidence inline

## Merged table

| # | Claim (plan location) | Verdict | Evidence (pointer or verbatim) | Load-bearing / impact |
|---|---|---|---|---|
| A1 | `installer-packaging.test.js:165,275,341` literal `['engineer','marketing','both']` | CONFIRMED | tests.md A1 — grep hits at exactly 165/275/341 | Y — phase 09 task 9.2 edits |
| A2 | 4th literal at `installer-claude-md.test.js:179` | CONFIRMED | tests.md A2 | Y — phase 09 |
| A3 | `esm-host.test.js` `SHIPPED_NODE_DIRS = ['.claude/hooks','.claude/scripts/ck']` | CONFIRMED | `tests/esm-host.test.js:31` | Y — phase 09 R12 |
| A4 | `kit === 'marketing'` gates `EXEMPT_SCRIPTS_IN_MARKETING`; `LINK` regex ≠ `^\.\.?/` | CONFIRMED | `installer-packaging.test.js:273,324,351` | Y — phase 09 R10 |
| A5 | test "no shipped doc links to a file the install does not have" resolves every relative `.md` link per kit | CONFIRMED | `installer-packaging.test.js:243` | Y |
| A6 | `npm test` = `node --test tests/` → 0 real tests on Node 24 | CONFIRMED | `package.json:11`; `npm test` → `Cannot find module '…/tests'`, tests 1/pass 0 | Y — all gates use glob form |
| A7 | `tests/lib/` absent | CONFIRMED | `ls tests/lib` → ENOENT | Y — phase 09 creates |
| A8 | `PLAN_RULES` in `bin/lib/gitignore-wire.js:58`, 2 entries, no `derived.json` yet; consumers `installer-packaging.test.js:26,78,81,148` | CONFIRMED | tests.md A8 | Y — phase 02 task 2.9 adds 3rd entry; file NOT in must-not-touch list |
| A9 | `relocate-scripts.test.js:117` fixture = marketing installs no scripts | CONFIRMED | tests.md A9 | Y — phase 09 R10 |
| A10 | `cjs-migrate.js:73` `SHIPPED_JS` digests resolved against git | CONFIRMED | tests.md A10 | Y — phase 09 "do not add" constraint |
| A11 | `protected-branch-guard.test.js:196` fails actual 0 / expected 2 | CONFIRMED | isolated run pass 19 / fail 1 | Y — baseline |
| A12 | `tests/ba-spine.test.js` absent | CONFIRMED | ENOENT | Y — phase 02 creates |
| A13 | baseline 349/347/1/1 | CONFIRMED (projection 358/356/1/1 UNVERIFIABLE until phase 02) | `node --test "tests/*.test.js"` → tests 349 pass 347 fail 1 skipped 1 (also STATE.md baseline) | Y |
| A14 | `kit-resolver.js` exports `listKits()` `:18` and `getKitPaths()` `:85` | CONFIRMED | tests.md A14 | Y — phase 09 `tests/lib/kits.js` |
| A15 | test "plan-artifact rules stay in sync with root .gitignore" at `installer-packaging.test.js:144` | CONFIRMED | tests.md A15 | Y — phase 02 task 2.9 "both or neither" |
| A16 | `.claude/kits/ba.json` absent | CONFIRMED | ENOENT | N |
| C1 | `to-tickets/SKILL.md:26,93` one-file-per-ticket; `:45` spec source; `:134` ticket carries AC | CONFIRMED (caveat: only `:93` has "never one combined file") | skills-docs.md C1 | Y — precedent only |
| C2 | `scenario/SKILL.md` no `](` and no backticked `.claude/` | CONFIRMED | grep → no match ×2 | Y — `requires.shared` link-clean |
| C3 | `tickets.md` 8 link targets; `argument-hint` has `spec-path` | CONFIRMED | skills-docs.md C3 | Y — phase 08 |
| C4 | `to-tickets/SKILL.md` 5 link targets | CONFIRMED | skills-docs.md C4 | N |
| C5 | `cook.md:86` UNSKIPPABLE; `:36` `--from-plan` `[ASSUMED]`-logs | CONFIRMED | verbatim quotes in skills-docs.md C5 | Y — phase 08 Gate 3 |
| C6 | `skills-lock.json` = `{"version":1,"skills":{}}` | CONFIRMED | cat | Y |
| C7 | `docs/known-defects.md` absent | CONFIRMED | ENOENT | Y — phase 10 creates |
| C8 | registry table shapes; `/mk:` = 12 rows | CONFIRMED | skills-docs.md C8 | Y — phase 10 |
| C9 | `mk/plan.md:6-10` pre-flight self-contradicting | CONFIRMED | verbatim | Y — phase 04 design |
| C10 | `skills/marketing/README.md` 12 H2s | CONFIRMED | skills-docs.md C10 | N |
| C11 | kitforge `phase-05…:52` asserts `p.name==="@trungdo9/ClauKit"` | CONFIRMED | verbatim | Y — known-defects entry |
| C12 | `html-output.md`, `preview`, `plans-kanban`, `gkg`, `ck-graphify` exist | CONFIRMED | find/ls | N — redirect rows |
| C13 | `ck/{design,research,scout,tickets}.md` exist | CONFIRMED | ls | N |
| C14 | `marketing-rules.md` = 10 numbered `##` + cross-refs last | CONFIRMED | grep | Y — phase 03 shape |
| C15 | plan.md:25 "transcript in phase 08" | **REFUTED (cross-ref)** — content is in `phase-10…:25-33` + `brainstorm-report.md:243-361`; underlying `resolveSourcePath` rebase behaviour **re-reproduced live** (`kit-resolver.js:109-118`) | skills-docs.md C15 | N — pointer wrong, fact right; nothing built on the pointer |
| C16 | `[NO BASELINE]` precedent in `seo-drift/SKILL.md` | CONFIRMED (cite refined → `.claude/commands/mk/seo.md:42`) | skills-docs.md C16 | N |
| C17 | phase-04:61 "plan.md § Unresolved Q6" | **REFUTED (cross-ref)** — no Q6; item sits unlabeled in plan.md:436 "Closed:" list | grep Q6 → none | N — fact (C9) holds |
| C18 | rule-3 / rule-8 precedents (`tickets.md:19`, `to-tickets:27,93`) | CONFIRMED | skills-docs.md C18 | N |
| C19 | phase-08 own cites (`tickets.md:28`, `to-tickets:45`, `cook.md:86,36`) | CONFIRMED | skills-docs.md C19 | Y — phase 08 |
| C20 | `.claude/commands/mk/seo.md` exists | CONFIRMED | ls | N |
| D1 | `LICENSE` absent; `package.json:28` MIT; `:43` lists LICENSE | CONFIRMED | env-product.md D1 | Y — phase 10 |
| D2 | `package.json:2` name `@trungdo9/ClauKit`; `:11` test script | CONFIRMED | | Y |
| D3 | `d2 plantuml mmdc dot repomix` not found; `java`, `npx` found; node v24.14.1 | CONFIRMED | `command -v` output | Y — phase 07 Gate 2 |
| D4 | `.gitignore:59-68` plans block + "404 in the PR body" comment | CONFIRMED | verbatim | Y — D-11 |
| D5 | `npm view @trungdo9/ClauKit` → E404 capital letters | CONFIRMED | verbatim | Y — Q3 |
| D6 | no `plantuml*.jar` under `$HOME` depth 4 | CONFIRMED | find → empty | N |
| D7/D9 | `scenario/SKILL.md` §§ at `:26,39,48,62` | CONFIRMED | grep `^#` | Y — phase 06 `tc` |
| D8 | `.claude/scripts/ck/` helper list; `plan-lint.cjs:7,36,40,52` exit 0/1/2 | CONFIRMED | env-product.md D8 | Y — helper CLI contract |
| D10 | `skills/THIRD_PARTY_NOTICES.md` precedent | CONFIRMED | `:9,15,17,25-30` | N — phase 11 only |
| D11 | brainstorm `:93` "~13 of 55" | CONFIRMED | | N |
| D12 | `skills/ba/`, `.claude/skills/ba/capability-map.md` absent | CONFIRMED | ENOENT | Y |
| M1 | `.claude/hooks/README.md` backticks `.claude/workflows/development-rules.md` (phase-01:59, plan.md:111 "two workflows hooks/README.md backticks") | **REFUTED (cite)** — README backticks only `.claude/scripts/ck/branch-guard.cjs`, `.claude/.env`, `.claude/hooks/.env`, `.claude/settings*.json`; **decision stands**: `.claude/hooks/discord-hook-setup.md:117` backticks `.claude/workflows/development-rules.md`, and `ba` ships `.claude/hooks/` | `grep -no '\`\.claude/[^\`]*\`' .claude/hooks/README.md`; `grep -n … discord-hook-setup.md` → `117:` | N — same manifest content, wrong filename in the rationale. `primary-workflow.md` is required by no `ba`-shipped backtick (only `skills/marketing/README.md`) — kept for parity with marketing, harmless |
| M2 | `labelFor('business-analysis-rules.md')` → "Business analysis rules"; `ba-rules.md` → "Ba rules" | CONFIRMED | `bin/lib/claude-md-wire.js:55-61` fallback; `node -e` eval → `"Business analysis rules" \| "Ba rules"` | Y — phase 01 Gate 2 label assert |
| M3 | CLAUDE.md § depth-2 skills not registered, say "Read" | CONFIRMED | `CLAUDE.md:58` header | Y — prose rule |
| M4 | `requires.shared` written at wave 0 (Global Constraints, plan.md:91) vs "first written at wave 4" (plan.md:407) | **RESOLVED → wave 0** | `phase-01…:32` manifest JSON carries `"requires": { "shared": [3 entries] }`; plan.md:407 is stale narrative | N — implement per phase 01 |
| M5 | `.claude/hooks/discord-hook-setup.md` and README are in `ba`'s `hooks/` path and backtick `.claude/scripts/ck/branch-guard.cjs` which `ba` does not ship | CONFIRMED (known; phase 09 R10 derived `shipsCkScripts` exemption is the fix; until phase 09 `ba` is outside the hardcoded loops so nothing goes red early) | README:13; A4 | Y — ordering 01→09 |
| M6 | `phase-brief.cjs` usage `<plan-dir> <N>` → writes `reports/phase-N-brief-*.md` (git-ignored via `.gitignore:68`) | CONFIRMED | ran; produced `reports/phase-1-brief-1789087638530.md` | N |
| X1 | `phase-11…:1` titled "Phase 14"; `:46` attributes capability-map to phase 06 (is phase 03, `phase-03…:62`) | **REFUTED (cosmetic)** | env-product.md § Inconsistencies 1–2 | N — phase 11 optional, skipped this run |

## § Installer (B)

Two agents covered this group (a pre-`/clear` run's `vp-installer`, B1–B27, and this run's `vp-installer-2`, rows 1–16). The first file was overwritten in a path race; its verdicts are recorded from the agent's summary and its file re-emit is [plan-verification-installer.md](plan-verification-installer.md) (pending at merge time — see § Gate verdict).

| # | Claim (plan location) | Verdict | Evidence (pointer or verbatim) | Load-bearing / impact |
|---|---|---|---|---|
| B'1 | `printKitList()` dir-scans `.claude/kits/*.json` | CONFIRMED | `kit-resolver.js:19-20`; live `ck init --kit list` → both/engineer/marketing | Y — phase 01 Gate 1 |
| B'2 | `bin/ck.js:49` exits 1 on missing declared path before copy | CONFIRMED (exit is `:54`; `:49` is the `checkKitPathsAvailable` call; copy loop `:67`) | live: bogus-path manifest → `❌ … 1 missing path(s)` `EXIT=1`, `git status` unchanged | Y — 01→02–08 ordering |
| B'3 | `ck.js:66-78` union-by-file + idempotent settings merge | CONFIRMED (merge half is `mergeSettings` `ck.js:127-133` + `settings-merge.js`) | live: engineer then marketing → both command trees, hooks=2; re-run adds 0 rules | Y — phase 01 Gate 3 |
| B'4 | `resolveSourcePath` `path.join(PACKAGE_ROOT, rel)` rebases absolute paths; `.claude/skills` symlink → real dir on install | CONFIRMED | `kit-resolver.js:110`; `ls -la .claude/skills → ../skills`; `file-copier.js:17-36` `realpathSync` | Y — D-5 finding basis |
| B'5 | `resolveKit` accepts external manifest | CONFIRMED | `kit-resolver.js:51-68`; live run | Y |
| B'6 | `marketing.json` `requires.shared` = 5, no `commands/ck/`; key set `name,description,namespace,version,paths{…},requires{shared}` | CONFIRMED | cat; `ba.json` (phase-01 task 1.1) mirrors minus `agents` | Y — manifest shape |
| B'7 | `labelFor('business-analysis-rules.md')` | CONFIRMED | = M2 | Y |
| B'8 | `extends` inert | CONFIRMED | `both.json:6` declares it; `grep -rln extends bin/ tests/` → none; `getKitPaths` `:85-95` reads `paths`+`requires` only | Y — no combo manifest |
| B'9 | LICENSE / package.json / test script | CONFIRMED | = D1/D2 | Y |
| B'10 | `docs/clauKit-registry.md`, `docs/project-roadmap.md` exist; `docs/known-defects.md` absent | CONFIRMED | `ls docs/` | Y — phase 10 |
| B'11 | `mk/plan.md` writes `plans/marketing-context.md`; sections Pre-flight/Variables/Workflow/Output/Output format/Notes/Examples | CONFIRMED | installer-2.md row 11 | Y — phase 04 shape |
| B'12 | environment binaries | CONFIRMED | = D3 | N |
| B'13 | `SHIPPED_NODE_DIRS` at `esm-host.test.js:31`; `shipsCkScripts` **does not exist yet** — phase 09 creates it in new `tests/lib/kits.js`; neither in a must-not-touch file | CONFIRMED (no conflict) | grep across `*.js`/`*.cjs` → only plan prose | Y — phase 09 buildable |
| B'14 | R17 `path.join` rebase/escape table | CONFIRMED | `node -e` repro ×3 | N — recorded debt |
| B'15 | hardcoded kit-loop lines | UNVERIFIABLE in installer-2 → **CONFIRMED by A1/A2** | tests.md | Y |
| B'16 | npm tarball de-symlink fallback | CONFIRMED (code path `kit-resolver.js:102-118`; tarball not packed) | installer-2.md row 16 | Y — not exercised by this plan's gates |
| B8 | `cli-parser.js:64,94` hold help text `engineer\|marketing\|both\|<custom.json>` | **REFUTED (line)** — help text is `:75`; `:64,94` are npx usage lines that *do* contain `@trungdo9/ClauKit` (so phase-10:19's blast-radius cite of them is right for a different reason) | vp-installer summary; file pending | N — phase 10 courtesy edit; implementer greps, does not trust the line |
| B12 | `.claude/hooks/README.md` backticks `development-rules.md` | **REFUTED (cite)** = M1; decision stands via `discord-hook-setup.md:117` | grep | N |
| B1–B27 rest | 24 CONFIRMED per summary (install mechanics live, kit-loop lines, cook.md gate text, to-tickets, skills-lock, baseline, LICENSE/npm, kitforge :52, link sets backing 6→3) | CONFIRMED | file pending re-emit | — |

## § Spine (E) — phases 02 / 05 / 06 / 07

Source: [plan-verification-spine.md](plan-verification-spine.md) — 20 rows, 19 CONFIRMED (plan-lint exit codes, to-tickets `:26,93`, scenario `:26,39,48,62`, cook.md `:86,:36`, kit-loop literals, baseline 349/347/1/1 re-measured, npm test breakage, renderer absence — all re-confirmed independently) + 1 REFUTED:

| # | Claim (plan location) | Verdict | Evidence | Load-bearing / impact |
|---|---|---|---|---|
| E20 | `traceability.derived.json` nodes expose `out_of_scope` (phase-05 Gate 1 `:77` reads `x.out_of_scope`) | **REFUTED — load-bearing, plan-internal** | phase-02 Interfaces `Node = { id, kind, title, file, doc, parents, source, confidence }`; task 2.5 never copies it | Y — `epics-missing-scope` would equal the EPIC count; Gate 1 fails by construction. **Resolved by ruling R1** (Node gains `out_of_scope`/`touches`, `string\|null`); phase-02 amended |
| E-c1 | phase-02 Gate 6 runs `ck init --kit ba` mid-plan | inconsistency | manifest requires `business-analysis-rules.md` (phase 03) → `ck.js:54` exits 1 | **Ruling R2**: order 01 → 03 → 02 → 04… |
| E-c2 | phase-02:93 "esm-host scope-join in phase 05" | stale | it is phase-09:58-61 | Ruling R4, amended |
| E-c3 | phase-02 2.9 vs phase-06 6.5 on who wires `.gitignore` | contradiction | `ck.js` `wireGitignore` + `PLAN_RULES` exists (A8) → installer wires it; phase-09 has no task 9.4 | Rulings R3 + R5 |
| E-c4 | phase-02/03 headers "Depends on: phase 04" | stale | plan.md table: 02←01, 03←01, 04←03 | Ruling R4 (phase-02 line removed; phase-03 header left, dispatch carries the truth) |
| E-c5 | phase-02 "8-key frontmatter table" ×2 | stale | plan.md § Spine model: ten keys | Ruling R4, amended |
| E-b | no phase touches a must-not-touch file | CONFIRMED | spine.md § (b) | Y |

## Gate verdict

**PASS** — `phase 0: gate verify-plan → PASS`, appended to `STATE.md` 2026-09-11 with rulings R1–R6.

- ~110 rows across 6 reports (A16 · B27 · B'16 · C20 · D12 · E20 · M6 · X1, with deliberate overlap between the pre-`/clear` and this run's agents — every overlapping row agreed).
- **0 REFUTED claims about existing repo behaviour are load-bearing.** The 7 refuted cites are plan-internal typos (wrong phase / line / filename) whose underlying facts were independently reproduced (C15 probe re-run live; M1/B12 real file found; B8 real line found).
- **1 load-bearing plan-internal defect (E20)** — an interface gap between two phases, not a false premise about the codebase. Resolved by an additive ruling (R1) that changes no approach; the fix is recorded in the ledger and in the amended phase-02 file rather than by a re-plan.
- 1 UNVERIFIABLE (A13 projection 358/356/1/1) — re-check at phase 02 exit.
- Note: the installer report's "pending re-emit" is done — [plan-verification-installer.md](plan-verification-installer.md) is on disk with B1–B27.

## Ambiguity resolutions carried into Implement

1. `requires.shared` = exactly three entries, written in `ba.json` at phase 01 (M4). Rationale text in shipped prose must cite `discord-hook-setup.md`, not `hooks/README.md` (M1) — flag to phase 03 implementer if the rules file repeats the reason.
2. Cross-refs C15 / C17 / X1 are plan-internal typos; nothing is built on them. Not fixed this run (plan files are not the deliverable); listed in the final report.
3. Phase 11 (optional prior-art scan) **skipped** — `[ASSUMED]` no user opt-in available in this run.
4. Every gate uses `node --test "tests/*.test.js"`; the 1 pre-existing fail (`protected-branch-guard.test.js:196`) is baseline, never chased.

## Gate verdict

*(pending B + E)*
