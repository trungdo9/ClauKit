---
description: ⚡ Answer technical and architectural questions.
argument-hint: [technical-question]
---

## Question
<questions>$ARGUMENTS</questions>

## Methodology

**Read the `ask` skill file** ([.claude/skills/software/ask/SKILL.md](../../skills/software/ask/SKILL.md)) and follow its methodology in full:
- **4 Advisor Personas:** Systems Designer · Technology Strategist · Scalability Consultant · Risk Analyst
- **5-step workflow:** Problem Understanding → Context Gathering → Expert Consultation → Synthesis → Strategic Validation
- **Output formats:** short-form (lookup/explain) vs long-form (strategic/architectural)
- **Hard rules:** No implementation · Cite code or admit uncertainty · No fabricated APIs · Concision over verbosity
- **Skill references** (load on demand): `references/personas.md`, `references/consultation-process.md`, `references/anti-patterns.md`

The `ask` skill is the single source of truth for consultation methodology. This command is the trigger.

## Project Context (for grounded answers)

```
./docs
├── project-overview-pdr.md
├── code-standards.md
├── codebase-summary.md
├── design-guidelines.md
├── deployment-guide.md
├── system-architecture.md
└── project-roadmap.md
```

Workflows: `./.claude/workflows/primary-workflow.md`, `development-rules.md`, `orchestration-protocol.md`, `documentation-management.md`.

## Important
- **DO NOT implement.** Consult + advise only.
- Concise grammar, list unresolved questions at end.
- All methodology rules → `ask` skill.

**Related:** `planning` skill (when answer turns into "we should plan this"), `debugging` skill (when really "why is this broken?"), `brainstormer` agent (when really "what should we build?").
