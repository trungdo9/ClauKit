---
name: dynamic-workflow
description: Controllable re-creation of Claude Code's dynamic-workflow model on ClauKit's own primitives — markdown recipes + Agent-tool fan-out/pipeline over the 29 existing agents, with 4-axis inheritance and hard gates. Use when a task needs deterministic large-ish fan-out + verification (whole-repo audit, N-file migration, cross-checked review, multi-angle plan) under explicit control, NOT the native closed runtime.
category: Orchestration
status: active
---

# Dynamic Workflow

## What This Skill Does

Defines ClauKit's **controllable orchestration model**: take one task, decompose it into phases, fan-out/pipeline those phases over the 29 existing agents, gate between phases, and synthesize a single report — all driven by an orchestrator running **in the main session under explicit control**.

This **re-creates** Claude Code's native dynamic-workflow model (workflow → agent → subagent, with inheritance) on primitives ClauKit fully controls. It borrows the *patterns* (adversarial verify, judge panel, loop-until-dry, multi-modal sweep, completeness critic) — it does **NOT** call the native `Workflow` tool or `ultracode` runtime. The native feature is the *reference model*; this skill is the controllable substitute.

This is **knowledge only** — no execution logic. The `/ck:flow` command ([.claude/commands/ck/flow.md](../../../commands/ck/flow.md)) is the trigger that activates this skill; `/ck:fix --flow` and `/ck:review --flow` are flag-variants that reuse this model. Trio rule: skill = knowledge, agent = persona, command = trigger.

## When to Use

Reach for this model when the task is a **deterministic fan-out + verify** at moderate scale (10s of agents), and you want it gated and inspectable:

- Whole-repo / whole-module **audit** (security, quality, dead code).
- **N-file migration** or mechanical sweep needing per-file verification.
- **Cross-checked review** — multiple dimensions, each finding adversarially verified.
- **Multi-angle plan** — N independent attempts judged + synthesized.

**Avoid when** — see [references/decision-matrix.md](references/decision-matrix.md):
- Quick one-turn parallel reads → plain subagent fan-out (Agent tool directly).
- 3+ workstreams needing persistent sessions + discussion + cross-session memory → `/ck:team`.
- A single readable canonical recipe is enough → markdown workflow (`.claude/workflows/*.md`).

## Decomposition Model

```
workflow (recipe + main-session orchestrator)   ← holds the loop + gates, IN main session
   └── agent stage (one of 29 personas via subagent_type)
          └── subagent (delegate within a stage)
```

The **orchestrator stays in the main session** — it holds the phase loop, the gate decisions, and the synthesis. This is the control advantage over the native runtime (which runs the plan as background JS, unsupervised). Each phase routes to a persona via the Agent tool's `subagent_type`; a phase may itself fan-out to several agents (parallel) or chain them (pipeline).

## 4-Axis Inheritance Contract

The differentiator vs plain subagent fan-out: parent workflow → child agent → subagent inherit along **four named axes**. Full table + ClauKit examples in [references/inheritance-contract.md](references/inheritance-contract.md).

1. **context/output** — every stage reads/writes the shared `plans/<plan>/reports/` dir; a child reads the parent's handoff file. No re-discovery.
2. **persona** — a stage routes to `code-reviewer`/`debugger`/`scout`/`planner`/`tester`/etc. via Agent `subagent_type`. Zero new agent code — the 29 existing agents ARE the persona library.
3. **config/gate** — development-rules pre-flight + every parent gate apply to every stage; a child stage **cannot silently skip** a gate.
4. **model/budget** — a stage inherits the parent model or overrides it (e.g. parent `opus`, verify-skeptics `haiku`). **Always name the model explicitly per stage** — tier by work shape per [model-tiering.md](../context-engineering/references/model-tiering.md) (single source: matrix, turn-count-beats-token-price, 529 one-tier fallback, dead-agent diff check). Cost estimate shown pre-run; **no injected hard cap** — the user decides.

## Quality Patterns

Borrowed from the native feature, expressed as **ClauKit orchestration** (Agent-tool fan-out/pipeline) — never native JS `agent()/parallel()/pipeline()`. Full recipes in [references/quality-patterns.md](references/quality-patterns.md).

- **Adversarial verify** — N independent skeptic agents per finding, each prompted to *refute* (default `refuted=true` if unsure); kill the finding on majority refute. Filters plausible-but-wrong findings.
- **Judge panel** — N independent attempts from different angles → score → synthesize from the winner. Beats one-attempt-iterated.
- **Loop-until-dry** — re-spawn finders until K consecutive rounds surface nothing new. Catches the tail a single pass misses.
- **Multi-modal sweep** — parallel agents each searching a different way (by-container, by-content, by-entity).
- **Completeness critic** — a final agent asks "what's missing?" → its findings become the next round.

## Guardrails

- **Never recommend native `ultracode`** — neither the `ultracode` keyword nor `/effort ultracode`. CLAUDE.md never enables session-wide ultracode. `/ck:flow` is the sole blessed orchestration entry point and is independent of the native runtime.
- **Cost preview is mandatory** — show the phase plan + token/budget estimate range before any fan-out; user approves / adjusts / aborts.
- **Control-first** — gates between phases + mid-run inspect/abort. Bounded by control, so no native 1000-agent backstop is needed.
- **Preserve all 4 inheritance axes** — a stage that drops one (e.g. doesn't read the parent handoff) breaks the model.
- **Borrow patterns, not the runtime** — express everything as ClauKit fan-out/pipeline.

> ⚠️ **Patterns mirror Claude Code dynamic-workflows (research preview).** Reference model verified **2026-06-03** — borrow patterns, do **NOT** call the native runtime. Re-verify <https://code.claude.com/docs/en/workflows> before relying on native signatures. No version floor: this skill uses the stable Agent tool, not the v2.1.154+ preview API.

## Cross-links

`[[team]]` (persistent multi-session), `[[orchestrate]]` / orchestration-protocol (4th layer), `[[cook]]` (gated lifecycle), `[[code-review]]`, `[[planning]]`, `[[scenario]]`. Entry points: `/ck:flow <task>`, `/ck:fix --flow`, `/ck:review --flow`.
