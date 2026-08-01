# Decision Matrix — which orchestration layer?

ClauKit has four orchestration options. Pick by *control need* + *scale* + *persistence*, not by habit.

| Dimension | Plain subagent fan-out (Agent tool) | **`/ck:flow` (this skill)** | `/ck:team` (sessions) | Markdown workflow (`*.md`) |
|---|---|---|---|---|
| Engine | Agent tool, 1 turn | ClauKit primitives + 29 agents, gated | Independent Claude sessions | Prose the model interprets |
| Plan location | Claude context | ClauKit recipe + orchestrator context | Lead context + task list | Claude context |
| Control | Model picks | **Explicit / gated / inspectable** | Lead, turn by turn | Interpretive |
| Mid-run intervention | turn-by-turn | **Yes (gated, between phases)** | Yes (messaging) | turn-by-turn |
| Inheritance (4-axis) | Manual | **All 4, by design** | Task list | Manual |
| Scale | Few / turn | **10s (bounded by control)** | Handful of peers | N/A |
| Cross-session memory | No | No | **Yes** | No |
| Token cost | Low | Medium | Highest | Low |
| Best for | Quick parallel reads | **Controlled audits / migrations / cross-checked review / multi-angle plans** | 3+ workstreams needing discussion | Readable canonical recipe |

## Quick chooser

- **One-turn, a few independent reads, no verification needed** → plain subagent fan-out. Don't reach for `/ck:flow`.
- **Deterministic fan-out + verify, 10s of agents, want gates + cost preview + inspect/abort** → `/ck:flow`. The middle ClauKit was missing.
- **3+ genuinely independent workstreams that must discuss findings, hold competing hypotheses, or persist across sessions** → `/ck:team`. Heavier; only when discussion/memory is the point.
- **You just want a readable, reusable recipe a human can follow** → a markdown workflow in `.claude/workflows/`. `/ck:flow save <name>` produces exactly this.

## `/ck:flow` vs native dynamic workflows (reference, NOT used)

| | `/ck:flow` (ClauKit) | Native dynamic workflow |
|---|---|---|
| Engine | Stable Agent tool + 29 agents | Closed background JS runtime |
| Control | Gated, inspectable, main-session orchestrator | Delegated, unsupervised |
| Preview-stage dependency | **No** | Yes (v2.1.154+, API churn) |
| Relationship | **Re-creates the model, borrows quality patterns** | The reference model |

`/ck:flow` is the **sole blessed orchestration entry point**. Native `ultracode` / `/effort ultracode` is discouraged at every level — see SKILL.md guardrails.

## Overlap notes

- **vs `/ck:team`** — `/ck:team` spawns persistent peers with cross-session memory + discussion. `/ck:flow` is fire-and-synthesize fan-out with no persistence. If you don't need teammates to *talk*, you don't need `/ck:team`.
- **vs `/ck:security`** — a `/ck:review --flow` security dimension is a quick proactive pass; a deep OWASP audit is still `/ck:security`.
- **vs the canonical `.md` recipes** — `/ck:fix --flow` and `/ck:review --flow` **complement** their canonical pipelines; they never replace them. The `.md` recipe stays the readable default.
