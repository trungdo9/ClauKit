# Project Roadmap

**Last Updated**: 2026-07-16
**Current Version**: 1.3.6
**Repository**: https://github.com/trungdo9/ClauKit

## Executive Summary

ClauKit is an opinionated multi-agent orchestration framework for Claude Code, distributed as the `@trungdo9/ClauKit` npm package. The project has completed its initial foundation phase and is advancing towards enhanced capabilities.

---

## Phase Overview

### Phase 1: Foundation (COMPLETE)
**Status**: Complete | **Version**: 1.0.1

Established core agent orchestration framework, slash command system, automated releases, and foundational skills library.

**Key Achievements**:
- Multi-agent orchestration system (19 agents)
- 65+ slash commands
- Semantic versioning and automated releases
- Comprehensive skills library
- Documentation system with repomix integration
- Scout Block Hook for cross-platform performance optimization
- Git workflows with conventional commits enforcement
- Cross-platform statusline support (Bash, PowerShell, Node.js)
- Post-install setup script with git clone fallback

---

### Phase 2: Enhancement (IN PROGRESS)
**Status**: Planned | **Target Start**: Q1 2026

Expanding platform support, improving developer experience, and adding additional capabilities.

**Planned Items**:
- Additional cloud platform skills (AWS, Azure)
- Enhanced UI/UX workflows
- Performance optimization phase 2
- Expanded debugging capabilities
- Additional integration commands

---

### Phase 3: Advanced Features (PLANNED)
**Status**: Future | **Target Start**: Q2 2026

Advanced enhancements for AI-assisted development capabilities.

**Planned Items**:
- Visual workflow builder concepts
- Enhanced agent collaboration features
- Analytics and insights integration
- Performance telemetry
- Team collaboration workflows

---

### Phase 4: Enterprise (FUTURE)
**Status**: Future | **Target Start**: Q4 2026

Enterprise-grade features and deployment options.

**Planned Items**:
- Self-hosted deployment options
- Advanced security features
- Compliance automation
- Custom enterprise integrations
- Dedicated support pathways

---

## Current Development Focus

### 0. Durability–Evidence–Cost upgrade — SHIPPED 2026-07-31 (plan `260730-1359-clauKit-upgrade`)
Closed the gap between documented behaviour and what 295 real sessions needed:
- **Durability**: `run-state` ledger (`plans/<plan>/STATE.md`) + resume protocol; interruption-proof multi-phase runs
- **Safety**: `guard-destructive` (2-tier, claim-aware) + `file-claims` hooks; scout-block precision fix; smoke-gated worktree fleet (`wt-new`/`wt-doctor`/`wt-clean`) — **removed 2026-08-05**, see below; scoped commits; DB safe-writes protocol
- **Evidence**: `verify-plan` falsification gate, `tdd` red-green discipline, scope-lock, remote-truth + baseline verification rows, multi-lens review, `pr-body.md` fill contract
- **Cost**: fresh-implementer-per-phase, artifacts-as-files scripts, model-tiering matrix + 529 fallback, headless `ci-review`/`delivery-tail`
- **Verification**: `node:test` harness (92 tests) + behavioral eval harness (6 scenarios, `tests/behavior/`) + governance rule for behavioural skills
- Remaining follow-ups: run the full behavioral sweep pre-release (5 scenarios pending, `guard-tier-b` verified live); measure a representative `/ck:cook` token cost before/after Phase 3 (Part H verification)

