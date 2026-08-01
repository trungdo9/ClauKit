# Changelog

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
