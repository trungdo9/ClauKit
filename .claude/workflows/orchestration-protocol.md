# Orchestration Protocol

**IMPORTANT:** Analyze the skills catalog and activate the skills that are needed for the task during the process.

## Sequential Chaining

Chain subagents when tasks have dependencies or require outputs from previous steps:

- **Brainstorm → Planning → Review → Code**: Architectural/complex feature decisions (user-triggered via `/ck:brainstorm`)
- **Research → Design → Code → Documentation**: New system components
- **Research → Planning → Review**: Complex feature planning
- Each agent completes fully before the next begins
- Pass context and outputs between agents in the chain

## Plan-to-Code Handoff

When a task requires explicit plan approval before coding:

- Finish planning first and present the plan for user review
- After the user approves the plan, run `/clear` to start a fresh implementation context
- Begin coding from the approved plan only after the review → clear handoff is complete
- Preserve only the minimum required handoff context: goal, approved approach, plan path, constraints, unresolved questions

## Parallel Execution

Spawn multiple subagents simultaneously for independent tasks:

- **Code + Tests + Docs**: Separate, non-conflicting components
- **Multiple Feature Branches**: Different agents on isolated features
- **Cross-platform Development**: iOS and Android specific implementations
- **Careful Coordination**: No file conflicts or shared resource contention

## Parallel Patterns

### Fan-Out Pattern
```
Main Agent
    ├── Agent A (Task 1)
    ├── Agent B (Task 2)
    └── Agent C (Task 3)
    ↓
Combine Results
```

### Pipeline Pattern
```
Agent A → Agent B → Agent C → Agent D
```

## Controlled Workflow Orchestration

The 4th orchestration layer (above plain fan-out/pipeline): a **gated, inheritance-aware** re-creation of Claude Code's dynamic-workflow model, built on ClauKit primitives — markdown recipes + Agent-tool fan-out/pipeline over the 29 agents. Source of truth: the `dynamic-workflow` skill ([../skills/software/dynamic-workflow/SKILL.md](../skills/software/dynamic-workflow/SKILL.md)). Entry points: `/ck:flow <task>`, plus `/ck:fix --flow` and `/ck:review --flow` variants.

**It borrows the native feature's PATTERNS** (adversarial verify, judge panel, loop-until-dry, multi-modal sweep, completeness critic) — it does **NOT** call the native `Workflow` runtime or `ultracode`. ClauKit re-creates the model on primitives it fully controls.

**4-axis inheritance contract** (parent workflow → child agent stage → subagent):

1. **context/output** — all stages read/write shared `plans/<plan>/reports/`; a child reads the parent's handoff.
2. **persona** — a stage routes to one of the 29 agents via Agent `subagent_type`; zero new agent code.
3. **config/gate** — development-rules pre-flight + every parent gate apply to each stage; a child cannot silently skip a gate.
4. **model/budget** — a stage inherits or overrides the parent model; cost estimate shown pre-run, no hard cap (user decides).

**Control properties** — orchestrator runs in the main session; mandatory cost preview before fan-out; mid-run inspect/abort between phases. Bounded by control, so no native 1000-agent backstop is needed. See the skill's decision matrix for when to use this vs `/ck:team` vs plain subagent vs a markdown workflow.

## Agent Selection Guidelines

**Always specify `model` explicitly on every dispatch** — an omitted model inherits the session's (often the most expensive) and silently defeats tiering. Tier source of truth: [model-tiering.md](../skills/software/context-engineering/references/model-tiering.md).

| Scenario | Agent(s) | Tier |
|-----------|----------|------|
| Brainstorm & architecture advisory | `brainstormer` | most capable |
| Research & discovery | `researcher`, `scout` | standard / cheap |
| Planning | `planner` | most capable |
| Implementation (per-phase, complete brief) | `backend-developer` / `frontend-developer` | cheap–standard by work shape (matrix) |
| Testing | `tester` | standard |
| Code review | `code-reviewer` | standard floor; most capable for final whole-branch review |
| Debugging | `debugger` | standard |
| Documentation | `docs-manager` | cheap |
| Project management | `project-manager` | cheap |
| Git operations | `git-manager` | cheapest |

## Multi-Repo Dispatch

When a trace spans repositories: **one read-only `scout` agent per repo, dispatched concurrently in a single message** — never one agent roaming several checkouts, never serial main-context tracing. Each scout returns `file:line` **plus the data shape it observes at that boundary** (the shape is what makes cross-repo mismatches visible — a bare `int[]` where an object was expected is a real defect class). The main agent reconciles into one cross-repo trace: where the value originates, each hop, where it diverges. Feeds the verify-plan evidence table directly. The main session performs zero `Read`/`Bash` calls against non-primary repos.

## Post-Dispatch Verification

After any subagent dispatch that should change files: **verify the agent actually changed something (`git diff --stat`) before recording it complete.** "Agent reported success" is not evidence (Iron Law row). A 529/overload-killed agent leaves no diff and no error you'll see — no diff ⇒ append `phase <N>: agent died (no diff) — redispatch` to `STATE.md` and redispatch (with the one-tier fallback from model-tiering.md if the failure was overload).

## Conflict Resolution

When multiple agents work in parallel:
1. Define clear boundaries - each agent owns specific files
2. Use unique file prefixes/namespaces
3. Define integration points before execution
4. Designate a "merge agent" to consolidate changes

## Context Preservation

- Pass essential context between agents in chain
- Use shared file system for large context (plans/, reports/)
- Keep handoff minimal but sufficient
- **Artifacts are handed to subagents as FILE PATHS — hard rule.** Anything pasted into a dispatch — or printed back by a subagent — stays resident in the orchestrator's context and is re-read on every later turn (a real dispatch reached 42k chars, 99% pasted history). Use `scripts/ck/phase-brief.js` (phase brief), `scripts/ck/review-package.js` (reviewer diff file), `scripts/ck/run-workspace.js` (per-plan artifact dir). Reviewers always get a diff **file**; never `HEAD~1` as BASE (it silently truncates a multi-commit phase — use the phase's recorded base SHA).
- **The durable record is `plans/<plan>/STATE.md`** (`run-state` skill): append one line at every gate transition; a killed run resumes from the ledger + gate re-runs, not from recollection. TodoWrite is a UI mirror, never the record.