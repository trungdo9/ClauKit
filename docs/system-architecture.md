# System Architecture

**Last Updated**: 2026-07-16
**Version**: 1.3.6
**Project**: ClauKit

## Overview

ClauKit implements a multi-agent AI orchestration architecture where specialized agents collaborate through a file-based communication protocol, running entirely inside Claude Code. It enables developers to leverage AI assistance throughout the entire software development lifecycle via three installable kits (`engineer`, `marketing`, `both`).

## Architectural Pattern

### Pattern Classification
**Primary Pattern**: Microservices-inspired Agent Architecture
**Secondary Patterns**:
- Command Pattern (slash commands)
- Observer Pattern (agent communication)
- Strategy Pattern (workflow selection)
- Template Method Pattern (agent workflows)

### Design Philosophy
- **Decoupled Agents**: Each agent is independent and specialized
- **File-Based Communication**: Agents communicate via markdown reports
- **Workflow Orchestration**: Coordinated agent execution (sequential/parallel)
- **Configuration-Driven**: Agents and commands defined in markdown
- **AI-First Development**: Leverage AI at every stage of SDLC

## System Components

### 1. Core Layer

#### 1.1 CLI Interface
**Location**: Claude Code CLI
**Responsibility**: User interaction and command routing
**Key Functions**:
- Parse slash commands
- Route to appropriate agent workflows
- Display results to users
- Manage conversation context

**Technology**: Anthropic Claude Code CLI

#### 1.2 Command Parser
**Location**: Built into CLI
**Responsibility**: Command interpretation and argument extraction
**Input**: Slash command with arguments (`/command arg1 arg2`)
**Output**: Parsed command and argument values
**Argument Variables**:
- `$ARGUMENTS` - All arguments as single string
- `$1, $2, $3...` - Individual positional arguments

#### 1.3 Configuration Manager
**Location**: `.claude/` and `.opencode/` directories
**Responsibility**: Load agent and command definitions
**File Types**:
- Agent definitions (`.md` with YAML frontmatter)
- Command definitions (`.md` with embedded agent calls)
- Skill modules (knowledge bases)
- Workflow templates

### 2. Agent Layer

#### 2.1 Agent Types

**28 Specialized Agents** — 17 in `.claude/agents/engineering/` (engineer kit) + 11 in `.claude/agents/marketing/` (marketing kit). No `specialists/`, `operations/`, or `research/` subfolders exist; both pools are flat.

**Engineering (17)**:

| Category | Agent | Purpose |
|----------|-------|---------|
| Planning | `planner` | Technical planning and architecture |
| Planning | `researcher` | Research and analysis |
| Planning | `brainstormer` | Solution ideation |
| Development | `frontend-developer` | UI implementation + design creation (via design skills) |
| Development | `backend-developer` | Server-side logic, APIs, infrastructure |
| Quality | `tester` | Test creation and execution |
| Quality | `code-reviewer` | Code quality assessment |
| Quality | `debugger` | Issue analysis and debugging |
| Quality | `performance-agent` | Performance profiling and optimization |
| Quality | `security-auditor` | Security analysis (OWASP 2025) |
| Documentation | `docs-manager` | Documentation maintenance |
| Documentation | `journal-writer` | Development journaling |
| Operations | `git-manager` | Version control operations |
| Operations | `project-manager` | Progress tracking |
| Operations | `database-admin` | Database operations |
| Operations | `integration-agent` | Third-party API / payment / webhook integration |
| Implementation | `scout` | Codebase exploration (parallel Explore subagents) |

**Marketing (11, only with `--kit marketing`/`both`)**: `campaign-manager`, `content-strategist`, `copywriter`, `crm-specialist`, `email-specialist`, `market-researcher`, `seo-content`, `seo-geo`, `seo-schema`, `seo-technical`, `video-producer`.

No `lovable-to-nextjs` or `csharp-expert` agents exist on disk — verify any agent name against `docs/clauKit-registry.md` § 2 before citing it. C#/.NET is covered by the `csharp-developer` **skill** (`software/development/csharp-developer/`), not an agent.

#### 2.2 Agent Definition Structure

```yaml
---
name: agent-name
description: Agent purpose and use cases (used for auto-delegation matching)
model: opus | sonnet | haiku | inherit
tools: Glob, Grep, Read, Edit, Write, ...   # optional — omit to inherit full tool set
---

# Agent instructions in markdown
## Core Responsibilities
## Workflow Process
## Output Requirements
## Quality Standards
```

No `mode` or `temperature` field is used in current agent frontmatter (only `name`/`description`/`model`/optional `tools`).

