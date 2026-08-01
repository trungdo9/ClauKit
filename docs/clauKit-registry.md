# ClauKit Registry

**Last Updated**: 2026-08-01 (**Workflow verification sweep** — full audit of all 15 `.claude/workflows/*` files against filesystem + registry + kit manifests. Fixed: stale "21 agents" → 29 across 10 files (`orchestration-protocol.md`, `dynamic-workflow` skill + its 2 references, `/ck:flow`/`/ck:team`/`/ck:find` (find.md also skills 74→131, commands 60→56), README, `system-architecture.md`, 2 registry entries); `seo-workflow.md` Phase 5 skill `email-campaign` → `emails` (no skill ever existed under that name); `cro-framework.md` added to marketing kit manifest (was engineer+both only, yet `/mk:cro`, `cro` skill, marketing-rules §4 and marketing-workflow Phase 6 hard-require it — marketing kit workflows 8→9); `fix-pipeline.md` tdd link `../../skills/` → `../skills/` (root-relative form breaks in installed projects — installer ships skills only at `.claude/skills/`); agent-vs-skill labels fixed in `sales-workflow.md`/`video-workflow.md`/`skill-activation.md`; `CHANGELOG.md` backfilled v1.0.2→v1.3.6 + `changelogTitle` added to `.releaserc.json` (changelog plugin configured post-v1.3.6, file had never been generated). Counts unchanged: 131 skills · 29 agents · 56 commands · 15 workflows.)

**Prior**: 2026-07-31 (**Durability–Evidence–Cost upgrade** (plan `260730-1359-clauKit-upgrade`) — 3 new skills (`run-state` durable ledger · `verify-plan` falsification gate · `tdd` red-green discipline), 2 new hooks (`guard-destructive` 2-tier conflict-aware guard · `file-claims` per-worktree claim registry; `scout-block` rewritten precise, single implementation), 8 new `scripts/ck/` (worktree fleet `wt-new`/`wt-doctor`/`wt-clean` w/ smoke gate · context hygiene `phase-brief`/`review-package`/`run-workspace` · headless `ci-review` + deterministic `delivery-tail`), 1 new workflow (`skill-activation.md` hard gate), `primary-workflow.md` rewritten to 13 gated stages (Exact-Requirements Gate surfaced — closes G25), `/ck:git` gains `finish` + scoped-commit + draft-default PR + declared delivery tail (empty default) + `pr-body.md` fill contract, `/ck:plan verify`, `/ck:fix tdd`, `/ck:review --lenses`, multi-repo `/ck:scout`, model-tiering matrix + 529 fallback, DB safe-writes protocol, node:test harness (`npm test`, 180 tests) + behavioral eval harness (`tests/behavior/`, 6 scenarios). **Removed:** `programmatic-seo` (duplicate of `seo-programmatic`); `preview` narrowed to presentations-only (render-markdown → `markdown-novel-viewer`). Counts: skills 129→131, agents 29, commands 53→56, workflows 14→15, total entries 211→216.) · 2026-07-31 (**`/ck:claude-md analyze` added** — read-only per-section token-cost profile of a CLAUDE.md (lines/chars/~tokens per `##` section, classify DIRECTIVE/POINTER/PROSE/DUP/FILLER, ranked KEEP/EXTRACT/DEDUPE/DROP recommendations + projected savings); alias `optimize` = analyze + offer `refactor`; `claude-md` dispatcher 3→4 actions. Counts: commands 52→53, total entries 210→211.) · 2026-07-25 (**SEO campaign workflow closed** — new `.claude/workflows/seo-workflow.md` (7-phase closed loop: gate → baseline audit+metrics → plan [hard stop] → batch write → publish [draft-default] → distribute → measure [GSC/GA4, 2–4 wk bake] → optimize scale/refresh/kill loop). `/mk:seo` gains `campaign` action; `seo-writer` agent + `seo-writing` skill gain `campaign` mode; `seo-flow` gains SEO Campaign recipe; wired into marketing/both kit manifests (workflows 5→6) + `marketing-workflow.md` Phase 5 delegation + MARKETING.md Flow 3c.) · 2026-07-23 (**seo-writing pipeline added** — new ClauKit-authored `seo-writing` skill (6-stage article-production pipeline ported from a production n8n workflow: strategy → outline → write → optimize → media → publish; 7 references + 100-article WordPress playbook), new `seo-writer` orchestrator agent, `/mk:seo` gains `plan` + `write` actions. 6 previously-stub SEO skills filled with real content; agents upgraded pipeline-stage-specific. Counts: skills 128→129, agents 28→29.) · 2026-07-17 (**Gemini purge** — `scout-external` agent removed (Gemini/OpenCode CLI orchestration retired; `/ck:scout` is now internal-Explore-only), Gemini offload paths stripped from `research` skill + `/ck:research` + `git-manager` + `/ck:use-mcp` (all now Claude-native). Gemini retained only in `software/ai/` skills (`ai-multimodal`/`ai-artist`) where it is a genuine capability. Earlier same-day: `mcp-manager` agent removed; `researcher` → sonnet, `journal-writer` → haiku; `tester`/`database-admin`/`project-manager` slimmed to thin personas; long agent descriptions trimmed to trigger-style.)
**Scope**: Single source of truth for every Skill, Agent, and Command in this project.
**Counts**: 131 skills (131 active + 0 scaffold) · 29 agents · 56 commands · **216 total entries**

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