#### 0a. Worktree fleet retired — 2026-08-05
T1.6 (`wt-new`/`wt-doctor`/`wt-clean` + the `git/worktree` skill) is **removed**. In real multi-session use the auto-provisioning gate fired on every concurrent session, each worktree paid a full dependency install, and stale trees accumulated because teardown depended on a session reaching its finish step. Replaced by **coordination, not isolation** (file-claims registry + disjoint path sets + serialized overlaps) and a **baseline-first** rule in `tdd` (suite on the untouched tree before the first edit, recorded in `STATE.md`; scratch-branch fallback when already dirty; `git stash` still forbidden). `guard-destructive`'s worktree/symlink Tier A rules stay — they protect worktrees the user creates.
- **What this cost, stated plainly:** parallel *editing* teammates in `/ck:team` are gone as a capability (overlapping path sets now serialize), and `/ck:refactor` halts on a shared tree rather than forking one. Read-only fan-out is unaffected. The `wt-doctor` health gate is replaced by a red-baseline halt, not dropped.
- **Upgrade path:** `ck init` removes the leftover files from existing installs only where a content digest proves ClauKit shipped that exact file, and only after refreshing the docs that invoke it. A file you wrote or edited is reported, never touched.

### 1. Agent System Enhancement
- Document and optimize existing 16 agents
- Expand agent capabilities based on usage patterns
- Improve agent handoff protocols

### 2. Skills Library Expansion
- Add cloud platform integrations (GCP, AWS, Azure)
- Enhance existing skill documentation
- Create skill optimization workflows

### 3. Documentation
- API reference automation
- Architecture guide expansion
- Tutorial library development
- Example project documentation

### 4. Performance Optimization
- Scout Block Hook optimization
- Caching strategies for common operations
- Token optimization
- Parallel execution enhancements

---

## Milestone Tracking

### Q1 2026 Milestones

| Milestone | Status | Target Date | Description |
|-----------|--------|-------------|-------------|
| Skills Library Expansion | Planned | 2026-03-31 | Add cloud platform skills |
| Enhanced Debugging | Planned | 2026-03-31 | Improve fix commands |
| Documentation Update | Planned | 2026-03-31 | API reference automation |

### Q2 2026 Milestones

| Milestone | Status | Target Date | Description |
|-----------|--------|-------------|-------------|
| Advanced Features | Planned | 2026-06-30 | Phase 3 features |
| Performance Telemetry | Planned | 2026-06-30 | Performance tracking |

### Q3-Q4 2026 Milestones

| Milestone | Status | Target Date | Description |
|-----------|--------|-------------|-------------|
| Enterprise Features | Planned | 2026-12-31 | Phase 4 features |

---

## Success Metrics

### Adoption Metrics
- GitHub stars and forks
- NPM package downloads
- Active users and installations
- Community engagement (issues, discussions, PRs)

### Performance Targets
- Bootstrap time: < 10 minutes
- Planning to implementation cycle: 50% reduction
- Documentation coverage: > 90%
- Test coverage: > 80%
- Code review time: 75% reduction

### Quality Standards
- Conventional commit compliance: 100%
- Zero secrets in commits: 100%
- Automated test pass rate: > 95%
- Documentation freshness: < 24 hours lag

### Developer Experience
- Time to first commit: < 5 minutes
- Onboarding time: 50% reduction vs baseline
- Context switching overhead: 60% reduction
- Satisfaction score target: > 4.5/5.0

---

## Feature Inventory

### Core Features (COMPLETE)
- Multi-agent orchestration system (19 agents)
- 65+ slash commands
- Comprehensive skills library
- Automated release management
- Development workflow automation
- Documentation system with repomix
- Cross-platform performance optimization
- Git workflow automation
- Comprehensive error handling
- Statusline scripts (sh, ps1, js)
- Post-install setup script

### Recent Additions (v1.0.1)
- Git clone fallback in post-install script
- Enhanced metadata.json configuration
- Updated build and setup dates
- ClaudeKit Engineer foundation integration
- New agents: csharp-expert, security-auditor, seo-specialist
- New commands: seo:audit, seo:keywords, seo:schema, design:ui-ux-pro-max
- New skills: csharp-expert, security-audit, seo

### Recent Additions (2026-06-03)
- `/ck:flow` command with dynamic-workflow skill: controllable recreation of Claude Code's dynamic-workflow model on ClauKit primitives (markdown recipes + Agent-tool fan-out/pipeline, 4-axis inheritance, gated + cost-previewed). No native ultracode runtime. Supports run/save/list modes with `--flow` orchestrated variants on `/ck:fix` and `/ck:review`.

