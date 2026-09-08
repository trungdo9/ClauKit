# Fix Pipeline — Canonical Workflow

Single source of truth for the `/ck:fix` family of commands. Each `/ck:fix*` command is a **variant** that selects which input source to use and which agents to invoke for diagnosis. The implementation→test→review→report cycle is shared across all variants.

## Canonical Pipeline (7 stages)

```
[1] Input intake       → variant-specific source
[2] Multimodal extract → ai-multimodal skill if screenshots/videos provided
[2.5] Scout            → MANDATORY before any hypothesis (see Scout Gate below)
[3] Diagnose           → variant-specific specialist agent(s)
[3.5] Root-Cause Gate  → MANDATORY 6-question check before implement (see below)
[3.7] Falsify Gate     → MANDATORY evidence row per claim before implement (see below)
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
| `tdd` | `tdd` skill loop: toolchain proof → red test → pre-edit baseline → green → sweep |
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

**[3.7] Falsify Gate (MANDATORY — blocks Stage [5])** — the 6-question gate above proves the
diagnosis is *specific*. It does not prove it is *true*. Question 04 demands a `file:line`, and a
confident wrong `file:line` is exactly what this pipeline kept shipping.

**This was a conditional sentence until it was promoted here, and the condition was the problem.**
It read "*when* the root cause asserts existing behaviour, run the evidence check" — leaving the
model to decide whether its own claim needed proof, which is the one judgement a wrong-but-confident
diagnosis always gets wrong. Measured on one estate: 34 `buggy_code` + 23 `wrong_approach` + 6
`incorrect_claim` friction events, a duplicate-deviation hypothesis that collapsed only when the user
demanded verification, an env-variable misattribution reversed twice, and a wrong mechanism that
reached a **merged PR body** and became the record other people read. In another dataset a wrong root
cause shipped through **3 merged PRs**.

Run the [`verify-plan` skill](../skills/software/verify-plan/SKILL.md) § Method on the diagnosis and
produce one row per claim — the same table that skill defines, because a diagnosis is a plan claim
that has not been written down yet:

| # | Claim | Verdict (CONFIRMED / REFUTED / UNVERIFIABLE) | Evidence (`file:line`, verbatim output, query result, failing test) | Impact if wrong |

Three rules, each of which has been violated in a real run:

- **CONFIRMED requires evidence in the row.** A citation-free CONFIRMED is a guess; downgrade it to
  UNVERIFIABLE rather than letting it read as proven.
- **A claim that is not CONFIRMED may not justify a code change, and may not appear unlabelled in a
  commit message or PR body.** Lowering the label always beats deleting the caveat.
- **REFUTED ends the run.** Report it; do not quietly do the missing work and carry on. A measured
  run inspected a plan's cited commit, found it a no-op, performed the missing migration on one file
  and shipped the change that depended on it — while the premise had said *every* producer.

**The strongest evidence for a root-cause claim is a failing test**, not a file read: a test that
reproduces the symptom at the cited `file:line` demonstrates the claim instead of asserting it
(`tdd` skill step 2). A behaviour claim nobody can make fail is a claim to downgrade.

**Cost, stated honestly:** in the default pipeline this is the main agent writing the table — no
extra subagent, so the cost is the evidence-gathering the diagnosis should have done anyway. Under
`--flow` it becomes a discrete stage run by an **independent** agent instance, which is stronger
because the author of a claim is the worst judge of it. `--quick` does **not** skip it: a quick fix
is where an unverified cause is most likely and least examined.

Append the gate result to `plans/<plan>/STATE.md` (`run-state` skill).

**After the gate — lock the scope when the blast radius spans layers (cook):** when **06 · blast radius** answers with more than one repo or layer, run the [`cook` skill](../skills/software/cook/SKILL.md) § Scope lock before Stage [4]: present **(A) minimal-surface** and **(B) thorough** — repos and layers touched, plus which existing conventions each option follows or breaks — and **halt for the pick**. Over-scoping is a distinct failure from a wrong root cause: the diagnosis can be right and the change still several times too large, and a cross-layer bug report is exactly where that happens. A behavioural eval of this path caught a two-layer email fix edited on one side with nothing asked, because this pipeline carried no scope gate at all while `/ck:cook` did — and a bug report, not `/ck:cook`, is how most work arrives. `--auto`: pick (A) and `[ASSUMED]`-log it. Single-layer fixes are unaffected — the condition is the gate's own answer, not a guess.

**Baseline rule (all variants, G19):** "is this failure pre-existing?" is answered from the suite run on the **untouched tree before the first edit** (recorded in `STATE.md`), **never via `git stash`** — see the [`tdd` skill](../skills/software/tdd/SKILL.md) § Baseline for why (the no-op is silent) and for the scratch-branch fallback when the tree is already dirty.

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

`/ck:fix --flow` runs this **same pipeline** as discrete, inspectable agent stages with structured handoff — it **complements, does not replace**, the canonical pipeline above. The prose gates ([2.5] Scout, [3.5] Root-Cause, [3.7] Falsify) become explicit agent stages whose answers are written to `plans/<plan>/reports/`. **[3.7] is not introduced by this flag** — it is mandatory in every mode; what changes is *who* runs it: N independent skeptic instances instead of the main agent writing its own evidence table, because the author of a claim is the worst judge of it. Reads the `dynamic-workflow` skill file ([../skills/software/dynamic-workflow/SKILL.md](../skills/software/dynamic-workflow/SKILL.md)) — source of truth for the pattern; do not duplicate methodology here.

```
[2.5] Scout Gate        → Agent[scout]: answer the 5 items → reports/scout-flow.md
[3]   Diagnose          → Agent[debugger|tester|frontend-developer]: root cause → reports/diagnose-flow.md
[3.5] Root-Cause Gate   → Agent: answer the 6 Q from the handoff; any "unknown" → loop [3]
[3.7] Falsify Gate      → N Agent skeptics: "refute this root cause; default refuted if unsure"
                           each returns CONFIRMED/REFUTED/UNVERIFIABLE + evidence per claim
                           majority refute → loop [3] with refutation evidence; survive → proceed
[4..7] Plan→Implement→Verify→Review→Report   (unchanged — inherit gates + reports/)
```

- **Same gates, different form** — the orchestrated path references the SAME 5-item Scout Gate, 6-Q Root-Cause Gate and per-claim Falsify Gate; only execution changes from prose-the-model-follows to discrete stages.
- **4-axis inheritance** — shared `reports/` (context), routed personas (persona), development-rules + all three gates apply to every stage (gate), skeptics may run a cheaper model (model/budget).
- **Independence is what this buys** — [3.7] runs in every mode; dispatching it to separate instances is what makes it adversarial rather than self-assessed, and "default refuted if unsure" is what stops a skeptic from rubber-stamping.
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