## 1 · Skills (131)

### Global (1) — `.claude/skills/global/`

| Name | Status | Path | Notes |
|---|:---:|---|---|
| `docs-seeker` | ✅ | `global/docs-seeker/SKILL.md` | |

> Note: `global/common/` does NOT contain a SKILL.md (only `README.md` + `api_key_helper.py`). It is a shared utility folder, not a skill. Earlier catalog listed it incorrectly — removed.

### Marketing (50) — `.claude/skills/marketing/`

**Claude-SEO engine (25 — imported from `AgriciDaniel/claude-seo`, replaces old `seo`/`geo`) + 1 ClauKit-authored pipeline (`seo-writing`):**

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

| Name | Status | Folder | Notes |
|---|:---:|---|---|
| `ad-creative` | ✅ | `marketing/ad-creative/` | |
| `ads` | ✅ | `marketing/ads/` | |
| `analytics` | ✅ | `marketing/analytics/` | |
| `cold-email` | ✅ | `marketing/cold-email/` | |
| `competitor-alternatives` | ✅ | `marketing/competitor-alternatives/` | |
| `competitor-profiling` | ✅ | `marketing/competitor-profiling/` | |
| `competitors` | ✅ | `marketing/competitors/` | |
| `content-strategy` | ✅ | `marketing/content-strategy/` | |
| `copy-editing` | ✅ | `marketing/copy-editing/` | |
| `copywriting` | ✅ | `marketing/copywriting/` | |
| `cro` | ✅ | `marketing/cro/` | |
| `customer-research` | ✅ | `marketing/customer-research/` | |
| `email-sequence` | ✅ | `marketing/email-sequence/` | |
| `emails` | ✅ | `marketing/emails/` | |
| `launch` | ✅ | `marketing/launch/` | |
| `marketing-ideas` | ✅ | `marketing/marketing-ideas/` | |
| `paywalls` | ✅ | `marketing/paywalls/` | |
| `popup` | ✅ | `marketing/popup/` | |
| `signup` | ✅ | `marketing/signup/` | |
| `sms` | ✅ | `marketing/sms/` | |
| `social-content` | ✅ | `marketing/social-content/` | |
| `user-onboarding` | ✅ | `marketing/user-onboarding/` | renamed from `onboarding` |

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

### Software · Top-level standalone (42)

All 40 are active (`dynamic-workflow` added 2026-06-03, paired with `/ck:flow`; baseline 39 active as of 2026-05-30) (10 scaffolds filled in earlier batch; `predict` merged into `planning` and removed — see section 5; `chrome-devtools` added 2026-05-16; `ask` re-added 2026-05-16 as knowledge skill complementing the `/ask` command; `brainstorm` re-added 2026-05-16 as knowledge skill complementing the `/brainstorm` command + `brainstormer` agent; `node-specialist` added 2026-05-29 sourced from VoltAgent/awesome-claude-code-subagents). `nextjs-developer` added 2026-05-30 sourced from VoltAgent/awesome-claude-code-subagents; `web-frameworks` removed (Next.js refs migrated, turborepo/remix-icon dropped). `typescript-pro` added 2026-05-30 sourced from VoltAgent/awesome-claude-code-subagents (subcategorized under `software/development/`).