### Recent Changes (2026-07-16)
- **Removed** `ui-ux-designer` agent (`engineering/ui-ux-designer.md`) — design work rerouted to `frontend-developer` + design skills (`aesthetic`, `frontend-design`, `ui-ux-pro-max`). Affected: `/ck:design`, `/ck:fix ui`, `/ck:cook`, `/ck:bootstrap` fast mode, `fix-pipeline` workflow.
- **Relocated** `copywriter` agent `engineering/` → `marketing/` — it's a marketing-kit persona; engineer kit no longer ships it, and `.claude/kits/marketing.json` no longer lists it under `requires.shared`.
- **Purged** stale `imagemagick` skill references (skill was deleted long ago alongside `media-processing`) — image/video gen and editing now routes through the `ai-multimodal` skill.
- **Rewrote** `/ck:cook` command: named stages (Gate → Research → Plan → Implement → Test → Review → Docs → Report), loop cap of max 3 fix cycles per gate, `--auto`+`--no-test` combo forbidden, `--from-plan` extracts the 5 gate items from a plan with `[ASSUMED]` logging, `/clear` handoff offered after Plan approval, subagent reports now go to `plans/<plan>/reports/`. Paired `cook` skill (`.claude/skills/software/cook/`) updated to match.
- Verified ground-truth counts (filesystem, 2026-07-17): 29 agents (17 engineering + 12 marketing), 37 command files (25 `ck/` + 12 `mk/`), 131 `SKILL.md` files (software 69 · marketing 50 · global 1 · automation 6 · integrations 2).
- **Added** `obsidian` knowledge-only skill (`software/obsidian/` — SKILL.md + 4 lazy-loaded references) teaching Obsidian-flavored markdown (wikilinks, embeds, callouts, block refs), typed YAML frontmatter (merge-never-overwrite), vault conventions + link-integrity on rename/move, and an optional live-vault Local REST API MCP path (plugin ≥ 4.1.3, CVE-gated). No agent/command/runtime code — operates on plain `.md` files with normal tools. Exposed to marketing kit via `.claude/kits/marketing.json`; engineer/both auto-cover through the broad `software/` path. *(Superseded — removed 2026-08-11, see below.)*

### Recent Changes (2026-08-11)
- **Removed** `obsidian` knowledge-only skill (`software/obsidian/` — SKILL.md + 4 references). Maintainer decision: no agent, no command, no runtime code, and no ClauKit pipeline ever routed to it, so it was auto-discoverable activation surface with nothing behind it — and vault authoring is out of scope for a software engineering kit. Dropped from `.claude/kits/marketing.json` (the only kit naming it explicitly; engineer/both reached it through the broad `software/` path). All 5 files registered in `RETIRED` (`bin/lib/retired-files.js`) with their shipped blob digests, so `ck init` cleans them from existing installs on content proof, never on a name guess. Counts: skills 130→129, `software/` 71→70, total registry entries 215→214.

### In Development
- Skills library expansion
- Enhanced debugging commands
- Documentation automation

### Planned
- Visual workflow concepts
- Team collaboration features
- Analytics dashboard
- Cloud platform integrations

---

## Technical Architecture

### Technology Stack
- **Runtime**: Node.js >= 18.0.0, Bash, PowerShell, Cross-platform hooks
- **AI Platforms**: Anthropic Claude, Google Gemini, Grok Code
- **Development Tools**: Semantic Release, Commitlint, Husky, Repomix, Scout Block Hook
- **CI/CD**: GitHub Actions
- **Languages**: JavaScript, Bash, PowerShell, Markdown

### Integration Points
- MCP Tools: context7, sequential-thinking, SearchAPI, review-website, VidCap
- External Services: GitHub (Actions, Releases, PRs), Discord, NPM
- Platforms: Windows, macOS, Linux, WSL, Git Bash

