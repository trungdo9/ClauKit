# Project Overview & Product Development Requirements (PDR)

**Project Name**: ClauKit
**Version**: 1.3.6
**Last Updated**: 2026-07-16
**Status**: Active Development
**Repository**: https://github.com/trungdo9/ClauKit

## Executive Summary

ClauKit is an opinionated multi-agent orchestration framework for Claude Code, distributed as the npm package `@trungdo9/ClauKit` (CLI: `ck`/`claukit`). `ck init` copies `.claude/` (agents, commands, skills, workflows) into any project, giving it a standardized foundation for AI-assisted development. Three installable kits: `engineer` (default), `marketing`, `both`.

## Project Purpose

### Vision

Enable developers to build professional software projects faster and with higher quality by leveraging AI agent orchestration and intelligent project management.

### Mission

Provide a production-ready template that:
- Accelerates development velocity through AI-powered agent collaboration
- Enforces best practices and coding standards automatically
- Maintains comprehensive documentation that evolves with code
- Ensures code quality through automated testing and review
- Streamlines git workflows with professional commit standards

### Value Proposition

- **Accelerated Planning**: Parallel researcher agents explore solutions simultaneously
- **Consistent Quality**: Automated code review and testing on every change
- **Zero Documentation Debt**: Docs update automatically with code changes
- **Professional Git History**: Clean, conventional commits without AI attribution
- **Reduced Context Switching**: Specialized agents handle specific concerns

## Target Users

### Primary Users

1. **Solo Developers**: Building projects faster with AI assistance
2. **Small Development Teams**: Standardizing workflows and practices
3. **AI-Powered Development Shops**: Leveraging Claude Code for automation
4. **Startups**: Rapid prototyping and MVP development
5. **Enterprise Teams**: Enforcing architectural standards

### User Personas

**Persona 1: Solo Full-Stack Developer**
- Needs: Fast iteration, quality code, minimal documentation overhead
- Pain Points: Context switching, documentation maintenance, testing gaps
- Solution: AI agents handle planning, testing, docs while dev focuses on features

**Persona 2: Technical Lead**
- Needs: Enforce standards, review code, maintain architecture docs
- Pain Points: Code review bottleneck, inconsistent patterns, outdated docs
- Solution: Automated reviews, standardized workflows, living documentation

**Persona 3: AI-First Developer**
- Needs: Leverage Claude Code capabilities, automated workflows
- Pain Points: Manual setup, inconsistent agent configurations
- Solution: Pre-configured agents, commands, and workflows

## Key Features & Capabilities

### 1. Multi-Agent Orchestration System

**Agent Types** (30 total — 19 engineering + 11 marketing, `.claude/agents/{engineering,marketing}/`):
- **Planning Agents**: `planner`, `researcher`, `brainstormer`
- **Implementation Agents**: `scout`, `scout-external`, `frontend-developer`, `backend-developer`
- **Quality Agents**: `tester`, `code-reviewer`, `debugger`, `performance-agent`, `security-auditor`
- **Documentation Agents**: `docs-manager`, `journal-writer`
- **Management Agents**: `project-manager`, `git-manager`, `database-admin`, `mcp-manager`, `integration-agent`
- **Marketing Agents** (marketing kit only, 11): `campaign-manager`, `content-strategist`, `copywriter`, `crm-specialist`, `email-specialist`, `market-researcher`, `seo-content`, `seo-geo`, `seo-schema`, `seo-technical`, `video-producer`

No `csharp-expert` agent exists — C#/.NET is covered by the `csharp-developer` skill, not a dedicated agent.

**Orchestration Patterns**:
- **Sequential Chaining**: Planning -> Implementation -> Testing -> Review -> Deploy
- **Parallel Execution**: Multiple researchers exploring different approaches
- **Query Fan-Out**: Simultaneous investigation of technical solutions
- **Controlled Fan-Out/Pipeline** (`/ck:flow`): phase-gated, cost-previewed orchestration over agent personas — re-creates the dynamic-workflow model on ClauKit primitives, never the native `ultracode` runtime

### 2. Slash Commands (37 files: 25 `/ck:<name>` + 12 `/mk:<name>`)

**Development**:
- `/ck:plan [task]` - Research and create implementation plans
- `/ck:cook [tasks]` - Implement features with full workflow
- `/ck:test` - Run comprehensive test suites
- `/ck:ask [question]` - Expert technical consultation
- `/ck:bootstrap` - Initialize new projects end-to-end
- `/ck:brainstorm [question]` - Solution ideation and evaluation

