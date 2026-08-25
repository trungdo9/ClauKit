# KitForge Commands Reference

A comprehensive guide to all available slash commands in KitForge.

## Table of Contents

- [Introduction](#introduction)
- [Core Development Commands](#core-development-commands)
- [Content Creation Commands](#content-creation-commands)
- [Design Commands](#design-commands)
- [Documentation Commands](#documentation-commands)
- [Fix & Debug Commands](#fix--debug-commands)
- [Git Commands](#git-commands)
- [Planning Commands](#planning-commands)
- [Integration Commands](#integration-commands)

---

## Introduction

### What are Slash Commands?

Slash commands are powerful shortcuts that trigger specialized AI agents and workflows in KitForge. They follow the simple syntax:

```bash
/ck:<command-name> [arguments]
```

Commands are stored in `.claude/commands/ck/` and invoked as `/ck:<name>` (e.g. `/ck:cook`, `/ck:fix ci`).

### Benefits

- **Instant Agent Orchestration**: Trigger specialized agents with a single command
- **Consistent Workflows**: Standardized processes across your team
- **Time Savings**: Automate complex multi-step operations
- **Context Preservation**: Maintain project context across agent handoffs

---

## Core Development Commands

### `/ck:ask`

**Description**: Answer technical and architectural questions with expert consultation.

**Usage**:
```bash
/ck:ask [technical-question]
```

**Examples**:
```bash
/ck:ask "Should we use Redis or Memcached for our caching layer?"
/ck:ask "How can we scale our database to handle 1M concurrent users?"
```

---

### `/ck:bootstrap`

**Description**: Bootstrap a new project from scratch with complete setup.

**Usage**:
```bash
/ck:bootstrap
```

**Workflow**:
1. Git Initialization
2. Requirements Gathering
3. Research (multiple agents)
4. Tech Stack Selection
5. Wireframe & Design
6. Implementation
7. Testing
8. Code Review
9. Documentation

---

### `/ck:brainstorm`

**Description**: Brainstorm solutions for features or technical challenges.

**Usage**:
```bash
/ck:brainstorm [feature-or-question]
```

**Examples**:
```bash
/ck:brainstorm "How should we implement user authentication?"
/ck:brainstorm "Best way to handle file uploads for large files?"
```

---

### `/ck:cook`

**Description**: Drive a feature spec → production through the full lifecycle (research, plan, code, test, review). Backed by the `cook` skill methodology (5-stage gated pipeline).

**Usage**:
```bash
/ck:cook [task hoặc plan path] [--fast|--auto|--from-plan|--no-test]
```

**Modes**:

| Flag | Effect |
|---|---|
| (default) | Full pipeline with user approval gates between stages |
| `--fast` | Skip research phase; keep plan + test + review |
| `--auto` | Skip user approval gates; auto-approve if code review reports `Critical=0 AND High=0` |
| `--from-plan` | Skip research + plan; jump to implementation (auto-set if argument is a plan path) |
| `--no-test` | Skip test stage; logs a visible waiver per cook skill rule |

**Workflow stages** (cook skill methodology):
1. **Analysis** — read plan/task, activate cook skill + supporting skills
2. **Research** (skipped in `--fast`/`--from-plan`) — parallel `researcher` + `scout`
3. **Plan** (skipped in `--from-plan`) — `planner` creates `./plans/<timestamp>-<slug>/plan.md`; user reviews
4. **Implementation** — `frontend-developer` / `backend-developer` / `ui-ux-designer`; phase-by-phase
5. **Testing** (skipped in `--no-test`) — `tester` + `debugger`; 100% pass, no fake data
6. **Code Review** — `code-reviewer` emits severity buckets; gate by user or auto-approve rule
7. **PM + Docs** — `project-manager` + `docs-manager` in parallel
8. **Onboarding + Final Report** — user instructions, optional `git-manager` commit

**Tip**: pass a plan path directly (e.g. `/ck:cook plans/.../plan.md`) to auto-enable `--from-plan` and jump straight to implementation.

**Examples**:
```bash
/ck:cook "add user profile page with avatar upload"
/ck:cook "implement OAuth2 authentication with Google" --auto
/ck:cook plans/260517-1430-auth/plan.md
/ck:cook plans/.../plan.md --auto
/ck:cook "prototype landing hero" --fast
```

---

### `/ck:debug`

**Description**: Analyze and debug technical issues without implementing fixes.

**Usage**:
```bash
/ck:debug [issue-description]
```

**Examples**:
```bash
/ck:debug "Memory leak in user service"
/ck:debug "API responses are slow after deployment"
```

**Note**: Use `/ck:fix:*` commands to implement fixes.

---

### `/ck:journal`

**Description**: Write journal entries about recent development work.

**Usage**:
```bash
/ck:journal
```

---

### `/ck:plan`

**Description**: Research, analyze, and create implementation plan without coding.

**Usage**:
```bash
/ck:plan [task-description]
```

**Examples**:
```bash
/ck:plan "implement WebSocket real-time notifications"
/ck:plan "add multi-language support with i18n"
```

**Note**: `/ck:plan` stops before implementation. After reviewing the plan, run `/ck:cook plans/.../plan.md` to execute it.

---

### `/ck:scout`

**Description**: Fast codebase search to find files needed for a task.

**Usage**:
```bash
/ck:scout [user-prompt] [scale]
```

**Arguments**:
- `$1`: What you're looking for
- `$2`: Number of agents (default: 3)

**Examples**:
```bash
/ck:scout "authentication related files" 3
/ck:scout "database models and migrations" 5
```

---

### `/ck:test`

**Description**: Run tests and analyze results without implementing fixes.

**Usage**:
```bash
/ck:test
```

---

### `/ck:watzup`

**Description**: Review recent changes and wrap up work session.

**Usage**:
```bash
/ck:watzup
```

---

## Content Creation Commands

### `/ck:content:enhance`

**Description**: Analyze and enhance existing copy based on reported issues.

**Usage**:
```bash
/ck:content:enhance [issues-description]
```

---

### `/ck:content:fast`

**Description**: Write creative & smart copy quickly.

**Usage**:
```bash
/ck:content:fast [user-request]
```

**Examples**:
```bash
/ck:content:fast "Write hero section for SaaS landing page"
/ck:content:fast "Create compelling CTA button text"
```

---

### `/ck:content:good`

**Description**: Write high-quality creative & smart copy with research.

**Usage**:
```bash
/ck:content:good [user-request]
```

---

## Design Commands

### `/ck:design:fast`

**Description**: Create a quick design implementation.

**Usage**:
```bash
/ck:design:fast [design-requirements]
```

---

### `/ck:design:good`

**Description**: Create immersive, award-winning quality design.

**Usage**:
```bash
/ck:design:good [design-requirements]
```

---

### `/ck:design:3d`

**Description**: Create immersive interactive 3D designs with Three.js.

**Usage**:
```bash
/ck:design:3d [3d-design-requirements]
```

---

### `/ck:design:screenshot`

**Description**: Create design based on a screenshot.

**Usage**:
```bash
/ck:design:screenshot [screenshot-path-or-url]
```

---

### `/ck:design:video`

**Description**: Create design based on a video reference.

**Usage**:
```bash
/ck:design:video [video-path-or-url]
```

---

### `/ck:design:describe`

**Description**: Describe a design from screenshot/video without implementing.

**Usage**:
```bash
/ck:design:describe [screenshot-or-video]
```

---

## Documentation Commands

### `/ck:docs:init`

**Description**: Analyze codebase and create initial documentation.

**Usage**:
```bash
/ck:docs:init
```

---

### `/ck:docs:summarize`

**Description**: Update codebase summary documentation.

**Usage**:
```bash
/ck:docs:summarize
```

---

### `/ck:docs:update`

**Description**: Comprehensively update all documentation.

**Usage**:
```bash
/ck:docs:update [additional-requests]
```

---

## Fix & Debug Commands

### `/ck:fix:ci`

**Description**: Analyze GitHub Actions logs and fix CI/CD issues.

**Usage**:
```bash
/ck:fix:ci [github-actions-url]
```

---

### `/ck:fix:fast`

**Description**: Quickly analyze and fix issues.

**Usage**:
```bash
/ck:fix:fast [issue-description]
```

---

### `/ck:fix:hard`

**Description**: Plan and fix hard issues with full workflow.

**Usage**:
```bash
/ck:fix:hard [complex-issue-description]
```

---

### `/ck:fix:logs`

**Description**: Analyze logs file and fix issues.

**Usage**:
```bash
/ck:fix:logs [issue-context]
```

**Requirement**: Must have `./logs.txt` file.

---

### `/ck:fix:test`

**Description**: Run test suite and fix all failures.

**Usage**:
```bash
/ck:fix:test [issue-context]
```

---

### `/ck:fix:types`

**Description**: Fix TypeScript type errors.

**Usage**:
```bash
/ck:fix:types
```

---

## Git Commands

### `/ck:git:cm`

**Description**: Stage all files and create a commit.

**Usage**:
```bash
/ck:git:cm
```

---

### `/ck:git:cp`

**Description**: Stage, commit, and push all changes.

**Usage**:
```bash
/ck:git:cp
```

---

## Planning Commands

### `/ck:plan:ci`

**Description**: Analyze GitHub Actions and provide fix plan (no implementation).

**Usage**:
```bash
/ck:plan:ci [github-actions-url]
```

---

### `/ck:plan:two`

**Description**: Create implementation plan with 2+ approaches.

**Usage**:
```bash
/ck:plan:two [task-description]
```

---

## Integration Commands

### `/ck:sepay`

**Description**: Implement payment integration with SePay (Vietnamese payment gateway).

**Usage**:
```bash
/ck:sepay [requirements]
```

---

## Best Practices

### Choosing the Right Command

**For Planning**:
- `/ck:plan` - Single approach
- `/ck:plan two` - Compare 2 approaches
- `/ck:brainstorm` - Exploratory discussion
- `/ck:ask` - Architectural consultation

**For Implementation**:
- `/ck:cook` - Full lifecycle: research → plan → code → test → review (primary)
- `/ck:cook plans/.../plan.md` or `/ck:cook ... --from-plan` - Execute an approved plan
- `/ck:bootstrap` - New projects
- `/ck:design` - UI/UX work
- `/ck:sepay` - Payment integration

**For Fixing Issues**:
- `/ck:fix --quick` - Simple bugs
- `/ck:fix` - Full fix pipeline
- `/ck:fix types` - TypeScript errors
- `/ck:fix test` - Test failures

---

## CLI Commands

KitForge also provides a CLI tool:

```bash
# Install globally
npm install -g https://github.com/trungdo9/ClauKit.git

# Initialize .claude in your project
ck init
ck init --force    # Overwrite existing

# Show help
ck help
```

---

**Last Updated**: 2026-05-22

Repository: https://github.com/trungdo9/ClauKit
