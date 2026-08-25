# ClauKit Registry

**Last Updated**: 2026-08-21 (**Norskmat sync — 1 skill ported, 3 retired, 2 commands rebuilt.** **Ported:** `to-tickets` (vertical tracer-bullet slicing with explicit blocking edges — the missing link between `/ck:plan`'s sequential `phase-*.md` detail and `/ck:cook`'s one-wave-at-a-time execution), with its `ticket-slicer` agent (5 cutting tests, draft-only — never publishes) and `/ck:tickets` command (approval gate + every write in main context). Genericized on the way in: no `KSL` board, no `jira-comment` dependency, plan dirs on ClauKit's 6-digit `YYMMDD-HHmm` contract, tracker publishing opt-in behind a named parent issue. **Retired:** `docs-seeker` (17 files, incl. its own test runner, to wrap doc discovery the harness already does with `WebFetch`/`WebSearch`), `cti-expert` (static threat-intel prose, no agent/command/pipeline — `security-auditor` now does a live `WebSearch` citing an advisory ID), `web-testing` (**merged into** `development/test-automation`, now v2.0.0: absorbed the Vitest + k6 halves and the CLI cheat-sheet; the audience-based split — 'app developer' vs 'QA engineer' — carried ~50% Playwright overlap and had been reopened as a duplicate since 2026-05-16; the real axis is which layer proves the claim, and that belongs in one file). Plus the security skill's `scripts/` pre-scanner, 4 empty `rules/languages/*` dirs, **`markdown-novel-viewer`** (68 lines wrapping `mdbook serve` / `markserv` / `grip` — no command routed to it, no agent required it, and it existed only as the other half of a 2026-07-31 de-duplication split from `preview`, which now carries a three-line pointer instead), and **`global/common/`** (`api_key_helper.py` + README — dead code for the repo's entire life: `git grep` over every commit finds the import in exactly one file, its own README, and its documented `parent^3/common` path could not resolve for any skill outside `skills/global/`). That empties the **`global/` group**, so the path is dropped from `engineer.json` and `both.json` — `checkKitPathsAvailable` aborts `ck init` on a manifest path the package lacks. Skill groups 5→**4**. 29 removed paths in `RETIRED` (42 entries total; `global/common/` is listed under both legacy install layouts) and 15 new + 3 extended `STALE` entries, so a no-`--force` upgrade refreshes the prose *before* the coherence gate deletes what it names — verified end-to-end against a real install (24 planted → 20 docs refreshed, 24 removed, 5 dirs cleaned). **`code-review` upgraded:** fixed-point pinning (three-dot merge-base diff, pre-flight ref+empty check before any spawn), spec-source lookup order, **three axes in parallel** (Standards · Spec · Security) reported side by side and never reranked, new `references/smell-baseline.md` (12 Fowler smells, always pasted into the Standards prompt, repo rules override). The 4-lens fan-out stays as the high-risk *escalation* on top, not a replacement. `review-package.cjs` **fixed**: its diff used two dots, so a fixed point on a branch that had moved on attributed other people's commits to the review, inverted — now `A...B` for the diff, `A..B` for the log. **`security` upgraded:** rule tiering (Core 8 always · 9 signal-gated by one `grep -lE` · 4 opt-in), TINY/SMALL/LARGE where **file count alone** picks the agent count (`min(3, ceil(files/25))`; a 30-day window over 3 files is TINY, not LARGE), report must list the IDs it skipped. `scripts/security_scan.py` **removed with evidence** — invoked by no workflow, and a trial run flagged a plain `/regex/.exec()` as `exec() usage CRITICAL`, reproduced before deletion. **Commands:** `/ck:security` 14 lines → full scope table + cost model + gate signals + 6-step workflow, default scope now the **working diff** (whole-repo is opt-in by name, never a fallback). `/ck:review` gains the fixed-point + three-axis core ahead of its existing `--flow` / `--lenses` variants. Counts, **all recounted from disk** rather than carried forward: skills 129→**126** (software 68 = 38 top-level + 30 subcategorized · marketing 50 · automation 6 · integrations 2), agents 29→**30** (18+12), commands 56→**57** logical / 38 files, total **213**. Four stale figures corrected on the way: § 6 still read `global/` 1, `software/` 71 and 130/215 after the `obsidian` removal, and § 1's top-level heading read 40 against 39 on disk. Tests 322 pass.) · 2026-08-11 (**`obsidian` skill removed** — maintainer decision. Knowledge-only skill for authoring Obsidian vaults (SKILL.md + 4 lazy-loaded references): no agent, no command, no runtime code, and nothing in ClauKit's own pipelines ever routed to it — out of scope for a software engineering kit, and an auto-discoverable `SKILL.md` that nothing invokes is activation surface with no payoff. Dropped from `.claude/kits/marketing.json` (the only kit that named it explicitly; engineer/both covered it through the broad `software/` path). All 5 files added to `RETIRED` in `bin/lib/retired-files.js` with their shipped blob digests, so existing installs are cleaned up by `ck init` on evidence, not inference. No `STALE` entry needed — no shipped `.claude/**` prose ever named `software/obsidian`. Counts: skills 130→**129**, total entries 215→**214**; agents/commands unchanged.) · 2026-08-11 (**`scripts/` code review — 5 fix groups applied.** (1) `branch-guard` **registered as a PreToolUse hook** (`.claude/hooks/branch-guard.cjs`, wired in `settings.json`, merged into existing installs by `settings-merge.js`) — the verdict shipped for a release with no registration anywhere and only prose in `/ck:git` telling anyone to run it, so a plain `git checkout -b` reached the shell with zero mechanical enforcement; `guard-destructive`'s own suite asserts that command is benign. (2) Command parsing extracted to `.claude/scripts/ck/lib/shell-parse.cjs` and **quote-aware**: newline and single `&` are separators (multi-line Bash is the normal shape for an agent's git calls), any git global option is skipped rather than four whitelisted ones (`git --no-pager checkout -b x` was allowed), launcher prefixes are peeled (`env git …`), and a `sh -c "…"` wrapper is found wherever it sits instead of only spanning the whole line — all four previously returned ALLOW with 0 ops. Registry path fixed to resolve against `repoRoot()`, not cwd. (3) The three `generate-marketing-*.js` scaffolders are **write-once** (`--force` to overwrite, `--dry-run` to preview, skip count always printed) — a re-run would have replaced 16 hand-authored files with stubs; `programmatic-seo` dropped from the generator + the `/mk:seo` cross-link (§4f records it removed as a duplicate, the generator would have resurrected it); the 3 automation agents now write to `.claude/agents/marketing/` where they actually live, instead of creating duplicate `name:` frontmatter under a stale `automation/`. (4) `delivery-tail.cjs` split 357→169 lines over `lib/tail-parse` + `lib/tail-checks` + `lib/tail-runtime`, and its parser fixed: a bold step name with trailing prose starts its own step, a declared key is never overwritten, an H1 closes the tail block, an unbackticked `done-when` is not split at a bare `=`, and **both** sides of `done-when` are substituted — each of these silently ran the wrong command, re-ran it every invocation, or reported the wrong step DONE. (5) Stale `.cjs` paths repaired in `ck-review.yml.template` (every consumer's PR review job failed with "Cannot find module") and in the tail's REFUSED payload (the only instructions for arming a tail); `cjs-migrate-refs.js` now covers `.github/workflows/` so existing installs self-heal. Plus: regenerable plan artifacts (`plans/**/reports/review-package-*.md`, `*-brief-*.md`) wired into the **root** `.gitignore` — `run-workspace.cjs` called that dir "git-ignored" and nothing ClauKit installed ignored it. Plus two dev-tree fixes: `scripts/postinstall.js` **deleted** — wired to nothing for the package's whole life (no `postinstall` entry, no husky hook, root `scripts/` excluded from `files`), so its banner never printed for anyone while `codebase-summary.md` listed it as a live setup script; `ck --help` already prints strictly more. And **`.agent/` is retired** — maintainer decision, 2026-08-11. It held `.agent/skills → ../skills`, the **Antigravity IDE**'s workspace skills path (plan `20260604-1747` phase 4, always best-effort: that IDE ignores symlinked skills at its global path, vercel-labs/skills#633; a link at `.claude/skills` does not serve it). So it was never dead code in *intent*, as the review first read it — but it was tracked as a symlink blob with no ignore rule, and a per-platform-regenerated pointer that git tracks is the one shape that breaks Windows checkouts (text file → junction → path reads as permanently modified; or, on the copy fallback, ~1500 untracked skill files nothing ignored). `link-skills.js` is back to ONE target and records how to restore the second (add to `targets` **and** give it an ignore rule — one without the other is the original defect). `installer-packaging.test.js` asserts `.claude/skills` stays untracked + ignored and that nothing tracks `.agent/` again. Counts: hooks 4→**5**, `.claude/scripts/ck/` 5→**7** listed (`branch-guard`, `plan-lint` were missing from this inventory), root `scripts/` 5→**4** files + `scripts/lib/`. Tests 281→**306**.) · 2026-08-06 (**Verification Iron Law deduplicated** — `skills/software/debugging/references/verification.md` retired: a near-copy of `code-review/references/verification-before-completion.md` (same Iron Law, same gate function, evidence table identical row for row), and its two remaining sections were already in `code-review/references/verification-patterns.md`, so consolidating ported **0 lines**. `debugging/SKILL.md` § 4 and `agents/engineering/debugger.md` now point at the canonical reference. **Kept deliberately, not an oversight:** the one-line `Iron Law: …` in `code-reviewer.md` and `debugger.md`. Agent `.md` files *are* the subagent system prompt — frontmatter carries no skill auto-load — so removing the line removes the rule from that agent. Duplication in a *reference* is drift; a summary line in an isolated context is load-bearing. **Why it mattered:** the behavioural eval for this gate needed three ablation rounds before the rule was actually absent from the tree, because no one could say where it lived. New coverage: `tests/retirement.test.js` (4 e2e tests over `syncRetired`, previously untested despite being the only code path that deletes user files — both its digest gate and its coherence gate verified to fail when disabled) + 2 static table tests in `installer-packaging.test.js` (all 55 RETIRED/STALE digests resolve via `git cat-file`; no retired token still named in ClauKit's own docs). Counts unchanged: 130 skills · 29 agents · 56 commands. Tests 248→254.) · 2026-08-05 (**Worktree fleet removed** — T1.6 of plan `260730-1359-clauKit-upgrade` retired after real multi-session use: automatic provisioning fired on every concurrent session, each worktree cost a full dependency install, and stale trees accumulated on disk because teardown depended on a session reaching its finish step. **Deleted:** `.claude/scripts/ck/wt-new`/`wt-doctor`/`wt-clean`, `tests/wt-scripts.test.js`, skill `software/git/worktree`. **Replaced by:** (a) *coordinate, don't isolate* — the `file-claims` registry + `guard-destructive` Tier B remain the concurrency substrate; pipelines now confine edits to unclaimed paths, `/ck:team` partitions disjoint path sets and serializes overlaps, `/ck:refactor` stops on a shared tree instead of forking one; (b) **baseline-first** replaces the base-commit-worktree baseline in `tdd` — run the suite on the untouched tree before the first edit and record `baseline: <X/Y> (<sha7>)` in `STATE.md`; already dirty ⇒ park your own WIP on a scratch branch by explicit paths (untracked included) and verify `git status --porcelain` is empty at the base checkout before running; foreign dirty files ⇒ don't park, stop; never `git stash`. `guard-destructive`'s two environment rules (`npm ci` onto a `node_modules` symlink, `rm -rf` of a known worktree) are **kept** — they protect worktrees the user makes themselves — with messages no longer pointing at deleted scripts. **Behaviour change, not just a removal — stated plainly because the pipelines now refuse work they used to complete:** `/ck:cook` and `/ck:flow` confine editing to unclaimed paths and defer a phase that cannot; `/ck:refactor` stops on a shared tree instead of forking one; `/ck:team` serializes editing teammates whose path sets overlap, so **parallel editing teammates are gone as a capability**, not merely as an implementation. The environment-health gate that `wt-doctor` backed is replaced by a **red-baseline halt** in `tdd`/`cook`/`primary-workflow` (suite red where green is expected ⇒ stop before the first edit, ruling recorded in `STATE.md`) — the smoke gate's purpose survives without its tooling. `ck init` retires leftover files from existing installs **only on a content digest proving ClauKit shipped that exact file**, and only after refreshing the docs that invoke it (`bin/lib/retired-files.js`); anything else is reported and left alone. Counts: skills 131→130, scripts 8→5, total entries 216→215.) · 2026-08-01 (**Workflow verification sweep** — full audit of all 15 `.claude/workflows/*` files against filesystem + registry + kit manifests. Fixed: stale "21 agents" → 29 across 10 files (`orchestration-protocol.md`, `dynamic-workflow` skill + its 2 references, `/ck:flow`/`/ck:team`/`/ck:find` (find.md also skills 74→131, commands 60→56), README, `system-architecture.md`, 2 registry entries); `seo-workflow.md` Phase 5 skill `email-campaign` → `emails` (no skill ever existed under that name); `cro-framework.md` added to marketing kit manifest (was engineer+both only, yet `/mk:cro`, `cro` skill, marketing-rules §4 and marketing-workflow Phase 6 hard-require it — marketing kit workflows 8→9); `fix-pipeline.md` tdd link `../../skills/` → `../skills/` (root-relative form breaks in installed projects — installer ships skills only at `.claude/skills/`); agent-vs-skill labels fixed in `sales-workflow.md`/`video-workflow.md`/`skill-activation.md`; `CHANGELOG.md` backfilled v1.0.2→v1.3.6 + `changelogTitle` added to `.releaserc.json` (changelog plugin configured post-v1.3.6, file had never been generated). Counts unchanged: 131 skills · 29 agents · 56 commands · 15 workflows.)

**Prior**: 2026-07-31 (**Durability–Evidence–Cost upgrade** (plan `260730-1359-clauKit-upgrade`) — 3 new skills (`run-state` durable ledger · `verify-plan` falsification gate · `tdd` red-green discipline), 2 new hooks (`guard-destructive` 2-tier conflict-aware guard · `file-claims` per-worktree claim registry; `scout-block` rewritten precise, single implementation), 8 new `.claude/scripts/ck/` (worktree fleet `wt-new`/`wt-doctor`/`wt-clean` w/ smoke gate · context hygiene `phase-brief`/`review-package`/`run-workspace` · headless `ci-review` + deterministic `delivery-tail`), 1 new workflow (`skill-activation.md` hard gate), `primary-workflow.md` rewritten to 13 gated stages (Exact-Requirements Gate surfaced — closes G25), `/ck:git` gains `finish` + scoped-commit + draft-default PR + declared delivery tail (empty default) + `pr-body.md` fill contract, `/ck:plan verify`, `/ck:fix tdd`, `/ck:review --lenses`, multi-repo `/ck:scout`, model-tiering matrix + 529 fallback, DB safe-writes protocol, node:test harness (`npm test`, 180 tests) + behavioral eval harness (`tests/behavior/`, 6 scenarios). **Removed:** `programmatic-seo` (duplicate of `seo-programmatic`); `preview` narrowed to presentations-only (render-markdown → `markdown-novel-viewer`). Counts: skills 129→131, agents 29, commands 53→56, workflows 14→15, total entries 211→216.) · 2026-07-31 (**`/ck:claude-md analyze` added** — read-only per-section token-cost profile of a CLAUDE.md (lines/chars/~tokens per `##` section, classify DIRECTIVE/POINTER/PROSE/DUP/FILLER, ranked KEEP/EXTRACT/DEDUPE/DROP recommendations + projected savings); alias `optimize` = analyze + offer `refactor`; `claude-md` dispatcher 3→4 actions. Counts: commands 52→53, total entries 210→211.) · 2026-07-25 (**SEO campaign workflow closed** — new `.claude/workflows/seo-workflow.md` (7-phase closed loop: gate → baseline audit+metrics → plan [hard stop] → batch write → publish [draft-default] → distribute → measure [GSC/GA4, 2–4 wk bake] → optimize scale/refresh/kill loop). `/mk:seo` gains `campaign` action; `seo-writer` agent + `seo-writing` skill gain `campaign` mode; `seo-flow` gains SEO Campaign recipe; wired into marketing/both kit manifests (workflows 5→6) + `marketing-workflow.md` Phase 5 delegation + MARKETING.md Flow 3c.) · 2026-07-23 (**seo-writing pipeline added** — new ClauKit-authored `seo-writing` skill (6-stage article-production pipeline ported from a production n8n workflow: strategy → outline → write → optimize → media → publish; 7 references + 100-article WordPress playbook), new `seo-writer` orchestrator agent, `/mk:seo` gains `plan` + `write` actions. 6 previously-stub SEO skills filled with real content; agents upgraded pipeline-stage-specific. Counts: skills 128→129, agents 28→29.) · 2026-07-17 (**Gemini purge** — `scout-external` agent removed (Gemini/OpenCode CLI orchestration retired; `/ck:scout` is now internal-Explore-only), Gemini offload paths stripped from `research` skill + `/ck:research` + `git-manager` + `/ck:use-mcp` (all now Claude-native). Gemini retained only in `software/ai/` skills (`ai-multimodal`/`ai-artist`) where it is a genuine capability. Earlier same-day: `mcp-manager` agent removed; `researcher` → sonnet, `journal-writer` → haiku; `tester`/`database-admin`/`project-manager` slimmed to thin personas; long agent descriptions trimmed to trigger-style.)
**Scope**: Single source of truth for every Skill, Agent, and Command in this project.
**Counts**: 127 skills (**106 active + 21 scaffold**) · 30 agents · 57 commands · **214 total entries**

> The 21 scaffold skills are the `coreyhaines31/marketingskills` imports listed in § 1 — all still carrying the generator's `[Core capability …]` placeholders. They were counted as active until 2026-08-25; the 19 claude-seo skills in the same state were filled that day, these were not (source repo not available locally).

Replaces previous `skills-catalog.md` (skills only). One file, all three resource types, with duplicate/overlap detection.

## Legend

| Symbol | Meaning |
|:---:|---|
| ✅ | Active — production-ready |
| 🟡 | Scaffold — stub awaiting fill |
| | Naming inconsistency — RESOLVED 2026-05-16 |
| 🔁 | Intentional cross-pool concept (skill ↔ agent ↔ command, complementary) |
| ❗ | Potential overlap / needs scope clarification |

## Resource-Type Rules

- **Skill** — auto-activated knowledge/methodology (lazy-loaded reference)
- **Agent** — persona + tool subset for delegated sub-context work
- **Command** — explicit user-typed `/<name>` trigger

→ **One concept = one primary entry point.** Skills here are pure knowledge; agents are personas; commands are workflows. Cross-pool overlap by name is allowed only when each role is distinct (e.g. `planning` skill = knowledge, `planner` agent = persona, `/plan` command = trigger).

---

## 1 · Skills (126)

### Global — **group removed 2026-08-21**

`.claude/skills/global/` no longer exists. It held exactly two things, both retired (§ 5): the `docs-seeker` skill, and `global/common/` (`api_key_helper.py` + README) — a helper **no Python file has ever imported, in any commit**. The path is dropped from `engineer.json` and `both.json`; leaving it would abort `ck init`, since `checkKitPathsAvailable` exits non-zero on a manifest path the package lacks.

Skill groups are now four: `software/`, `marketing/`, `automation/`, `integrations/`.

### Marketing (50) — `.claude/skills/marketing/`

**Claude-SEO engine (25 — imported from `AgriciDaniel/claude-seo`, replaces old `seo`/`geo`) + 1 ClauKit-authored pipeline (`seo-writing`):**

> **Content-fill completed 2026-08-25.** Of the 25, only 6 (`seo-cluster`, `seo-content`, `seo-content-brief`, `seo-flow`, `seo-images`, `seo-plan`) had ever been written. The other **19 shipped as unfilled scaffold** — 50 lines each, still carrying `scripts/generate-marketing-skills.js`'s literal `[Core capability 1 — what it does well]` placeholders — while listed here as ✅ production-ready. All 19 are now ported from source (123–356 lines each, + **55** new `references/`/`assets/` files). Two live dependencies of the `seo-writing` pipeline were among the empty ones: Stage 4 delegated to `[[seo-schema]]` for JSON-LD and `[[seo-geo]]` for AI-search structuring, and both returned nothing — a silent failure, since an empty skill still resolves. **The generator is the trap:** re-running `scripts/generate-marketing-skills.js --force` overwrites these files back to placeholders. It is write-once by default for exactly this reason; do not `--force` it over a filled skill.

| Name | Status | Folder | Source |
|---|:---:|---|---|
| `seo` | ✅ | `marketing/seo/` | claude-seo root (orchestrator) |
| `seo-audit` | ✅ | `marketing/seo-audit/` | claude-seo |
| `seo-technical` | ✅ | `marketing/seo-technical/` | claude-seo |
| `seo-content` | ✅ | `marketing/seo-content/` | claude-seo |
| `seo-schema` | ✅ | `marketing/seo-schema/` | claude-seo |
| `seo-geo` | ✅ | `marketing/seo-geo/` | claude-seo (replaces old `geo`) |
| `seo-local` | ✅ | `marketing/seo-local/` | claude-seo |
| `seo-page` | ✅ | `marketing/seo-page/` | claude-seo |
| `seo-images` | ✅ | `marketing/seo-images/` | claude-seo |
| `seo-sitemap` | ✅ | `marketing/seo-sitemap/` | claude-seo |
| `seo-drift` | ✅ | `marketing/seo-drift/` | claude-seo |
| `seo-cluster` | ✅ | `marketing/seo-cluster/` | claude-seo |
| `seo-content-brief` | ✅ | `marketing/seo-content-brief/` | claude-seo |
| `seo-competitor-pages` | ✅ | `marketing/seo-competitor-pages/` | claude-seo |
| `seo-ecommerce` | ✅ | `marketing/seo-ecommerce/` | claude-seo |
| `seo-hreflang` | ✅ | `marketing/seo-hreflang/` | claude-seo |
| `seo-programmatic` | ✅ | `marketing/seo-programmatic/` | claude-seo |
| `seo-backlinks` | ✅ | `marketing/seo-backlinks/` | claude-seo |
| `seo-sxo` | ✅ | `marketing/seo-sxo/` | claude-seo |
| `seo-flow` | ✅ | `marketing/seo-flow/` | claude-seo |
| `seo-plan` | ✅ | `marketing/seo-plan/` | claude-seo |
| `seo-maps` | ✅ | `marketing/seo-maps/` | claude-seo |
| `seo-dataforseo` | ✅ | `marketing/seo-dataforseo/` | claude-seo |
| `seo-google` | ✅ | `marketing/seo-google/` | claude-seo |
| `seo-image-gen` | ✅ | `marketing/seo-image-gen/` | claude-seo |
| `seo-writing` | ✅ | `marketing/seo-writing/` | ClauKit-authored — 6-stage article-production pipeline (ported from n8n). 7 references + 100-article WP playbook. Paired with `seo-writer` agent + `/mk:seo write\|plan` |

**Coreyhaines31 (22 — imported from `coreyhaines31/marketingskills`, curated subset):**

> **21 of these 22 are 🟡 scaffold, not ✅ active** (verified on disk 2026-08-25) — only `cro` was ever filled. Same root cause as the claude-seo batch: `scripts/generate-marketing-skills.js` emitted the placeholder template and no one wrote the bodies. Filling them needs the upstream `coreyhaines31/marketingskills` repo, which is not checked out locally. Until then, treat a `/mk:` command that routes to one of these as unimplemented.

| Name | Status | Folder | Notes |
|---|:---:|---|---|
| `ad-creative` | 🟡 | `marketing/ad-creative/` | |
| `ads` | 🟡 | `marketing/ads/` | |
| `analytics` | 🟡 | `marketing/analytics/` | |
| `cold-email` | 🟡 | `marketing/cold-email/` | |
| `competitor-alternatives` | 🟡 | `marketing/competitor-alternatives/` | |
| `competitor-profiling` | 🟡 | `marketing/competitor-profiling/` | |
| `competitors` | 🟡 | `marketing/competitors/` | |
| `content-strategy` | 🟡 | `marketing/content-strategy/` | |
| `copy-editing` | 🟡 | `marketing/copy-editing/` | |
| `copywriting` | 🟡 | `marketing/copywriting/` | |
| `cro` | ✅ | `marketing/cro/` | |
| `customer-research` | 🟡 | `marketing/customer-research/` | |
| `email-sequence` | 🟡 | `marketing/email-sequence/` | |
| `emails` | 🟡 | `marketing/emails/` | |
| `launch` | 🟡 | `marketing/launch/` | |
| `marketing-ideas` | 🟡 | `marketing/marketing-ideas/` | |
| `paywalls` | 🟡 | `marketing/paywalls/` | |
| `popup` | 🟡 | `marketing/popup/` | |
| `signup` | 🟡 | `marketing/signup/` | |
| `sms` | 🟡 | `marketing/sms/` | |
| `social-content` | 🟡 | `marketing/social-content/` | |
| `user-onboarding` | 🟡 | `marketing/user-onboarding/` | renamed from `onboarding` |

**ClauKit-authored (2):**

| Name | Status | Folder | Scope |
|---|:---:|---|---|
| `product-marketing` | ✅ | `marketing/product-marketing/` | Hub skill — creates/updates `plans/marketing-context.md` (ICP, positioning, voice). Activated by `/mk:plan` |
| `kit-builder` | ✅ | `marketing/kit-builder/` | Build custom ClauKit marketing components — skills, agents, workflows tailored to specific business needs |

### Marketing Automation (6) — `skills/automation/`

| Name | Status | Folder | Scope |
|---|:---:|---|---|
| `marketing-orchestrator` | ✅ | `automation/marketing-orchestrator/` | Multi-MCP coordinator for `/mk:campaign` + Phase 9 (Measure) |
| `mcp-ga4` | ✅ | `automation/mcp-ga4/` | Google Analytics 4 wrapper (with manual fallback) |
| `mcp-gsc` | ✅ | `automation/mcp-gsc/` | Google Search Console wrapper (with manual fallback) |
| `mcp-sendgrid` | ✅ | `automation/mcp-sendgrid/` | SendGrid email wrapper (with manual fallback) |
| `mcp-resend` | ✅ | `automation/mcp-resend/` | Resend email wrapper (with manual fallback) |
| `mcp-reviewweb` | ✅ | `automation/mcp-reviewweb/` | ReviewWeb reputation wrapper (with manual fallback) |

### Integrations (2) — `skills/integrations/` — NEW

| Name | Status | Folder | Scope |
|---|:---:|---|---|
| `wordpress-rest` | ✅ | `integrations/wordpress-rest/` | WordPress REST client — publish/update posts & pages (draft→publish), media, taxonomies, Yoast/RankMath SEO meta, audit. Env-only auth, idempotent, draft-default. Adapted (consumer) from WordPress agent-skills (GPL v2+, attributed in TPN). |
| `mcp-wordpress` | ✅ | `integrations/mcp-wordpress/` | WordPress MCP wrapper (BYO server) with curl fallback to `wordpress-rest`. |

### Software · Top-level standalone (38 on disk; 39 rows below)

> **Row count ≠ disk count, and both are stated on purpose.** Disk has **38** skills with `SKILL.md` exactly one level under `software/` (`find skills/software -mindepth 2 -maxdepth 2 -name SKILL.md`). The table has **39** rows because two of them — `csharp-developer`, `node-specialist` — carry `software/development/` paths and belong to the Subcategorized section; they are listed here for discoverability. Conversely `git` is on disk as top-level but is itemised under Subcategorized as `software/git/`, which it has been since its only subskill (`worktree`) was retired 2026-08-05. Net: 39 − 2 + 1 = 38. ✓

All are active (`dynamic-workflow` added 2026-06-03, paired with `/ck:flow`; baseline 39 active as of 2026-05-30) (10 scaffolds filled in earlier batch; `predict` merged into `planning` and removed — see section 5; `chrome-devtools` added 2026-05-16; `ask` re-added 2026-05-16 as knowledge skill complementing the `/ask` command; `brainstorm` re-added 2026-05-16 as knowledge skill complementing the `/brainstorm` command + `brainstormer` agent; `node-specialist` added 2026-05-29 sourced from VoltAgent/awesome-claude-code-subagents). `nextjs-developer` added 2026-05-30 sourced from VoltAgent/awesome-claude-code-subagents; `web-frameworks` removed (Next.js refs migrated, turborepo/remix-icon dropped). `typescript-pro` added 2026-05-30 sourced from VoltAgent/awesome-claude-code-subagents (subcategorized under `software/development/`).

| Name | Status | Folder | Scope |
|---|:---:|---|---|
| `agent-browser` | ✅ | `software/agent-browser/` | Token-efficient snapshot+refs browser automation for AI agents |
| `ask` 🔁 | ✅ | `software/ask/` | Technical/architectural consultation methodology — 4 advisor personas, grounded-context protocol, synthesis |
| `chrome-devtools` | ✅ | `software/chrome-devtools/` | Puppeteer CLI scripts with persistent sessions + JSON output |
| `agentize` | ✅ | `software/agentize/` | Convert codebase to CLI + MCP server for AI agents |
| `brainstorm` 🔁 | ✅ | `software/brainstorm/` | Architecture/solution advisory methodology — 5 pillars, 7-phase process, YAGNI/KISS/DRY, brutally-honest alternatives debate |
| `ck-graphify` | ✅ | `software/ck-graphify/` | AST → queryable code graph (syntactic) |
| `claude-md` 🔁 | ✅ | `software/claude-md/` | CLAUDE.md lifecycle — init (from ground truth, no phantom commands) · verify (9-point audit, Critical/High/Medium/Low) · analyze (per-section token-cost profile → ranked optimization plan; alias `optimize`) · refactor (behavior-preserving slim-down, directive inventory 1:1); paired with `/ck:claude-md`, added 2026-07-17, analyze added 2026-07-31 |
| `code-review` 🔁 | ✅ | `software/code-review/` | Pre-review edge-case scout · **fixed-point pinning** (three-dot merge-base diff + pre-flight before any spawn) · **three axes in parallel** (Standards · Spec · Security) reported side by side, never reranked · `smell-baseline.md` (12 Fowler smells, always pasted into the Standards prompt) · 4-lens fan-out as the high-risk escalation · receiving feedback (no performative agreement) · verification gates (evidence before claims). Upgraded 2026-08-21 |
| `coding-level` | ✅ | `software/coding-level/` | Developer proficiency (0-5) → output tuning |
| `context-engineering` | ✅ | `software/context-engineering/` | Curate token flow into AI agents (6-layer model) |
| `cook` 🔁 | ✅ | `software/cook/` | Feature lifecycle pipeline with gates — methodology source for `/cook` command; includes Stage 0 Exact-Requirements Gate (5-item hard-block before planning) |
| `csharp-developer` | ✅ | `software/development/csharp-developer/` | ASP.NET Core, Blazor, EF Core, cloud-native .NET — sourced from VoltAgent/awesome-claude-code-subagents |
| `node-specialist` | ✅ | `software/development/node-specialist/` | Node.js backend — event loop, async patterns, streams, Express/Fastify/NestJS, performance profiling, security — sourced from VoltAgent/awesome-claude-code-subagents |
| `debugging` 🔁 | ✅ | `software/debugging/` | |
| `dynamic-workflow` 🔁 | ✅ | `software/dynamic-workflow/` | Controllable re-creation of the dynamic-workflow model — fan-out/pipeline over the 29 agents, 4-axis inheritance, gated + cost-previewed; paired with `/ck:flow` (re-creates patterns, never native ultracode) |
| `find-skills` | ✅ | `software/find-skills/` | |
| `gkg` | ✅ | `software/gkg/` | Text → semantic knowledge graph (NLP) |
| `mintlify` | ✅ | `software/mintlify/` | |
| `payment-integration` | ✅ | `software/payment-integration/` | |
| `refactor` 🔁 | ✅ | `software/refactor/` | Large mechanical refactor (rename · extract · migrate · codemod) — 7-phase pipeline w/ atomic commits + rollback; paired with `/ck:refactor` |
| `planning` 🔁 | ✅ | `software/planning/` | Now includes "Predictive planning" subsection (merged from removed `predict` scaffold) |
| `plans-kanban` | ✅ | `software/plans-kanban/` | Kanban methodology applied to plans/ folder |
| `preview` | ✅ | `software/preview/` | Presentations only (Marp/reveal.js/Quarto). ❗ cleared 2026-08-21: the render-markdown half it once duplicated was split out 2026-07-31 and then retired outright, so there is no second skill left to overlap with — `preview` keeps a pointer at `mdbook serve` / `markserv` / `grip` |
| `problem-solving` | ✅ | `software/problem-solving/` | |
| `project-organization` | ✅ | `software/project-organization/` | Repo layout / monorepo / naming patterns |
| `research` 🔁 | ✅ | `software/research/` | |
| `retro` | ✅ | `software/retro/` | Team retrospective facilitation |
| `run-state` | ✅ | `software/run-state/` | **Durable per-plan ledger** (`plans/<plan>/STATE.md`) — append-only gate events, resume protocol (re-derive from git + gate re-runs), parallel-session safety. Scope vs `plans-kanban` (plan board/status views) and `project-organization` (repo layout): run-state records *execution* events of one run, not plan management. Added 2026-07-31 |
| `scenario` | ✅ | `software/scenario/` | Test scenario design (tool-agnostic) |
| `sequential-thinking` | ✅ | `software/sequential-thinking/` | |
| `tdd` ❗ | ✅ | `software/tdd/` | **Red-green discipline** — Iron Law (no production code without a failing test first), baseline-first (suite on the untouched tree before the first edit; never `git stash`), rationalization table. Deliberate scope split: `tdd` = discipline · `test-automation` = infra **and** browser toolkit (merged 2026-08-21) · `scenario` = case derivation. Paired with `/ck:fix tdd`. Added 2026-07-31 |
| `verify-plan` | ✅ | `software/verify-plan/` | **Plan falsification gate** — claim → verdict (CONFIRMED/REFUTED/UNVERIFIABLE) → evidence table; mandatory for `--from-plan` (cook Stage 0.5); paired with `/ck:plan verify`. Added 2026-07-31 |
| `team` 🔁 | ✅ | `software/team/` | Parallel multi-session orchestration — spawns independent Claude Code teammates (templates: research/cook/review/debug); paired with `/team` command |
| `show-off` | ✅ | `software/show-off/` | |
| `tech-graph` | ✅ | `software/tech-graph/` | |
| `template-skill` | ✅ | `software/template-skill/` | (still a 5-LOC stub — see open issue) |
| `security` 🔁 | ✅ | `software/security/` | Renamed from `vulnerability-scanner` 2026-05-29. **Tiered 2026-08-21**: Core 8 always · 9 signal-gated · 4 opt-in; TINY/SMALL/LARGE on file count alone (`min(3, ceil(files/25))` agents); a report must name the IDs it skipped. Pattern-matching pre-scanner removed on evidence |
| `port` 🔁 | ✅ | `software/port/` (port & refactor from GitHub) | |
| `to-tickets` 🔁 | ✅ | `software/to-tickets/` | **Vertical tracer-bullet slicing** — one plan → N tickets, each declaring only the tickets that genuinely gate it; the frontier is what can start now. Expand → migrate-batches → contract for a wide refactor (with the integration-branch variant when a batch cannot stay green alone). Draft-then-publish gate: nothing written before user approval. Local files default; tracker sub-tasks opt-in under a named parent. Scope vs `plans-kanban` (board over *whole plans*) and `planning` (writes the plan this slices). Paired with `/ck:tickets` + `ticket-slicer`. Ported from norskmat 2026-08-21 |

### Software · Subcategorized

#### `software/ai/` (3)

| Name | Status |
|---|:---:|
| `ai-artist` | ✅ |
| `ai-multimodal` | ✅ |
| `remotion` | ✅ |

#### `software/database/` (2)

| Name | Status | Folder | Scope |
|---|:---:|---|---|
| `postgresql` | ✅ | `database/databases/` | PostgreSQL guide — SQL queries, schema design, performance, psql CLI, backups, replication |
| `supabase` 🔁 | ✅ | `database/supabase/` | Complete Supabase skill — platform layer (Auth/RLS, SDK, Storage, Realtime, Edge Functions, CLI) + Postgres layer (query optimization, indexing, connection pooling, schema, locking, monitoring). Merged from `supabase-postgres-best-practices` 2026-05-22 |

#### `software/design/` (9)

| Name | Status |
|---|:---:|
| `aesthetic` | ✅ |
| `excalidraw` | ✅ |
| `frontend-design` | ✅ |
| `mermaidjs-v11` | ✅ |
| `stitch` | ✅ |
| `threejs` | ✅ |
| `ui-styling` | ✅ |
| `ui-ux-pro-max` | ✅ |
| `web-design-guidelines` | ✅ |

#### `software/development/` (9)

| Name (frontmatter) | Status | Folder |
|---|:---:|---|
| `backend-development` | ✅ | `development/backend-development/` |
| `bootstrap` 🔁 | ✅ | `development/bootstrap/` |
| `frontend-development` | ✅ | `development/frontend-development/` |
| `python-pro` | ✅ | `software/development/python-pro/` | Python 3.11+, type-safe async APIs, mypy strict, pytest 90%+ — sourced from VoltAgent/awesome-claude-code-subagents |
| `react-specialist` | ✅ | `development/react-specialist/` | React 18+ specialist — advanced patterns, concurrent rendering, state management, performance — sourced from VoltAgent/awesome-claude-code-subagents |
| `test-automation` | ✅ | `development/test-automation/` (QA engineering — Playwright canonical, BDD, mobile, API) |
| `nextjs-developer` | ✅ | `development/nextjs-developer/` | Next.js 14+ full-stack — App Router, Server Components, Server Actions, Core Web Vitals > 90, SEO > 95 — sourced from VoltAgent/awesome-claude-code-subagents |
| `python-development` | ✅ | `development/python-development/` | FastAPI, Django, Flask, data/ML integration — comprehensive Python backends, APIs, data pipelines |
| `typescript-pro` | ✅ | `development/typescript-pro/` | TypeScript 5.0+ type system, advanced generics, type-level programming, full-stack type safety, tRPC, build tooling — sourced from VoltAgent/awesome-claude-code-subagents |

#### `software/document-skills/` (4)

| Name | Status |
|---|:---:|
| `docx` | ✅ |
| `pdf` | ✅ |
| `pptx` | ✅ |
| `xlsx` | ✅ |

> `software/expo/` (12 sub-skills, 9515 LOC) **removed 2026-05-16** per user direction. `mobile-development` skill also **removed 2026-05-29** per user direction — no dedicated mobile skill remains. Re-add via `npx skills add expo/skills` (if upstream pkg exists) if needed.

#### `software/git/` (1) 🔁

| Name | Status | Path |
|---|:---:|---|
| `git` | ✅ | `software/git/SKILL.md` |

#### `software/infrastructure/` (1)

| Name | Status | Folder | Scope |
|---|:---:|---|---|
| `docker-expert` | ✅ | `infrastructure/docker-expert/` | Production Docker: multi-stage builds, image optimization, security hardening, supply chain security — sourced from VoltAgent/awesome-claude-code-subagents |

---

## 2 · Agents (30)

### `marketing/` (12) — marketing kit

| Name | Status | Model | File |
|---|:---:|---|---|
| `campaign-manager` | ✅ | sonnet | `marketing/campaign-manager.md` |
| `content-strategist` | ✅ | sonnet | `marketing/content-strategist.md` |
| `copywriter` 🔁 | ✅ | sonnet | `marketing/copywriter.md` (relocated from `engineering/` 2026-07-16) |
| `crm-specialist` | ✅ | sonnet | `marketing/crm-specialist.md` |
| `email-specialist` | ✅ | sonnet | `marketing/email-specialist.md` |
| `market-researcher` | ✅ | sonnet | `marketing/market-researcher.md` |
| `seo-content` | ✅ | sonnet | `marketing/seo-content.md` |
| `seo-geo` | ✅ | sonnet | `marketing/seo-geo.md` |
| `seo-writer` | ✅ | sonnet | `marketing/seo-writer.md` (orchestrates the `seo-writing` 6-stage pipeline end-to-end; paired with `/mk:seo write\|plan\|campaign` — `campaign` adds the seo-workflow.md measure/optimize loop) |
| `seo-schema` | ✅ | sonnet | `marketing/seo-schema.md` |
| `seo-technical` | ✅ | sonnet | `marketing/seo-technical.md` |
| `video-producer` | ✅ | sonnet | `marketing/video-producer.md` |

### `engineering/` (18) — engineer kit

| Name | Status | Model | File |
|---|:---:|---|---|
| `backend-developer` | ✅ | sonnet | `engineering/backend-developer.md` |
| `brainstormer` 🔁 | ✅ | opus | `engineering/brainstormer.md` |
| `code-reviewer` 🔁 | ✅ | opus | `engineering/code-reviewer.md` |
| `database-admin` 🔁 | ✅ | sonnet | `engineering/database-admin.md` |
| `debugger` 🔁 | ✅ | opus | `engineering/debugger.md` |
| `docs-manager` 🔁 | ✅ | sonnet | `engineering/docs-manager.md` |
| `frontend-developer` | ✅ | sonnet | `engineering/frontend-developer.md` |
| `git-manager` 🔁 | ✅ | haiku | `engineering/git-manager.md` |
| `integration-agent` 🔁 | ✅ | sonnet | `engineering/integration-agent.md` |
| `journal-writer` 🔁 | ✅ | haiku | `engineering/journal-writer.md` |
| `performance-agent` | ✅ | sonnet | `engineering/performance-agent.md` |
| `planner` 🔁 | ✅ | opus | `engineering/planner.md` |
| `project-manager` | ✅ | haiku | `engineering/project-manager.md` |
| `researcher` 🔁 | ✅ | sonnet | `engineering/researcher.md` |
| `scout` 🔁 | ✅ | haiku | `engineering/scout.md` |
| `security-auditor` 🔁 | ✅ | inherit | `engineering/security-auditor.md` |
| `tester` 🔁 | ✅ | sonnet | `engineering/tester.md` |
| `ticket-slicer` 🔁 | ✅ | inherit | `engineering/ticket-slicer.md` — drafts a ticket graph from a plan/spec/issue and runs 5 cutting tests; **writes nothing, publishes nothing** (approval + every side effect stay in main context). No `Task` tool. Added 2026-08-21 |

---

## 3 · Commands (57)

All commands are ✅ active. Grouped by namespace. **Prefix `ck:` applied 2026-05-17** — every command lives under `.claude/commands/ck/`, invoked as `/ck:<name>` (e.g. `/ck:cook`, `/ck:fix ci`). **`/orchestrate` removed 2026-05-17** (superseded by `/ck:team`). **Flag-style variants applied 2026-05-17** — sibling variants of the same command (e.g. fast/hard/auto/good/ext) collapsed into flags rather than `:nested` namespace; namespaced commands now reserved for genuinely-distinct actions (e.g. `/ck:fix ci`, `/ck:plan two`).

### Top-level (21) — single-action + flagged-variant entrypoints

| Command | Description |
|---|---|
| `/ck:ask` | Answer technical and architectural questions |
| `/ck:bootstrap [auto\|fast]` 🔁 | Bootstrap a new project — default: step-by-step · `auto`: minimal Q&A · `fast`: low-interaction parallel |
| `/ck:brainstorm` 🔁 | Brainstorm a feature |
| `/ck:cook` 🔁 | Drive feature spec → production (full lifecycle: research, plan, code, test, review) |
| `/ck:debug` 🔁 | Debugging technical issues |
| `/ck:design [fast\|good] [3d\|screenshot\|describe\|ui-ux-pro-max]` 🔁 | Design UI/UX — workflow flags: `fast` (minimal) · `good` (research-driven). Output-type flags: `3d` · `screenshot` · `describe` · `ui-ux-pro-max` (Style Intelligence) |
| `/ck:find` 🔁 | Recommend ClauKit skill/agent/command for a task — local registry first, external skills fallback |
| `/ck:flow [save\|list]` 🔁 | Controllable orchestration — plan phases, cost preview, fan-out/pipeline over the 29 agents, 4-axis inheritance, gated (re-creates dynamic workflows; never native ultracode). Paired with `dynamic-workflow` skill |
| `/ck:fix [--auto] [--review] [--quick] [--parallel] [--flow]` 🔁 | Analyze and fix issues — combinable flags: `--auto` · `--review` · `--quick` · `--parallel` · `--flow` (orchestrated: gates as agent stages + adversarial-verify root cause before implement) |
| `/ck:journal` 🔁 | Write journal entries |
| `/ck:plan [fast\|hard\|two\|ci\|cro] [-o md\|html]` 🔁 | Intelligent plan creation — router (auto-detect) · `fast`: no research · `hard`: research-heavy · `-o html`: also render self-contained `plan.html` view (md stays source of truth) · `/ck:plan <path>.md -o html`: convert an existing plan's markdown → `plan.html` (no re-plan) |
| `/ck:refactor` 🔁 | Large mechanical refactor — rename · extract · migrate · codemod. 7-phase pipeline w/ atomic-commit + rollback gates |
| `/ck:research` 🔁 | Technical research — technology evaluation, best practices, solution design (uses `research` skill) |
| `/ck:scout` 🔁 | Scout codebase — parallel internal Explore subagents |
| `/ck:security [scope] [--full\|--rules ids] [--en]` 🔁 | Scoped security audit — OWASP 2025, 21 **tiered** rules, TINY/SMALL/LARGE by file count, bilingual. **Default scope = the working diff**; whole-repo is `repo`, opt-in by name and never a fallback. Rebuilt 2026-08-21 |
| `/ck:team` 🔁 | Orchestrate parallel multi-session collaboration with independent Claude Code teammates (paired with `team` skill) |
| `/ck:test` 🔁 | Run tests locally, analyze report |
| `/ck:use-mcp` 🔁 | Utilize MCP server tools |
| `/ck:watzup` | Review recent changes, wrap up work |
| `/ck:port` 🔁 | Port & refactor feature from public GitHub repo |
| `/ck:tickets [source] [--jira KEY] [--dry-run]` 🔁 | Slice a plan/spec/issue/conversation into vertical tracer-bullet tickets with blocking edges. Delegates drafting to `ticket-slicer`; the approval gate and every write stay in this session. Added 2026-08-21 |

### `claude-md` (dispatcher, 4) 🔁 docs-manager + `claude-md` skill

| Command | Description |
|---|---|
| `/ck:claude-md init [path]` | Create CLAUDE.md from ground truth (gate: must not exist) |
| `/ck:claude-md verify [path]` | Read-only 9-point audit → PASS/FAIL report |
| `/ck:claude-md analyze [path]` | Read-only per-section token-cost profile → ranked KEEP/EXTRACT/DEDUPE/DROP plan + projected savings (alias `optimize`; apply via `refactor`) |
| `/ck:claude-md refactor [path]` | Behavior-preserving slim-down (gates: clean git, verify first, directive inventory 1:1) |

### `docs` (dispatcher, 3) 🔁 docs-manager

| Command | Description |
|---|---|
| `/ck:docs init` | Create initial docs from scratch |
| `/ck:docs update [requests]` | Update existing docs |
| `/ck:docs summarize [topics] [scan?]` | Summary report (read-only) |

### `fix` variants (6) 🔁 tester / debugger — specialized inputs/agents

| Command | Description |
|---|---|
| `/ck:fix ci` | Fix CI/GitHub Actions issues |
| `/ck:fix logs` | Fix from log analysis |
| `/ck:fix test` | Run tests + fix (input: an already-red suite) |
| `/ck:fix tdd` | Production-symptom red-green loop (`tdd` skill): toolchain proof → red test w/ pasted failure → pre-edit baseline → green → sweep. Distinct from `test` by input (symptom vs red suite) — both stay (R4) |
| `/ck:fix types` | Fix type errors |
| `/ck:fix ui` | Fix UI issues |

### `git` (dispatcher, 5) 🔁 git-manager

| Command | Description |
|---|---|
| `/ck:git cm` | **Scoped** commit — session manifest from the file-claims registry, foreign WIP reported never staged, explicit paths only (never `-A`) |
| `/ck:git cp` | Scoped commit + push |
| `/ck:git pr [to] [from] [--no-handoff] [--ready]` | Finish the branch: verify green → self-review scoped diff → **draft-default** PR (`pr-body.md` fill contract) → project-declared delivery tail (ships empty); auth failure ⇒ paste-ready payload, zero retries |
| `/ck:git merge [pr#\|branch]` | Merge PR or branch (interactive); merged-status claims require `git fetch` + remote-ref evidence |
| `/ck:git finish` | Verify green → env detect (repo/worktree/detached) → menu: merge locally · push+PR · keep as-is |

### `sepay` 🔁 integration-agent

| Command | Description |
|---|---|
| `/ck:sepay` | SePay.vn payment integration |

### `plan` variants (4) 🔁 planner — specialized planning shapes

| Command | Description |
|---|---|
| `/ck:plan ci` | Plan to fix CI issues |
| `/ck:plan cro` | CRO plan |
| `/ck:plan two` | Plan w/ 2 approaches |
| `/ck:plan verify <path>` | Falsify an existing plan (`verify-plan` skill): claim → verdict → evidence table, read-only; SAFE-TO-EXECUTE or back-to-planner verdict. Auto-invoked by `/ck:cook --from-plan` |

### `review` 🔁 code-reviewer + security-auditor

| Command | Description |
|---|---|
| `/ck:review [since <ref>] [--flow] [--lenses]` | Scan + analyze codebase. **Core (2026-08-21):** pin the fixed point → three-dot merge-base diff → one review-package file → **three parallel axes** (Standards · Spec · Security) reported side by side, never reranked. `--flow`: orchestrated dimension fan-out (bugs/security/perf) → adversarial-verify per finding → confirmed-only report · `--lenses` (opt-in, risk-gated **escalation on top of the axes**): 4 concurrent lenses (ADVERSARY/FIDELITY/BLAST-RADIUS/CONVENTION), falsifier never sees implementer reasoning, evidence-or-discard |

### `mk` (dispatcher, 12) 🔁 marketing kit — NEW in v2.0.0

All commands under `/mk:` namespace. Each hard-fails if `plans/marketing-context.md` is missing.

| Command | Description |
|---|---|
| `/mk:plan [fast\|full] [-o md\|html]` | Bootstrap or update marketing context (ICP, positioning, voice) · `-o html`: also render `marketing-context.html` view · `<path>.md -o html`: convert existing context → HTML |
| `/mk:seo [audit\|keywords\|ai\|programmatic\|schema\|plan\|write\|campaign]` | SEO via claude-seo engine (audit/keywords/ai/programmatic/schema) + `plan`/`write` = full 6-stage article-production pipeline (`seo-writing` skill + `seo-writer` agent) + `campaign` = 7-phase closed loop per `.claude/workflows/seo-workflow.md` (baseline → plan → write → publish → measure → optimize); draft-default publishing |
| `/mk:content [blog\|social\|video\|copy]` | Content creation |
| `/mk:email [campaign\|cold\|drip\|sms]` | Email & SMS |
| `/mk:ads [google\|meta\|creative\|ab-test]` | Paid advertising |
| `/mk:cro [audit\|landing\|signup\|email]` | Conversion optimization |
| `/mk:research [market\|competitor\|customer\|icp]` | Market research |
| `/mk:growth [launch\|referral\|free-tool]` | Growth tactics |
| `/mk:campaign` | Full 10-phase campaign pipeline (plan → optimize loop) |
| `/mk:leads` | 5-phase lead pipeline (generate → retain) |
| `/mk:nurture` | 5-phase lifecycle nurture (calendar → bigquery) |
| `/mk:video` | 6-phase AI video (script → distribute) |

---

## 4 · Duplicate / Overlap Detection

### 4a · True duplicates (same name in 2+ pools) — **none post-cleanup** ✅

The v2 dedupe (2026-05-16) removed 15 skill scaffolds that exactly duplicated existing command + agent names. After cleanup, no two pools contain the same exact name.

### 4b · Intentional cross-pool concepts (🔁) — complementary, not duplicates

These are the *intended* trios where Skill = knowledge, Agent = persona, Command = trigger.

**DRY pattern applied 2026-05-16 to 14 trios** — single-source-of-truth approach where the skill (or designated canonical doc) owns methodology; agents + commands retain only unique parts and reference the canonical source.

**Batch 1** (4 trios): `brainstorm`, `planning`, `code-review`, `debugging`
**Batch 2** (5 trios): `research`, `scout`/`scout-external`, `docs`, `bootstrap`, `payment-integration`
**Batch 3** (5 trios): `git`, `xia`, `journal`, `fix`, `ask`
**Batch 4** (1 trio): `seo` (dispatcher with 3 flags: `/ck:seo audit`, `/ck:seo keywords`, `/ck:seo schema`) — extracted detailed pipelines/templates from commands into `seo/references/{audit-checklist,keyword-research,schema-templates}.md`. Commands dropped 840→109 lines (−87%); single source of truth = skill + references. Collapsed from `seo:*` namespace to flag-style dispatcher 2026-05-18.
**Batch 5** (4 cleanups): `content/cro` + `plan/cro` (cross-command CRO duplicate), `design/3d` (plan-structure duplicate), `design/*` (skill-activation boilerplate), `skill/*` (input-handling boilerplate).
- **CRO framework** — 25-point Conversion Optimization Framework extracted to [.claude/workflows/cro-framework.md](../../.claude/workflows/cro-framework.md). `/ck:plan cro` references it instead of duplicating.
- **`design/*`** — removed repeated `aesthetic`+`frontend-design` skill-activation block from 5 commands (`ui-ux-designer` agent already auto-activates these). `design/3d`, `design/screenshot`, `design/describe` now reference `planning` skill for plan structure.

Notable extensions:
- `bootstrap` skill extended with **"Canonical Bootstrap Workflow"** (10-phase pipeline) — `/ck:bootstrap`, `/ck:bootstrap auto`, `/ck:bootstrap fast` only document variant differences.
- `fix` family — no skill/agent existed → created [.claude/workflows/fix-pipeline.md](../../.claude/workflows/fix-pipeline.md) as canonical 7-stage pipeline; 8 commands (`/ck:fix`, `/ck:fix --quick`, `/ck:fix --review`, `/ck:fix logs`, `/ck:fix ci`, `/ck:fix test`, `/ck:fix types`, `/ck:fix ui`) reference it + document variant deltas.
- `docs-manager` agent + `journal-writer` agent serve as canonical sources (no dedicated knowledge skill exists for those concepts).
- `git-manager` agent retains haiku-optimized 2-3 tool execution workflow as agent-specific knowledge (skill = conventional-commits methodology).

Other trios (`testing` → covered by `test-automation`/`chrome-devtools`, `design` → `frontend-design`, `mcp` → `use-mcp`, `database` → `databases`, `seo`, `security`, `orchestrate`, `code`, `watchup`) may follow this pattern in future passes.

| Concept | Skill | Agent | Command |
|---|---|---|---|
| Planning | `planning` | `planner` | `/ck:plan` |
| Research / Scout | `research` | `researcher`, `scout` | `/ck:research`, `/ck:scout` |
| Code review | `code-review` | `code-reviewer` | `/ck:review` |
| Debugging | `debugging` | `debugger` | `/ck:debug` |
| Testing | `test-automation` (every layer: unit · E2E · BDD · mobile · API · load), `scenario` (case derivation), `tdd` (red-green discipline) | `tester` | `/ck:test`, `/ck:fix test` |
| Docs | `mintlify`, `tech-graph`, `document-skills/*` | `docs-manager` | `/ck:docs [init\|update\|summarize]` |
| CLAUDE.md lifecycle | `claude-md` | `docs-manager` (reused — no new agent) | `/ck:claude-md [init\|verify\|analyze\|refactor]` |
| Design | 10 design skills | `frontend-developer` (agent `ui-ux-designer` removed 2026-07-16) | `/ck:design` |
| Content | `show-off` | `copywriter` (marketing kit) | – (marketing kit: `/mk:content`) |
| SEO/GEO | `seo`, `geo` | – (agent removed 2026-05-17) | – (marketing kit: `/mk:seo`) |
| Git | `git` | `git-manager` | `/ck:git [cm\|cp\|pr\|merge\|finish]` |
| Bootstrap | `bootstrap` (knowledge) | – | `/ck:bootstrap` |
| Port & Refactor | `port` | (uses `scout`, `code-reviewer`) | `/ck:port` |
| Security | `security` (scanner + mindset + 21 tiered rules) | `security-auditor` | `/ck:review` (Security axis), `/ck:security` (arbitrary scope, saved report) |
| Payments | `payment-integration` | `integration-agent` | `/ck:sepay` |
| MCP | – | – (native deferred MCP-tool loading; isolate verbose calls in `general-purpose` subagent) | `/ck:use-mcp` |
| Skill management | `find-skills`, `template-skill` | – | – |
| Database | `postgresql`, `supabase` | `database-admin` | – |
| Journal | – | `journal-writer` | `/ck:journal` |
| Brainstorm (7-phase advisory: Scout→Discovery→Research→Analysis→Debate→Consensus→Finalize→`planner`) | `brainstorm` (5-pillar methodology + 7-phase process) | `brainstormer` | `/ck:brainstorm` |
| Team (parallel multi-session) | `team` (templates: research/cook/review/debug) | – | `/ck:team` |
| Refactor (7-phase mechanical change pipeline) | `refactor` | – (uses `scout`, `tester`, `code-reviewer`, `git-manager`) | `/ck:refactor` |
| Discoverability (local-first tool finder) | – (uses `find-skills` skill for external fallback) | – | `/ck:find` |
| Fix | – | (uses tester/debugger) | `/ck:fix` |
| Ask | `ask` (4-persona consultation methodology) | – | `/ck:ask` |
| Watchup | – | – | `/ck:watzup` |
| Cook (feature lifecycle) | `cook` (5-stage gated methodology) | (uses team) | `/ck:cook` |
| Problem-solving | `problem-solving` | – | – |
| Sequential thinking | `sequential-thinking` | – | – |
| Misc skills (knowledge only) | `preview`, `mintlify`, `tech-graph`, design subskills | – | – |
| Scaffold methodology (knowledge only, future) | 12 scaffolds | – | – |

### 4c · Naming inconsistencies — RESOLVED 2026-05-16

All 8 violations (spec requires `name:` lowercase+hyphen and == folder) fixed:

| Folder | Before → After | Strategy |
|---|---|---|
| `software/debugging/` | `Debugging` → `debugging` | edit `name:` |
| `software/problem-solving/` | `Problem-Solving Techniques` → `problem-solving` | edit `name:` |
| `software/expo/skills/expo-ui-jetpack-compose/` | `Expo UI Jetpack Compose` → `expo-ui-jetpack-compose` | edit `name:` |
| `software/expo/skills/expo-ui-swift-ui/` | `Expo UI SwiftUI` → `expo-ui-swift-ui` | edit `name:` |
| `software/development/frontend-development/` | `frontend-dev-guidelines` → `frontend-development` | edit `name:` |
| `marketing/geo/` | `geo-fundamentals` → `geo` (also updated `seo-specialist.md` agent ref) | edit `name:` + caller |
| `marketing/seo/` | `seo-fundamentals` → `seo` (also updated `seo-specialist.md` agent ref) | edit `name:` + caller |

Bonus: moved non-spec fields `version`/`languages` into `metadata:` map for `debugging` and `problem-solving` skills (spec only defines `metadata` as a freeform map for extra properties).

Verification: `for f in $(find .claude/skills -name SKILL.md); do …` returns zero mismatches.

### 4d · Potential scope overlap — RESOLVED 2026-05-16

| Pair | Concern | Resolution |
|---|---|---|
| ~~`web-testing` ↔ `test-automation`~~ | ~50% overlap on Playwright basics, page objects, wait strategies, CI/CD | **CLOSED BY MERGE 2026-08-21.** The 2026-05-16 audience-based split ("app developer" vs "QA engineer") did not hold — the overlap stayed, and both files carried a "Scope vs" section arguing about a boundary a reader picking a skill does not have. Merged into `development/test-automation` v2.0.0; the surviving axis is *which layer proves the claim* (unit / E2E / API / load), stated once. |

### 4e · Indirect overlaps (not flagged) — multiple knowledge skills feed one agent

- `frontend-developer` agent reads from 10 design skills for design work (inherited from removed `ui-ux-designer`) — by design, not a bug.
- `docs-manager` agent reads from 5+ doc skills — by design.
- Security: `security` (OWASP 2025 scanner + mindset + 21 tiered rules) feeds `security-auditor`. Threat-intel context is a live `WebSearch` citing an advisory ID, not a shipped prose file — `cti-expert` retired 2026-08-21 (§ 5).

### 4f · Overlap audit 2026-07-31 (T5.5) — first real use of the ❗ marker

**Resolved duplicate:** `marketing/programmatic-seo` (coreyhaines31 import) vs `marketing/seo-programmatic` (claude-seo import) — same subject, two 50-line stubs. **Kept `seo-programmatic`** (claude-seo is the designated SEO backbone; it also carried the orchestrator parent link — a strict superset). `programmatic-seo` removed; cross-links updated in `/mk:seo` + `skills/marketing/README.md`.

**Resolved overlap → closed by deletion 2026-08-21:** `software/preview` vs `software/markdown-novel-viewer` — the render-markdown half was duplicated, and the 2026-07-31 fix split it into its own skill. That skill was then retired (§ 5): a 68-line file wrapping three well-known CLI one-liners, invoked by nothing. `preview` stays presentations-only and carries a pointer, so the overlap is gone rather than merely partitioned. The ❗ on `preview` in §1 is cleared.

**Checked and NOT duplicates — recorded so this is not re-litigated:**
- `competitors` / `competitor-profiling` / `competitor-alternatives` — landscape vs single-competitor deep-dive vs comparison-page artifact
- `emails` / `email-sequence` / `cold-email` — distinct channel shapes
- `copywriting` / `copy-editing` — create vs refine
- `ck-graphify` / `gkg` / `tech-graph` — code-AST graph vs text knowledge graph vs SVG diagrams; the shared word "graph" is the only overlap
- `/ck:fix test` vs `/ck:fix tdd` — failing-suite input vs production-symptom input (R4)
- `run-state` vs `plans-kanban` / `project-organization` — run-execution ledger vs plan board vs repo layout (flagged in §1 scope notes)
- `tdd` vs `test-automation` / `scenario` — discipline vs infra+toolkit vs case derivation (flagged ❗ in §1)

---

## 5 · Removed (cumulative)

### Norskmat sync (2026-08-21)

| Action | Entry | Notes |
|---|---|---|
| Removed | `docs-seeker` skill | 17 files (`SKILL.md` + 3 references + 3 workflows + 5 scripts + 4 of its own tests + `package.json` + `.env.example`) wrapping llms.txt / context7 doc discovery in bespoke Node scripts. `WebFetch` + `WebSearch` do this natively and a docs MCP server covers the rest, so the skill was pure shipped surface. Replaced in prose across 9 shipped files: `brainstorm`, `ask`, `research`, `planning/references/research-phase`, `brainstormer`, `researcher`, `debugger`, `/ck:research`, `development-rules`. `.claude/skills/global/` is now empty of skills; the manifests still name it because `global/common/` (a shared Python helper) remains. |
| Removed | `cti-expert` skill | Static threat-intel prose with no agent, no command, and no pipeline routing to it. Only `security-auditor` named it — as a second skill to activate beside `security` — and what it needed there was a *live* CVE lookup, which is a `WebSearch` citing an advisory ID, not a file that ages out of date the week it ships. |
| **Merged** + removed | `web-testing` → `development/test-automation` (v2.0.0) | The 2026-05-16 audience split ("app developer" vs "QA engineer") documented the overlap instead of removing it, and § 7 item 1 had been carrying it as resolved-then-reopened ever since. `test-automation` absorbed the Vitest and k6 halves, the CLI cheat-sheet, and the negative-scope list; the surviving axis is *which layer proves the claim*. Cross-links repointed in `scenario`, `tdd`, `chrome-devtools`, `agent-browser`, and the `tester` agent (which now names `test-automation` + `scenario` + `tdd` instead of two overlapping toolkits). |
| Removed | `security` skill's `scripts/security_scan.py` | A pattern-matching pre-scanner **invoked by no workflow in any version that shipped it**. Trial run before deletion: a plain `/regex/.exec()` call reported as `exec() usage CRITICAL`. The skill's Core Principle is reasoning-first L1–L4 tracing; a regex pass that skips the tracing is cheap and wrong, and its noise costs more to triage than the scan saves. A guardrail now names the retirement so it is not reintroduced. |
| Removed | `markdown-novel-viewer` skill | 68 lines, one file, telling you to run `mdbook serve` / `npx markserv` / `grip README.md`. No command routed to it; `docs-manager` only listed it in an "auto-activate as needed" enumeration. **It existed only as the other half of a de-duplication.** On 2026-07-31 `preview` was carrying a duplicated render-markdown section and the fix carved that half into its own skill — so nobody ever needed this skill, it was created to partition an overlap. The bar this registry sets is whether a skill encodes something the model gets wrong unprompted; three well-known CLI one-liners do not. `preview` now carries a three-line pointer, which is not a re-duplication because `preview` remains presentations-only. Closes the § 4f overlap by deletion and clears `preview`'s ❗. |
| Removed | `global/common/` (`api_key_helper.py` + README) | **Dead code for the repository's entire life.** `git grep` across every commit on every branch finds `from api_key_helper import …` in exactly one file: the helper's own README, at each of the three paths it has lived at. No Python file has ever imported it. It also could not have worked where it claimed to — the README resolves it as `parent.parent.parent / 'common'`, i.e. `<group>/common`, which only exists for a skill sitting directly under `skills/global/`; the one skill that ever sat there (`docs-seeker`) is JavaScript, and for the consumer the README names (`software/ai/ai-multimodal`) that arithmetic lands on `skills/software/ai/common`, which has never existed. `ai-multimodal` carries its own `find_api_key()`, so this changes no behaviour. Both legacy install layouts are in `RETIRED` (`.claude/skills/common/` and `.claude/skills/global/common/`); each file has one content version in all of history. |
| Removed | the `global/` skill **group** | Emptied by the two rows above. Dropped from `engineer.json` + `both.json` — `checkKitPathsAvailable` exits non-zero on a manifest path the package lacks, so leaving it would abort `ck init` outright. Groups are now four: `software/`, `marketing/`, `automation/`, `integrations/`. |
| Removed | 4 empty `security/rules/languages/{go,php,python,typescript}/` dirs | `.gitkeep`-only. `SKILL.md` now states the kit ships the language-override *hook* and no overlay files; four empty directories said the opposite. `rules/languages/README.md` stays — it is the documented hook. |

All 29 removed paths are in `RETIRED` (`bin/lib/retired-files.js` — 42 entries total) with their shipped blob digests: 17 `docs-seeker` · 1 `cti-expert` · 1 `web-testing` · 1 `markdown-novel-viewer` · 1 security pre-scanner · 4 `.gitkeep` · 4 for `global/common/` (2 files × 2 legacy install layouts, so a project on either layout is cleaned).

`STALE` gains 15 new entries and extends 3 existing ones (`debugger.md`, `development-rules.md`, `tdd/SKILL.md`) with this release's digest — 32 entries total. The refresh must land **before** the coherence gate, or deleting a `SKILL.md` out from under prose that still names it leaves the install worse than not touching either.

Verified against a real install rather than by reading the tables: 24 files planted at their release digests → 20 docs refreshed, 24 removed, 5 directories cleaned. (20, not 16 — four of the refreshed docs are `STALE` from the earlier worktree and verification retirements, which the same pass picks up.)

### Overlap audit (2026-07-31)

- **`programmatic-seo` skill removed** — confirmed duplicate of `seo-programmatic` (see §4f). Kept the claude-seo import (designated SEO backbone, superset content). Cross-links updated: `/mk:seo` programmatic action now lists only `seo-programmatic`; `skills/marketing/README.md` curated-subset note updated (23→22 coreyhaines31 imports).

### Agent audit (2026-07-17)

- **`scout-external` agent removed** — Gemini/OpenCode CLI orchestration retired as part of the Gemini purge. `/ck:scout` is now internal-`Explore`-only (the `-ext` flag is gone). Gemini offload paths also stripped from the `research` skill, `/ck:research`, `git-manager` (Tool 2 always self-generates the commit message), and `/ck:use-mcp` (native MCP only). Gemini is retained only in `software/ai/` skills (`ai-multimodal`/`ai-artist`) where it provides a genuine capability (image generation, TTS, long-context video) with no Claude-native equivalent. Refs purged from `docs/*`, `README.md`, and the `debugger`/`docs-manager`/`code-reviewer` agents + `plan`/`review`/`port` commands.
- **`mcp-manager` agent removed** — its reason for existing (keep main context clean during MCP discovery) is obsolete: modern Claude Code defers MCP tool schemas (loaded on demand via tool search), and its Gemini-CLI fallback path referenced a non-existent `mcp-management` skill + `cli.ts` script (dead code). Verbose MCP result isolation, when needed, now uses a `general-purpose` subagent. `/ck:use-mcp` rewritten to call MCP tools natively. Refs purged from `kits/marketing.json`, `docs/{project-overview-pdr,system-architecture,codebase-summary}.md`.

### v2 cleanup (2026-05-16, earlier batch)

15 scaffolds deleted because they duplicated existing command+agent pairs. Replacement entry points:

> **Note (2026-05-16, later in day):** `ask` skill was **re-added** as an active knowledge skill (`software/ask/`) — distinct from this earlier scaffold-removal. Current pairing follows the canonical trio pattern: `ask` skill (4-persona consultation methodology + grounded-context protocol) + `/ask` command (trigger). No agent. See section 4b.

| Removed skill | Replacement |
|---|---|
| `ask` (scaffold) | `/ask` (now also paired with re-added `ask` skill — see note above) |
| `brainstorm` (scaffold) | `/brainstorm` + `brainstormer` (now also paired with re-added `brainstorm` skill — 2026-05-16) |
| `plan` | `/plan*` + `planner` |
| `scout` | `/scout*` + `scout`, `scout-external` |
| `journal` | `/journal` + `journal-writer` |
| `watzup` | `/watzup` |
| `test` | `/test` + `tester` |
| `fix` | `/fix*` |
| `docs` | `/docs:*` + `docs-manager` |
| `copywriting` | `/content:*` + `copywriter` |
| `security` | `/review` + `security-auditor` |
| `use-mcp` | `/use-mcp` + `mcp-manager` |
| `project-management` | `project-manager` agent |
| `team` | `team` skill + `/team` (parallel multi-session) — `/orchestrate` command + `orchestrator` agent both removed 2026-05-17, superseded by `team` |
| `loop` | built-in `/loop` skill |

### Scaffold-fill batch (2026-05-16, this batch)

10 scaffolds filled to active; 1 merged + deleted:

| Action | Skill | Notes |
|---|---|---|
| Merged | `predict` → `[[planning]]` | High overlap with planning; "Predictive planning" subsection added to `planning/SKILL.md` + `references/forecasting-outcomes.md`; `software/predict/` folder removed. |

### Skill removal (2026-05-30)

| Action | Skill | Notes |
|---|---|---|
| Deleted | `deploy` | `software/development/deploy/` removed — single-file, no references/, no paired command/agent. Platform selection content (Vercel/Render/Fly.io/etc.) is generic docs; `backend-devops.md` covers deployment strategies adequately. |

### Skill merge (2026-05-29)

| Action | Skill | Notes |
|---|---|---|
| Merged + deleted | `supabase-postgres-best-practices` → `supabase` | 42 files trimmed to 3 (only patterns Claude gets wrong). `security-rls-performance.md` ported to `supabase/references/`. 9 supabase refs deleted + 1 unlisted (`edge-functions-deno.md`). `supabase` SKILL.md rewritten v2.0.0. |
| Renamed | `vulnerability-scanner` → `security` | Disk path `software/security/SKILL.md` was already correct; registry entry name and path updated to match. |
| Removed from registry | `software/react-native/` (5 entries) | `github`, `github-actions`, `react-native-best-practices`, `react-native-brownfield-migration`, `upgrading-react-native` — no SKILL.md files on disk; ghost entries removed. |
| Deleted | `mobile-development` | `software/development/mobile-development/` folder removed (SKILL.md + references/ + rules/). 2026-05-29 per user direction. |
| Replaced | `react-best-practices` → `react-specialist` | Vercel 70-rule reference lib (SKILL.md + 70+ rule files) replaced by VoltAgent senior React 18+ specialist agent definition (single SKILL.md). 2026-05-30 per user direction. |

### Skill swap (2026-05-30)

| Action | Skill | Notes |
|---|---|---|
| Added | `nextjs-developer` | `software/development/nextjs-developer/` — Next.js 14+ agent persona adapted as knowledge skill. 4 Next.js refs migrated from `web-frameworks`. Sourced from VoltAgent/awesome-claude-code-subagents. |
| Removed | `web-frameworks` | `software/development/web-frameworks/` deleted. Next.js refs (4) migrated to `nextjs-developer/references/`. Turborepo (3 refs), RemixIcon (1 ref), scripts (`nextjs_init.py`, `turborepo_migrate.py`) dropped per user direction. |

### Agent removal (2026-05-17)

| Action | Agent | Notes |
|---|---|---|
| Removed | `seo-specialist` | `marketing/` folder emptied + removed. `/seo audit`, `/seo keywords`, `/seo schema` commands now run directly with `seo` skill + references (no dedicated agent). Frontmatter had non-standard fields (`mode`, `temperature`, `skills`) — legacy from OpenCode/agentgateway. |

### Agent removal (2026-07-16)

| Action | Agent | Notes |
|---|---|---|
| Relocated | `copywriter` | Moved `engineering/copywriter.md` → `marketing/copywriter.md` — marketing persona misplaced in engineer kit. Engineer kit (dir-include) no longer ships it; marketing kit gets it via `agents/marketing/` dir instead of `requires.shared` (manifest entry dropped). `cro-framework.md` note updated; `/mk:cro` "copywriter skill" misnomer fixed → `copywriting` skill. |
| Removed | `ui-ux-designer` | Heaviest agent file (18KB); design methodology already lives in the 10 design skills (`aesthetic`, `frontend-design`, `ui-ux-pro-max`, …). All routing rerouted to `frontend-developer` + design skills: `/ck:design`, `/ck:fix ui`, `/ck:cook` Implement stage, `/ck:bootstrap` fast mode, `fix-pipeline`. Style Intelligence reference now points to `ui-ux-pro-max` skill. Stale `imagemagick` skill refs (skill deleted with `media-processing` at `715e5d5`) purged from `cook`, `design`, `fix`, `review`, `development-rules` — image gen/edit routes through `ai-multimodal`. |

---

## 6 · Summary Counts

| Pool | Active | Scaffold | Total |
|---|---:|---:|---:|
| Skills · `marketing/` | 50 | 0 | 50 |
| Skills · `automation/` | 6 | 0 | 6 |
| Skills · `software/` | 68 | 0 | 68 |
| Skills · `integrations/` | 2 | 0 | 2 |
| Skills · removed (v2.0.0: old `geo`, old `seo/references`; 2026-07-31: `programmatic-seo`; 2026-08-11: `obsidian`; 2026-08-21: `docs-seeker`, `cti-expert`, `web-testing`) | — | — | — |
| **Skills total** | **126** | **0** | **126** |
| Agents · `engineering/` | 18 | 0 | 18 |
| Agents · `marketing/` | 12 | 0 | 12 |
| **Agents total** | **30** | **0** | **30** |
| Commands (logical, per § 3 row scheme) | 57 | 0 | 57 |
| **Grand total entries** | | | **213** |

> **Counted from disk on 2026-08-21**, not carried forward:
> - `find skills -name SKILL.md | wc -l` → **126** (software 68 · marketing 50 · automation 6 · integrations 2)
> - `software/` 68 = **38** top-level (`-mindepth 2 -maxdepth 2`) + **30** subcategorized (`-mindepth 3`)
> - `ls .claude/agents/*/*.md | wc -l` → **30** (engineering 18 · marketing 12)
> - Command *files*: 26 `ck/` + 12 `mk/` = 38. The 57 above is the logical count per § 3's row scheme, where dispatcher sub-actions (`/ck:fix ci`, `/ck:plan two`) count separately.
>
> Four rows here had drifted before this pass: `global/` 1, `software/` 71, and the 130/215 totals — the `obsidian` removal updated the header and not this table. § 1's top-level heading said 40 against 39 on disk, which is now stated with its reconciliation instead of a bare number.

Adjacent inventories (not registry entries — hooks and scripts are itemised in **§ 9**): **15 workflows** (`.claude/workflows/*.md`, incl. `skill-activation.md`), **4 hooks**, **5 scripts**, **1 PR-body template** (`git/references/pr-body.md`), **6 behavioral eval scenarios** (`tests/behavior/scenarios/`).

## 7 · Open Issues

1. ~~**`web-testing` vs `test-automation`** scope overlap~~ — **CLOSED BY MERGE 2026-08-21**. The 2026-05-16 "resolution" was a documented boundary, not a removed overlap, and it reopened; see § 4d.
2. ~~**11 scaffolds** still need research-fill~~ — **RESOLVED 2026-05-16** (10 filled to active, `predict` merged into `planning`; see § 5).
3. ~~**`global/common/`** folder has utility files (no SKILL.md) — fine to keep but should NOT be counted as a skill.~~ — **RESOLVED 2026-08-21 by removal.** "Fine to keep" was the wrong call: no Python file had ever imported it, in any commit, and its documented import path could not resolve for any skill outside `skills/global/`. See § 5.
4. **Mobile deep-knowledge gap** — `software/expo/` removed 2026-05-16; `mobile-development` skill removed 2026-05-29. No dedicated mobile skill remains. Re-add if implementation guidance needed.
5. **`template-skill/SKILL.md`** is a 5-LOC placeholder (`# Insert instructions below`). Should be expanded into a real reference template for new skill authors.

## 8 · How to Use This Registry

- **Add a skill** → create `.claude/skills/<group>/[<subcat>/]<name>/SKILL.md` and add a row to section 1.
- **Add an agent** → create `.claude/agents/engineering/<name>.md` (engineer kit) or `.claude/agents/marketing/<name>.md` (marketing kit) and add a row to section 2.
- **Add a command** → create `.claude/commands/ck/[<ns>/]<name>.md` (always under `ck/` so it invokes as `/<name>` or `/<ns>:<name>`) and add a row to section 3.
- **Before adding** → search this file: if a row with the same name already exists in another pool, decide whether you're adding (a) knowledge/skill, (b) persona/agent, or (c) trigger/command. Avoid creating a fourth entry for the same concept.
- **On rename** → update both the SKILL/agent/command file frontmatter AND this registry in the same commit.

---

## 9 · Hooks & Scripts (adjacent inventory)

Not registry *entries* (they are neither skill, agent, nor command), but they are installed by the kit manifests and are load-bearing at runtime, so they are itemised here. **Every path below must appear in `.claude/kits/{engineer,both}.json` or it will not install** — the `hooks`, `scripts`, and `statusline` keys exist for exactly this.

### 9a · Hooks (`.claude/hooks/`) — 5

| Hook | Event · matcher | Role | Failure posture |
|---|---|---|---|
| `scout-block` | PreToolUse · `Bash` | Blocks *traversal* of heavy dirs (`node_modules`, `.git/`, `dist/`, `build/`, `__pycache__`). Exclusion contexts (`grep -v`, `--exclude-dir`, `-prune`, `!pattern`) pass — the substring-match false positive is fixed and pinned by regression tests | deny on unparseable input |
| `guard-destructive` | PreToolUse · `Bash` | Tier A denies irreversible loss (`stash -u`, `reset --hard`, `clean -f[dx]`, whole-tree checkout/restore, force-push sans lease, destructive SQL via a DB client, `npm ci` onto a `node_modules` symlink, `rm -rf` of a known worktree). Tier B denies over-broad staging (`add -A/./-u`, `commit -a[m]`, bare `stash`) **only when the claim registry proves a live foreign session owns a dirty file**. `CK_ALLOW_DESTRUCTIVE=1` overrides | Tier B **fails open**; unparseable payload allows |
| `file-claims` | PostToolUse · `Write\|Edit` | Per-**worktree** claim registry (`.claude/.ck-file-claims.jsonl`, git-ignored). Self-pruning on read (file clean in `git status` ⇒ claim moot; TTL `CK_CLAIM_TTL`, default 4h; compaction past ~2k lines). Consumed by `guard-destructive` Tier B and by `/ck:git cm` (`file-claims.cjs list`) so the session manifest is machine-derived, not recalled | always exits 0 |
| `branch-guard` | PreToolUse · `Bash` | Denies a git command that **moves HEAD** (`checkout -b`/`switch -c`/plain switch/detach) while the claim registry shows another live session sharing the working tree. `git branch <new>` is allowed with an advisory (creates a ref, moves no HEAD). `CK_AUTO_MODE=1` overrides — in the environment for a run, or as a prefix binding to one segment. Verdict + parsing are shared with the CLI (`.claude/scripts/ck/branch-guard.cjs` → `lib/branch-checks.cjs` + `lib/shell-parse.cjs`), so the hook, the CLI and the tests cannot drift | **fails open** three ways: unparseable payload, missing checks module, unreadable registry. Silent when it allows |
| `modularization-hook` | PostToolUse · `Write\|Edit` | Advisory LOC-threshold notice (200) suggesting file splits | advisory only |

`.sh` / `.ps1` siblings of `guard-destructive` are **thin delegates** to the `.js` — one implementation, no cross-language drift. (`scout-block` is the inverse: `.js` dispatches to the platform script.)

### 9b · Scripts (`.claude/scripts/ck/`) — 7

| Script | Purpose | Notes |
|---|---|---|
| `branch-guard` | Ask-first verdict on a git command that would move HEAD in a shared tree; exit 1 = refuse | The mechanical path is the `branch-guard` **hook** (§9a) — this CLI is for deciding *before* proposing a command. Logic in `lib/branch-checks.cjs` (verdict) + `lib/shell-parse.cjs` (finding the git invocation inside a Bash line: newline/`&` separators, launcher and global-option prefixes, `sh -c` wrappers with trailing text) |
| `plan-lint` | Turn the `planning` skill's self-review checklist into an exit code over a plan directory | logic in `lib/plan-checks.cjs` |
| `phase-brief` | Extract one phase's full text from a plan into a uniquely-named file, print the path | artifacts-as-files rule (dispatches carry paths, not pasted prose) |
| `review-package` | `git log --oneline` + `--stat` + `diff -U10` for BASE..HEAD into one file | never `HEAD~1` as BASE — that silently truncates a multi-commit phase |
| `run-workspace` | Resolve/create the per-plan artifact dir, print the path | — |
| `ci-review` | Headless `claude -p` review of a PR diff with a narrow grant; CRITICAL/HIGH/MEDIUM + `file:line` + a fix | wrapper: `.github/workflows/ck-review.yml.template` |
| `delivery-tail` | **Deterministic executor** for the project-declared post-PR tail (T6.1 step 5) — resolves `{{placeholders}}` on **both** sides of `done-when`, evaluates it, runs `run`, emits paste-ready payloads on failure. No LLM on this path (zero token cost, no unattended tool grant); `run: mcp <server> <tool>` is the opt-in agent path, granted `mcp__<server>__*` only. Split into `lib/tail-parse.cjs` (markdown → steps + substitution), `lib/tail-checks.cjs` (approval fingerprint + printed payloads), `lib/tail-runtime.cjs` (shell/MCP/ledger) — the risky half is parsing untrusted declared text | ClauKit declares **zero** steps; no `## Delivery tail` block ⇒ no-op, exit 0. Runs only an **approved** declaration (`--approve`; content-fingerprinted, so an edited tail re-arms the refusal) — `CLAUDE.md` is tracked, so a merged PR must not add steps that run unattended. Substituted values carrying shell metacharacters are refused. Fenced blocks and HTML comments are inert. `--dry-run` prints resolved commands without executing |

### 9c · Test harness

`npm test` → `node --test tests/` (Node ≥18 built-in, **zero new dependencies** — ClauKit is installed by other projects, so a test framework in `dependencies` would be a cost every consumer pays). 303 tests. Covers every hook, the `.claude/scripts/ck/` helpers, `delivery-tail`, and wraps the legacy shell suites so one command runs everything. A gate's **registration** is asserted too, not only its logic: `branch-guard` shipped once with a correct verdict and no entry in `settings.json`, so `tests/branch-guard.test.js` now pipes a real hook payload end-to-end and reads the settings file. Behavioral gates that cannot be verified by reading a diff live in `tests/behavior/scenarios/` (6 scenarios, each required to fail when its gate is removed).
