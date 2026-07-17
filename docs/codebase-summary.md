# Codebase Summary

**Last Updated**: 2026-07-16
**Version**: 1.3.6
**Repository**: https://github.com/trungdo9/ClauKit

## Overview

ClauKit is an opinionated multi-agent orchestration framework that runs inside Claude Code. It ships pre-configured agents, slash commands, skills, and gated workflows via `ck init` (installs `.claude/` into any project). Three installable kits: `engineer` (default, `/ck:` namespace), `marketing` (`/mk:` namespace), `both`.

## Project Structure

```
ClauKit/
├── .claude/                    # Claude Code configuration (what `ck init` copies)
│   ├── agents/
│   │   ├── engineering/        # 17 engineer-kit agent definitions
│   │   └── marketing/          # 11 marketing-kit agent definitions
│   ├── commands/
│   │   ├── ck/                 # 26 engineer-kit command files (/ck:<name>)
│   │   └── mk/                 # 12 marketing-kit command files (/mk:<name>)
│   ├── hooks/                  # Git hooks and scripts (scout-block.js dispatcher)
│   ├── kits/                   # Kit manifests (*.json) — engineer/marketing/both
│   ├── skills/                 # 128 SKILL.md files — see § Skills Library below
│   ├── workflows/              # Development workflow definitions (*.md)
│   ├── settings.json           # Claude Code settings
│   ├── metadata.json           # Installed-project metadata (kit, version)
│   ├── .env.example            # Environment template
│   ├── .mcp.json.example       # MCP configuration template
│   ├── statusline.sh/.ps1/.js  # Cross-platform statusline scripts
├── .opencode/                  # OpenCode CLI configuration (mirrors .claude/)
│   ├── agent/
│   └── command/
├── .github/workflows/          # CI/CD (semantic-release)
├── docs/                       # Project documentation (this file's home)
├── plans/                      # Implementation plans + `<plan>/reports/`
├── scripts/                    # Setup/utility scripts (postinstall, link-skills)
├── skills/marketing/README.md  # Marketing kit reference (skills/agents/commands)
├── CLAUDE.md                   # Project instructions for Claude
├── MARKETING.md                # Full marketing kit guide
├── README.md                   # Project overview
├── package.json                # `@trungdo9/ClauKit` npm package (bin: `ck`, `claukit`)
└── LICENSE                     # MIT License
```

## Core Technologies

### Runtime & Dependencies
- **Node.js**: >=18.0.0
- **Package Manager**: npm
- **License**: MIT
- **Package**: `@trungdo9/ClauKit` (CLI binaries `ck` / `claukit`)

### Development Dependencies
- `@commitlint/cli` + `@commitlint/config-conventional`
- `@semantic-release/*` (changelog, commit-analyzer, exec, git, github, npm, release-notes-generator)
- `conventional-changelog-conventionalcommits`
- `husky`, `semantic-release`

### Development Tools
- **Semantic Release**: Automated versioning and changelog
- **Commitlint**: Conventional commit enforcement
- **Husky**: Git hooks automation
- **Repomix**: Optional codebase compaction for AI consumption (`repomix-output.xml`, not committed)

### CI/CD
- **GitHub Actions**: Automated release workflow (`.github/workflows/release.yml`)
- **Semantic Versioning**: Automated version management via Conventional Commits

## Key Components

### 1. Agent Orchestration System

**Claude Code Agents** (`.claude/agents/` — 28 total, two folders, no `specialists/`, `operations/`, or `research/` subfolders):

| Folder | Count | Agents |
|--------|------:|--------|
| `engineering/` (engineer kit) | 17 | `backend-developer`, `brainstormer`, `code-reviewer`, `database-admin`, `debugger`, `docs-manager`, `frontend-developer`, `git-manager`, `integration-agent`, `journal-writer`, `performance-agent`, `planner`, `project-manager`, `researcher`, `scout`, `security-auditor`, `tester` |
| `marketing/` (marketing kit) | 11 | `campaign-manager`, `content-strategist`, `copywriter`, `crm-specialist`, `email-specialist`, `market-researcher`, `seo-content`, `seo-geo`, `seo-schema`, `seo-technical`, `video-producer` |

Notes:
- `ui-ux-designer` agent was **removed** (2026-07-16) — design work now routes to `frontend-developer` + design skills (`aesthetic`, `frontend-design`, `ui-ux-pro-max`).
- `copywriter` was **relocated** `engineering/` → `marketing/` (2026-07-16) — it's a marketing persona, not shipped with the engineer kit.
- No `csharp-expert` or `lovable-to-nextjs` agents exist (never did on disk, or were removed — verify against `docs/clauKit-registry.md` § 2 before citing any agent name).