**Model Selection** (per `docs/clauKit-registry.md` § 2):
- `opus` — advanced reasoning: `planner`, `brainstormer`, `code-reviewer`, `debugger`
- `sonnet` — default, most agents (`frontend-developer`, `backend-developer`, `tester`, `docs-manager`, `researcher`, `database-admin`, `performance-agent`, `integration-agent`, and all 11 marketing agents)
- `haiku` — token-efficient, narrow-scope agents: `git-manager`, `journal-writer`, `project-manager`, `scout`
- `inherit` — takes the calling session's model: `security-auditor`

#### 2.3 Agent Communication Protocol

**Communication Medium**: File system (markdown files)
**Report Location**: `./plans/<plan-name>/reports/`
**Naming Convention**: `YYMMDD-from-[source]-to-[dest]-[task]-report.md`

**Report Structure**:
```markdown
# Task Report: [Task Name]

**From**: [Source Agent]
**To**: [Destination Agent]
**Date**: YYYY-MM-DD
**Status**: [Complete|In Progress|Blocked]

## Summary
Brief overview of findings/results

## Details
Comprehensive information

## Recommendations
Actionable next steps

## Concerns
Issues, blockers, or questions
```

**Communication Patterns**:
1. **Request-Response**: Agent A requests, Agent B responds
2. **Broadcast**: Agent publishes report for multiple consumers
3. **Chain**: Sequential handoffs (A -> B -> C)
4. **Fan-Out**: Parallel execution (A spawns B, C, D)
5. **Fan-In**: Collect results from parallel agents

### 3. Command Layer

#### 3.1 Command Categories

**37 command files** — 25 under `.claude/commands/ck/` (`/ck:<name>`) + 12 under `.claude/commands/mk/` (`/mk:<name>`). All engineer-kit commands live under the `ck:` prefix (applied 2026-05-17); `/skill:*` commands referenced in older docs never existed as files and are not part of the current command set.

| Category | Commands |
|----------|----------|
| Development | `/ck:plan`, `/ck:cook`, `/ck:test`, `/ck:ask`, `/ck:bootstrap`, `/ck:brainstorm`, `/ck:team` |
| Debugging | `/ck:debug`, `/ck:fix [ci\|logs\|test\|types\|ui]`, `/ck:fix [--auto\|--review\|--quick\|--parallel\|--flow]` |
| Design | `/ck:design [fast\|good] [3d\|screenshot\|describe\|ui-ux-pro-max]` |
| Documentation | `/ck:docs [init\|update\|summarize]` |
| Security | `/ck:security [scope] [--en]` |
| Orchestration | `/ck:flow [save\|list]`, `/ck:team` |
| Git Operations | `/ck:git [cm\|cp\|pr\|merge]` |
| Planning | `/ck:plan [fast\|hard\|two\|ci\|cro] [-o md\|html]` |
| Refactor / Port | `/ck:refactor`, `/ck:port` |
| Project Management | `/ck:watzup`, `/ck:journal`, `/ck:scout`, `/ck:find` |
| Integration | `/ck:sepay`, `/ck:use-mcp` |
| Code Review | `/ck:review [--flow]` |
| Research | `/ck:research` |
| Marketing kit (12, `/mk:` namespace) | `/mk:plan`, `/mk:seo`, `/mk:content`, `/mk:email`, `/mk:ads`, `/mk:cro`, `/mk:research`, `/mk:growth`, `/mk:campaign`, `/mk:leads`, `/mk:nurture`, `/mk:video` |

#### 3.2 Command Workflow Pattern

```
User Input: /command [args]
    ↓
Command Parser
    ↓
Load Command Definition
    ↓
Substitute Arguments
    ↓
Execute Agent Workflow
    ↓
Sequential or Parallel Execution
    ↓
Collect Results
    ↓
Present to User
```

### 4. Workflow Layer

#### 4.1 Orchestration Patterns

**Sequential Chaining**:
```
Planner → Researcher → Planner → Main Agent → Tester → Code Reviewer → Docs Manager → Git Manager
```
Use when tasks have dependencies

**Parallel Execution**:
```
            ┌─→ Researcher (Auth) ─┐
Planner ────┼─→ Researcher (DB) ───┼─→ Planner (Synthesize)
            └─→ Researcher (UI) ───┘
```
Use for independent research tasks

**Query Fan-Out**:
```
Main Agent → Planner → [Multiple Researchers in Parallel] → Planner → Main Agent
```
Explore different approaches simultaneously