**Debugging & Fixing**:
- `/ck:debug [issues]` - Deep issue analysis
- `/ck:fix --quick [issues]` - Quick bug fixes
- `/ck:fix --review [issues]` - Complex problem solving with subagents
- `/ck:fix ci [url]` - GitHub Actions log analysis
- `/ck:fix test [issues]` - Test suite debugging
- `/ck:fix types` - Type error resolution
- `/ck:fix logs [issue]` - Log analysis and fixes
- `/ck:fix ui [issue]` - UI/UX problem solving

**Design & Content**:
- `/ck:design fast [tasks]` - Quick design creation
- `/ck:design good [tasks]` - Immersive design development
- `/ck:design 3d [tasks]` - Interactive 3D designs with Three.js
- `/ck:design screenshot [image]` - Design from screenshots
- `/ck:design describe [image]` - Describe design from images
- `/ck:design ui-ux-pro-max` - Advanced UI/UX design

**Documentation**:
- `/ck:docs init` - Create initial documentation
- `/ck:docs update` - Update existing documentation
- `/ck:docs summarize` - Generate codebase summaries

**SEO**:
- `/ck:seo audit` - Comprehensive SEO audit
- `/ck:seo keywords` - Keyword research and analysis
- `/ck:seo schema` - Schema markup generation

**Git Operations**:
- `/ck:git cm` - Stage and commit changes
- `/ck:git cp` - Stage, commit, and push
- `/ck:git pr [branch]` - Create pull requests
- `/ck:git merge [pr#|branch]` - Merge PR or branch (interactive strategy)

**Project Management**:
- `/ck:watzup` - Review recent changes and status
- `/ck:journal` - Development journal entries
- `/ck:scout [prompt] [scale]` - Parallel codebase exploration
- `/ck:scout -ext [prompt]` - Codebase exploration with external tools

**Integration**:
- `/ck:use-mcp` - Use MCP servers
- `/ck:sepay` - SePay.vn payment integration

**Quality & Security**:
- `/ck:review [--flow]` - Scan and analyze the codebase
- `/ck:security [scope] [--en]` - OWASP 2025 security audit

**Refactor & Migration**:
- `/ck:refactor <pattern>` - Large mechanical refactor (rename/extract/migrate/codemod), gated + atomic-commit
- `/ck:xia <github-url>` - Port & refactor a feature from a public GitHub repo

**Orchestration**:
- `/ck:team <template>` - Persistent multi-session teammates (templates: research/cook/review/debug)
- `/ck:flow [save|list] <task>` - Controllable phase-gated fan-out/pipeline over agent personas (never native `ultracode`)

**Discovery**:
- `/ck:find <task>` - Recommend the right ClauKit skill/agent/command

**Marketing kit** (`/mk:` namespace, 12 commands — only with `--kit marketing`/`both`; every command except `/mk:plan` hard-fails without `plans/marketing-context.md`):
- `/mk:plan`, `/mk:seo`, `/mk:content`, `/mk:email`, `/mk:ads`, `/mk:cro`, `/mk:research`, `/mk:growth`, `/mk:campaign`, `/mk:leads`, `/mk:nurture`, `/mk:video`

### 3. Workflow System

**Primary Workflows**:
1. **primary-workflow.md** - Code implementation cycle
2. **development-rules.md** - Coding standards and rules
3. **orchestration-protocol.md** - Agent coordination patterns
4. **documentation-management.md** - Documentation protocols

### 4. Development Principles