| Name | Status | Folder | Scope |
|---|:---:|---|---|
| `agent-browser` | ✅ | `software/agent-browser/` | Token-efficient snapshot+refs browser automation for AI agents |
| `ask` 🔁 | ✅ | `software/ask/` | Technical/architectural consultation methodology — 4 advisor personas, grounded-context protocol, synthesis |
| `chrome-devtools` | ✅ | `software/chrome-devtools/` | Puppeteer CLI scripts with persistent sessions + JSON output |
| `agentize` | ✅ | `software/agentize/` | Convert codebase to CLI + MCP server for AI agents |
| `brainstorm` 🔁 | ✅ | `software/brainstorm/` | Architecture/solution advisory methodology — 5 pillars, 7-phase process, YAGNI/KISS/DRY, brutally-honest alternatives debate |
| `ck-graphify` | ✅ | `software/ck-graphify/` | AST → queryable code graph (syntactic) |
| `claude-md` 🔁 | ✅ | `software/claude-md/` | CLAUDE.md lifecycle — init (from ground truth, no phantom commands) · verify (9-point audit, Critical/High/Medium/Low) · analyze (per-section token-cost profile → ranked optimization plan; alias `optimize`) · refactor (behavior-preserving slim-down, directive inventory 1:1); paired with `/ck:claude-md`, added 2026-07-17, analyze added 2026-07-31 |
| `code-review` 🔁 | ✅ | `software/code-review/` | 4 practices — pre-review edge-case scout, receiving feedback (no performative agreement), requesting code-reviewer subagent, verification gates (evidence before claims) |
| `coding-level` | ✅ | `software/coding-level/` | Developer proficiency (0-5) → output tuning |
| `context-engineering` | ✅ | `software/context-engineering/` | Curate token flow into AI agents (6-layer model) |
| `cook` 🔁 | ✅ | `software/cook/` | Feature lifecycle pipeline with gates — methodology source for `/cook` command; includes Stage 0 Exact-Requirements Gate (5-item hard-block before planning) |
| `csharp-developer` | ✅ | `software/development/csharp-developer/` | ASP.NET Core, Blazor, EF Core, cloud-native .NET — sourced from VoltAgent/awesome-claude-code-subagents |
| `node-specialist` | ✅ | `software/development/node-specialist/` | Node.js backend — event loop, async patterns, streams, Express/Fastify/NestJS, performance profiling, security — sourced from VoltAgent/awesome-claude-code-subagents |
| `cti-expert` | ✅ | `software/cti-expert/` | |
| `debugging` 🔁 | ✅ | `software/debugging/` | |
| `dynamic-workflow` 🔁 | ✅ | `software/dynamic-workflow/` | Controllable re-creation of the dynamic-workflow model — fan-out/pipeline over the 29 agents, 4-axis inheritance, gated + cost-previewed; paired with `/ck:flow` (re-creates patterns, never native ultracode) |
| `find-skills` | ✅ | `software/find-skills/` | |
| `gkg` | ✅ | `software/gkg/` | Text → semantic knowledge graph (NLP) |
| `markdown-novel-viewer` | ✅ | `software/markdown-novel-viewer/` | |
| `mintlify` | ✅ | `software/mintlify/` | |
| `obsidian` | ✅ | `software/obsidian/` | Obsidian vault authoring — wikilinks/embeds/callouts/block refs, typed YAML frontmatter (merge-never-overwrite), link-integrity on rename/move, optional live-vault MCP (Local REST API ≥ 4.1.3, CVE-gated); 4 lazy-loaded references; knowledge-only (no agent/command), registered 2026-07-17 |
| `payment-integration` | ✅ | `software/payment-integration/` | |
| `refactor` 🔁 | ✅ | `software/refactor/` | Large mechanical refactor (rename · extract · migrate · codemod) — 7-phase pipeline w/ atomic commits + rollback; paired with `/ck:refactor` |
| `planning` 🔁 | ✅ | `software/planning/` | Now includes "Predictive planning" subsection (merged from removed `predict` scaffold) |
| `plans-kanban` | ✅ | `software/plans-kanban/` | Kanban methodology applied to plans/ folder |
| `preview` ❗ | ✅ | `software/preview/` | Presentations only (Marp/reveal.js/Quarto) — scope narrowed 2026-07-31; render-markdown half lives in `markdown-novel-viewer` |
| `problem-solving` | ✅ | `software/problem-solving/` | |
| `project-organization` | ✅ | `software/project-organization/` | Repo layout / monorepo / naming patterns |
| `research` 🔁 | ✅ | `software/research/` | |
| `retro` | ✅ | `software/retro/` | Team retrospective facilitation |
| `run-state` | ✅ | `software/run-state/` | **Durable per-plan ledger** (`plans/<plan>/STATE.md`) — append-only gate events, resume protocol (re-derive from git + gate re-runs), parallel-session safety. Scope vs `plans-kanban` (plan board/status views) and `project-organization` (repo layout): run-state records *execution* events of one run, not plan management. Added 2026-07-31 |
| `scenario` | ✅ | `software/scenario/` | Test scenario design (tool-agnostic) |
| `sequential-thinking` | ✅ | `software/sequential-thinking/` | |
| `tdd` ❗ | ✅ | `software/tdd/` | **Red-green discipline** — Iron Law (no production code without a failing test first), base-commit-worktree baseline (never `git stash`), rationalization table. Deliberate scope split: `tdd` = discipline · `test-automation` = infra · `web-testing` = browser toolkit · `scenario` = case derivation. Paired with `/ck:fix tdd`. Added 2026-07-31 |
| `verify-plan` | ✅ | `software/verify-plan/` | **Plan falsification gate** — claim → verdict (CONFIRMED/REFUTED/UNVERIFIABLE) → evidence table; mandatory for `--from-plan` (cook Stage 0.5); paired with `/ck:plan verify`. Added 2026-07-31 |
| `team` 🔁 | ✅ | `software/team/` | Parallel multi-session orchestration — spawns independent Claude Code teammates (templates: research/cook/review/debug); paired with `/team` command |
| `show-off` | ✅ | `software/show-off/` | |
| `tech-graph` | ✅ | `software/tech-graph/` | |
| `template-skill` | ✅ | `software/template-skill/` | (still a 5-LOC stub — see open issue) |
| `security` 🔁 | ✅ | `software/security/` | Renamed from `vulnerability-scanner` 2026-05-29 — path updated to match `software/security/SKILL.md` on disk |
| `web-testing` | ✅ | `software/web-testing/` (developer toolkit; Playwright deep-dive lives in `test-automation`) | |
| `port` 🔁 | ✅ | `software/port/` (port & refactor from GitHub) | |

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

