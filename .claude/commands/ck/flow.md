---
description: ⚡⚡⚡ Controllable orchestration — plan phases, fan-out/pipeline over the 21 agents, gated, cost-previewed (re-creates dynamic workflows; never native ultracode)
argument-hint: [<task> | save <name> | list] [--model <m>] [--dry-run]
---

**Activate the `dynamic-workflow` skill** ([.claude/skills/software/dynamic-workflow/SKILL.md](.claude/skills/software/dynamic-workflow/SKILL.md)) — **single source of truth** for the orchestration model (decomposition, 4-axis inheritance, quality patterns, guardrails). This command is the **trigger**; it does NOT redefine methodology. Orchestrator runs IN the main session under explicit control.

## Variables

ARGS: `$ARGUMENTS` (full input)
MODE: `save` or `list` if `$1` matches exactly; else `run`
TASK: ARGS minus the mode keyword/name (the thing to orchestrate)
NAME: `$2` when MODE=`save` (recipe filename)
MODEL: `--model <m>` value — override parent/default model for stages, optional
DRY_RUN: `--dry-run` present → stop after PREVIEW (show plan + estimate, don't orchestrate)

## Dispatch

1. `list` → enumerate `.claude/workflows/*.md` whose frontmatter has `kind: flow-recipe`; print name + one-line purpose.
2. `save <name>` → persist the last run's recipe (see **save** below).
3. anything else (`run`, default) → the 4-stage orchestration below on TASK.

> **Mode parse rule:** treat `$1` as a keyword ONLY when it is exactly `save` or `list`. Otherwise the whole of ARGS is the `<task>`. Document this so "list the auth modules" stays a task, not `list` mode.

## Run (default) — 4 stages

Orchestrator = main session, under control. Apply the skill's 4-axis inheritance to every stage.

**Environment pre-flight (before any phase that edits files):** `node .claude/hooks/file-claims.js list` → a `FOREIGN` claim (or dirty work you didn't author) means another live session shares this tree; provision an isolated worktree via `node scripts/ck/wt-new.js <slug>`, verify with `node scripts/ck/wt-doctor.js` (**unhealthy → refuse to orchestrate edits**), and record the worktree path in `plans/<plan>/STATE.md`. Append one `STATE.md` line after every phase gate (run-state skill).

1. **PLAN** — decompose TASK → phases. Each phase declares: persona (`subagent_type`), shape (fan-out | pipeline), gate set, model. Pick quality patterns from the skill (adversarial verify, judge panel, loop-until-dry, multi-modal sweep, completeness critic) as the task warrants.
2. **PREVIEW (mandatory gate)** — print the phase plan + chosen personas/models + a **cost estimate range**. Ask **approve / adjust / abort**. NO orchestration without approval. If `--dry-run` → stop here.
   - **Estimate heuristic** (range + caveat, not a promise): `phases × avg-agents-per-phase × model-tier token band`. Show as a band (e.g. "~8–14 agent calls, est. 60k–120k output tokens, mixed opus/haiku") with the caveat that loop-until-dry / completeness-critic rounds may extend it. **No injected hard cap — user decides.**
3. **ORCHESTRATE** — execute phases: fan-out via parallel Agent calls, pipeline via staged Agent calls. Children write to `plans/<plan>/reports/` (context/output axis). **Offer inspect/abort between phases** — the control advantage over the native runtime.
4. **SYNTHESIZE** — orchestrator consolidates child reports → a single report. Confirmed-only where adversarial verify ran. List unresolved questions at the end.

## save `<name>`

Persist the **last run's phase structure** as a reusable markdown recipe:

- Path: `.claude/workflows/<name>.md` — so `ck init` copies it (recursive, no extension filter) into other projects.
- Frontmatter: `kind: flow-recipe` (so `list` can find it) + a one-line `description:`.
- Format: orchestration spec — a **phases table** (phase · persona · shape · gate · model) + persona-routing notes + inheritance notes + the chosen quality patterns. The `<task>` slot is **parametrized** (templatized), not the specific task text.
- Re-run later via **`/ck:flow <task>`** pointing the orchestrator at the saved recipe. (Recipes live in `.claude/workflows/`, which is NOT slash-invocable — only `.claude/commands/` resolves as `/<name>`; a recipe is a reusable plan for `/ck:flow`, not a standalone command.)
- Before writing: confirm the proposed `<name>` with the user.

## list

Enumerate `.claude/workflows/*.md` whose frontmatter has `kind: flow-recipe` → print `name` + `description` so the user can pick one to re-run via `/ck:flow`.

## Gates

- **development-rules pre-flight** inherited by every orchestrated stage (config/gate axis) — cannot be silently skipped by a child.
- **Cost preview mandatory** before any fan-out (decision: show estimate, no cap).
- **Mid-run inspect/abort** offered between phases — prevents runaway without a hard backstop.

## Examples

- `/ck:flow audit auth module for security` — plan → preview gate → fan-out review/verify → synthesize.
- `/ck:flow migrate 12 components from class to hooks` — pipeline per file + per-file verify.
- `/ck:flow plan the notifications system --model opus --dry-run` — show phase plan + estimate, don't run.
- `/ck:flow save security-audit` — save last run as `.claude/workflows/security-audit.md` (re-run via `/ck:flow`).
- `/ck:flow list` — list saved flow recipes.

## Relationship to Other Commands

- `/ck:team` — persistent multi-session peers with cross-session memory + discussion. Use `/ck:flow` instead for **deterministic fan-out + verify** that needs no discussion. (See skill decision matrix.)
- **Plain subagent fan-out** — quick one-turn parallel reads; reach for `/ck:flow` only when you want gates + cost preview + verification.
- **Markdown workflow** (`.claude/workflows/*.md`) — the readable canonical recipe; `save` produces one.
- `/ck:fix --flow` + `/ck:review --flow` — flag-variants that reuse THIS orchestration model on existing pipelines (they complement, never replace, the canonical `.md` recipes).

**REMEMBER:**
- The `dynamic-workflow` skill is the source of truth; this command is the trigger.
- **Never** recommend native `ultracode` / `/effort ultracode`. `/ck:flow` is ClauKit's controllable re-creation, independent of the native runtime.
- Preview gate + inspect/abort keep the user in control of token spend + scope.
