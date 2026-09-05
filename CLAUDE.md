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

KitForge supports multiple installable kits via `ck init --kit <name>`:
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

## Repo layout ≠ installed layout (doc links)

`.claude/skills` is a **symlink** to `./skills` in this repo, but `ck init` copies it as a **real directory** into the target project (`bin/ck.js` — source may de-symlink, destination keeps the manifest path). So a path that resolves here can resolve nowhere there.

**An install writes nothing outside `.claude/`** — every path in every kit manifest is `.claude/`-prefixed, so a root-level `skills/` does not exist in a consuming project (helpers moved too: root `scripts/ck/` → `.claude/scripts/ck/`). A shipped doc must never point at one.

Rules for markdown links in shipped files (`.claude/agents/**`, `.claude/commands/**`, `skills/**`):

- **A link target is relative to the file containing it**, never to the repo root. `](.claude/skills/x/SKILL.md)` inside `.claude/commands/ck/ask.md` resolves to `.claude/commands/ck/.claude/skills/…` — broken in the repo *and* in every install. It only looks right when a human resolves it from the root by eye.
- **Write the target relative, keep the display text canonical:** `[.claude/skills/software/git/SKILL.md](../../skills/software/git/SKILL.md)`. Reader sees the installed path; the link actually resolves.
- Count `../` from the **installed** position: agents at `.claude/agents/<group>/` → `../../skills/…`; commands at `.claude/commands/<ns>/` → `../../skills/…`; skills at `.claude/skills/<domain>/<name>/` → `../../../commands/…`.

Guarded by `tests/installer-packaging.test.js` → *"no shipped doc links to a file the install does not have"*: installs all three kits and checks every relative `.md` target. It caught 38. **Do not narrow that regex back to `^\.\.?/`** — that exemption is exactly what hid them.

## A grouped skill is NOT a registered skill — say "Read", never "Activate"

**Measured 2026-09-05, Claude Code 2.1.261.** Skill discovery reads `.claude/skills/<name>/SKILL.md`
and **exactly that depth**. Two probe skills with identical frontmatter, differing only in depth:

| installed path | registered? |
|---|---|
| `.claude/skills/<name>/SKILL.md` | ✅ invocable as `Skill(skill: "<name>")` |
| `.claude/skills/<group>/<name>/SKILL.md` | ❌ `Unknown skill: <name>` |
| `.claude/skills/<group>/<sub>/<name>/SKILL.md` | ❌ invisible |

The second control used a brand-new group directory, so the cause is **depth**, not a group name.

**This kit groups its 132 skills on purpose** (`skills/software/…`, `skills/marketing/…`) — the tree is
a **reference library reached by path**, not a set of registered skills. That is a deliberate trade:
flattening would register all 132 and load 132 descriptions into every session, and 121 of them have
no `ck:` command because they were never meant to be entry points. The **commands** are the invocation
surface; the skill files are the methodology those commands read.

**So the prose must match the model:**

- ✅ `**Read the \`planning\` skill file** ([.claude/skills/software/planning/SKILL.md](…))`
- ❌ `**Activate the \`planning\` skill** (…)` — names a call that returns `Unknown skill`. An agent
  that takes it literally burns a failed tool call; one that does not is relying on the link being
  next to it.

A subagent with a closed `tools:` list has no `Skill` tool at all, so for those the read is the *only*
path — see `.claude/rules/agent-wiring-rules.md`.

🔴 **Never claim a skill is registered without checking.** One call settles it:
`Skill(skill: "<name>")` in a fresh session, or `claude -p 'list available skills starting with <x>'`.
A `SKILL.md` sitting at a plausible path is not evidence.

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