- **YANGI** (You Aren't Gonna Need It) - Avoid over-engineering
- **KISS** (Keep It Simple, Stupid) - Prefer simple solutions
- **DRY** (Don't Repeat Yourself) - Eliminate code duplication
- Files under 200 lines for optimal context management
- Try-catch error handling
- Security-first development

## Technical Requirements

### Functional Requirements

**FR1: Agent Orchestration**
- Support sequential and parallel agent execution
- Enable agent-to-agent communication via file system
- Maintain context across agent handoffs
- Track agent task completion

**FR2: Command System**
- Parse slash commands with arguments
- Route to appropriate agent workflows
- Support nested commands (e.g., `/ck:fix ci`)
- Provide command discovery and help

**FR3: Documentation Management**
- Auto-generate codebase summaries with repomix
- Keep docs synchronized with code changes
- Maintain project roadmap and changelog
- Update API documentation automatically

**FR4: Quality Assurance**
- Run tests before commits
- Perform code review automatically
- Check type safety and compilation
- Validate security best practices

**FR5: Git Workflow**
- Enforce conventional commits
- Scan for secrets before commits
- Generate professional commit messages
- Create clean PR descriptions

**FR6: Project Bootstrapping**
- Initialize git repository
- Gather requirements through questions
- Research tech stacks
- Generate project structure
- Create initial documentation
- Set up CI/CD

### Non-Functional Requirements

**NFR1: Performance**
- Command execution < 5 seconds for simple operations
- Parallel agent spawning for independent tasks
- Efficient file system operations
- Optimized context loading

**NFR2: Reliability**
- Handle agent failures gracefully
- Provide rollback mechanisms
- Validate agent outputs
- Error recovery and retry logic

**NFR3: Usability**
- Clear command syntax and documentation
- Helpful error messages
- Progress indicators for long operations
- Comprehensive command help

**NFR4: Maintainability**
- Modular agent definitions
- Reusable workflow templates
- Clear separation of concerns
- Self-documenting code and configs

**NFR5: Security**
- Secret detection before commits
- No AI attribution in public commits
- Secure handling of credentials
- Security best practice enforcement

**NFR6: Scalability**
- Support projects of any size
- Handle large codebases efficiently
- Scale agent parallelization
- Manage complex dependency graphs

## Success Metrics

### Adoption Metrics
- GitHub stars and forks
- NPM package downloads
- Active users and installations
- Community engagement (issues, discussions, PRs)

### Performance Metrics
- Average time to bootstrap new project: < 10 minutes
- Planning to implementation cycle time: 50% reduction
- Documentation coverage: > 90%
- Test coverage: > 80%
- Code review time: 75% reduction

### Quality Metrics
- Conventional commit compliance: 100%
- Zero secrets in commits: 100%
- Automated test pass rate: > 95%
- Documentation freshness: < 24 hours lag

### Developer Experience Metrics
- Time to first commit: < 5 minutes
- Developer onboarding time: 50% reduction
- Context switching overhead: 60% reduction
- Satisfaction score: > 4.5/5.0

## Technical Architecture

### Core Components

**1. Agent Framework**
- Agent definition files (Markdown with frontmatter)
- Agent orchestration engine
- Context management system
- Communication protocol (file-based reports)

**2. Command System**
- Command parser and router
- Argument handling ($ARGUMENTS, $1, $2, etc.)
- Command composition and nesting
- Help and discovery system

**3. Workflow Engine**
- Sequential execution support
- Parallel task scheduling
- Dependency resolution
- Error handling and recovery

**4. Documentation System**
- Repomix integration for codebase compaction
- Template-based doc generation
- Auto-update triggers
- Version tracking

**5. Quality System**
- Test runner integration
- Code review automation
- Type checking and linting
- Security scanning

**6. Release System**
- Semantic versioning engine
- Changelog generation
- GitHub release creation
- Asset packaging

### Technology Stack

**Runtime**:
- Node.js >= 18.0.0
- Bash scripting (Unix hooks)
- PowerShell scripting (Windows hooks)
- Cross-platform hook dispatcher (Node.js)

**AI Platforms**:
- Anthropic Claude (opus/sonnet/haiku, selected per-agent via `model:` frontmatter — `docs-manager`=sonnet, `git-manager`=haiku)
- Google Gemini (optional, via `human-mcp` MCP server + `GEMINI_API_KEY`)

**Development Tools**:
- Semantic Release
- Commitlint
- Husky (git hooks)
- Repomix (codebase compaction)
- Scout Block Hook (performance optimization)

**CI/CD**:
- GitHub Actions
- Conventional Commits
- Automated versioning

### Integration Points

**MCP Tools** (`.claude/.mcp.json.example`):
- **context7**: Read latest documentation
- **sequential-thinking**: Structured problem solving
- **human-mcp**: Gemini-backed multimodal helper
- **chrome-devtools**: Browser automation / devtools access

**External Services**:
- GitHub (Actions, Releases, PRs)
- Discord (notifications)
- NPM (optional package publishing)

## Use Cases

### UC1: Bootstrap New Project
1. Run `/ck:bootstrap` command
2. Answer requirement questions
3. AI researches tech stacks
4. Review and approve recommendations
5. AI generates project structure
6. AI implements initial features
7. AI creates tests and documentation
8. Project ready for development

### UC2: Implement New Feature
1. Run `/ck:cook "add user authentication"`
2. Planner creates implementation plan
3. Researcher agents explore auth solutions
4. Developer reviews and approves plan
5. AI implements code
6. AI writes comprehensive tests
7. AI performs code review
8. AI updates documentation
9. AI commits with conventional message

### UC3: Debug Production Issue
1. Run `/ck:fix logs "API timeout errors"`
2. Debugger agent analyzes logs
3. Root cause identified
4. Fix plan created
5. AI implements solution
6. Tests validate fix
7. Code review confirms quality
8. Commit and deploy

### UC4: Create Pull Request
1. Run `/ck:git pr feature/new-auth main`
2. AI analyzes all commits in branch
3. AI generates comprehensive PR description
4. PR created with proper context
5. Links to related issues added

### UC5: Update Documentation
1. Run `/ck:docs update`
2. Docs manager scans codebase
3. Generates fresh summary with repomix
4. Identifies outdated sections
5. Updates API docs, guides, architecture
6. Validates naming conventions
7. Creates update report

## Constraints & Limitations

### Technical Constraints
- Requires Node.js >= 18.0.0
- Depends on Claude Code CLI
- File-based communication has I/O overhead
- Token limits on AI model context windows

### Operational Constraints
- Requires API keys for AI platforms
- GitHub Actions minutes for CI/CD
- Internet connection for MCP tools
- Storage for repomix output files

### Design Constraints
- Agent definitions must be Markdown with frontmatter
- Commands follow slash syntax
- Reports use specific naming conventions
- Conventional commits required

## Risks & Mitigation

### Risk 1: AI Model API Failures
- Impact: High, Likelihood: Medium
- Mitigation: Retry logic, fallback models, graceful degradation

### Risk 2: Context Window Limits
- Impact: Medium, Likelihood: High
- Mitigation: Repomix for code compaction, selective context loading, chunking

### Risk 3: Agent Coordination Failures
- Impact: High, Likelihood: Low
- Mitigation: Validation checks, error recovery, rollback mechanisms

### Risk 4: Secret Exposure
- Impact: Critical, Likelihood: Low
- Mitigation: Pre-commit scanning, .gitignore enforcement, security reviews

### Risk 5: Documentation Drift
- Impact: Medium, Likelihood: Medium
- Mitigation: Automated triggers, freshness checks, validation workflows

## Future Roadmap

### Phase 1: Foundation (Current - v1.0.1)
- Core agent framework
- Slash command system
- Automated releases
- Skills library
- Documentation system

### Phase 2: Enhancement (Planned)
- Additional cloud skills (GCP, AWS, Azure)
- UI/UX improvements
- Performance optimization
- Enhanced error handling

### Phase 3: Advanced Features (Planned)
- Visual workflow builder
- Custom agent creator UI
- Team collaboration features
- Analytics and insights dashboard

### Enterprise (Future)
- Self-hosted deployment
 Phase 4:- Advanced security features
- Compliance automation
- Custom integrations

## Dependencies & Integration

### Required Dependencies
- Node.js runtime environment
- Git version control
- Claude Code CLI
- API keys for AI platforms

### Optional Dependencies
- Discord webhook for notifications
- GitHub repository for CI/CD
- NPM account for publishing

### Integrations
- GitHub Actions
- Semantic Release
- Commitlint
- Husky
- Repomix
- Various MCP servers

## Compliance & Standards

### Coding Standards
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

## Glossary

- **Agent**: Specialized AI assistant with specific expertise
- **Slash Command**: Shortcut that triggers agent workflows
- **Skill**: Reusable knowledge module for specific technologies
- **MCP**: Model Context Protocol for AI tool integration
- **Repomix**: Tool for compacting codebases into AI-friendly format
- **Sequential Chaining**: Running agents one after another with dependencies
- **Parallel Execution**: Running multiple agents simultaneously
- **Query Fan-Out**: Spawning multiple researchers to explore different approaches
- **Conventional Commits**: Structured commit message format

## Related Documentation

- [Codebase Summary](./codebase-summary.md)
- [Code Standards](./code-standards.md)
- [System Architecture](./system-architecture.md)
- [Project Roadmap](./project-roadmap.md)
- [ClauKit Registry](./clauKit-registry.md) — skills + agents + commands single source of truth
- [Design Guidelines](./design-guidelines.md)
- [Deployment Guide](./deployment-guide.md)

## Support & Community

- GitHub Issues: https://github.com/trungdo9/ClauKit/issues
- Repository: https://github.com/trungdo9/ClauKit
