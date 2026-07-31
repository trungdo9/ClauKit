# Fix Pipeline — Canonical Workflow

Single source of truth for the `/ck:fix` family of commands. Each `/ck:fix*` command is a **variant** that selects which input source to use and which agents to invoke for diagnosis. The implementation→test→review→report cycle is shared across all variants.

## Canonical Pipeline (7 stages)

```
[1] Input intake       → variant-specific source
[2] Multimodal extract → ai-multimodal skill if screenshots/videos provided
[2.5] Scout            → MANDATORY before any hypothesis (see Scout Gate below)
[3] Diagnose           → variant-specific specialist agent(s)
[3.5] Root-Cause Gate  → MANDATORY 6-question check before implement (see below)
[4] Plan (optional)    → planner subagent for complex fixes
[5] Implement          → main agent applies fix
[6] Verify             → tester subagent runs tests
[7] Review + Report    → code-reviewer + summary back to user
```

### Stage details

**[1] Input intake** — read the issue source. Variant-specific:
- `/ck:fix` → router (auto-detect complexity, route to `--quick` or `--review`)
- `/ck:fix --quick` → user-provided issue text
- `/ck:fix --review` → user-provided issue text (complex)
- `/ck:fix logs` → `./logs.txt` (reproduce + pipe if missing)
- `/ck:fix ci` → GitHub Actions URL (via `gh` command)
- `/ck:fix test` → run test suite first, then diagnose failures
- `/ck:fix tdd` → production symptom (no red suite yet): red test first per the `tdd` skill — Iron Law, no production code without a failing test
- `/ck:fix types` → run `tsc` / `bun typecheck` / `npx tsc` first
- `/ck:fix ui` → user-provided UI issue + design guidelines

**[2] Multimodal extract** — if user provided screenshots/videos → `ai-multimodal` skill describes in detail so root causes are predictable.

**[2.5] Scout Gate (MANDATORY — blocks Stage [3])** — before forming any hypothesis, scout these 5 items:

| # | What to scout | How |
|---|---|---|
| 1 | Project type · language · framework | read `package.json` / `pyproject.toml` / `go.mod` / etc. |
| 2 | File where symptom appears + direct callers/dependents | `grep`/`glob` from symptom description |
| 3 | Related tests | find test files that import/cover the symptom file |
| 4 | Last 20 commits touching that file | `git log -20 -- <file>` |
| 5 | Existing patterns/conventions for fixing (match codebase style) | read sibling files, check for prior fixes of same class |

**Do NOT propose or implement anything until all 5 items are answered.** This gate exists to prevent "imagined context" — where the agent builds a plausible-but-wrong mental model from a few files, ignoring legacy code, conventions, or half-alive "temporary" files that have lived 3 years.

**[3] Diagnose** — variant-specific specialist:
| Variant | Diagnostic agent |
|---|---|
| `--quick` / `--review` / `logs` / `ci` | `debugger` subagent |
| `--review` (added) | `researcher` subagent (external research) |
| `test` | `tester` first → `debugger` for failures |
| `tdd` | `tdd` skill loop: toolchain proof → red test → base-commit-worktree baseline → green → sweep |
| `types` | direct: run typecheck → fix loop (no agent) |
| `ui` | `frontend-developer` subagent + `chrome-devtools` skill |
| `logs` / `ci` (added) | `scout` subagent (locate issues in codebase) |

**[3.5] Exact-Root-Cause Gate (MANDATORY — blocks Stage [4] and [5])** — after Diagnose, agent must answer all 6 questions before proceeding. If any answer is "unknown", go back to Stage [3] with new evidence.

| # | Question | Rule |
|---|---|---|
| 01 · exact symptom | What exactly is the symptom? | No vague descriptions |
| 02 · reproduction steps | Steps to reproduce, deterministic | Must be repeatable |
| 03 · expected vs actual | What should happen vs what does happen | Both sides stated |
| 04 · root cause + file:line | Exact location, no speculation | Must point to code |
| 05 · why now | What changed that caused this to appear today? | Commit / env / dep / migration — if unknown, say so explicitly and investigate before proceeding |
| 06 · blast radius | What will the fix affect? | List files, callers, tests at risk |

**"Why now" is non-negotiable.** Most bugs don't appear from nowhere — a commit changed data shape, a dependency upgraded, a migration ran halfway. If the agent cannot answer "why now", it is fixing the symptom, not the system. Investigate further before implementing.

**After the gate — falsify the diagnosis (verify-plan):** when the root cause asserts *existing* behaviour ("X currently does Y", row counts, "the legacy path handles Z"), run the `verify-plan` skill's evidence check on it before implementing — a wrong root cause once shipped through 3 merged PRs. Append the gate result to `plans/<plan>/STATE.md` (`run-state` skill).

**Baseline rule (all variants, G19):** "is this failure pre-existing?" is answered from the base commit checked out **in a separate worktree** (`node scripts/ck/wt-new.js baseline --base <sha>`), **never via `git stash`** — a stash-based baseline silently no-ops and the failure is invisible when it happens.