#### `software/git/` (2) 🔁

| Name | Status | Path |
|---|:---:|---|
| `git` | ✅ | `software/git/SKILL.md` |
| `worktree` | ✅ | `software/git/worktree/SKILL.md` |

#### `software/infrastructure/` (1)

| Name | Status | Folder | Scope |
|---|:---:|---|---|
| `docker-expert` | ✅ | `infrastructure/docker-expert/` | Production Docker: multi-stage builds, image optimization, security hardening, supply chain security — sourced from VoltAgent/awesome-claude-code-subagents |

---

## 2 · Agents (29)

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

### `engineering/` (17) — engineer kit

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

---

## 3 · Commands (56)

All commands are ✅ active. Grouped by namespace. **Prefix `ck:` applied 2026-05-17** — every command lives under `.claude/commands/ck/`, invoked as `/ck:<name>` (e.g. `/ck:cook`, `/ck:fix ci`). **`/orchestrate` removed 2026-05-17** (superseded by `/ck:team`). **Flag-style variants applied 2026-05-17** — sibling variants of the same command (e.g. fast/hard/auto/good/ext) collapsed into flags rather than `:nested` namespace; namespaced commands now reserved for genuinely-distinct actions (e.g. `/ck:fix ci`, `/ck:plan two`).

### Top-level (20) — single-action + flagged-variant entrypoints

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
| `/ck:security [scope] [--en]` 🔁 | Security audit — OWASP 2025, 21 rules, SMALL/LARGE, bilingual |
| `/ck:team` 🔁 | Orchestrate parallel multi-session collaboration with independent Claude Code teammates (paired with `team` skill) |
| `/ck:test` 🔁 | Run tests locally, analyze report |
| `/ck:use-mcp` 🔁 | Utilize MCP server tools |
| `/ck:watzup` | Review recent changes, wrap up work |
| `/ck:port` 🔁 | Port & refactor feature from public GitHub repo |

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
| `/ck:fix tdd` | Production-symptom red-green loop (`tdd` skill): toolchain proof → red test w/ pasted failure → base-commit-worktree baseline → green → sweep. Distinct from `test` by input (symptom vs red suite) — both stay (R4) |
| `/ck:fix types` | Fix type errors |
| `/ck:fix ui` | Fix UI issues |

