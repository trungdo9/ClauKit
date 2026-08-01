# Plan Verification — 260730-1359-clauKit-upgrade

**Verified:** 2026-07-31 · **Method:** T2.1's own falsification protocol applied to this plan — every repo-checkable factual claim extracted, proven/disproven with live commands. Plan status: awaiting approval (nothing implemented — all "new deliverable" paths correctly absent).

**Verdict: APPROVE.** 30 load-bearing claims checked → 27 CONFIRMED (most with exact `file:line` precision), 3 minor discrepancies (none breaks a task premise), 1 claim class UNVERIFIABLE (source HTML reports not in repo). Bonus: **G6 reproduced live during this verification** — a `grep` command merely *containing* the string `node_modules` in its pattern was blocked by the scout-block hook.

## Claim table

| # | Claim (plan ref) | Verdict | Evidence | Impact if wrong |
|---|---|---|---|---|
| 1 | G0: no kit manifest declares `hooks`/`statusline`; `settings.json` in every manifest `config` | **CONFIRMED** | all 3 `.claude/kits/*.json` read — `paths` keys: agents/commands/skills/workflows/config only; `settings.json` present in each `config`; `.claude/hooks/` + `statusline.{js,sh,ps1}` exist in repo but uninstalled | T1.0 pointless |
| 2 | `getKitPaths()` at `bin/lib/kit-resolver.js:85` flattens all `paths` values | **CONFIRMED** | `grep -n 'function getKitPaths'` → line 85; body iterates `Object.values(manifest.paths)` + `requires` | T1.0 needs CLI change |
| 3 | `.gitignore:59` = `plans/**/*`; `STATE.md` + `plan.md` untrackable | **CONFIRMED** | `grep -n` → line 59 exact; `git check-ignore -v` matches both files against that line; `git ls-files plans/` → **0** tracked | D1/T1.1/T6.1a blocker void |
| 4 | `refactor/SKILL.md:88` instructs `git reset --hard`; only such hit in skills/.claude | **CONFIRMED** | line 88 exact: "If red → fix within batch OR `git reset --hard` + rethink"; `grep -rn 'reset --hard'` → single hit | T1.2 conflict-fix misdirected |
| 5 | `cook/SKILL.md:53` = Stage 0 Exact-Requirements Gate, hard-gate language | **CONFIRMED** | line 53 exact heading; "hard gate… STOP and ask ONE clarifying question"; `UNSKIPPABLE` at `cook.md:50` | G25 premise wrong |
| 6 | G25: `primary-workflow.md` never mentions the gate; regression grep returns nothing | **CONFIRMED** (nit #1) | `grep -icE 'exact-requirements\|acceptance criteria'` → **0**. Nit: plan's parenthetical "no match for `requirement`" literally false — line 37 "Validate performance requirements" (incidental, unrelated to gate) | T5.2 keystone gone |
| 7 | Counts: 129 skills · 29 agents · 14 workflow md · 81,539 skill lines | **CONFIRMED** | `find`/`wc` — all four exact, incl. the plan's corrected 14-workflow baseline | inventory math off |
| 8 | Commands: 25 `/ck:` + 12 `/mk:` files; registry = 52 command entries, 210 total | **CONFIRMED** | file count 25+12=37; registry §3 rows = 52 (variants counted); prose "129 skills · 29 agents · 52 commands · **210 total entries**" | T5.3 baseline wrong |
| 9 | G4: `git.md:17,21` "Stage all files" | **CONFIRMED** | lines 17 & 21 exact, in `cm` and `cp` | T1.4 target wrong |
| 10 | G6: scout-block substring-matches blocked dirs → false positives | **CONFIRMED — reproduced live** | this verification's own `grep -n 'node_modules…' scout-block.js` Bash call was denied by the PreToolUse hook ("ERROR: Blocked directory pattern") | T1.3 unneeded |
| 11 | G12: `/ck:git pr` dead-ends on auth failure, no draft fallback | **CONFIRMED** | git.md §pr: "If `gh` is not installed/authorized, instruct user to install and authorize GitHub CLI first" — full section, no fallback | T1.5 unneeded |
| 12 | T1.0b: no test runner — `tests/` = 2 shell scripts, `npm test` = `bash tests/test-scout-block.sh` | **CONFIRMED** | `ls tests/` → `test-scout-block.{sh,ps1}`; package.json scripts verbatim | acceptance criteria executable after all |
| 13 | Wired hooks read snake_case `tool_input`; discord/telegram read camelCase and are NOT registered | **CONFIRMED** | `modularization-hook.js:48` `payload.tool_input?.file_path`; `scout-block.js:35` `data.tool_input`; `discord_notify.sh:45`/`telegram_notify.sh:43` `sessionId`/`toolsUsed`; settings.json registers only scout-block + modularization | T1.2b session-id key wrong |
| 14 | G7: `database` skill zero dry-run/rollback content | **CONFIRMED** (nit #2) | `databases/SKILL.md` 0 hits both terms. Nit: `references/postgresql-psql-cli.md:313-320` has txn `ROLLBACK`/savepoint examples; `db_migrate.py` implements rollback — literal "zero" overstated, but no *write-safety protocol* (dry-run count → paired rollback → approval) exists anywhere | T1.7 duplicate |
| 15 | Superpowers: 14 skills / 7,169 lines / SDD 503 lines / SessionStart hook on `startup\|clear\|compact` | **CONFIRMED — all four exact** | `../superpowers-main`: `find … wc -l` → 14, 7169, 503; `hooks/hooks.json:3-5` matcher verbatim | Part C/C.2 comparison bogus |
| 16 | T5.5: registry `❗` marker used once (legend only) | **CONFIRMED** | `grep -c '❗'` → 1 | audit premise wrong |
| 17 | Duplicates exist: `programmatic-seo` + `seo-programmatic`; `preview` + `markdown-novel-viewer` | **CONFIRMED** | all 4 dirs exist | T5.5 targets phantom |
| 18 | `includeCoAuthoredBy: false` + dev-rules no-AI-references rule | **CONFIRMED** | settings.json key; `development-rules.md:35` verbatim | T6.1a rationale gone |
| 19 | `fix-pipeline.md` = declared SoT for `/ck:fix` family, 7 stages, Root-Cause Gate | **CONFIRMED** | header verbatim "Single source of truth…"; stages 1–7 with 3.5 Root-Cause Gate | T5.2 edit target wrong |
| 20 | All Part C "already ported" files exist | **CONFIRMED** | code-review refs: requesting/reception(+examples)/verification-before-completion/verification-patterns; debugging refs: verification/systematic-debugging/root-cause-tracing/defense-in-depth | port matrix wrong |
| 21 | cook: loop cap 3 + retro | **CONFIRMED** | `cook/SKILL.md:90` verbatim | Global Constraints wrong |
| 22 | `skills/` → symlinked `.claude/skills` | **CONFIRMED** | `.claude/skills -> ../skills` | manifest paths wrong |
| 23 | `context-engineering` skill exists (T3.3 extends, not creates) | **CONFIRMED** | dir + references/ exist; no model-tiering.md yet (expected) | T3.3 shape wrong |
| 24 | `test-automation`, `web-testing`, `scenario`, `plans-kanban`, `worktree`, `dynamic-workflow`, `find-skills` skills exist | **CONFIRMED** | all found; note `test-automation` lives at `skills/software/development/test-automation` (plan never states a path — fine) | T2.2 scope-boundary refs dangle |
| 25 | `/ck:plan` has no `verify` action today | **CONFIRMED** | `grep -c verify plan.md` → 0 | T2.1 duplicate |
| 26 | All new deliverables absent (plan unimplemented) | **CONFIRMED** | run-state/verify-plan/tdd skills, guard-destructive/file-claims hooks, pr-body.md, tests/behavior, skill-activation.md, scripts/ck — none exist; `scripts/` holds only 5 build/link scripts | plan already (partially) done |
| 27 | Agent model tiering: haiku ×4 · sonnet ×7 · opus ×4 · inherit ×1 | **REFUTED (off-by-one, cosmetic)** | engineering agents actual: haiku 4 · **sonnet 8** · opus 4 · inherit 1 (=17; +12 marketing sonnet = 29). Likely stale since `seo-writer` (registry 2026-07-23, 28→29) | none — Part A.4 descriptive row only |
| 28 | cook SKILL.md "~130 lines" | **CONFIRMED-ish** | actual 110; "~" claim, direction of argument (thin vs SDD's 503) unaffected | none |
| 29 | Registry prose "was off by one" re workflows 15 vs 14 | **UNVERIFIABLE** | no "15 workflows" string found in registry/README today; 14 files confirmed. Possibly already corrected or stated elsewhere | none — baseline 14 is what matters and holds |
| 30 | All User A/B statistics + named incidents (msgs/sessions/hours, tool counts, 43%/29% multi-clauding, the 3-PR wrong root cause, exit-216, ~20GB worktrees, …) | **UNVERIFIABLE from repo** | source HTMLs (`Claude Code Insights.html`, `report-2026-07-29-140553.html`) not found in repo or ~/Downloads. Internal consistency OK (189+106=295). Taken on trust as the plan's evidence base | Parts B/B.2 evidence weights shift; task list itself still stands on repo-verified gaps |

## Discrepancies requiring plan edits (all cosmetic)

1. **Part A.4 tiering row:** `sonnet ×7` → `sonnet ×8` (or "engineering: 4/8/4/1 of 17").
2. **G25 parenthetical:** "no match for `requirement`…" → soften to "no match for the gate's vocabulary (`exact-requirements`, `acceptance criteria`, `scope boundary`, `touchpoint` as gate items)" — an incidental "performance requirements" exists at line 37. The regression-test grep in T5.2 acceptance is already correct as written.
3. **G7 wording:** "zero 'dry-run'/'rollback' content" → "no write-safety protocol (dry-run count · paired rollback script · approval); txn-ROLLBACK syntax examples exist in psql-cli reference but no procedure". T1.7 unchanged.

## Side observations (support the plan, not in it)

- **G6 live repro during verification** — the hook blocked a read-only `grep` whose *pattern argument* contained `node_modules`. Stronger than the plan's cited repro; paste into T1.3's regression-test corpus.
- Registry internal staleness: section headings say "Skills (128)" / "Agents (28)" while its own counts line says 129/29 — supports T5.3's registry refresh.
- `.claude/hooks/` also carries `discord-hook-setup.md`, `send-discord.sh`, `README.md` — T1.0's `"hooks": [".claude/hooks/"]` glob would install setup docs + unregistered notify scripts into every consumer project. Consider enumerating files or splitting wired hooks from optional ones.

## Unresolved questions

1. Should the two source HTML reports (or extracts) be committed under `plans/260730-1359-clauKit-upgrade/reports/` so Part B/B.2 evidence is re-checkable? (Currently the plan's largest evidence base is off-repo.)
2. T1.0 hooks glob: install whole `.claude/hooks/` dir or an explicit file list (see side observation 3)?