**OpenCode Agents** (`.opencode/agent/`): mirrors the `.claude/agents/` definitions, optimized for OpenCode CLI.

### 2. Slash Commands System

**Command files**: 25 under `.claude/commands/ck/` (`/ck:<name>`) + 12 under `.claude/commands/mk/` (`/mk:<name>`) = 37 files. `docs/clauKit-registry.md` counts "commands" differently (dispatcher sub-actions like `/ck:fix ci` counted separately) — its header/§1/§3/§6 figures are now reconciled to **52** logical commands (= 208 total entries with 128 skills + 28 agents). The registry's § 3 tables remain the itemized source of truth.

| Namespace | Commands |
|-----------|----------|
| `/ck:` (engineer kit, 25 files) | `ask`, `bootstrap`, `brainstorm`, `claude-md`, `cook`, `debug`, `design`, `docs`, `find`, `fix`, `flow`, `git`, `journal`, `plan`, `port`, `refactor`, `research`, `review`, `scout`, `security`, `sepay`, `team`, `test`, `use-mcp`, `watzup` |
| `/mk:` (marketing kit, 12 files) | `ads`, `campaign`, `content`, `cro`, `email`, `growth`, `leads`, `nurture`, `plan`, `research`, `seo`, `video` |

Several `/ck:` commands are dispatchers with positional-arg variants (no dash), e.g. `/ck:fix [ci|logs|test|types|ui]`, `/ck:git [cm|cp|pr|merge]`, `/ck:plan [fast|hard|two|ci|cro]`, `/ck:docs [init|update|summarize]`. `/ck:fix` also takes combinable flags: `--auto --review --quick --parallel --flow`.

### 3. Skills Library

**Skills Organization** (`.claude/skills/` — 128 `SKILL.md` files across 5 top-level groups):

| Group | Count | Notes |
|-------|------:|-------|
| `global/` | 1 | `docs-seeker` |
| `marketing/` | 50 | 25 claude-seo engine skills + 23 coreyhaines31-sourced + 2 ClauKit-authored (`product-marketing`, `kit-builder`) |
| `automation/` | 6 | MCP wrappers: `marketing-orchestrator`, `mcp-ga4`, `mcp-gsc`, `mcp-sendgrid`, `mcp-resend`, `mcp-reviewweb` |
| `integrations/` | 2 | `wordpress-rest`, `mcp-wordpress` |
| `software/` | 69 | Top-level standalone (37) + subcategorized: `ai/` (3), `database/` (2), `design/` (9), `development/` (11), `document-skills/` (4), `git/` (2), `infrastructure/` (1) |

No `ffmpeg`, `shopify`, or `csharp-expert` skills exist. Image/video generation and editing route through the `ai-multimodal` skill (stale `imagemagick` references were purged 2026-07-16 along with the earlier-deleted `media-processing` skill). C#/.NET work is covered by the `csharp-developer` skill (`software/development/csharp-developer/`), not `csharp-expert`.

Single source of truth: **`docs/clauKit-registry.md`** (skills + agents + commands + duplicate detection). Skills auto-activate by description match; agents/commands cross-link to related skills.

### 4. Workflows

**Primary Workflows** (`.claude/workflows/`):

1. **primary-workflow.md** — Core development cycle (Plan → `/clear` → Cook → Test → Review)
2. **development-rules.md** — Development standards (file size, YAGNI/KISS/DRY, pre-commit rules)
3. **orchestration-protocol.md** — Agent coordination patterns (sequential/parallel/fan-out)
4. **documentation-management.md** — Documentation maintenance triggers and protocols
5. **cro-framework.md**, **fix-pipeline.md** — canonical pipelines referenced by `/ck:plan cro` and the `/ck:fix` family respectively

### 5. Hooks System

**Scout Block Hook** (`.claude/hooks/scout-block.js`):
- Cross-platform Node.js dispatcher (Windows/Unix/WSL auto-detection)
- Blocks heavy directories: `node_modules`, `__pycache__`, `.git/`, `dist/`, `build/`
- Improves AI agent response time and token efficiency

### 6. Statusline Scripts

Three implementations for cross-platform statusline:
- `statusline.sh` — Bash (Unix/Linux/WSL)
- `statusline.ps1` — PowerShell (Windows)
- `statusline.js` — Node.js (universal fallback)

## Entry Points

### For Users
- **README.md**: Project overview and quick start
- **CLAUDE.md**: Development instructions and workflows
- **MARKETING.md**: Marketing kit guide (if `--kit marketing`/`both`)

### For Developers
- **package.json**: Dependencies and scripts (`ck`/`claukit` bin)
- **.releaserc.json** / **.commitlintrc.json**: Release + commit-lint config

