---
description: ⚡⚡⚡ Scan & analyze the codebase.
argument-hint: [tasks-or-prompt] [--flow] [--lenses]
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
- `/ck:scout` for codebase file discovery.

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

## Multi-Lens Variant (`--lenses`, composable with `--flow`)

**Opt-in** — default `/ck:review` stays single-reviewer; this is a genuine ~4× on the review stage. **Auto-suggest it only above a risk threshold**: >~200 changed lines, >3 files, or the diff touches auth / payments / migrations / a cross-service boundary.

Fan out **4 reviewers concurrently in one message**, each with a distinct lens (perspective diversity beats redundancy — lens table is canonical in the `code-review` skill):

| Lens | Prompt core | Tier |
|---|---|---|
| **ADVERSARY** | assume the implementation is wrong; prove it from the actual diff + live queries, not the description | escalate on risky diffs |
| **FIDELITY** | diff new logic against legacy behavior on the base branch (`git show`/`git log`); list every behavioral divergence, intended or not | standard |
| **BLAST RADIUS** | cascade deletes, dropped status/permission guards, route-level auth gaps, duplicate keys, non-atomic mutation sequences, cross-service deploy-order hazards | cheap, narrow prompt |
| **CONVENTION** | does the change respect the codebase's own architectural patterns? (pair with the scope-lock convention check: planned intent vs shipped reality) | cheap, narrow prompt |

**Context rules (non-negotiable):**
- **The falsifier gets no reasoning.** Each lens receives **the diff and the requirement — never the implementer's explanation of why it is correct**. A reviewer handed the rationale grades the rationale, not the code. Fresh context, no memory of the implementation attempts.
- Each lens reads the **review-package file** (`node scripts/ck/review-package.js <BASE> [HEAD] --plan <plan>`) — a path, not an inline diff; the main context grows by four short finding lists, not four diffs.
- **Admissibility:** every finding must cite `file:line`, a git ref, or verbatim output. **No evidence → discarded as a hallucination** (a subagent once invented a flag).

**Then reconcile (main session):** cross-check the four reports against each other; flag disagreements explicitly; rank surviving findings Critical/High/Medium; route Critical/High through the existing adversarial-verify step before any fix.

**Examples:** `/ck:review --lenses` · `/ck:review --lenses --flow plans/<plan>` 

## Notes
- Concise grammar, list unresolved questions at end.
- Visual assets: `ai-multimodal` skill (generate + verify + edit).
