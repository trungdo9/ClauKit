# Changelog

## [1.5.2](https://github.com/trungdo9/ClauKit/compare/v1.5.1...v1.5.2) (2026-08-25)

**Two link-and-reference defects in the marketing kit, both of the same family: a path or a name that resolved in this repo and nowhere in an install.**

### 🐞 Bug Fixes

* **docs:** six marketing doc references rewritten from bare `skills/marketing/…` to `.claude/skills/marketing/…`. An install writes nothing outside `.claude/`, so a root-level `skills/` does not exist in a consuming project and each of those links was a 404 there while resolving fine here. Fixed at the source in three generators (`generate-marketing-agents.js`, `generate-marketing-commands.js`, `generate-marketing-skills.js`) so regeneration cannot reintroduce them, and in the four already-emitted docs (`wordpress-rest/SKILL.md`, `wordpress-rest/references/audit.md`, `marketing/cro/SKILL.md`, `marketing/seo-writing/SKILL.md`).
* **marketing:** `/mk:email cold`, `/mk:leads` and `/mk:growth referral` listed skills that do not exist. `prospecting` has no directory under `skills/marketing/` at all and is dropped; `referrals` is mapped to the real `marketing-ideas`. Both names sat in the `marketing-commands.js` skill table, so the three generated `mk` commands named them at activation time and resolved nothing. Table corrected and the commands regenerated.

## [1.5.1](https://github.com/trungdo9/ClauKit/compare/v1.5.0...v1.5.1) (2026-08-11)

**A `scripts/` code review, and the headline finding is that a gate shipped with no way to fire.** `branch-guard` went out in 1.5.0 with its verdict, its tests, and its documentation — and no registration anywhere, so a plain `git checkout -b` reached the shell unchecked. Same shape as the 1.5.0 finding it followed. Also: the delivery tail's parser held six defects at once, three dev-tree files were retired, and `ck init` now stops consumer projects from committing megabytes of regenerable diff.

### 🐞 Bug Fixes

