---
description: ⚡⚡⚡ Scan & analyze the codebase.
argument-hint: [tasks-or-prompt] [--flow]
---

Think harder to scan + analyze the codebase. Follow Orchestration Protocol + Core Responsibilities + Subagents Team + Development Rules.

<tasks>$ARGUMENTS</tasks>

## Role
Elite software engineering expert — system architecture + technical decision-making. Operate by YAGNI / KISS / DRY trinity.

## Methodology references (skills)

- **Code-review methodology** → `code-review` skill ([.claude/skills/software/code-review/SKILL.md](.claude/skills/software/code-review/SKILL.md)) — receiving feedback, requesting reviews, verification gates.
- **Planning methodology** → `planning` skill ([.claude/skills/software/planning/SKILL.md](.claude/skills/software/planning/SKILL.md)) — plan directory structure, file specification.
- **Activate other skills as needed** from the catalog.

## Workflow (orchestration variant — multi-agent)

### Research
- 2 `researcher` subagents in parallel — max 5 sources for user request, idea validation, best practices, challenges, best solutions.
- Each research markdown ≤150 lines while covering all topics + citations.
- `/ck:scout -ext` (preferred) or `/ck:scout` (fallback) for codebase file discovery.

### Code Review
- Multiple `code-reviewer` subagents in parallel (methodology from `code-review` skill).
- Issues / duplicate code / security vulns → ask main agent to improve + repeat test cycle until all tests pass.
- All clear → report changes to user + ask for review + approval.

### Plan
- `planner` subagent analyzes researcher + scout reports → creates improvement plan following `planning` skill's **Plan Creation & Organization** + **Plan Directory Structure** + **Plan File Specification**.

### Final Report
- Summarize changes + brief explanation + getting-started guide + next steps.
- Ask user about commit + push. If yes → `git-manager` subagent.

## Distinct role
**Orchestration-level command** (not just review trigger). Coordinates researcher + code-reviewer + planner + git-manager subagents in a full scan-analyze-plan-report cycle.

## Orchestrated Variant (`--flow`)

`/ck:review --flow` adds a **specific deterministic shape**: dimension fan-out → per-finding adversarial verify → dedup → confirmed-only report. It **complements** the default multi-agent review above; default behavior unchanged. Activates the `dynamic-workflow` skill ([.claude/skills/software/dynamic-workflow/SKILL.md](../../skills/software/dynamic-workflow/SKILL.md)) — source of truth for the pattern; no methodology duplication here.

```
Phase 1 · Review fan-out (parallel, persona=code-reviewer, inherit repo gates)
  ├─ Agent[code-reviewer]: BUGS      → reports/review-bugs.md
  ├─ Agent[code-reviewer]: SECURITY  → reports/review-security.md
  └─ Agent[code-reviewer]: PERF      → reports/review-perf.md
        ↓ (context/output inherited)
Phase 2 · Adversarial Verify (per finding)
  └─ for each finding → Agent: "refute; default refuted=true if unsure"
        majority refute → DROP (log for inspect)
        ↓
Dedup → confirmed-only report (main-session orchestrator, gated/inspectable)
```

- **Persona axis:** every stage routes to `code-reviewer`; skeptics are independent `code-reviewer` instances prompted to refute.
- **4-axis inheritance:** shared `reports/` (context), `code-reviewer` everywhere (persona), development-rules + repo conventions (gate), skeptics may use a cheaper model (model/budget).
- **Cost preview** before the run; mid-run inspect/abort between phases (per `/ck:flow`).
- **SECURITY dimension is always in the fan-out** (default) — proactively surfaces vulns even when unasked. A deep OWASP audit is still `/ck:security`; this is a quick pass. More dimensions = YAGNI; add later.
- Confirmed-only report avoids alarm-fatigue from unverified findings; dropped findings logged for inspection.

**Examples:** `/ck:review --flow` · `/ck:review --flow src/payments`

## Notes
- Concise grammar, list unresolved questions at end.
- Visual assets: `ai-multimodal` skill (generate + verify + edit).
