---
description: ⚡⚡⚡ Plan operations dispatcher (router · fast hard two ci cro verify · -o md|html)
argument-hint: [task] [fast|hard|two|ci|cro|verify] [-o md|html]
---

Activate `planning` skill ([.claude/skills/software/planning/SKILL.md](.claude/skills/software/planning/SKILL.md)).

## Your mission
<task>$ARGUMENTS</task>

## Mode dispatch (inspect `$ARGUMENTS` for first word)

> First strip any trailing `-o md|html` from `$ARGUMENTS` (handled in "Output format" section below); it is independent of the mode word.

| Mode | Thinking budget |
|---|---|
| *(none)* | **auto-detect** — analyze task, route to `fast` or `hard` |
| `fast` | **fast** — analysis + planning only, no research | Think |
| `hard` | **hard** — research-heavy, multi-researcher | Think harder |
| `two` | **2-approaches** — research + plan with ≥2 approaches + trade-offs | Think harder |
| `ci` | **CI-failure** — plan to fix GitHub Actions failures | Think harder |
| `cro` | **CRO plan** — Conversion Rate Optimization plan | Think harder |
| `verify` | **falsify an existing plan** — claim → verdict → evidence table, read-only | Think harder |

## Output format (`-o`) — orthogonal to mode

Strip `-o md|html` from `$ARGUMENTS` before mode dispatch. Default (no `-o`, or `-o md`) = markdown only (current behavior).

If `-o html`: after the `planner` subagent returns the finished markdown plan (any mode above), the **MAIN agent** (not the subagent) renders ONE self-contained `plan.html` into the plan dir as a final step, derived from `plan.md` + `phase-*.md`. Do this BEFORE the "ask user to review" prompt. Follow `planning` skill reference [html-output.md](.claude/skills/software/planning/references/html-output.md) (single source of truth for the template + fill procedure). Markdown stays source-of-truth; html is a one-directional snapshot (re-run `-o html` to refresh). Does NOT change cook — cook reads markdown only.

## Convert mode — existing plan → HTML (`<path>.md -o html`)

**Detect FIRST, before mode dispatch:** if the stripped `$ARGUMENTS` is (or starts with) a path to an EXISTING `.md` file under `plans/` AND `-o html` is set → this is a **convert**, not a new plan.