### `git` (dispatcher, 5) 🔁 git-manager

| Command | Description |
|---|---|
| `/ck:git cm` | **Scoped** commit — session manifest from the file-claims registry, foreign WIP reported never staged, explicit paths only (never `-A`) |
| `/ck:git cp` | Scoped commit + push |
| `/ck:git pr [to] [from] [--no-handoff] [--ready]` | Finish the branch: verify green → self-review scoped diff → **draft-default** PR (`pr-body.md` fill contract) → project-declared delivery tail (ships empty) → worktree teardown; auth failure ⇒ paste-ready payload, zero retries |
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
| `/ck:review [--flow] [--lenses]` | Scan + analyze codebase — `--flow`: orchestrated dimension fan-out (bugs/security/perf) → adversarial-verify per finding → confirmed-only report · `--lenses` (opt-in, risk-gated): 4 concurrent lenses (ADVERSARY/FIDELITY/BLAST-RADIUS/CONVENTION), falsifier never sees implementer reasoning, evidence-or-discard |

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

Other trios (`testing` → covered by `web-testing`/`chrome-devtools`, `design` → `frontend-design`, `mcp` → `use-mcp`, `database` → `databases`, `seo`, `security`, `orchestrate`, `code`, `watchup`) may follow this pattern in future passes.

| Concept | Skill | Agent | Command |
|---|---|---|---|
| Planning | `planning` | `planner` | `/ck:plan` |
| Research / Scout | `research` | `researcher`, `scout` | `/ck:research`, `/ck:scout` |
| Code review | `code-review` | `code-reviewer` | `/ck:review` |
| Debugging | `debugging` | `debugger` | `/ck:debug` |
| Testing | `web-testing` (developer toolkit), `test-automation` (QA/automation engineering) | `tester` | `/ck:test`, `/ck:fix test` |
| Docs | `mintlify`, `markdown-novel-viewer`, `obsidian`, `tech-graph`, `document-skills/*` | `docs-manager` | `/ck:docs [init\|update\|summarize]` |
| CLAUDE.md lifecycle | `claude-md` | `docs-manager` (reused — no new agent) | `/ck:claude-md [init\|verify\|analyze\|refactor]` |
| Design | 10 design skills | `frontend-developer` (agent `ui-ux-designer` removed 2026-07-16) | `/ck:design` |
| Content | `show-off` | `copywriter` (marketing kit) | – (marketing kit: `/mk:content`) |
| SEO/GEO | `seo`, `geo` | – (agent removed 2026-05-17) | – (marketing kit: `/mk:seo`) |
| Git | `git`, `worktree` | `git-manager` | `/ck:git [cm\|cp\|pr\|merge\|finish]` |
| Bootstrap | `bootstrap` (knowledge) | – | `/ck:bootstrap` |
| Port & Refactor | `port` | (uses `scout`, `code-reviewer`) | `/ck:port` |
| Security | `security`, `cti-expert` | `security-auditor` | `/ck:review`, `/ck:security` |
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
| Misc skills (knowledge only) | `preview`, `markdown-novel-viewer`, `mintlify`, `obsidian`, `tech-graph`, `cti-expert`, design subskills | – | – |
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
| `web-testing` ↔ `test-automation` | ~50% overlap on Playwright basics, page objects, wait strategies, CI/CD | **Clarified by audience**: `web-testing` = web-app developer toolkit (Vitest unit + Playwright overview + k6 load). `test-automation` = QA / automation engineer (Playwright deep-dive canonical, BDD/Cucumber, mobile Appium/Detox, API Supertest/Newman, credentials). Each SKILL.md now has a "Scope vs" section + cross-link. |