---

## Known Constraints & Limitations

### Technical
- Requires Node.js >= 18.0.0
- Depends on Claude Code CLI
- File-based communication has I/O overhead
- Token limits on AI model context windows

### Operational
- Requires API keys for AI platforms
- GitHub Actions minutes for CI/CD
- Internet connection for MCP tools
- Storage for repomix output files

### Design
- Agent definitions must be Markdown with frontmatter
- Commands follow slash syntax
- Reports use specific naming conventions
- Conventional commits required

---

## Risk Management

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|-----------|
| AI Model API Failures | High | Medium | Retry logic, fallback models, graceful degradation |
| Context Window Limits | Medium | High | Repomix for code compaction, selective loading, chunking |
| Agent Coordination Failures | High | Low | Validation checks, error recovery, rollback mechanisms |
| Secret Exposure | Critical | Low | Pre-commit scanning, .gitignore enforcement, security reviews |
| Documentation Drift | Medium | Medium | Automated triggers, freshness checks, validation workflows |

---

## Dependencies & External Requirements

### Required
- Node.js runtime environment
- Git version control
- Claude Code CLI
- API keys for AI platforms

### Optional
- Discord webhook for notifications
- GitHub repository for CI/CD
- NPM account for publishing
- PowerShell 5.1+ (Windows statusline)

### Key External Tools
- Semantic Release
- Commitlint
- Husky
- Repomix
- Scout Block Hook
- Various MCP servers

---

## Compliance & Standards

### Code Standards
- YANGI (You Aren't Gonna Need It)
- KISS (Keep It Simple, Stupid)
- DRY (Don't Repeat Yourself)
- Files < 200 lines
- Comprehensive error handling
- Security-first development

### Git Standards
- Conventional Commits
- Clean commit history
- No AI attribution
- No secrets in commits
- Professional PR descriptions

### Documentation Standards
- Markdown format
- Up-to-date (< 24 hours)
- Comprehensive coverage
- Clear examples
- Proper versioning

### Testing Standards
- Unit test coverage > 80%
- Integration tests for workflows
- Error scenario coverage
- Performance validation
- Security testing

---

## Version History

### Version 1.3.6 (Current - 2026-07-16)

**Changes**: see "Recent Changes (2026-07-16)" above (agent removal/relocation, `/ck:cook` rewrite, stale-reference purge). Full history: [CHANGELOG.md](../CHANGELOG.md) (auto-generated by semantic-release).

### Version 1.0.1 (2026-01-31)

**Changes**:
- Update build and setup dates in metadata.json
- Enhance post-install script with git clone fallback
- Refactor project metadata structure
- Added 3 new agents (csharp-expert, security-auditor, seo-specialist) — `csharp-expert` was later superseded by the `csharp-developer` skill; `seo-specialist` agent was removed 2026-05-17 (see `docs/clauKit-registry.md` § 5)
- Added new SEO commands (seo:audit, seo:keywords, seo:schema)
- Added design:ui-ux-pro-max command
- Added new specialized skills

---

## Document References

### Core Documentation
- [Project Overview & PDR](./project-overview-pdr.md)
- [Code Standards](./code-standards.md)
- [System Architecture](./system-architecture.md)
- [Codebase Summary](./codebase-summary.md)
- [Design Guidelines](./design-guidelines.md)
- [Deployment Guide](./deployment-guide.md)

### External Resources
- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code/overview)
- [Open Code Documentation](https://opencode.ai/docs)
- [Conventional Commits](https://conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)

---

## Questions & Notes

### Current Status
- Foundation phase complete
- Ready for enhancement phase
- All core components documented

### Next Steps
1. Skills library expansion planning
2. Enhanced debugging capabilities design
3. Documentation automation implementation
4. Cloud platform integration research

---

**Maintained By**: ClauKit maintainers
**Last Review**: 2026-07-16
**Next Review Target**: 2026-10-16