### For Agents
- **CLAUDE.md**: Primary agent instructions (delegates to `.claude/workflows/*`)
- **docs/clauKit-registry.md**: Skill/agent/command inventory (read before creating anything new)
- **plans/templates/**: Implementation plan templates

## Development Principles

### YAGNI (You Aren't Gonna Need It)
Avoid over-engineering and unnecessary features

### KISS (Keep It Simple, Stupid)
Prefer simple, straightforward solutions

### DRY (Don't Repeat Yourself)
Eliminate code duplication

### File Size Management
- Keep files under 200 lines for optimal context management
- Split large files into focused components
- Extract utilities into separate modules
- Exception: `README.md` (curated at ~768 lines per recent deliberate commits) — see Unresolved Questions

### Security First
- Try-catch error handling
- No secrets in commits
- Confidential info protection

## Agent Communication Protocol

**Report Format**: Markdown files in `./plans/<plan-name>/reports/`
**Naming Convention**: `YYMMDD-from-[agent]-to-[agent]-[task]-report.md`

**Communication Patterns**:
- Sequential: Task dependencies require ordered execution
- Parallel: Independent tasks run simultaneously
- Query Fan-Out: Multiple researchers explore different approaches
- Controlled fan-out/pipeline: `/ck:flow` decomposes a task into phases and routes each to an agent persona, gated + cost-previewed (does **not** use the native `ultracode` runtime)

## Git Workflow

**Commit Message Format**: Conventional Commits
```
type(scope): description
```

**Types**: `feat` (minor bump) · `fix` (patch) · `docs` (patch) · `refactor` (patch) · `test` (patch) · `ci` (patch) · `BREAKING CHANGE:` (major)

**Automated Release**: every push to `main` triggers semantic-release (version bump, changelog, GitHub release).

## Documentation Standards

**Canonical doc set** (`./docs/`):
- `project-overview-pdr.md` — Project overview and PDR
- `code-standards.md` — Coding standards and structure
- `codebase-summary.md` — This file
- `system-architecture.md` — Architecture documentation
- `project-roadmap.md` — Development roadmap
- `clauKit-registry.md` — Skills + agents + commands single source of truth
- `design-guidelines.md` [optional] — Design principles and guidelines
- `deployment-guide.md` [optional] — Deployment procedures

**Documentation Triggers**: feature implementation completion · new/removed skill-agent-command · bug fixes · security updates.

## File Statistics

Not regenerated this pass — no `repomix-output.xml` is committed to the repo (generated on demand by `/ck:docs update`, gitignored). Run `repomix` locally for current token/file counts rather than trusting stale numbers here.

**Verified counts** (via `ls`/`find` against the filesystem, 2026-07-17):
- Agent definitions: 28 (17 engineering + 11 marketing)
- Command files: 38 (26 `ck/` + 12 `mk/`)
- Skill files: 128 `SKILL.md`
- Workflow files: 5 (`primary-workflow.md`, `development-rules.md`, `orchestration-protocol.md`, `documentation-management.md`, plus `cro-framework.md`/`fix-pipeline.md` references)

## Integration Capabilities

### GitHub Actions
Workflow: `.github/workflows/release.yml`
Features: Automated releases, changelog generation

### MCP Servers
Configuration: `.claude/.mcp.json.example`
Kit-specific MCP wrappers live under `.claude/skills/automation/` (GA4, GSC, SendGrid, Resend, ReviewWeb) and `.claude/skills/integrations/` (WordPress).

## Critical Files

### Configuration
- `/package.json` — Node.js config (`@trungdo9/ClauKit`)
- `/.releaserc.json` — Release config
- `/.commitlintrc.json` — Commit linting
- `/.gitignore` — Git exclusions

### Documentation
- `/README.md` — Main project docs
- `/CLAUDE.md` — Agent instructions
- `/MARKETING.md` — Marketing kit guide
- `/CHANGELOG.md` — Version history (auto-generated by semantic-release)

### Workflows
- `/.claude/workflows/primary-workflow.md`
- `/.claude/workflows/development-rules.md`
- `/.claude/workflows/orchestration-protocol.md`
- `/.claude/workflows/documentation-management.md`

## Version History

**Current**: v1.3.6
**License**: MIT
**Repository**: https://github.com/trungdo9/ClauKit

## Unresolved Questions

1. `docs/clauKit-registry.md` command-count convention is internally inconsistent (header says 64, § 3 body sums to 52, § 6 Summary Counts says 72) — needs reconciliation in a future pass; this doc uses the literal file count (37) plus a pointer to that discrepancy instead of picking one.
2. `README.md` is 768 lines, exceeding the generic "<300 lines" guidance in `CLAUDE.md` — appears to be a deliberate choice from a recent commit ("docs: split marketing kit guide into MARKETING.md"). Flagging rather than enforcing; needs an explicit decision on whether the rule should carve out an exception for README.