- SKIP all research/planning. Do NOT spawn `planner`. Do NOT create a new plan dir.
- Resolve the plan dir = the file's parent (if given a dir or `plan.md`, use that dir; if given a `phase-*.md`, use its dir).
- The MAIN agent reads `plan.md` + all `phase-*.md` in that dir and renders ONE `plan.html` there, per [html-output.md](.claude/skills/software/planning/references/html-output.md) fill procedure (same as above).
- Overwrite any existing `plan.html` (it's a regenerated snapshot). Report the path. No user-review gate (pure render).
- Use this to refresh a stale `plan.html` after editing the markdown.

## Default mode (no flag) — router

1. Analyze the task; ask for more details if needed.
2. **Decide complexity** → execute `fast` or `hard` mode below with an enhanced prompt (detailed-instructions version of the task description).

## `fast` — no research

Use `planner` subagent to:
1. Create directory `plans/YYYYMMDD-HHmm-plan-name` and pass path to every subagent.
2. Follow the **"Plan Creation & Organization"** rules + **Plan Directory Structure** + **Plan File Specification** defined in the `planning` skill (single source of truth).
3. Analyze codebase: read `docs/codebase-summary.md`, `docs/code-standards.md`, `docs/system-architecture.md`, `docs/project-overview-pdr.md`.
4. Gather information → create implementation plan.
5. Ask user to review the plan.

**Distinct from `hard`:** Skip the research phase (no `researcher` agents, no scout). Pure analysis + planning from existing docs only.

## `hard` — research-heavy

1. Create directory `plans/YYYYMMDD-HHmm-plan-name` and pass path to every subagent.
2. Follow the **"Plan Creation & Organization"** rules + **Plan Directory Structure** + **Plan File Specification** defined in the `planning` skill (single source of truth).
3. Use up to **2 `researcher` agents in parallel** — each researches a different aspect, max 5 tool calls each.
4. Analyze codebase: read `docs/codebase-summary.md`, `docs/code-standards.md`, `docs/system-architecture.md`, `docs/project-overview-pdr.md`.
   - **Only if** `codebase-summary.md` missing or >3 days old → use `/ck:scout` to discover relevant files.
5. Main agent passes all research + scout report filepaths to `planner` subagent to produce the implementation plan.
6. Receive plan from `planner`, ask user to review.

**Research output:** Each research markdown report ≤150 lines while covering all topics + citations.

**Distinct from `fast`:** Includes the research phase (multiple researchers in parallel + conditional scout).

## `two` — 2-approach comparison (⚡⚡⚡⚡)

Think harder. Use `planner` subagent to create **2 detailed implementation plans**.

1. Create directory `plans/YYYYMMDD-HHmm-plan-name`, pass path to every subagent.
2. Follow **Plan Creation & Organization** + **Plan Directory Structure** + **Plan File Spec** from `planning` skill.
3. Multiple `researcher` agents in parallel — each on a different aspect, max 5 tool calls each.
4. `scout` agent → discover relevant files.
5. Main agent passes all reports to `planner` with instruction:
   **Output ≥2 implementation approaches with clear trade-offs + pros/cons + recommended approach.**
6. Receive plan, ask user to review.

**Distinct from `hard`:** Mandatory 2+ approaches comparison with pros/cons table.

## `ci` — CI-failure-driven plan

Input: GitHub Actions URL = `$ARGUMENTS` (minus `ci`)

Use `planner` subagent to:
1. Read the GitHub Actions logs via `gh` command.
2. Analyze and find root causes.
3. Produce a detailed fix plan.

**Output:** ≥2 implementation approaches with clear trade-offs + pros/cons + recommended approach.

**Distinct from `hard`:** Source of truth is CI logs (not codebase analysis); root-cause-first framing. Ask user for confirmation before implementing.

## `cro` — CRO plan (not direct rewrite)

You are an expert in conversion optimization. Analyze the content based on `$ARGUMENTS` (minus `cro`).

**CRO Framework:** [.claude/workflows/cro-framework.md](.claude/workflows/cro-framework.md) — single source of truth for the 25-point CRO principles.

This command produces a **CRO plan document** with framework-driven recommendations — not a direct copy rewrite. Wait for user approval before implementation.

Workflow:
- Screenshots / videos → `ai-multimodal` skill extracts detailed description.
- URL → `web_fetch` retrieves content for analysis.
- Screenshot capture → screenshot tools + `ai-multimodal` / `gemini-video-understanding` / `gemini-document-processing` as needed.
- `/ck:scout` → codebase discovery.
- `planner` agent applies the 25-point framework + follows planning skill's directory/file structure.
- **DO NOT implement** — wait for user approval.

## `verify <path>` — falsify an existing plan (⚡⚡)

**Input:** path to an existing `plan.md`. Activate the `verify-plan` skill ([.claude/skills/software/verify-plan/SKILL.md](.claude/skills/software/verify-plan/SKILL.md)) — single source of truth for the method.

1. Read the plan; **extract every factual claim** (root cause · current behaviour · data/row counts · code-path · "already done" status).
2. Prove or disprove each with `git log`/`git blame`/`git show`, direct file reads, **read-only** queries. Verification is read-only — no edits, no writes.
3. Emit the fixed table → `plans/<plan>/reports/plan-verification.md`: `# · Claim · Verdict (CONFIRMED/REFUTED/UNVERIFIABLE) · Evidence (file:line, git ref, or verbatim output) · Impact if wrong`.
4. Verdict line: **plan SAFE TO EXECUTE** (no REFUTED load-bearing claims) or **plan REFUTED — back to planner** (name the broken claims). Append the gate result to `plans/<plan>/STATE.md`.

**Auto-invoked** by `/ck:cook --from-plan` (Stage 0.5); use standalone before executing any plan you didn't write this session.

## Important Notes
- **DO NOT implement** — plan only.
- Token efficiency, concise grammar, list unresolved questions at end.
- All planning rules → `planning` skill.
- All CRO principles → CRO framework workflow doc.
