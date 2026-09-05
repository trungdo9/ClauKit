---
description: ⚡⚡⚡ Scan & analyze the codebase.
argument-hint: [tasks-or-prompt] [since <ref>] [--flow] [--lenses]
---

Think harder to scan + analyze the codebase. Follow Orchestration Protocol + Core Responsibilities + Subagents Team + Development Rules.

<tasks>$ARGUMENTS</tasks>

## Role
Elite software engineering expert — system architecture + technical decision-making. Operate by YAGNI / KISS / DRY trinity.

## Methodology references (skills)

- **Code-review methodology** → `code-review` skill ([.claude/skills/software/code-review/SKILL.md](../../skills/software/code-review/SKILL.md)) — fixed-point pinning, the three axes, receiving feedback, verification gates. Procedure in full: [requesting-code-review.md](../../skills/software/code-review/references/requesting-code-review.md).
- **Planning methodology** → `planning` skill ([.claude/skills/software/planning/SKILL.md](../../skills/software/planning/SKILL.md)) — plan directory structure, file specification.
- **Activate other skills as needed** from the catalog.

## Workflow (orchestration variant — multi-agent)

### Research
- 2 `researcher` subagents in parallel — max 5 sources for user request, idea validation, best practices, challenges, best solutions.
- Each research markdown ≤150 lines while covering all topics + citations.
- `/ck:scout` for codebase file discovery.

### Code Review

**Pin the fixed point first.** Every review is the diff between `HEAD` and one named fixed point — `HEAD~1` for a single commit, the PR target branch pre-PR, the phase's recorded base from `STATE.md` inside a `/ck:cook` run, or whatever the user named ("review since X"). Verify the ref resolves and the diff is non-empty **before** spawning anything; a bad ref discovered inside three parallel subagents costs three contexts and returns three confusing reports. Use three-dot `git diff <fp>...HEAD` so the target branch's own commits stay out of the diff. Nothing named and more than one commit in play → **ask**, don't default to `HEAD~1`. Full procedure + spec-source lookup order: [requesting-code-review.md](../../skills/software/code-review/references/requesting-code-review.md) steps 1–2.

**Build the package once:** `node .claude/scripts/ck/review-package.cjs <FIXED_POINT> [HEAD] [--plan <plan>]` — every reviewer gets the **path**, never an inline diff.

**Three axes, three parallel subagents, separate reports:**

| Axis | Agent | Question | Sources pasted into the prompt |
|---|---|---|---|
| **Standards** | `code-reviewer` | Does the code follow this project's documented standards? | [development-rules.md](../../workflows/development-rules.md) + `./docs/code-standards.md` + [smell-baseline.md](../../skills/software/code-review/references/smell-baseline.md) **in full** |
| **Spec** | `code-reviewer` | Does the code do what was asked — no more, no less? | the plan file, else the ticket / issue |
| **Security** | `security-auditor` | Does the diff hold the security line? | the `security` skill's Core rule tier + [checklists.md](../../skills/software/security/references/checklists.md) |

- Dispatch all three **in one message** so they actually run concurrently.
- Scale Standards to the diff — more than one `code-reviewer` on that axis when the change spans subsystems. Spec and Security stay one each.
- **The Security axis is not optional** and not conditional on the diff looking security-shaped. When it needs more room than a capped report — a non-diff scope, a file count big enough for the LARGE-mode fan-out, or a saved report to keep — run [`/ck:security`](security.md) separately; it does not replace this axis.
- **No spec found** → ask; if there genuinely is none, skip the Spec axis and say so. Never fold Spec findings into Standards, and never invent requirements to review against.
- Cap every axis report at **400 words**.

**Report the axes side by side under `## Standards` / `## Spec` / `## Security` — do not merge or rerank.** Code can follow every rule while implementing the wrong thing (Standards pass, Spec fail) or nail the ticket while breaking every convention (Spec pass, Standards fail); one ranked list hides exactly that. Close with per-axis totals and the worst finding *within each axis* — never a single winner across axes.

- Findings inside an axis → ask main agent to fix (Critical now, High before proceeding) + repeat test cycle until all tests pass. Re-run only the affected axis.
- All clear → report changes to user + ask for review + approval.
- High-risk diff (>~200 lines, >3 files, or auth / payments / migrations / cross-service)? → escalate to `--lenses` below. The axes and the lenses compose: axes ask *did it follow the rules / do the job / hold the line*; lenses ask *is it actually wrong*.

### Plan
- `planner` subagent analyzes researcher + scout reports → creates improvement plan following `planning` skill's **Plan Creation & Organization** + **Plan Directory Structure** + **Plan File Specification**.

### Final Report
- Summarize changes + brief explanation + getting-started guide + next steps.
- Ask user about commit + push. If yes → `git-manager` subagent.

## Distinct role
**Orchestration-level command** (not just review trigger). Coordinates researcher + code-reviewer + planner + git-manager subagents in a full scan-analyze-plan-report cycle.

## Orchestrated Variant (`--flow`)

`/ck:review --flow` adds a **specific deterministic shape**: dimension fan-out → per-finding adversarial verify → dedup → confirmed-only report. It **complements** the default multi-agent review above; default behavior unchanged. Reads the `dynamic-workflow` skill file ([.claude/skills/software/dynamic-workflow/SKILL.md](../../skills/software/dynamic-workflow/SKILL.md)) — source of truth for the pattern; no methodology duplication here.

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

**Opt-in escalation on top of the three axes** — this is a genuine ~4× on the review stage. **Auto-suggest it only above a risk threshold**: >~200 changed lines, >3 files, or the diff touches auth / payments / migrations / a cross-service boundary.

Fan out **4 reviewers concurrently in one message**, each with a distinct lens.

→ **The lens table, the context rules and the reconcile step are canonical in [`code-review` skill § Multi-Lens Review](../../skills/software/code-review/SKILL.md).** They are not restated here: duplicating them into two documents is how they drift apart, and this file already named that skill as their owner.

Command-only additions:

| Lens | Model tier for the dispatch |
|---|---|
| **ADVERSARY** | escalate on risky diffs |
| **FIDELITY** | standard |
| **BLAST RADIUS** | cheap, narrow prompt |
| **CONVENTION** | cheap, narrow prompt |

- Reuse the review package built in the Code Review stage — same pinned fixed point, one file, every lens gets the path.
- Composable with `--flow`; the reconcile step runs in the main session.

**Examples:** `/ck:review --lenses` · `/ck:review --lenses --flow plans/<plan>` 

## Relationship to other commands

- [`/ck:security`](security.md) — the arbitrary-scope, saved-report version of the Security axis; the only path that reaches the LARGE-mode parallel fan-out.
- [`/ck:cook`](cook.md) — its Review stage runs this same three-axis dispatch per phase, fixed point = the phase's recorded base.
- [`/ck:fix`](fix.md) — remediates what this command reports.
- [`/ck:tickets`](tickets.md) — when the Plan stage's output is big enough to need slicing before anyone starts.

## Notes
- Concise grammar, list unresolved questions at end.
- Visual assets: `ai-multimodal` skill (generate + verify + edit).
