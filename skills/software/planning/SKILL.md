---
name: planning
description: Use when you need to plan technical solutions that are scalable, secure, and maintainable.
license: MIT
---

# Planning

Create detailed technical implementation plans through research, codebase analysis, solution design, and comprehensive documentation.

## When to Use

Use this skill when:
- Planning new feature implementations
- Architecting system designs
- Evaluating technical approaches
- Creating implementation roadmaps
- Breaking down complex requirements
- Assessing technical trade-offs

## Core Responsibilities & Rules

Always honoring **YAGNI**, **KISS**, and **DRY** principles.
**Be honest, be brutal, straight to the point, and be concise.**

### 1. Research & Analysis
Load: `references/research-phase.md`
**Skip if:** Provided with researcher reports

### 2. Codebase Understanding
Load: `references/codebase-understanding.md`
**Skip if:** Provided with scout reports

### 3. Solution Design
Load: `references/solution-design.md`

### 4. Plan Creation & Organization
Load: `references/plan-organization.md`

### 5. Task Breakdown & Output Standards
Load: `references/output-standards.md`

### 6. Predictive Planning · Forecasting Outcomes
Load: `references/forecasting-outcomes.md`
**When**: estimating timelines from team velocity, risk-scoring an architectural decision, predicting bottlenecks from a dependency graph. Use historical metrics, not gut feel. Distinct from solution design — predictive planning quantifies uncertainty rather than choosing among approaches.

## Workflow Process

1. **Initial Analysis** → Read codebase docs, understand context
2. **Research Phase** → Spawn researchers, investigate approaches
3. **Synthesis** → Analyze reports, identify optimal solution
4. **Design Phase** → Create architecture, implementation design
5. **Plan Documentation** → Write comprehensive plan
6. **Review & Refine** → Ensure completeness, clarity, actionability

## Output Formats

- **Default: Markdown** — `plan.md` + `phase-*.md` (the structure below). Always the single source of truth; `/ck:cook` consumes these.
- **`-o html` (opt-in):** ADDITIONALLY render one self-contained `plan.html` view, derived from the markdown. Markdown stays primary; html is a one-directional snapshot. Also supports **convert mode** — `/ck:plan <existing-plan.md> -o html` re-renders `plan.html` from an existing plan without re-planning. Full template + fill procedure: `references/html-output.md` (single source — do not duplicate HTML guidance elsewhere).

## Output Requirements

- DO NOT implement code - only create plans
- Respond with plan file path and summary
- Ensure self-contained plans with necessary context
- Include code snippets/pseudocode when clarifying
- Provide multiple options with trade-offs when appropriate
- Fully respect the `./docs/development-rules.md` file.

**Plan Directory Structure**
**Plan dir name:** `YYMMDD-HHmm-<slug>` — 6-digit date, from `bash -c 'date +%y%m%d-%H%M'` (PowerShell: `Get-Date -UFormat "%y%m%d-%H%M"`), never from model knowledge. `/ck:cook` resolves plan paths on this form; an 8-digit `YYYYMMDD` dir is a different name and will not be found.

```
plans/
└── 260805-1430-plan-name/
    ├── research/
    │   ├── researcher-XX-report.md
    │   └── ...
    ├── reports/
    │   ├── XX-report.md
    │   └── ...
    ├── scout/
    │   ├── scout-XX-report.md
    │   └── ...
    ├── plan.md
    ├── phase-XX-phase-name-here.md
    └── ...
```

## Plan Rigor (mandatory blocks — every `plan.md`)

Plans are executed by fresh per-phase implementers and resumed by sessions with no memory of this one; these five blocks are what make that safe. Details: `references/output-standards.md`.

1. **Global Constraints block** — project-wide requirements with **values copied verbatim** (limits, versions, naming, paths). Implicitly part of every phase; a phase implementer sees only its own phase, so constraints must not live in prose elsewhere.
2. **Interfaces per phase** — `Consumes:` / `Produces:` with exact signatures and types, so a fresh implementer that reads only its phase still learns neighboring names. This is also what keeps per-phase dispatch (cook Implement) from losing cross-phase knowledge.
3. **No Placeholders** — "TBD", "add appropriate error handling", "similar to Phase N", "write tests for the above" are **plan failures**, not shorthand. Every task names its files, values, and behavior.
4. **Exit gate per phase** — every phase declares its gate as an **executable check**: a command, a test id, or a query **with the expected result stated**. This is what lets a resumed run (`run-state` skill) re-derive true state instead of trusting status claims.
5. **Scope options table** — when the task *could* span >1 repo/layer: the **(A) minimal-surface vs (B) thorough** table (repos/layers touched + conventions followed/broken per option, recommendation marked). Produced by cook's scope lock; the plan records which option was picked and why.

6. **Plan Completeness block** — the plan's own explicit sign-off, the last section of `plan.md`. Six ticked items; the plan is not finished until it declares itself finished. Exact block: `references/output-standards.md`.

### Hand-over gate (hard) — `plan-lint`

A self-attested checklist is attested by the same agent that wrote the plan, so the checkable half is machine-checked instead:

```
node .claude/scripts/ck/plan-lint.cjs <plan-dir>      # 0 = PASS · 1 = violations · 2 = no plan.md
```

Verifies: `## Global Constraints` present and non-empty · every phase has a gate stating `<command> → <expected>` (`**Exit gate:**`, `**Acceptance:**` and `**Exit criteria:**` all count) · every phase declares `**Interfaces**` (or `**Interfaces:** none — no cross-phase surface`, a recorded decision rather than silence) · no banned placeholders outside code fences and quotations · the `## Plan Completeness` block exists with all six items ticked. Warns when the plan spans >1 top-level dir with no scope options table.

**Exit 1 ⇒ the plan does not leave the planner.** Do not present it for review, do not implement against it. The two items no script can settle — spec coverage and cross-phase type agreement — stay attestation-only and the tool says so rather than implying it checked them.

Why hard: without `## Global Constraints`, `.claude/scripts/ck/phase-brief.cjs` emits a "plan declares no Global Constraints" comment and **exits 0**, so every per-phase implementer works without the verbatim values and the violation only surfaces at review, three gates later. Run against this repo's own flagship plan the gate returns 11 violations — the failure mode is the normal case, not a hypothetical.

**Self-review checklist before handing the plan over:** spec coverage (every requirement maps to a phase) · placeholder scan (grep for TBD/appropriate/similar to) · type/name consistency across phases (Interfaces blocks agree) · every phase gate runnable · Global Constraints verbatim. Then run `plan-lint` — the checklist is the intent, the linter is the gate.

## Quality Standards

- Be thorough and specific
- Consider long-term maintainability
- Research thoroughly when uncertain
- Address security and performance concerns
- Make plans detailed enough for junior developers
- Validate against existing codebase patterns

**Remember:** Plan quality determines implementation success. Be comprehensive and consider all solution aspects.
