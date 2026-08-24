# 4-Axis Inheritance Contract

Parent workflow → child agent stage → subagent inherit along **four named axes**. This is what makes `/ck:flow` more than plain subagent fan-out: inheritance is *by design*, not manual re-plumbing each call.

## Axis 1 — context / output

All stages read and write a **shared report directory**: `plans/<plan>/reports/`.

- A child stage reads the parent's handoff file (e.g. `reports/scout-flow.md`) instead of re-discovering context.
- A child writes its result to a named file the next stage consumes.
- The orchestrator (main session) reads every report to synthesize the final answer.

**Example** — fix `--flow`: `scout` writes `reports/scout-flow.md` → `debugger` reads it, writes `reports/diagnose-flow.md` → skeptics read that to refute.

## Axis 2 — persona (the agent bridge)

Each stage routes to one of the **30 existing agents** via the Agent tool's `subagent_type`. **Zero new agent code** — the 30 agents ARE the persona library. The model is implemented purely by pointing `subagent_type` at the right persona.

| Stage intent | `subagent_type` | Example use |
|---|---|---|
| locate files / discover | `scout` (or `scout-external`) | find blast radius before diagnose |
| diagnose / root-cause | `debugger` | log/CI/runtime failure analysis |
| review code | `code-reviewer` | per-dimension review fan-out |
| security depth | `security-auditor` | OWASP / deep vuln pass |
| plan | `planner` | turn findings into an impl plan |
| test | `tester` | run suite, verify regressions |
| research | `researcher` | external best-practice gather |
| UI diagnose/fix | `ui-ux-designer` | visual regression |
| backend / frontend impl | `backend-developer` / `frontend-developer` | apply the fix |
| DB | `database-admin` | schema/query work |
| docs | `docs-manager` | update `./docs/*` |
| project tracking | `project-manager` | plan progress |
| git | `git-manager` | commit/push |
| integrations | `integration-agent` | 3rd-party APIs |
| perf | `performance-agent` | profiling/optimization |
| MCP | `mcp-manager` | MCP tool discovery |
| brainstorm | `brainstormer` | architecture options |
| copy | `copywriter` | marketing/content |
| journal | `journal-writer` | incident log |

The full 21: `backend-developer`, `code-reviewer`, `debugger`, `docs-manager`, `frontend-developer`, `journal-writer`, `performance-agent`, `planner`, `project-manager`, `tester`, `copywriter`, `database-admin`, `security-auditor`, `ui-ux-designer`, `git-manager`, `integration-agent`, `mcp-manager`, `researcher`, `scout`, `scout-external`, `brainstormer`.

**Skeptics for adversarial verify** are independent instances of the *same* persona prompted to refute (e.g. review skeptics = independent `code-reviewer` instances).

## Axis 3 — config / gate

Every stage inherits:

- **development-rules pre-flight** (`.claude/workflows/development-rules.md`) — applies to every orchestrated stage.
- **All parent gates** — e.g. fix's Scout Gate (5 items) + Root-Cause Gate (6 questions); review's repo conventions.

A child stage **cannot silently skip** an inherited gate. If a gate cannot pass, the stage halts and reports up — it does not proceed on a guess. This propagation is the safety backbone of the model.

## Axis 4 — model / budget

- A stage **inherits the parent model** by default, or **overrides** it via the Agent `model` option.
- Common pattern: parent reasons on `opus`; cheap verify-skeptics run on `haiku` to keep cost down (budget axis).
- A **cost estimate** (phase count × agents/phase × model-tier token band) is shown **before** the run as a range + caveat.
- **No injected hard cap** — the estimate informs; the user decides whether to run, adjust, or abort. Control replaces the native runtime's 1000-agent backstop.

## Why all four matter

Drop any one axis and the model degrades to plain fan-out: lose context/output → re-discovery + token waste; lose persona → generic agents miss domain nuance; lose gate → "imagined context" fixes slip through; lose model/budget → either over-spend or under-power. Preserve all four.