### 4e · Indirect overlaps (not flagged) — multiple knowledge skills feed one agent

- `frontend-developer` agent reads from 10 design skills for design work (inherited from removed `ui-ux-designer`) — by design, not a bug.
- `docs-manager` agent reads from 5+ doc skills — by design.
- Security: `security` (OWASP 2025 scanner + mindset) + `cti-expert` (threat intel) feed `security-auditor` — distinct scopes.

### 4f · Overlap audit 2026-07-31 (T5.5) — first real use of the ❗ marker

**Resolved duplicate:** `marketing/programmatic-seo` (coreyhaines31 import) vs `marketing/seo-programmatic` (claude-seo import) — same subject, two 50-line stubs. **Kept `seo-programmatic`** (claude-seo is the designated SEO backbone; it also carried the orchestrator parent link — a strict superset). `programmatic-seo` removed; cross-links updated in `/mk:seo` + `skills/marketing/README.md`.

**Resolved overlap:** `software/preview` vs `software/markdown-novel-viewer` — the render-markdown half was duplicated. `preview` narrowed to **presentations only** (flagged ❗ with scope note in §1); markdown viewing/serving is `markdown-novel-viewer`'s alone.

**Checked and NOT duplicates — recorded so this is not re-litigated:**
- `competitors` / `competitor-profiling` / `competitor-alternatives` — landscape vs single-competitor deep-dive vs comparison-page artifact
- `emails` / `email-sequence` / `cold-email` — distinct channel shapes
- `copywriting` / `copy-editing` — create vs refine
- `ck-graphify` / `gkg` / `tech-graph` — code-AST graph vs text knowledge graph vs SVG diagrams; the shared word "graph" is the only overlap
- `/ck:fix test` vs `/ck:fix tdd` — failing-suite input vs production-symptom input (R4)
- `run-state` vs `plans-kanban` / `project-organization` — run-execution ledger vs plan board vs repo layout (flagged in §1 scope notes)
- `tdd` vs `test-automation` / `web-testing` / `scenario` — discipline vs infra vs toolkit vs case derivation (flagged ❗ in §1)

---

## 5 · Removed (cumulative)

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
| Skills · `global/` | 1 | 0 | 1 |
| Skills · `marketing/` | 50 | 0 | 50 |
| Skills · `automation/` | 6 | 0 | 6 |
| Skills · `software/` | 72 | 0 | 72 |
| Skills · `integrations/` | 2 | 0 | 2 |
| Skills · removed (v2.0.0: old `geo`, old `seo/references`; 2026-07-31: `programmatic-seo`) | — | — | — |
| **Skills total** | **131** | **0** | **131** |
| Agents · `engineering/` | 17 | 0 | 17 |
| Agents · `marketing/` | 12 | 0 | 12 |
| **Agents total** | **29** | **0** | **29** |
| Commands (logical, per § 3 row scheme) | 56 | 0 | 56 |
| **Grand total entries** | | | **216** |

Adjacent inventories (not registry entries — hooks and scripts are itemised in **§ 9**): **15 workflows** (`.claude/workflows/*.md`, incl. `skill-activation.md`), **4 hooks**, **8 scripts**, **1 PR-body template** (`git/references/pr-body.md`), **6 behavioral eval scenarios** (`tests/behavior/scenarios/`).

## 7 · Open Issues

1. ~~**`web-testing` vs `test-automation`** scope overlap~~ — **RESOLVED 2026-05-16** (audience-based clarification; see § 4d).
2. ~~**11 scaffolds** still need research-fill~~ — **RESOLVED 2026-05-16** (10 filled to active, `predict` merged into `planning`; see § 5).
3. **`global/common/`** folder has utility files (no SKILL.md) — fine to keep but should NOT be counted as a skill.
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

### 9a · Hooks (`.claude/hooks/`) — 4

