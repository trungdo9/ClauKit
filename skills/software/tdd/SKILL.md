---
name: tdd
description: Red-green test-driven discipline — NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST. Use for bug fixes (default), regression-prone changes, or when asked to "write tests first" / "TDD this". Covers red → verify-red → green → verify-green → refactor, the baseline rule (base-commit worktree, never git stash), the rationalization table, and red flags. Discipline only — test infra lives in test-automation, browser toolkits in web-testing, case derivation in scenario.
metadata:
  version: "1.0.0"
---

# TDD — Red-Green Discipline

## Iron Law

**NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST.**

A test written after the code proves the code does what the code does. A test that failed first proves the code fixed a real symptom — the source data shows 24 + 23 + 15 tests all written post-hoc, and separately a wrong root cause shipping through 3 merged PRs that a red test would have caught at step one.

## The Loop

1. **RED** — write the smallest test reproducing the **exact production symptom** (not a paraphrase of it).
2. **VERIFY RED** — run it; **paste the failure output**. A test you never saw fail proves nothing — it may be testing nothing, or testing the wrong thing. The failure must be for the *expected reason*, not an import error.
3. **GREEN** — write the minimum production code to pass. Resist fixing adjacent things.
4. **VERIFY GREEN** — run the test (pass) + the full sweep; paste output. Confirm the pre-existing failure set is unchanged.
5. **REFACTOR** — only now, with the test as the safety net.

## Baseline rule (non-negotiable)

"Is this failure pre-existing?" is answered by **checking out the base commit in a separate worktree** (`node scripts/ck/wt-new.cjs baseline --base <sha>`) and running the suite there — **never by `git stash`**. A stash-based baseline **silently no-ops** (dirty state that doesn't stash cleanly, untracked files, partial staging) and there is no error when it happens — a real one produced a commit message that had to be corrected. The failure mode is invisible, so the rule must be absolute.

Record the baseline failure set before step 1; step 4 diffs against it so regressions stay distinguishable from inherited breakage.

## Rationalization table

| The thought | The reality |
|---|---|
| "It's a one-line fix, a test is overkill" | One-line fixes have the highest wrong-root-cause rate — the test is how you find out the line is wrong |
| "I'll write the test after, while it's fresh" | A post-hoc test asserts the implementation, not the requirement; it passes by construction |
| "The test is hard to write, the fix is obvious" | Hard-to-test = the symptom isn't understood yet; writing the test *is* the diagnosis |
| "The suite is slow, I'll just run the new test" | Step 4 requires the sweep — a green target test with a new red elsewhere is a regression you shipped |
| "This test looks wrong, I'll fix it to pass" | Never weaken or skip assertions to get green; if a test looks wrong, **explain why before changing it** |

## Red flags — stop and restart the loop

- Production code changed before any test ran red.
- A test that passed on first run (you never verified red).
- Assertions deleted/loosened during GREEN.
- "Fixed" claimed from the target test alone, without the sweep.
- Baseline taken via `git stash` (see above).
- Suite "passes" but could not actually run (dangling venv symlink, missing dep) — prove the runner runs first; **never conclude from a suite that could not run**.

## Scope boundary (registry-clean)

- `tdd` (this skill) = the **discipline** — when tests are written and what order.
- `[[test-automation]]` = test **infrastructure** — runners, CI wiring, coverage tooling.
- `[[web-testing]]` = browser/app-dev **toolkit**.
- `[[scenario]]` = **case derivation** — which cases exist (happy/negative/recovery).

## Cross-links

`[[scenario]]`, `[[test-automation]]`, `[[web-testing]]`, `[[debugging]]`, `[[cook]]` (Test stage), `[[run-state]]` (gate lines), `[[worktree|git/worktree]]` (baseline)
