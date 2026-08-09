---
name: team
description: Orchestrate parallel multi-session collaboration with independent Claude Code teammates. CK-native (v2.1.0) engine that spawns independent Claude Code sessions as teammates — each with own context window, task ownership, and persistent cross-session memory. Use when 3+ independent workstreams must run in parallel, workers need to discuss findings, competing hypotheses need evaluation, or multi-layer work (API + UI + DB) benefits from per-layer ownership.
category: Orchestration
status: active
---

# Team

CK-native (v2.1.0) orchestration engine that spawns independent Claude Code sessions as teammates — each with their own context window, task ownership, and cross-session memory.

## What This Skill Does

Agent Teams let you run multiple Claude Code instances in parallel — each tackling a different workstream simultaneously. Teammates share a task list and communicate via messaging. Unlike subagents (fire-and-forget), teammates are persistent, event-driven, and able to discuss.

Templates auto-execute on spawn (changed in v2.1.0 — was manual in v1.x).

Distinct from:
- Subagents (e.g. via Agent tool) — short-lived, isolated context, fire-and-forget, no inter-worker communication.
- `[[cook]]` — single-feature gated pipeline; use `cook` template here only when 3+ features run in parallel.

## When to Use

- 3+ independent workstreams that can progress in parallel (e.g. auth + notifications + dashboard).
- Workers must discuss findings or hand off context mid-flight.
- Competing hypotheses need to be evaluated head-to-head (debug template).
- Long-running review where reviewers benefit from staying loaded with the diff.
- Token budget allows separate context windows per teammate.

**Avoid when:** task is single-focused, a short sequential chain (A → B → C), or token budget is tight — use a subagent instead.

Activation phrases: *"spin up a team to..."*, *"run these workstreams in parallel"*, *"competing investigators on..."*

## Templates

| Template | Teammates | Best For | Token Budget |
|----------|-----------|----------|--------------|
| `research` | 2-4 researchers | Competitive analysis, multi-source investigation | 150-300K (haiku) |
| `cook` | 1 lead + N devs | Parallel feature implementation | 400-800K (sonnet+haiku) |
| `review` | 2-3 reviewers | Code quality, security, performance audits | 100-200K (haiku) |
| `debug` | 3 debuggers (default) | Root-cause analysis via competing hypotheses | 200-400K (sonnet) |

## How to Use

```
/ck:team <template> <context> [flags]
```

**Flags:**
- `--devs N` — number of developer teammates
- `--researchers N` — number of researcher teammates
- `--reviewers N` — number of reviewer teammates
- `--debuggers N` — number of debugger teammates
- `--plan-approval` — require lead approval before implementation starts
- `--delegate` — lead coordinates only, never touches code directly

**Examples:**
- `/ck:team cook "implement auth + notifications + dashboard" --devs 3`
- `/ck:team research "compare React state management options" --researchers 2`
- `/ck:team review --reviewers 2`
- `/ck:team debug "race condition in payment flow" --plan-approval`

## Shared-Tree Protocol (canonical)

Teammates editing the same working tree is the **#1 lost-work shape** in the source data. ClauKit does not hand each teammate its own worktree — that was tried and retired (auto-provisioning fired on nearly every run, each tree paid a full dependency install, and stale trees accumulated). The replacement is **partition, don't isolate**:

1. **Declare disjoint path sets before dispatch.** Each editing teammate owns a set of paths no other editing teammate may touch. Record the partition in `plans/<plan>/STATE.md` so a resume re-establishes it.
2. **Overlap ⇒ serialize.** Two teammates whose sets would intersect run one after the other, not in parallel. Parallelism is the thing you give up, not correctness.
3. **`node .claude/hooks/file-claims.cjs list` is the live check.** A `FOREIGN` claim inside your partition means the partition is already violated: stop and re-partition, never push through.
4. **Read-only teammates are exempt.** Research and review teammates share the tree freely — they claim nothing.

Because each editing teammate stages only its own paths, `guard-destructive` Tier B stays quiet; a Tier B denial during a team run is a signal the partition leaked, not a nuisance to override.

## Requirements

Agent Teams must be enabled in your Claude Code environment:

```bash
# Claude Code < 2.1.33 (use env var)
CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 claude

# Claude Code >= 2.1.33 (enabled by default)
```

## Event-Driven Monitoring

Teams emit hooks you can observe:

| Event | When | Use For |
|-------|------|---------|
| `TaskCompleted` | Teammate finishes a task | Track progress, trigger dependents |
| `TeammateIdle` | Teammate has no pending tasks | Reassign work, wind down |

## Agent Memory

Teammates persist knowledge across sessions via `.claude/agent-memory/<name>/`. Each teammate maintains:
- Prior context and findings
- Decisions made
- Files owned

Memory is scoped per teammate — not shared between teammates unless handed off explicitly via messaging or task update.

## Team vs Subagents

| Situation | Agent Teams | Subagents |
|-----------|:-----------:|:---------:|
| 3+ independent parallel workstreams | Yes | No |
| Workers need to discuss findings | Yes | No |
| Competing hypotheses to evaluate | Yes | No |
| Multi-layer work (API + UI + DB) | Yes | Yes |
| Single focused task | No | Yes |
| Sequential chain (A then B then C) | No | Yes |
| Limited token budget | No | Yes |

## Display Modes

Teams render based on your terminal:

- **auto** — detects best mode for your environment
- **in-process** — inline output (navigate with Shift+Up/Down)
- **tmux** — split-pane view per teammate
- **split** — separate terminal windows

## Failure Recovery

If a teammate crashes or goes idle unexpectedly:
1. Inspect `TaskList` for orphaned in-progress tasks.
2. Reassign via `TaskUpdate` to another teammate or self.
3. Teammate agent memory preserves context for handoff.
4. If repeated crashes, halt the team and run `[[retro]]` on the spawn config.

## Anti-Patterns

- **Team-for-everything**: spawning a 4-teammate review for a 20-line diff. Use a single reviewer subagent instead.
- **No ownership**: teammates picking tasks ad-hoc with no file-ownership boundaries → merge conflicts. Define owners up front.
- **Silent handoffs**: passing work between teammates without recording context in agent memory or task notes.

## References

In-depth playbooks live in `references/`:
- `template-cook.md` — parallel implementation: file ownership, lead vs `--delegate`, merge sequencing
- `template-debug.md` — competing-hypotheses methodology (assign, score, converge)
- `agent-memory.md` — what to persist per teammate, handoff format, hygiene
- `failure-recovery.md` — crashes, idle stalls, conflict-resolution playbook

## Related Skills

- `[[cook]]` — single-feature lifecycle engine; `team cook` parallelizes across features
- `[[planning]]` — generate plans before handing off to teams
- `[[retro]]` — postmortem when team runs go sideways
- `[[context-engineering]]` — per-teammate token budgets and layer caps