**[4] Plan (optional)** — `planner` subagent creates implementation plan. Triggered for:
- `--review` (always)
- `logs` / `ci` / `test` (after diagnostic reports)
- `--quick` / `types` / `ui` (skip — go straight to implement)

**[5] Implement** — main agent applies the fix based on diagnostic reports + plan.
- `ui` variant uses `frontend-developer` for implementation
- `--review` may use additional skills (`sequential-thinking`, `problem-solving`)

**[6] Verify** — `tester` subagent runs tests + compile.
- `types` → loop tsc until zero errors (do NOT use `any` to pass)
- `ui` → screenshot capture + `ai-multimodal` analysis to verify design match
- All others → standard test run

**Failure handling (circuit breaker):**
- Attempt 1–2: if tests fail → loop back to stage [3] (re-diagnose with new evidence).
- **Attempt 3 fail:** STOP. Do not patch further. Report to user:
  - What was tried (3 attempts summary)
  - Why each fix failed
  - Hypothesis: this may be an **architectural issue**, not a local bug
  - Ask user for direction before proceeding
- Never continue patching after 3 failed attempts — "fix one place, break another" is a sign of wrong abstraction level, not a fixable loop.

**[7] Review + Report** — `code-reviewer` subagent for code quality check; if critical issues found → loop back to [5]. When clean, summarize to user.

### Post-implementation (variant-specific, optional)

For variants `--review` and `ui` (those with plan/docs update in the Variant Matrix):
- **Project mgmt + docs update:** if user approves → `project-manager` + `docs-manager` subagents in parallel update `./docs/*` + `./docs/project-roadmap.md` + plan task status.
- **Commit:** ask user about commit/push → `git-manager` subagent.

## Orchestrated Execution (`--flow`)

`/ck:fix --flow` runs this **same pipeline** as discrete, inspectable agent stages with structured handoff — it **complements, does not replace**, the canonical pipeline above. The prose gates ([2.5] Scout, [3.5] Root-Cause) become explicit agent stages whose answers are written to `plans/<plan>/reports/`, and a new **[3.7] adversarial-verify** stage tests the root cause *before* implement. Activates the `dynamic-workflow` skill ([../skills/software/dynamic-workflow/SKILL.md](../skills/software/dynamic-workflow/SKILL.md)) — source of truth for the pattern; do not duplicate methodology here.

```
[2.5] Scout Gate        → Agent[scout]: answer the 5 items → reports/scout-flow.md
[3]   Diagnose          → Agent[debugger|tester|frontend-developer]: root cause → reports/diagnose-flow.md
[3.5] Root-Cause Gate   → Agent: answer the 6 Q from the handoff; any "unknown" → loop [3]
[3.7] Adversarial Verify→ N Agent skeptics: "refute this root cause; default refuted if unsure"
                           majority refute → loop [3] with refutation evidence; survive → proceed
[4..7] Plan→Implement→Verify→Review→Report   (unchanged — inherit gates + reports/)
```

- **Same gates, different form** — the orchestrated path references the SAME 5-item Scout Gate + 6-Q Root-Cause Gate; only execution changes from prose-the-model-follows to discrete stages.
- **4-axis inheritance** — shared `reports/` (context), routed personas (persona), development-rules + both gates apply to every stage (gate), skeptics may run a cheaper model (model/budget).
- **Adversarial-verify before implement** reduces "imagined context" fixes — strengthens the gate's stated purpose.
- **Explicit opt-in** — `/ck:fix --auto` never auto-enables `--flow`. Cost preview shown before the run; orchestrator can inspect/abort between phases.

## Companion Skills (auto-activate)

- `problem-solving` — root-cause synthesis (all variants)
- `sequential-thinking` — break complex problems into steps (`--review`)
- `debugging` — 4-technique framework activated by `debugger` agent (all variants)
- `ai-multimodal` — screenshot/video analysis (any variant with visual input)
- `chrome-devtools` — UI verification (`ui`)

## Shared Rules

- **Auto-activate skills** from the catalog as needed during the process.
- **No fake test data** — tests must be real, cover all cases. Do not ignore failures.
- **Repeat until clean** — diagnose → fix → test → review loop until all tests pass.
- **Final summary** — explain changes briefly, guide getting-started, suggest next steps.
- **Concise grammar** in reports. List unresolved questions at end.

## Variant Selection Matrix

| Variant | Input | Has planner? | Has researcher? | Has reviewer? | Has plan/docs update? |
|---|---|:---:|:---:|:---:|:---:|
| `/ck:fix` | router | – | – | – | – |
| `/ck:fix --quick` | text | – | – | – | – |
| `/ck:fix --review` | text | ✓ | ✓ | ✓ | ✓ |
| `/ck:fix logs` | `logs.txt` | ✓ | – | ✓ | – |
| `/ck:fix ci` | GH Actions URL | ✓ | – | ✓ | – |
| `/ck:fix test` | test suite | ✓ | – | ✓ | – |
| `/ck:fix types` | `tsc` errors | – | – | – | – |
| `/ck:fix ui` | UI + design guide | – | – | – | ✓ |
