---
description: ⚡⚡⚡⚡⚡ Bootstrap a new project (default: step-by-step · auto: minimal Q&A · fast: parallel)
argument-hint: [user-requirements] [auto|fast]
---

Read the `bootstrap` skill file ([.claude/skills/software/development/bootstrap/SKILL.md](../../skills/software/development/bootstrap/SKILL.md)).

## User's Objectives & Requirements
<user-requirements>$ARGUMENTS</user-requirements>

## Mode dispatch (inspect `$ARGUMENTS` for first word)

| Mode | Workflow | Thinking budget |
|---|---|---|
| *(none)* | **default** — high-interaction step-by-step | **Ultrathink** |
| `auto` | **auto** — medium-interaction, minimal Q&A | **Ultrathink** |
| `fast` | **fast** — low-interaction, parallel research+planning | Think hard |

## Workflow

Follow the **Canonical Bootstrap Workflow** in the `bootstrap` skill (10-phase pipeline: Git Init → Research → Tech Stack → Planning → Wireframe & Design → Implementation → Testing → Code Review → Documentation → Onboarding → Final Report).

### Default mode (no arg) — high-interaction step-by-step
- **High user interaction:** ask one question at a time, wait for answer before next step.
- **Approval gates:** tech stack · plan · design · final commit/push.
- **Question style:** clarifying questions first ("Brutal Honesty" approach — challenge unrealistic/over-engineered ideas). Skip questions only when user already answered.

### `auto` mode — medium-interaction automated
- **Minimal user interaction** — no clarification questions; proceed with reasonable defaults.
- **Approval gates:** design approval · final commit/push approval.
- **Phase 0 (Git Init):** auto-init without asking (use `main` branch).
- **Skip Phase 2 step "Ask user for tech stack"** — directly use `planner` + `researcher` to choose.
- **Skip Phase 1 questioning** — straight to research.

### `fast` mode — low-interaction parallel
- **Lowest user interaction.** No clarification questions; reasonable defaults; no design approval gate.
- **Phase 0:** auto-init Git (`main` branch).
- **Phases 1+2+4 run in parallel** — fire all researchers simultaneously: idea-validation researchers + tech-stack researchers + design researchers. Max 2 agents per group, max 5 sources each.
- **Phase 3 (Planning):** after all parallel research completes, `frontend-developer` (with `aesthetic` + `frontend-design` skills) creates design guidelines + wireframes, then `planner` creates the implementation plan from all reports.
- **Phase 10 (Final Report):** `git-manager` creates commits **but does NOT push to remote**.

## Important
- **DO NOT implement** before plan is approved by user (applies in default + `auto` modes; `fast` skips this gate).
- All other rules → `bootstrap` skill.
