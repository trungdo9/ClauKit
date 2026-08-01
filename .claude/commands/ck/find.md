---
description: ⚡ Find ClauKit skill/agent/command for a task (local registry first, external skills fallback)
argument-hint: [task-description]
---

## Task
<task>$ARGUMENTS</task>

## Purpose

Given a task description, recommend the best ClauKit tool to use — **local registry first**, external skills ecosystem as fallback. Reduces the discoverability gap across 131 skills + 29 agents + 56 commands (see `docs/clauKit-registry.md` for exact counts).

## Workflow

### Step 1 — Parse intent

From the task description, identify:
- **Domain** (e.g. testing, design, refactor, deploy, payments, DB)
- **Action verb** (find / build / fix / review / explain / plan / port)
- **Scope** (single file · module · cross-cutting · full feature)

### Step 2 — Local registry lookup (PRIMARY)

Read `docs/clauKit-registry.md` (single source of truth). Match the task against:

1. **Commands** (section 3) — preferred when the task maps to a clear user-action.
2. **Agents** (section 2) — when delegated persona work is needed.
3. **Skills** (section 1) — when methodology/knowledge is the gap.

**Matching heuristics**:
- Action verb → command (e.g. "review code" → `/ck:review`; "fix CI" → `/ck:fix ci`)
- Domain knowledge → skill (e.g. "Postgres tuning" → `postgresql` skill)
- Personas / delegated multi-step → agent (e.g. heavy parallel research → `researcher`)
- **Controlled fan-out / audit / migration / cross-checked review / multi-angle plan** (deterministic, gated, no persistent discussion) → `/ck:flow` (or `/ck:fix --flow` / `/ck:review --flow`). Distinguish from `/ck:team` (persistent sessions + discussion + cross-session memory).

### Step 3 — Present 1–3 recommendations

For each match, output:

```
🎯 <name> (skill | agent | command)
   What: <one-line purpose from registry>
   How:  <exact invocation>
   Why:  <why this matches the task>
```

If multiple matches, **rank by precision** (command > agent > skill — closer to user intent). Highlight the top pick.

### Step 4 — Trio awareness

If a concept has all three (skill + agent + command), point user at the **command** as primary entry — the skill/agent activate automatically.

### Step 5 — External fallback (only if NO local match)

If nothing in the local registry fits, activate **`find-skills` skill** ([.claude/skills/software/find-skills/SKILL.md](.claude/skills/software/find-skills/SKILL.md)) to search the external `npx skills` ecosystem. Be explicit that this is a fallback.

### Step 6 — Empty case

If even external search yields nothing relevant:
- Suggest authoring a new skill/agent/command (add the file under `.claude/` and register it in `docs/clauKit-registry.md`).
- Or directly handle the task with general capabilities.

## Hard Rules

- **No implementation.** This command only recommends. Do not start running the suggested tool unless user confirms.
- **Local-first.** Never recommend external skills before checking the registry.
- **No fabricated tool names.** Only recommend entries that exist in `docs/clauKit-registry.md` or surface from `npx skills find`.
- **Be concise.** 1–3 recommendations max. No prose dump.

## Output Example

```
Task: "I need to migrate React class components to hooks across the repo"

🎯 /ck:refactor  (command — top pick)
   What: Large mechanical refactor — codemod, atomic commits, rollback plan
   How:  /ck:refactor migrate class components to hooks
   Why:  Mechanical cross-file change with safety gates; not a feature work (cook) or bug (fix)

Alt: react-best-practices (skill) — load for hook patterns
     code-reviewer (agent) — run after each batch
```

## Related

- `find-skills` skill — external `npx skills` lookup (fallback only)
- `docs/clauKit-registry.md` — local single source of truth