**Controlled Dynamic Workflow (`/ck:flow`)**:
```
/ck:flow prompt → Phase plan (cost-previewed, gated) → fan-out/pipeline over 21 agents → gate → next phase
```
Re-creates Claude Code's dynamic-workflow model on ClauKit primitives — 4-axis inheritance, phase gates, cost preview; never uses native `ultracode`. Orchestrated variants: `/ck:fix --flow`, `/ck:review --flow`.

#### 4.2 Standard Workflows

**Feature Development Workflow**:
1. User: `/ck:cook "add user authentication"`
2. Planner: Create implementation plan
3. Researchers: Explore auth solutions (parallel)
4. Planner: Synthesize research, create detailed plan
5. Main Agent: Implement code
6. Main Agent: Run type checking/compilation
7. Tester: Write and run tests
8. (If tests fail): Debugger analyzes, loop to step 5
9. Code Reviewer: Review implementation
10. Docs Manager: Update documentation
11. Git Manager: Commit with conventional message

**Bug Fix Workflow**:
1. User: `/ck:debug "API timeout errors"`
2. Debugger: Analyze logs and system
3. Debugger: Identify root cause
4. Planner: Create fix plan
5. Main Agent: Implement solution
6. Tester: Validate fix
7. Code Reviewer: Review changes
8. Git Manager: Commit fix

**Documentation Update Workflow**:
1. User: `/ck:docs update`
2. Docs Manager: Check doc freshness
3. (If >1 day old): Run `repomix` for codebase summary
4. Docs Manager: Analyze codebase changes
5. Docs Manager: Update affected documentation
6. Docs Manager: Validate naming conventions
7. Docs Manager: Create update report

### 5. Skills Layer

#### 5.1 Skill Architecture

**Purpose**: Reusable knowledge modules for specific technologies

**Structure**:
```
.claude/skills/
└── [skill-name]/
    ├── SKILL.md           # Main skill definition
    └── references/        # Supporting documentation
        ├── api-ref.md
        └── examples.md
```

**128 skills across 5 groups** (see `docs/clauKit-registry.md` § 1 for the full itemized list):
- **`global/`** (1): `docs-seeker`
- **`marketing/`** (50): claude-seo engine (`seo`, `seo-audit`, `seo-technical`, `seo-content`, `seo-schema`, `seo-geo`, +19 more `seo-*`), coreyhaines31-sourced (`copywriting`, `cro`, `ads`, `emails`, `analytics`, +18 more), ClauKit-authored (`product-marketing`, `kit-builder`)
- **`automation/`** (6): `marketing-orchestrator`, `mcp-ga4`, `mcp-gsc`, `mcp-sendgrid`, `mcp-resend`, `mcp-reviewweb`
- **`integrations/`** (2): `wordpress-rest`, `mcp-wordpress`
- **`software/`** (69): top-level standalone (`git`, `worktree`, `research`, `planning`, `cook`, `refactor`, `debugging`, `code-review`, `dynamic-workflow`, `obsidian`, `claude-md`, `team`, `port`, `chrome-devtools`, `agent-browser`, `security`, `cti-expert`, `problem-solving`, `sequential-thinking`, …) + subcategorized: `ai/` (`ai-artist`, `ai-multimodal`, `remotion`), `database/` (`postgresql`, `supabase`), `design/` (`aesthetic`, `frontend-design`, `ui-ux-pro-max`, `threejs`, …), `development/` (`csharp-developer`, `node-specialist`, `python-pro`, `react-specialist`, `nextjs-developer`, `typescript-pro`, `bootstrap`, `test-automation`, …), `document-skills/` (`docx`, `pdf`, `pptx`, `xlsx`), `git/`, `infrastructure/` (`docker-expert`)