| Hook | Event · matcher | Role | Failure posture |
|---|---|---|---|
| `scout-block` | PreToolUse · `Bash` | Blocks *traversal* of heavy dirs (`node_modules`, `.git/`, `dist/`, `build/`, `__pycache__`). Exclusion contexts (`grep -v`, `--exclude-dir`, `-prune`, `!pattern`) pass — the substring-match false positive is fixed and pinned by regression tests | deny on unparseable input |
| `guard-destructive` | PreToolUse · `Bash` | Tier A denies irreversible loss (`stash -u`, `reset --hard`, `clean -f[dx]`, whole-tree checkout/restore, force-push sans lease, destructive SQL via a DB client, `npm ci` onto a `node_modules` symlink, `rm -rf` of a known worktree). Tier B denies over-broad staging (`add -A/./-u`, `commit -a[m]`, bare `stash`) **only when the claim registry proves a live foreign session owns a dirty file**. `CK_ALLOW_DESTRUCTIVE=1` overrides | Tier B **fails open**; unparseable payload allows |
| `file-claims` | PostToolUse · `Write\|Edit` | Per-**worktree** claim registry (`.claude/.ck-file-claims.jsonl`, git-ignored). Self-pruning on read (file clean in `git status` ⇒ claim moot; TTL `CK_CLAIM_TTL`, default 4h; compaction past ~2k lines). Consumed by `guard-destructive` Tier B and by `/ck:git cm` (`file-claims.cjs list`) so the session manifest is machine-derived, not recalled | always exits 0 |
| `modularization-hook` | PostToolUse · `Write\|Edit` | Advisory LOC-threshold notice (200) suggesting file splits | advisory only |

`.sh` / `.ps1` siblings of `guard-destructive` are **thin delegates** to the `.js` — one implementation, no cross-language drift. (`scout-block` is the inverse: `.js` dispatches to the platform script.)

### 9b · Scripts (`scripts/ck/`) — 8

| Script | Purpose | Notes |
|---|---|---|
| `wt-new` | Provision a worktree: **absolute path outside the repo root**, per-worktree install, then a **smoke gate** (typecheck + suite on the untouched base commit, cached by base SHA) | refuses to install when `node_modules` is a symlink (the exit-216 shape) |
| `wt-doctor` | Diagnose broken/circular symlinks, dependency version skew, missing dev server/token | non-zero exit = unhealthy; pipelines refuse to proceed |
| `wt-clean` | Safe teardown via `git worktree remove` + `prune`, reports reclaimed disk | validates the path against `git worktree list`; **never** `rm -rf`; refuses the main worktree |
| `phase-brief` | Extract one phase's full text from a plan into a uniquely-named file, print the path | artifacts-as-files rule (dispatches carry paths, not pasted prose) |
| `review-package` | `git log --oneline` + `--stat` + `diff -U10` for BASE..HEAD into one file | never `HEAD~1` as BASE — that silently truncates a multi-commit phase |
| `run-workspace` | Resolve/create the per-plan artifact dir, print the path | — |
| `ci-review` | Headless `claude -p` review of a PR diff with a narrow grant; CRITICAL/HIGH/MEDIUM + `file:line` + a fix | wrapper: `.github/workflows/ck-review.yml.template` |
| `delivery-tail` | **Deterministic executor** for the project-declared post-PR tail (T6.1 step 5) — resolves `{{placeholders}}`, evaluates `done-when`, runs `run`, emits paste-ready payloads on failure. No LLM on this path (zero token cost, no unattended tool grant); `run: mcp <server> <tool>` is the opt-in agent path, granted `mcp__<server>__*` only | ClauKit declares **zero** steps; no `## Delivery tail` block ⇒ no-op, exit 0. Runs only an **approved** declaration (`--approve`; content-fingerprinted, so an edited tail re-arms the refusal) — `CLAUDE.md` is tracked, so a merged PR must not add steps that run unattended. Substituted values carrying shell metacharacters are refused. Fenced blocks and HTML comments are inert. `--dry-run` prints resolved commands without executing |

### 9c · Test harness

`npm test` → `node --test tests/` (Node ≥18 built-in, **zero new dependencies** — ClauKit is installed by other projects, so a test framework in `dependencies` would be a cost every consumer pays). Covers both hooks, the worktree scripts, `delivery-tail`, and wraps the legacy shell suites so one command runs everything. Behavioral gates that cannot be verified by reading a diff live in `tests/behavior/scenarios/` (6 scenarios, each required to fail when its gate is removed).
