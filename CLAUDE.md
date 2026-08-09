# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Role & Responsibilities

Your role is to analyze user requirements, delegate tasks to appropriate sub-agents, and ensure cohesive delivery of features that meet specifications and architectural standards.

## Workflows

- Primary workflow: `./.claude/workflows/primary-workflow.md`
- **Skill activation (hard gate — read before any response or action):** `./.claude/workflows/skill-activation.md`
- Development rules: `./.claude/workflows/development-rules.md`
- Orchestration protocols: `./.claude/workflows/orchestration-protocol.md`
- Documentation management: `./.claude/workflows/documentation-management.md`
- And other workflows: `./.claude/workflows/*`

## Kits

ClauKit supports multiple installable kits via `ck init --kit <name>`:
- **`engineer`** (default) — software engineering, `/ck:` namespace
- **`marketing`** — marketing automation, `/mk:` namespace. See `skills/marketing/README.md`
- **`both`** — engineer + marketing combined

Kit manifests: `.claude/kits/*.json`. Adding a new kit = drop a JSON file, no CLI changes.

**Marketing kit details:** When user requests marketing work, activate the marketing kit skills/agents/commands. See `skills/marketing/README.md` for full kit overview, command list, and workflow index. Marketing kit docs: `docs/marketing-kit/` (QA + implementation reports). Marketing-context hub: `plans/marketing-context.md` (required by all `/mk:` commands — hard fail if absent).

**Claude-SEO engine:** The marketing kit's SEO backbone is `AgriciDaniel/claude-seo` (25 sub-skills + 18 agents, runs in parallel, 3-layer architecture: directive → orchestration → execution). All `/mk:seo*` commands route through this engine. See Phase 6 "Claude-SEO Workflow" section in the marketing-kit plan for usage patterns.

**Integrations:** `skills/integrations/` (marketing + both kits) — `wordpress-rest` client + `mcp-wordpress` wrapper. WordPress publish via `/mk:content publish` (draft-default, idempotent, env-only creds: `WP_SITE_URL`/`WP_USER`/`WP_APP_PASSWORD`), WordPress audit via `/mk:seo audit wp:<id>` (read-only). See `skills/integrations/wordpress-rest/SKILL.md`.

**IMPORTANT:** Analyze the skills catalog and activate the skills that are needed for the task during the process. The **single source of truth** for all skills, agents, and commands (with status + duplicate detection) is `./docs/clauKit-registry.md` — read it whenever you need to know what is available, before suggesting to create a new skill/agent/command (avoid duplicates), or when activating skills for a task.
**IMPORTANT:** You must follow strictly the development rules in `./.claude/workflows/development-rules.md` file.
**IMPORTANT:** For task context read `./docs/codebase-summary.md` + `./docs/system-architecture.md` — **not** `./README.md`. README is ~47k chars (~12k tokens) and, once read, stays resident and is re-sent on every later turn of the run. Load it **only** when the task changes documentation or the installer/CLI surface it documents.
**IMPORTANT:** Sacrifice grammar for the sake of concision when writing reports.
**IMPORTANT:** In reports, list any unresolved questions at the end, if any.
**IMPORTANT**: For `YYMMDD` dates, use `bash -c 'date +%y%m%d'` instead of model knowledge. Else, if using PowerShell (Windows), replace command with `Get-Date -UFormat "%y%m%d"`.

## Documentation Management

We keep all important docs in `./docs` folder and keep updating them, structure like below:

```
./docs
├── project-overview-pdr.md
├── code-standards.md
├── codebase-summary.md
├── clauKit-registry.md       # ⭐ Skills + Agents + Commands single source of truth
├── design-guidelines.md
├── deployment-guide.md
├── system-architecture.md
└── project-roadmap.md
```

**IMPORTANT:** *MUST READ* and *MUST COMPLY* all *INSTRUCTIONS* in project `./CLAUDE.md`, especially *WORKFLOWS* section is *CRITICALLY IMPORTANT*, this rule is *MANDATORY. NON-NEGOTIABLE. NO EXCEPTIONS. MUST REMEMBER AT ALL TIMES!!!*