---
description: 🤖 Orchestrate parallel multi-session collaboration with independent Claude Code teammates
argument-hint: <template> [context] [--devs N|--researchers N|--reviewers N|--debuggers N] [--plan-approval] [--delegate]
---

**Spawn an Agent Team — multiple independent Claude Code sessions (teammates) collaborating in parallel.** Follow the `team` skill methodology and the Orchestration Protocol.

<task>$ARGUMENTS</task>

---

## Role Responsibilities

- You are the **team lead**. Spawn teammates, assign tasks, coordinate handoffs, and report final outcomes to the user.
- Read the `team` skill file ([.claude/skills/software/team/SKILL.md](../../skills/software/team/SKILL.md)) — the **single source of truth** for templates, flags, event hooks, agent memory, and failure-recovery rules. Don't redefine methodology here; delegate to the skill.
- Drive work honoring **YAGNI**, **KISS**, **DRY** principles.

**IMPORTANT:** Remind these rules in teammate communication:
- Sacrifice grammar for the sake of concision when writing reports.
- In reports, list any unresolved questions at the end, if any.

**Environment pre-flight (mandatory for `cook` template / any editing teammates):** → **the `team` skill § Shared-Tree Protocol** is canonical — disjoint path sets declared before dispatch, overlaps serialized, `file-claims` as the live check, read-only teammates exempt. Not restated here.

---

## Argument & Template Resolution

**Step 1 — Detect template** (first positional arg):

| Template | Teammates spawned | Best for |
|---|---|---|
| `research` | 2-4 researchers | Competitive analysis, multi-source investigation |
| `cook` | 1 lead + N devs | Parallel feature implementation |
| `review` | 2-3 reviewers | Code quality / security / performance audit |
| `debug` | 3 debuggers (default) | Root-cause via competing hypotheses |

**Step 2 — Resolve flags:**

| Flag | Effect |
|---|---|
| `--devs N` / `--researchers N` / `--reviewers N` / `--debuggers N` | Override teammate count for that role |
| `--plan-approval` | Require lead approval before teammates start implementation |
| `--delegate` | Lead coordinates only — never touches code directly |

Flags are composable (e.g. `/ck:team cook "auth + notifications" --devs 3 --plan-approval`).

**Step 3 — Validate environment:** confirm Agent Teams is enabled (Claude Code ≥ 2.1.33 or `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`). If unavailable, **fall back to direct subagent delegation via the Agent tool** with the same task and warn the user.

---

## Workflow

### Stage 0 — Activate skill & analyze

* Read [.claude/skills/software/team/SKILL.md](../../skills/software/team/SKILL.md) end-to-end.
* Decide template, teammate count per role, and file-ownership boundaries (prevents merge conflicts).
* If task is single-focused or fully sequential → **abort and recommend a subagent** to the user.
* If task is a **deterministic fan-out** (whole-repo audit, N-file migration, cross-checked review — no persistent discussion / cross-session memory needed) → **recommend `/ck:flow`** (gated controlled orchestration) instead of spawning a team. Recommend only — never auto-switch; the user decides.

### Stage 1 — Spawn

* Spawn teammates per template. Each teammate gets:
  * Clear task scope and owned files.
  * Pointer to shared task list.
  * Pointer to its `.claude/agent-memory/<name>/` for cross-session continuity.
* If `--plan-approval`: lead drafts plan first; ask user to approve before teammates start.

### Stage 2 — Coordinate

* Observe `TaskCompleted` and `TeammateIdle` hooks.
* On `TaskCompleted` of a blocker → trigger dependents.
* On `TeammateIdle` → reassign unfinished work or wind down that teammate.
* Mediate inter-teammate discussion when findings conflict (especially `debug` template's competing hypotheses).

### Stage 3 — Handle failures

Per skill's Failure Recovery section:
1. Inspect `TaskList` for orphaned in-progress tasks.
2. Reassign via `TaskUpdate` to another teammate or self.
3. On repeated crashes → halt team, run `[[retro]]` on the spawn config, then respawn with a corrected plan.

### Stage 4 — Consolidate & report

* Collect each teammate's findings / diffs / reports.
* Resolve conflicts (overlapping edits, contradicting conclusions).
* Produce a single consolidated report for the user.
* **IMPORTANT:** List unresolved questions at the end.

### Stage 5 — Onboarding (optional)

* If team produced shippable changes: instruct user on usage (env vars, API keys, config). One question at a time.
* Ask if user wants to commit + push; if yes, delegate to `git-manager`.

---

## Quick Reference

```
/ck:team cook "implement auth + notifications + dashboard" --devs 3
/ck:team research "compare React state management options" --researchers 2
/ck:team review --reviewers 2
/ck:team debug "race condition in payment flow" --plan-approval
/ck:team cook "checkout flow" --devs 2 --delegate     # lead coordinates only
```

---

## Relationship to Other Commands

- **Subagents** — single-session multi-agent delegation via `Agent` tool. Use when work is sequential or fan-out without persistent teammates.
- `/ck:flow` — gated, inheritance-aware controlled orchestration (fan-out/pipeline over the 30 agents). Prefer it over a team for **deterministic fan-out + verify** (audit / migration / cross-checked review) that needs no discussion or cross-session memory. `/ck:team` is for persistent peers that must talk.
- `/ck:cook` — gated feature lifecycle (Plan → Code → Test → Docs → Deploy) for a single feature. Use `/ck:team cook` only when 3+ features can be developed in parallel.
- `/ck:plan` — generates a plan; pair with `/ck:team cook plan.md` to parallelize implementation across devs.
- `/ck:debug` — single-session debug. Use `/ck:team debug` only when competing hypotheses need head-to-head evaluation.

---

**REMEMBER:**
- Team skill methodology is the source of truth; this command is the workflow trigger.
- Define file ownership up front to avoid merge conflicts between teammates.
- Persist context per teammate in `.claude/agent-memory/<name>/` — silent handoffs are an anti-pattern.
- Never spawn a team for work a single subagent can handle.