* **hooks:** `branch-guard` **registered as a PreToolUse hook** (`.claude/hooks/branch-guard.cjs`, wired in `settings.json`, merged into existing installs by `settings-merge.js`). The verdict shipped for a release with the only instruction to use it being one line of prose in `/ck:git` — so the gate fired exactly when the model chose to run it, which is not a gate. `guard-destructive`'s own suite asserts `git checkout -b feat/x` is benign, so nothing else stopped it either. A shared HEAD is a mechanical invariant; it needs a mechanical check. Fails open in three ways (unparseable payload, missing checks module, unreadable registry) because it adds a refusal to a previously-allowed action.
* **scripts:** command parsing extracted to `scripts/ck/lib/shell-parse.cjs` and made **quote-aware**. Newline and single `&` are separators (multi-line Bash is the normal shape for an agent's git calls), any git global option is skipped rather than four whitelisted ones (`git --no-pager checkout -b x` was allowed), launcher prefixes are peeled (`env git …`), and a `sh -c "…"` wrapper is found wherever it sits instead of only spanning the whole line. **All four previously returned ALLOW with 0 ops.** Registry path now resolves against `repoRoot()`, not cwd.
* **scripts:** the delivery tail's parser, five defects, each of which silently ran the wrong command, re-ran it every invocation, or reported the wrong step DONE — a bold step name with trailing prose starts its own step, a declared key is never overwritten, an H1 closes the tail block, an unbackticked `done-when` is not split at a bare `=`, and **both** sides of `done-when` are substituted.
* **install:** stale `.cjs` paths repaired in `ck-review.yml.template` — every consumer's PR review job failed with `Cannot find module` — and in the tail's REFUSED payload, which is the only instructions for arming a tail. `cjs-migrate-refs.js` now covers `.github/workflows/` so existing installs self-heal.
* **install:** regenerable plan artifacts (`plans/**/reports/review-package-*.md`, `*-brief-*.md`) wired into the **root** `.gitignore`. `run-workspace.cjs` described that directory as "a git-ignored per-plan artifact dir" and nothing ClauKit installed ignored it, so every `review-package.cjs` run wrote a full `git diff -U10` there and the next `git add -A` swept it into history. Scoped to the two regenerable name patterns, not `plans/**` — a plan's `plan.md`, `STATE.md` and hand-written reports are linked from the PR body, and an ignored report is a 404 in a review.
* **scripts:** the three `generate-marketing-*.js` scaffolders are **write-once** (`--force` to overwrite, `--dry-run` to preview, skip count always printed) — a re-run would have replaced 16 hand-authored files with stubs, `/mk:seo` alone having grown to 78 lines against its template's 50. `programmatic-seo` dropped from the generator and the `/mk:seo` cross-link (§4f records it removed as a duplicate; the generator would have resurrected it). The 3 automation agents now write to `.claude/agents/marketing/` where they actually live, instead of creating a second file with duplicate `name:` frontmatter under a stale `automation/`.

### ♻️ Code Refactoring

* **scripts:** `delivery-tail.cjs` split 357 → 169 lines over `lib/tail-parse` (parse + substitute), `lib/tail-checks` (approval policy + payloads) and `lib/tail-runtime` (execute). The previous single unit held all six defects above, all of them in the parsing half, with no seam to test them at.

### 💥 Removed

* **`obsidian` skill** (`software/obsidian/` — SKILL.md + 4 references). Maintainer decision: no agent, no command, no runtime code, and nothing in ClauKit's own pipelines ever routed to it — out of scope for a software engineering kit, and an auto-discoverable `SKILL.md` that nothing invokes is activation surface with no payoff. All 5 files registered in `RETIRED` with their shipped blob digests, so `ck init` cleans existing installs on content proof, never on a name guess. Counts: skills 130→**129**, `software/` 71→70, registry entries 215→**214**.
* **`scripts/postinstall.js`** — wired to nothing for the package's whole life (no `postinstall` entry, no husky hook, root `scripts/` excluded from `files`), so its banner never printed for anyone while `codebase-summary.md` listed it as a live setup script. `ck --help` already prints strictly more.
* **`.agent/`** — held `.agent/skills → ../skills`, the Antigravity IDE's workspace skills path. Never dead code in *intent*, but it was tracked as a symlink blob with no ignore rule, and a per-platform-regenerated pointer that git tracks is the one shape that breaks Windows checkouts. `link-skills.js` is back to one target and records how to restore the second (add to `targets` **and** give it an ignore rule — one without the other is the original defect).

### ✅ Tests

* 281 → **306 tests**, 305 pass, 0 fail, 1 skip. New: `branch-guard` hook coverage, delivery-tail parser cases pinning each of the five defects, and `installer-packaging` assertions that `.claude/skills` stays untracked + ignored and that nothing tracks `.agent/` again.

### 📚 Documentation

* **README counts corrected against the filesystem** — skills 130→129 (5 sites), hooks 4→**5**, `scripts/ck/` helpers 5→**7**, tests 254→**306**, behavioral scenarios 6→**10**. The verification-status note now states what each gate demonstrates rather than describing a sweep two releases old.

## [1.5.0](https://github.com/trungdo9/ClauKit/compare/v1.4.2...v1.5.0) (2026-08-06)

**Gates that were never demonstrated, measured — and two of them were dark.** The behavioural harness was rebuilt until its verdicts meant something, and the first thing it found was that a gate can pass review, ship, and still not fire. Also: the worktree fleet is removed, the installer can finally *update* an existing project rather than only create one, and two new mechanical gates (`branch-guard`, `plan-lint`) replace checklist prose with exit codes.

### 🚀 Features

* **install:** `ck init` now brings an existing project **up to date**, not just a new one. `wireClaudeMd` treated "already wired" as "nothing to add", so every project was frozen at whatever its first `init` wrote — a later version's workflows and rules reached brand-new installs only. It now ensures every line this version generates is present (pointers inserted after the marker, rule paragraphs appended) and never rewrites a line. A hand-written `CLAUDE.md` carrying no marker of ours is still left **byte-identical**; the CLI reports which rules are missing instead, because that file is not ours to edit.
* **install:** evidence-based retirement (`bin/lib/retired-files.js`, `bin/lib/blob-digest.js`). `copyPath` only ever writes, so a file ClauKit stopped shipping survived in every project that had installed it — dead weight at best, an auto-discoverable retired `SKILL.md` at worst. Removal is gated on the file's **git blob matching a byte sequence ClauKit actually shipped**, so `scripts/ck/wt-clean.js` written by a user is never touched. `blob-digest.js` is now the single answer to "is this file ours?" for both this and `cjs-migrate`.
* **cook:** new **§ Closing gate** in the `cook` skill — before any completion claim, every Stage-0 acceptance criterion is answered with the command output that settles it. Stage 0 demanded criteria that are *verifiable* and nothing ever verified them: the skill's pipeline ended at Deploy, and only `/ck:cook`'s Report closed the loop, so every other consumer collected criteria and never looked at them again. Stated outside the stage table on purpose — Deploy runs only in `--auto` and Docs can be skipped, so a check living inside a stage would not survive every path.
* **scripts:** `branch-guard.cjs` refuses to move HEAD while another live session shares the tree; `plan-lint.cjs` turns the `planning` skill's self-review checklist into an exit code over a plan directory.
* **behavioural harness:** `--positive` + `POSITIVE_PATTERN` — remove **one** claimed-load-bearing line (not the skill, not the other 48 lines) and require the case to fail without it and pass with it. `--negative` now runs the ablated scenario **3 times** (`--negative=N`) and reports three outcomes instead of two: demonstrated, **SUPPORTED, NOT DEMONSTRATED** (the rule shifts the outcome without deciding it), **NOT DISCRIMINATING**. One ablated run is a coin flip and produced two wrong verdicts in a single session.

### 💥 Removed

* **worktree fleet** — `scripts/ck/wt-{new,doctor,clean}.cjs`, `skills/software/git/worktree/`, and their suite. Existing installs have them removed by the retirement gate above, on blob evidence only.

### 🐞 Bug Fixes

* **cook/verify-plan:** the refuted-premise **hard stop** now reaches the session. A run verified a plan's cited commit, found it was a no-op, silently performed the missing migration on one file and shipped the change that depended on it — the premise had said *every* producer. The rule existed (`verify-plan/SKILL.md`: "back to `planner`; do not patch around it") but the failing run had opened **no `.claude` file at all**, so it lived behind a link nobody followed. It is now stated in `CLAUDE.md` itself. Positive control, same fixture and prompt, one variable: without the line, cited commit inspected @4 and the target mutated @11 → FAIL; with it, inspected @3–6, no mutation → PASS, reproduced three times.
* **workflows:** `skill-activation.md` said *process skills before implementation skills* but never **which** process for which task. A cross-layer bug fix edited one side without asking, twice, in runs that had read that very file. Rule 5 adds a task-shape → gate trigger table (>1 repo/layer → `cook` § Scope lock, plan asserting existing behaviour → `verify-plan`, reported bug → `tdd`, resumed work → `run-state`), each row linking its skill rather than restating it. Positive-controlled, with a rejected candidate first: the same halt delegated from `fix-pipeline.md` did **not** flip the scenario, because that run never opened that file.
* **cook:** the `≤5 fix cycles per feature` cap lived only in `/ck:cook`, while the skill it names as its source of truth had only the per-gate cap — so `/ck:fix`, `/ck:flow` and any bare activation ran with the ping-pong hole the command itself documents (a Review fix that breaks a test hands control to the Test gate with a fresh budget: 9 cycles). Cap moved into the skill; the command delegates and names no numbers.
* **install:** a rule no longer cites a path its kit does not ship. The hard stop was emitted unconditionally, so every `marketing` install carried a `CLAUDE.md` pointing at `skills/software/verify-plan/SKILL.md`, which that kit has no copy of — the exact thing `workflowLines` already refuses to do for workflow pointers.
* **docs:** `.claude/hooks/README.md` linked twice to a `SETUP-SUMMARY.md` that exists nowhere; `.claude/commands/ck/cook.md` linked `../../../README.md`, which resolves to ClauKit's own README in this repo and to the **user's unrelated README** in any install — plausible-looking and wrong, which is worse than dangling.

### ✅ Tests

* **behavioural harness — four defects that silently corrupted its own verdicts.** Each was found by opening the raw data rather than reading the label, and each is pinned by a mutation-checked unit test:
  * **A healthy run reported as "never ran."** The ERROR heuristic grepped the rendered transcript, which carries the contents of every file the session read, and `run-state/SKILL.md` documents *"killed mid-phase by spend limits"*. The one scenario whose own gate file contains that phrase became permanently unrunnable. Across every preserved run, **12 of 13 recorded ERRORs were real runs** — including the 33 KB one that printed `stopping: infrastructure failure` and killed a whole sweep. Notices are now matched only against the session's *own* words, with tool output stripped.
  * **A successful `Read` rendered `fail:FAIL`** because the file it returned documents `gate <name> → PASS|FAIL`. Content-sniffing is now limited to `Bash`, where the output *is* the run's report.
  * **Commands truncated at 160 chars were used for matching**, so an assertion looked for `cli.js` in a command that had chained `cd … && echo … && node -e …` first and reported work that had plainly been done as not done — twice. Steps now carry an untruncated `raw` beside the display-capped `target`.
  * **"Genuinely verified" counted the gate run alone**, printing `2 scenario(s) genuinely verified` directly beneath a `NOT SENSITIVE` and an ERROR meaning one scenario never ran.
* **Ablation was incomplete in two structural ways.** Blanking a `SKILL.md` left a directory named after the rule — a `verify-plan` control ran `find .claude/skills -iname "*verify*"`, found the emptied skill and produced the gate's own artifact anyway; a skill is now removed as a directory. And a gate moved into a tracked file is recoverable from git: an ablated run ran `git diff CLAUDE.md`, recovered the deleted rule and obeyed it verbatim.
* **Five new scenarios** (`closing-gate`, `deploy-waiver`, `plan-before-code`, `docs-usable`, plus `research-reports` kept out of the sweep with the evidence for why it cannot run) and three fixtures rebuilt because they handed over their own answer — `tdd-red-first` reported `add(2,2) returns 5` against a three-line function commented `// bug`; `guard-tier-b` gave the session one file to commit, so `git add <that file>` was the obvious move and the guard was never approached.
* 199 → **279 tests**, 278 pass, 0 fail, 1 skip. New suites: `branch-guard` (22), `plan-lint` (20), `retirement` (4), plus `behavior-harness` (30) — the harness's own checkers, so a regression in *them* is caught without spending a `claude -p` run.

### 📚 Documentation

* **`development-rules.md` § Behavioural-Skill Governance** rewritten to match what is measurable. A green scenario counts as evidence only under a control; where neither control is reachable you **record that and ship** — *a rule the current model already follows unprompted is not a wrong rule, it is an invisible one, and the two are easy to confuse in the direction that gets working rules deleted*. Includes what running each scenario actually proves today.
* **`tests/behavior/README.md`** records the method's ceiling: three causes can produce a gate's behaviour — the rule, model capability, and the kit's general posture — and ablating the gate removes only one. Chasing that with harder fixtures was tried and measured not to work (`tdd-red-first`: 5 of 13 ablated runs across two fixtures, the second built specifically to make test-first expensive).

**Where the ten gates actually stand.** All 10 gate runs pass.

* **All 10 gate runs pass** — every stage that has a scenario does its job with its rule in place.
* **`plan-before-code` clears both bars** — the behaviour is absent in **all 3** ablated runs *and* a one-line positive control flips it. The only gate in the suite with evidence from both directions, and it covers the stage that had been written off as untestable because its gate reads "user reviews the plan before coding" and a headless run has no user. Approval was never the observable; *stopping* is.
* **`verify-plan-fires` and `scope-lock` are positive-controlled** — a failing case flipped on one line, reproduced.
* **`iron-law`** separates 2 of 3 under ablation but no single line flips it, so that rule is distributed rather than concentrated.
* **The remaining five are not discriminating**: with the rule removed the model still does the right thing, which is a fact about the model, not a verdict on the rule. Stated plainly rather than rounded up.

**Ten of `/ck:cook`'s eleven stages now have a scenario.** The eleventh, **Research**, is unreachable for a demonstrated reason rather than an assumed one: it appears zero times in the cook skill — `cook.md` calls it *"a command-level extension, not a numbered stage"* — so it exists only in the command file, and `claude -p` does not expand slash commands. A run prompted `/ck:cook Add support for…` made **zero reads of `commands/ck/cook.md`** and said so itself: *"I'll start by looking at the actual codebase before invoking any methodology."* Its scenario is kept, with that evidence, outside the sweep.

An earlier draft of this entry grouped **Docs** with Research as "outside the instrument, no scenario grants the dispatch tool". Both halves were wrong: `ALLOWED_TOOLS` goes straight to `--allowedTools`, so that was a description of choices rather than a limit — and Docs is Stage 5 *of the skill*, with its own exit gate, which is why `docs-usable` runs at all. What separates a reachable stage from an unreachable one is where its rule lives, not what the stage does.

## [1.4.2](https://github.com/trungdo9/ClauKit/compare/v1.4.1...v1.4.2) (2026-08-01)

**ESM fix — every hook was dead in projects with `"type": "module"`, and two safety guards were silently off.** Upgrade with `npx @trungdo9/claukit init`; the repair runs on a plain `init`, no `--force` needed.

### 🐞 Bug Fixes

* **hooks:** ship CommonJS as `.cjs` so hooks survive `"type": "module"` hosts ([e5aeaec](https://github.com/trungdo9/ClauKit/commit/e5aeaec)). Node picks a `.js` file's module system from the **host project's** nearest `package.json`, and ClauKit installs 14 CommonJS files into that host — so in every Vite/Next/modern-ESM project all of them died on their first line with `ReferenceError: require is not defined in ES module scope`. Renamed to `.cjs`, which is CommonJS regardless of the host: 4 hooks, `statusline`, 8 `scripts/ck/` helpers, `lib/common`. `bin/` is unaffected — it runs under ClauKit's own `package.json`.
* **hooks:** `scout-block` and `guard-destructive` were failing open, not just crashing. Both are PreToolUse guards, so in an ESM project the destructive-command gate had been **absent since install** with nothing announcing it — the reported `/ck:git cp` crash was the visible half of a much quieter defect.
* **scripts:** relative requires now carry explicit extensions ([e5aeaec](https://github.com/trungdo9/ClauKit/commit/e5aeaec)). Node's CommonJS resolver tries `.js`, `.json`, `.node` — **not** `.cjs` — so the 9 `require('./lib/common')` calls would have silently stopped resolving under the rename.

### 🚀 Features

* **install:** two-stage migration repairs existing installs on a plain `ck init` ([e5aeaec](https://github.com/trungdo9/ClauKit/commit/e5aeaec)). The rename alone would have stranded them: `copyPath` skips a destination directory that already exists, and `settings-merge` only *adds* entries — so an upgrade left the broken `.js` in place, still wired, plus a duplicate entry for the fix. `bin/lib/cjs-migrate.js` installs the missing `.cjs`, repoints `settings.json` (only ever to files that exist), collapses the duplicates and prunes the stale `.js`; `bin/lib/cjs-migrate-refs.js` rewrites shipped docs that still invoke the old paths, such as `/ck:git cm`'s `node .claude/hooks/file-claims.js list`. Requiring `--force` would have meant the projects the bug actually broke stay broken by default. Both stages are idempotent and touch only ClauKit-owned names — a project's own `.claude/hooks/deploy.js` is left alone.

### ✅ Tests

* **esm:** new `tests/esm-host.test.js` installs into a real `"type": "module"` project and *executes* every hook, the statusline and `wt-doctor` there — the shipped-artifact check, not a repo-local one (the same blindness class that hid the 1.4.0 and 1.4.1 defects). It also fails the build on any `.js` under `.claude/hooks/` or `scripts/ck/`, and covers the pre-rename upgrade path without `--force`, asserting the user's own hook survives both the rewrite and the prune. 192 → **199 tests**, 198 pass, 0 fail, 1 skip.

### 📚 Documentation

* **standards:** `docs/code-standards.md` gains the extension rule — shipped Node code is `.cjs`, requires carry the extension, and renaming one is a migration rather than a rename.

### 🧹 Chores

* **engineer:** kit bumped to 1.3.2 ([15737ca](https://github.com/trungdo9/ClauKit/commit/15737ca)) — the manifest's statusline entry moved to `.cjs`.

Verified end-to-end: installed into a fresh `"type": "module"` project and ran all four hooks plus the statusline clean, then repaired a real pre-rename install — 13 `.cjs` restored, 5 `settings.json` entries repointed, 13 stale `.js` removed, 20 shipped docs updated, and the second `init` reported nothing left to migrate.

> Released by hand. The `release.yml` workflow is active on `main` but has never produced a run, so semantic-release did not cut this tag.

## [1.4.1](https://github.com/trungdo9/ClauKit/compare/v1.4.0...v1.4.1) (2026-08-01)

**Install fix — v1.4.0 could not be installed from a package.** `ck init` exited 1 before copying anything, on every kit. Upgrade straight to 1.4.1; skip 1.4.0.

### 🐞 Bug Fixes

* **install:** stop shipping `.claude/.gitignore` as a file — npm strips it ([59a09c7](https://github.com/trungdo9/ClauKit/commit/59a09c7)). All three manifests declared it in `paths.config`, but npm strips every `.gitignore` from every tarball, so `checkKitPathsAvailable()` reported it missing and hard-failed the pre-flight. The rules moved into `bin/lib/gitignore-wire.js` and are merged in additively — create when absent, append only what is missing, leave the user's own rules and comments alone. Third instance of the same remedy after `settings-merge.js` (hooks) and `claude-md-wire.js` (workflows).
* **install:** `--force` no longer replaces an existing `.claude/settings.json` ([59a09c7](https://github.com/trungdo9/ClauKit/commit/59a09c7)). The copy loop overwrote it and the additive merge then ran on the result, so the permissions and env the merge exists to protect were already gone — and `--force` is exactly what an upgrading user needs to refresh every other directory. An existing settings file is now written by the merge alone.

### ✅ Tests

* **packaging:** new `tests/installer-packaging.test.js` asserts the general rule rather than this one instance — **every kit-declared path must survive `npm pack`**. The prior test asserted the right behaviour but ran `bin/ck.js` from the repo, where `.claude/.gitignore` is present on disk, so it passed while the shipped artifact was broken (the same blindness that hid the CLAUDE.md defect in 1.4.0). Both new guards fail with their fix reverted.
* Installer suite split by concern — settings/`--force`, CLAUDE.md wiring, packaging. 185 → **192 tests**, 191 pass, 0 fail, 1 skip.

Verified end-to-end: packed, installed globally from the tarball, then `ck init --force` over a project carrying its own `CLAUDE.md`, `settings.json`, `.claude/.gitignore` and `scripts/ck/` file — all four survived, the 8 shipped scripts landed, and the three runtime-state paths are git-ignored.

## [1.4.0](https://github.com/trungdo9/ClauKit/compare/v1.3.6...v1.4.0) (2026-08-01)

> ⚠️ **Do not use — this release cannot be installed.** `ck init` exits 1 on every kit; see 1.4.1.

Durability–Evidence–Cost release (absorbs untagged in-branch bumps 1.3.7–1.3.9). Headline: evidence-gated pipeline (`run-state` ledger · `verify-plan` falsification · `tdd` red-green), worktree fleet, 2-tier destructive-op guard, and a full workflow-verification sweep.

### 🚀 Features

* **durability:** evidence gates, concurrency guard, worktree fleet, declared delivery tail ([d114c7b](https://github.com/trungdo9/ClauKit/commit/d114c7b)) — 3 new skills (`run-state`/`verify-plan`/`tdd`), `guard-destructive` + `file-claims` hooks, 8 new `scripts/ck/` utilities, `skill-activation.md` hard gate, `primary-workflow.md` rewritten to 13 gated stages, `/ck:git finish` + draft-default PR + `pr-body.md` fill contract
* **seo:** complete SEO campaign workflow + port stage-2 source logic ([5cf9d43](https://github.com/trungdo9/ClauKit/commit/5cf9d43)) — 7-phase closed loop (`seo-workflow.md`), `/mk:seo campaign`

### 🐞 Bug Fixes

* **security:** pass git refs as argv, never through a shell ([23b0187](https://github.com/trungdo9/ClauKit/commit/23b0187))
* **security:** resolve heredocs by consumer; stop the delivery tail executing untrusted input ([b4d4832](https://github.com/trungdo9/ClauKit/commit/b4d4832))
* **security:** close the remaining guard bypasses; scope Tier B to what an op can reach ([724a57d](https://github.com/trungdo9/ClauKit/commit/724a57d))
* **install:** ship hooks + statusline with the kit, add a test runner ([c5aa011](https://github.com/trungdo9/ClauKit/commit/c5aa011))
* **install:** merge hooks into an existing settings.json; stop `--force` deleting user files ([ad9e8d0](https://github.com/trungdo9/ClauKit/commit/ad9e8d0))
* **scripts:** atomic compaction, realpath containment, rg include-globs, CI verdict ([3f88d50](https://github.com/trungdo9/ClauKit/commit/3f88d50))
* **cook:** add Deploy stage for `--auto` mode, unify severity taxonomy ([8088398](https://github.com/trungdo9/ClauKit/commit/8088398))

### ♻️ Code Refactoring

* **agents:** remove ui-ux-designer, reroute design to frontend-developer + optimize cook pipeline ([dfd2c61](https://github.com/trungdo9/ClauKit/commit/dfd2c61))
* **agents:** relocate copywriter to marketing kit ([e5be717](https://github.com/trungdo9/ClauKit/commit/e5be717))
* **agents:** purge Gemini offload paths, remove mcp-manager + scout-external ([1c83bca](https://github.com/trungdo9/ClauKit/commit/1c83bca))
* remove rarely-used commands/skills and update references ([4c87703](https://github.com/trungdo9/ClauKit/commit/4c87703))

### 📚 Documentation

* workflow verification sweep — all 15 `.claude/workflows/*` audited against filesystem + registry + kit manifests: stale "21 agents" → 29 across 10 files, `seo-workflow.md` `email-campaign` → `emails`, `cro-framework.md` now shipped by the marketing kit, `fix-pipeline.md` link portability fix, agent-vs-skill labels corrected
* sync all docs with actual codebase ([90c27c6](https://github.com/trungdo9/ClauKit/commit/90c27c6)) · reconcile every count with the filesystem ([d4d7422](https://github.com/trungdo9/ClauKit/commit/d4d7422))
* **trio:** replace duplicated protocols in commands with pointers to their skills ([b1d5a18](https://github.com/trungdo9/ClauKit/commit/b1d5a18))
* **review:** record resolution status for every multi-lens finding ([a052be2](https://github.com/trungdo9/ClauKit/commit/a052be2))
* backfill this CHANGELOG (v1.0.2–v1.3.6) + add `changelogTitle` to `.releaserc.json`

### ✅ Tests

* **behavior:** rewrite all six scenarios so the negative control can fail ([adc0c36](https://github.com/trungdo9/ClauKit/commit/adc0c36))

## [1.3.6](https://github.com/trungdo9/ClauKit/compare/v1.3.5...v1.3.6) (2026-06-27)

### Documentation

* split marketing kit guide into MARKETING.md ([655e166](https://github.com/trungdo9/ClauKit/commit/655e166))
* **marketing:** English-only headings + 10 real-world playbooks ([cea78f9](https://github.com/trungdo9/ClauKit/commit/cea78f9))

## [1.3.5](https://github.com/trungdo9/ClauKit/compare/v1.3.4...v1.3.5) (2026-06-27)

### Features

* **mk:plan:** add `-o html` output + convert mode for marketing-context ([a5d9fc6](https://github.com/trungdo9/ClauKit/commit/a5d9fc6))

## [1.3.4](https://github.com/trungdo9/ClauKit/compare/v1.3.3...v1.3.4) (2026-06-27)

### Bug Fixes

* **kit:** ship config files + trim marketing shared agents to 3 ([83f39e2](https://github.com/trungdo9/ClauKit/commit/83f39e2))
* **kit:** drop settings.local.json from ship — per-machine, not shared ([82c6993](https://github.com/trungdo9/ClauKit/commit/82c6993))

## [1.3.3](https://github.com/trungdo9/ClauKit/compare/v1.3.2...v1.3.3) (2026-06-26)

### Bug Fixes

* **cli:** resolve kit skills paths when `.claude/skills` symlink dropped by npm ([4054d92](https://github.com/trungdo9/ClauKit/commit/4054d92))

## [1.3.2](https://github.com/trungdo9/ClauKit/compare/v1.3.1...v1.3.2) (2026-06-26)

Marketing-kit milestone: `/mk:` namespace shipped end-to-end (skills, agents, commands, workflows, MCP wrappers, WordPress integration) behind the new kit manifest system.

### Features

* **kits:** kit manifest system — `engineer`/`marketing`/`both` + `ck init --kit` ([f2b8326](https://github.com/trungdo9/ClauKit/commit/f2b8326))
* **marketing-kit:** folder structure, rules, product-marketing hub ([428db04](https://github.com/trungdo9/ClauKit/commit/428db04))
* **marketing-kit:** 48 marketing skills (claude-seo engine replaces seo/geo) ([a78dbb9](https://github.com/trungdo9/ClauKit/commit/a78dbb9))
* **marketing-kit:** 10 new agents (7 marketing + 3 automation) ([dfe9c64](https://github.com/trungdo9/ClauKit/commit/dfe9c64))
* **marketing-kit:** 12 commands under `/mk:` namespace ([af41c7c](https://github.com/trungdo9/ClauKit/commit/af41c7c))
* **marketing-kit:** 5 workflow files (≤100 lines each) ([61faa0a](https://github.com/trungdo9/ClauKit/commit/61faa0a))
* **marketing-kit:** 5 MCP wrappers + marketing-orchestrator ([686c18e](https://github.com/trungdo9/ClauKit/commit/686c18e))
* **integrations:** WordPress REST integration for marketing kit ([10956a4](https://github.com/trungdo9/ClauKit/commit/10956a4))
* **seo:** `/ck:seo` migration notes to marketing-kit claude-seo engine ([4ba58d6](https://github.com/trungdo9/ClauKit/commit/4ba58d6))
* **ck:** auto-create `.claude/skills` symlink on kit install (Unix/Mac) ([a12a610](https://github.com/trungdo9/ClauKit/commit/a12a610))
* **plan:** add `-o html` output option for `/ck:plan` ([a84d329](https://github.com/trungdo9/ClauKit/commit/a84d329))
* **plan:** add convert mode — existing plan.md → plan.html ([549508c](https://github.com/trungdo9/ClauKit/commit/549508c))

### Bug Fixes

* **cli:** use dir junction on Windows for `.claude/skills` symlink ([6430a35](https://github.com/trungdo9/ClauKit/commit/6430a35))
* **integrations:** quote Content-Disposition filename, redaction guidance, doc wording ([2060b25](https://github.com/trungdo9/ClauKit/commit/2060b25))
* **workflows:** correct dead paths + stale variant notation ([530a8b8](https://github.com/trungdo9/ClauKit/commit/530a8b8))
* **plan:** name html render owner, sync template ([e7e5281](https://github.com/trungdo9/ClauKit/commit/e7e5281))

### Refactoring

* **skills:** externalize `.claude/skills` to root `./skills` + symlinks + `ck init` fix ([8f5699d](https://github.com/trungdo9/ClauKit/commit/8f5699d))
* **workflows:** consolidate gate logic, align idempotency, add CRO wiring ([f532c40](https://github.com/trungdo9/ClauKit/commit/f532c40))
* **agents:** consolidate agents, update kit manifests and docs ([a823071](https://github.com/trungdo9/ClauKit/commit/a823071))
* **kit-resolver:** standardize skill paths, remove symlink creation ([4eed209](https://github.com/trungdo9/ClauKit/commit/4eed209))
* remove legacy `--path` flag, dead code, release pipeline cleanup ([01786a2](https://github.com/trungdo9/ClauKit/commit/01786a2))

## [1.3.1](https://github.com/trungdo9/ClauKit/compare/v1.3.0...v1.3.1) (2026-06-03)

### Features

* **cook:** add Stage 0 Exact-Requirements Gate (5-item hard-block before planning) ([45ded10](https://github.com/trungdo9/ClauKit/commit/45ded10))
* **flow:** add `/ck:flow` controllable dynamic-workflow re-creation ([e2703d8](https://github.com/trungdo9/ClauKit/commit/e2703d8))

## [1.3.0](https://github.com/trungdo9/ClauKit/compare/v1.2.1...v1.3.0) (2026-05-30)

### Features

* **skills,commands:** add find/onboard/refactor + use-case flows ([f06d6af](https://github.com/trungdo9/ClauKit/commit/f06d6af))
* **security:** add `/security` command for OWASP vulnerability scanning ([b6d1e8a](https://github.com/trungdo9/ClauKit/commit/b6d1e8a))
* **skill:** add typescript-pro to development registry ([304490a](https://github.com/trungdo9/ClauKit/commit/304490a))
* **readme:** SEO-optimized rewrite — above-fold, comparison table, FAQ, Schema.org JSON-LD ([424168f](https://github.com/trungdo9/ClauKit/commit/424168f), [426d225](https://github.com/trungdo9/ClauKit/commit/426d225), [d5a5b89](https://github.com/trungdo9/ClauKit/commit/d5a5b89), [3c3d7a7](https://github.com/trungdo9/ClauKit/commit/3c3d7a7))

### Bug Fixes

* resolve fallout from vulnerability-scanner + supabase-postgres removal ([fb2dad8](https://github.com/trungdo9/ClauKit/commit/fb2dad8))
* resolve all review findings (CRITICAL/HIGH/MEDIUM) ([ffb8370](https://github.com/trungdo9/ClauKit/commit/ffb8370))
* **docs:** quote mermaid node labels starting with `/` ([d767bf2](https://github.com/trungdo9/ClauKit/commit/d767bf2))
* **readme:** address code-reviewer findings (Critical + High) ([e61106c](https://github.com/trungdo9/ClauKit/commit/e61106c))

### Refactoring

* **skills:** merge supabase-postgres-best-practices into supabase skill ([5036246](https://github.com/trungdo9/ClauKit/commit/5036246))
* **skills:** remove MongoDB from databases skill, rename to postgresql ([15fa5b0](https://github.com/trungdo9/ClauKit/commit/15fa5b0))

## [1.2.1](https://github.com/trungdo9/ClauKit/compare/v1.2.0...v1.2.1) (2026-05-21)

### Refactoring

* update project structure ([a22f391](https://github.com/trungdo9/ClauKit/commit/a22f391))

## [1.2.0](https://github.com/trungdo9/ClauKit/compare/v1.1.0...v1.2.0) (2026-05-21)

Command-structure consolidation release (absorbs unreleased v1.1.1–v1.1.9 work).

### Features

* **security:** add merged security skill (vulnerability-scanner + vbs-scan-security) ([741e31e](https://github.com/trungdo9/ClauKit/commit/741e31e))

### Bug Fixes

* **security:** remove insecure authType defaults in sepay webhook verifier ([2cca1d1](https://github.com/trungdo9/ClauKit/commit/2cca1d1))
* address 5 command audit failures + clean stale `ck/` directory ([a467c42](https://github.com/trungdo9/ClauKit/commit/a467c42))
* **hooks:** exclude `.md` files from LOC modularization check ([d41e279](https://github.com/trungdo9/ClauKit/commit/d41e279))
* rename claude-code skill file to SKILL.md (uppercase) ([7ac05f3](https://github.com/trungdo9/ClauKit/commit/7ac05f3))

### Refactoring

* consolidate commands to dispatchers with positional args (`ck:docs`, `ck:git`, `ck:seo`, `ck:design`, `ck:bootstrap` …) ([9b3b723](https://github.com/trungdo9/ClauKit/commit/9b3b723), [b2ca4a7](https://github.com/trungdo9/ClauKit/commit/b2ca4a7))
* command layout iterations → final `ck/` subfolder structure ([30f0e5b](https://github.com/trungdo9/ClauKit/commit/30f0e5b), [c0fbdf2](https://github.com/trungdo9/ClauKit/commit/c0fbdf2), [f18724d](https://github.com/trungdo9/ClauKit/commit/f18724d))
* rename `ck:integrate:sepay` → `ck:sepay`, `ck:review:codebase` → `ck:review`; `/skill` → `/cc-skill` ([09e40fe](https://github.com/trungdo9/ClauKit/commit/09e40fe), [ed7edfa](https://github.com/trungdo9/ClauKit/commit/ed7edfa))
* standardize `ck:cook` flags to double-dash ([fe7d93f](https://github.com/trungdo9/ClauKit/commit/fe7d93f))

## [1.1.0](https://github.com/trungdo9/ClauKit/compare/v1.0.5...v1.1.0) (2026-05-18)

### Refactoring

* adopt `ck:` command prefix across all documentation ([4296731](https://github.com/trungdo9/ClauKit/commit/4296731))

## [1.0.5](https://github.com/trungdo9/ClauKit/compare/v1.0.4...v1.0.5) (2026-05-17)

Maintenance release (version alignment only).

## [1.0.4](https://github.com/trungdo9/ClauKit/compare/v1.0.3...v1.0.4) (2026-04-04)

### Features

* add update command to check GitHub for latest version ([8050306](https://github.com/trungdo9/ClauKit/commit/8050306))

### Bug Fixes

* update agent references in code-reviewer and orchestrator documentation ([bb02c88](https://github.com/trungdo9/ClauKit/commit/bb02c88))
* update post-push hook to increment patch version correctly ([57cc90e](https://github.com/trungdo9/ClauKit/commit/57cc90e))

## [1.0.3](https://github.com/trungdo9/ClauKit/compare/v1.0.2...v1.0.3) (2026-04-03)

### Features

* add SEO Checker script; introduce Vulnerability Scanner with security checks + reference materials ([28fb3af](https://github.com/trungdo9/ClauKit/commit/28fb3af))

## [1.0.2](https://github.com/trungdo9/ClauKit/releases/tag/v1.0.2) (2026-04-02)

First tagged release.

### Features

* add ClauKit CLI with `bin/ck.js` entry point ([07137d8](https://github.com/trungdo9/ClauKit/commit/07137d8))
* Security Audit + SEO Knowledge Base documentation ([6513d2f](https://github.com/trungdo9/ClauKit/commit/6513d2f))

### Bug Fixes

* remove git dependency to avoid SSH error ([b2e6695](https://github.com/trungdo9/ClauKit/commit/b2e6695))

---

*Entries v1.0.2 – v1.3.6 were backfilled by hand from git history on 2026-08-01 — the semantic-release changelog plugin was configured after v1.3.6, so the file had never been generated. Entries above v1.3.6 are auto-generated by semantic-release on release; do not edit those by hand.*
