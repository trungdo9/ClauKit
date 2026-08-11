# Output Standards & Quality

## Mandatory Plan Blocks (rigor)

### Global Constraints
One block near the top of `plan.md`: project-wide requirements with **values copied verbatim** — file-size limits, framework versions, naming schemes, forbidden dependencies, target paths. Implicitly part of every phase. Never "see CLAUDE.md" — the value itself, inline, so a phase-scoped implementer cannot miss it.

### Interfaces (per phase)
```markdown
**Interfaces**
- Consumes: `parseClaims(raw: string): Claim[]` (from phase 2, `src/claims/parse.ts`)
- Produces: `resolveConflicts(claims: Claim[], session: string): Conflict[]` — exported from `src/claims/resolve.ts`
```
Exact signatures and types. A fresh implementer reading only its phase learns every neighboring name it must call or provide.

### No Placeholders
Ban list (each is a plan failure, not shorthand): `TBD` · "add appropriate error handling" · "similar to Phase N" · "write tests for the above" · "handle edge cases". If the plan can't state it concretely, the planning isn't done.

### Exit gate per phase (executable)
```markdown
**Exit gate:** `npm test -- claims.test.js` → 12 pass, 0 fail
```
A command / test id / query **plus its expected result** — not prose ("tests pass"). These gates are what `run-state` resume re-runs to verify a phase is genuinely complete, and what STATE.md gate lines cite as evidence.

### Scope options table (when the task could span >1 repo/layer)
| Option | Repos/layers touched | Conventions followed / broken | Recommended |
|---|---|---|---|
| A (minimal) | … | … | ✓ |
| B (thorough) | … | … | |
Record which option was picked. Produced by cook's scope-lock gate; the rejected option feeds the PR body's Tradeoffs section.

### Plan Completeness (the plan's sign-off — last section of `plan.md`)

Copy this block verbatim and tick every box. `plan-lint` requires all six, refuses any left unticked, and independently re-verifies four of them from the file — a ticked box cannot stand in for the thing it claims.

```markdown
## Plan Completeness

- [x] spec coverage — every requirement maps to a phase
- [x] placeholder scan clean
- [x] Interfaces blocks consistent across phases
- [x] every phase gate is a runnable command with a stated expected result
- [x] Global Constraints values verbatim, not referenced
- [x] scope option recorded (A minimal / B thorough) — or N/A, single layer
```

Machine-checked: placeholders · phase gates · Interfaces presence · Global Constraints. Attestation-only: spec coverage · cross-phase type agreement.

### Self-review checklist (before hand-over)
- [ ] every requirement maps to a phase (spec coverage)
- [ ] placeholder scan clean (`grep -inE 'TBD|appropriate|similar to phase' plan.md phase-*.md`)
- [ ] Interfaces blocks consistent across phases (names/types agree)
- [ ] every phase gate is a runnable command with a stated expected result
- [ ] Global Constraints values verbatim, not referenced
- [ ] `node .claude/scripts/ck/plan-lint.cjs <plan-dir>` exits 0 — **hard gate**, the plan does not leave the planner otherwise

## Task Breakdown

- Transform complex requirements into manageable, actionable tasks
- Each task independently executable with clear dependencies
- Prioritize by dependencies, risk, business value
- Eliminate ambiguity in instructions
- Include specific file paths for all modifications
- Provide clear acceptance criteria per task

### File Management
List affected files with:
- Full paths (not relative)
- Action type (modify/create/delete)
- Brief change description
- Dependencies on other changes
- Fully respect the `./docs/development-rules.md` file.

## Workflow Process

1. **Initial Analysis** → Read docs, understand context
2. **Research Phase** → Spawn researchers in parallel, investigate approaches
3. **Synthesis** → Analyze reports, identify optimal solution
4. **Design Phase** → Create architecture, implementation design
5. **Plan Documentation** → Write comprehensive plan in Markdown (source of truth). If `-o html` passed, also render `plan.html` per `html-output.md`.
6. **Review & Refine** → Ensure completeness, clarity, actionability

## Output Requirements

### What Planners Do
- Create plans ONLY (no implementation)
- Provide plan file path and summary
- Self-contained plans with necessary context
- Code snippets/pseudocode when clarifying
- Multiple options with trade-offs when appropriate
- Fully respect the `./docs/development-rules.md` file.

### Writing Style
**IMPORTANT:** Sacrifice grammar for concision
- Focus clarity over eloquence
- Use bullets and lists
- Short sentences
- Remove unnecessary words
- Prioritize actionable info

### Unresolved Questions
**IMPORTANT:** List unresolved questions at end
- Questions needing clarification
- Technical decisions requiring input
- Unknowns impacting implementation
- Trade-offs requiring business decisions

## Quality Standards

### Thoroughness
- Thorough and specific in research/planning
- Consider edge cases, failure modes
- Think through entire user journey
- Document all assumptions

### Maintainability
- Consider long-term maintainability
- Design for future modifications
- Document decision rationale
- Avoid over-engineering
- Fully respect the `./docs/development-rules.md` file.

### Research Depth
- When uncertain, research more
- Multiple options with clear trade-offs
- Validate against best practices
- Consider industry standards

### Security & Performance
- Address all security concerns
- Identify performance implications
- Plan for scalability
- Consider resource constraints

### Implementability
- Detailed enough for junior developers
- Validate against existing patterns
- Ensure codebase standards consistency
- Provide clear examples

**Remember:** Plan quality determines implementation success. Be comprehensive, consider all solution aspects.