No `ffmpeg`, `shopify`, `mongodb`, `turborepo`, `csharp-expert`, or `security-audit` skills exist — these were either never real or have been superseded (`security-audit` → `security`; C# coverage → `csharp-developer`; image/video work → `ai-multimodal`). Verify any skill name against the registry before citing it.

#### 5.2 Skill Invocation

**Invocation**: `Skill` tool in CLI
**Usage**: Agents invoke skills to access specialized knowledge

### 6. Integration Layer

#### 6.1 Hook System

**Scout Block Hook** (Cross-Platform):
- **Architecture**: Node.js dispatcher with platform-specific implementations
- **Windows**: PowerShell implementation (via Node.js)
- **Unix (Linux/macOS/WSL)**: Bash implementation
- **Platform Detection**: Automatic via `process.platform` in dispatcher
- **Configuration**: Zero-config - automatic platform selection

**Functionality**:
- Blocks access to heavy directories (node_modules, __pycache__, .git/, dist/, build/)
- Input validation (JSON structure, command presence)
- Error handling with exit codes (0 = allow, 2 = block/error)
- Security features: sanitized error messages, input validation

**Testing**:
- Cross-platform test suites
- Comprehensive test coverage
- Validates blocked/allowed patterns, error handling, edge cases

**Hook Configuration** (`.claude/settings.json`):
```json
{
  "hooks": {
    "BeforeBash": [{
      "type": "command",
      "command": "node ${CLAUDE_PROJECT_DIR}/.claude/hooks/scout-block.js"
    }]
  }
}
```

#### 6.2 MCP (Model Context Protocol) Integration

**Available MCP Servers** (`.claude/.mcp.json.example`):
- **context7**: Read latest documentation
- **human-mcp**: Gemini-backed multimodal helper (requires `GOOGLE_GEMINI_API_KEY`)
- **chrome-devtools**: Browser automation / devtools access
- **sequential-thinking**: Structured thinking process

**Skills Integration**:
- **ai-multimodal**: Visual analysis + image generation/editing (images, videos, documents)
- **docs-seeker**: Documentation reading
- **sequential-thinking**: Problem decomposition

#### 6.3 External Service Integration

**GitHub**:
- Actions (CI/CD automation)
- Releases (semantic versioning)
- Issues and PRs (project management)

**Discord**:
- Webhook notifications
- Project updates
- Team communication

**NPM**:
- Package publishing
- Version management

### 7. Data Layer

#### 7.1 File-Based Storage

**Configuration Data**:
- `.claude/` - Claude Code config
- `.opencode/` - OpenCode config
- `.gitignore` - Git exclusions
- `package.json` - Node.js config
- `.releaserc.json` - Release config

**Runtime Data**:
- `plans/` - Implementation plans
- `plans/<plan-name>/reports/` - Agent communication
- `plans/<plan-name>/research/` - Research reports
- `docs/` - Project documentation
- `repomix-output.xml` - Codebase compaction

**Version Control**:
- `.git/` - Git repository
- `CHANGELOG.md` - Version history
- Git tags - Release versions

#### 7.2 Data Flow

```
User Input
    ↓
Command Parsing
    ↓
Agent Execution
    ↓
File System (Reports/Plans)
    ↓
Agent Reading
    ↓
Processing
    ↓
File System (Updated Docs/Code)
    ↓
Version Control (Git)
    ↓
Remote Repository (GitHub)
```

## Component Interactions

### Typical Interaction Flow: Feature Implementation

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │ /cook "add auth"
       ↓
┌─────────────────────┐
│   Command Parser    │
└──────┬──────────────┘
       │ Parse command + args
       ↓
┌─────────────────────┐
│  Planner Agent      │
└──────┬──────────────┘
       │ Spawn researchers
       ↓
┌──────────────────────────────────┐
│  Researchers (Parallel)          │
│  - Auth strategies               │
│  - Security best practices       │
│  - Integration patterns          │
└──────┬───────────────────────────┘
       │ Reports to planner
       ↓
┌─────────────────────┐
│  Planner Agent      │
└──────┬──────────────┘
       │ Create plan
       │ Save to ./plans/
       ↓
┌─────────────────────┐
│   Main Agent        │
└──────┬──────────────┘
       │ Read plan
       │ Implement code
       ↓
┌─────────────────────┐
│  Tester Agent       │
└──────┬──────────────┘
       │ Write & run tests
       ↓
┌─────────────────────┐
│ Code Reviewer Agent │
└──────┬──────────────┘
       │ Review quality
       ↓
┌─────────────────────┐
│ Docs Manager Agent  │
└──────┬──────────────┘
       │ Update docs
       ↓
┌─────────────────────┐
│  Git Manager Agent  │
└──────┬──────────────┘
       │ Commit & push
       ↓
┌─────────────────────┐
│   User (Result)     │
└─────────────────────┘
```

## Technology Stack

### Core Technologies

**Runtime Environment**:
- Node.js >= 18.0.0
- Bash scripting (hooks)
- PowerShell (Windows hooks)

**AI Platforms**:
- Anthropic Claude (opus/sonnet/haiku via agent `model:` frontmatter — see § 2.2)
- Google Gemini (optional, via `human-mcp` MCP server and `GEMINI_API_KEY` env var)

**Development Tools**:
- Semantic Release (versioning)
- Commitlint (commit standards)
- Husky (git hooks)
- Repomix (codebase compaction)

**CI/CD**:
- GitHub Actions
- Conventional Commits
- Semantic Versioning

## Security Architecture

### Security Layers

**Layer 1: Pre-Commit Security**
- Secret scanning (git-manager agent)
- Credential detection
- .gitignore validation
- Environment file exclusion

**Layer 2: Code Security**
- Input validation enforcement
- SQL injection prevention
- XSS protection patterns
- OWASP Top 10 awareness

**Layer 3: Agent Security**
- No logging of sensitive data
- Sanitized error messages
- Secure credential handling
- API key protection

**Layer 4: Communication Security**
- File system permissions
- Report sanitization
- Context isolation
- Clean handoffs

### Secret Management

**Environment Variables**:
```
.env (local, gitignored)
.env.example (template, committed)
```

**API Keys**:
- Never hardcoded
- Environment variable injection
- Secure storage systems in production

## Scalability Considerations

### Horizontal Scalability

**Parallel Agent Execution**:
- Independent researchers run simultaneously
- No shared state between agents
- File-based coordination
- Scalable to N agents

**Workflow Parallelization**:
- Multiple feature branches
- Concurrent issue resolution
- Parallel test execution
- Independent documentation updates

### Vertical Scalability

**Context Management**:
- Repomix for code compaction
- Selective context loading
- Chunked file processing
- Efficient token usage

**Performance Optimization**:
- Lazy loading of skills
- Cached MCP responses
- Incremental documentation updates
- Optimized file I/O

## Deployment Architecture

### Development Environment

```
Developer Machine
├── Claude Code CLI
├── .claude/ (configuration)
├── .opencode/ (configuration)
├── Git repository
└── Node.js runtime
```

### CI/CD Pipeline

```
GitHub Repository
    ↓ Push to main
GitHub Actions
    ↓
Run Tests
    ↓
Semantic Release
    ├─→ Version Bump
    ├─→ Changelog Generation
    ├─→ GitHub Release
    └─→ (Optional) NPM Publish
```

### Production Usage

```
User Project
├── .claude/ (from template)
├── .opencode/ (from template)
├── docs/ (generated)
├── plans/ (generated)
├── src/ (user code)
└── tests/ (user tests)
```

## Monitoring & Observability

### Agent Activity Tracking

**Logs**:
- Agent invocations
- Command executions
- Workflow progress
- Error occurrences

**Reports**:
- Agent communication files
- Implementation plans
- Research findings
- Test results

**Metrics**:
- Command execution time
- Agent success rates
- Test pass/fail ratios
- Documentation coverage

### Quality Metrics

**Code Quality**:
- Test coverage percentage
- Type safety compliance
- Linting pass rate
- Security scan results

**Process Metrics**:
- Planning to implementation time
- Code review turnaround
- Documentation freshness
- Commit message compliance

## Failure Handling

### Error Recovery Strategies

**Agent Failures**:
- Graceful degradation
- Error reporting to user
- Rollback mechanisms
- Retry logic for transient errors

**Workflow Failures**:
- Checkpoint saving
- Partial progress preservation
- Clear failure messages
- Recovery suggestions

**Communication Failures**:
- File write retries
- Report validation
- Missing report detection
- Timeout handling

## Extension Points

### Adding New Agents

1. Create agent definition file: `.claude/agents/my-agent.md`
2. Define YAML frontmatter (name, description, mode, model)
3. Write agent instructions and workflows
4. Reference in commands or other agents

### Adding New Commands

1. Create command file: `.claude/commands/my-command.md`
2. Define YAML frontmatter
3. Write command workflow with agent invocations
4. Use `$ARGUMENTS` or `$1, $2` for parameters

### Adding New Skills

1. Create skill directory: `.claude/skills/my-skill/`
2. Write `SKILL.md` with knowledge content
3. Add references and examples
4. Reference in agent definitions

### Custom Workflows

1. Define workflow in `.claude/workflows/`
2. Document orchestration patterns
3. Specify agent handoffs
4. Provide examples

## Performance Considerations

### Optimization Strategies

**Token Efficiency**:
- Repomix for codebase compaction
- Selective context inclusion
- Efficient prompt engineering
- Response caching where possible

**Execution Speed**:
- Parallel agent spawning
- Async file operations
- Lazy skill loading
- Minimal context switching

**Resource Usage**:
- File system efficiency
- Memory management for large files
- Cleanup of temporary files
- Optimized git operations

## References

### Internal Documentation
- [Project Overview PDR](./project-overview-pdr.md)
- [Codebase Summary](./codebase-summary.md)
- [Code Standards](./code-standards.md)
- [Design Guidelines](./design-guidelines.md)
- [Deployment Guide](./deployment-guide.md)

### External Resources
- [Claude Code Documentation](https://docs.claude.com/)
- [Open Code Documentation](https://opencode.ai/docs)
- [MCP Documentation](https://modelcontextprotocol.io/)
- [Semantic Versioning](https://semver.org/)
