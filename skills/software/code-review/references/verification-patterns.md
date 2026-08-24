---
name: verification-patterns
description: Concrete verification patterns for tests passing, regression test red-green cycle, build success, requirements coverage, and agent delegation diff-checks - plus rationalization-prevention table for "should work" excuses
---

# Verification Patterns

Companion to `verification-before-completion.md`. Concrete patterns per claim type + excuse-killer table.

## Rationalization Prevention

| Excuse | Reality |
|---|---|
| "Should work now" | RUN the verification |
| "I'm confident" | Confidence ≠ evidence |
| "Just this once" | No exceptions |
| "Linter passed" | Linter ≠ compiler |
| "Agent said success" | Verify independently |
| "I'm tired" | Exhaustion ≠ excuse |
| "Partial check is enough" | Partial proves nothing |
| "Different words so rule doesn't apply" | Spirit over letter |

## Key Patterns

**Tests:**
```text
✅ [Run test command] [See: 34/34 pass] "All tests pass"
❌ "Should pass now" / "Looks correct"
```

**Regression tests (TDD Red-Green):**
```text
✅ Write → Run (pass) → Revert fix → Run (MUST FAIL) → Restore → Run (pass)
❌ "I've written a regression test" (without red-green verification)
```

**Merged / deployed status:**
```text
✅ git fetch origin && git branch -r --contains <sha>  [See: origin/main] "Merged to origin/main"
❌ "The branch shows merged locally" / "the PR was approved" (stale local state reported as fact — happened twice in the source data)
```

**Pre-existing failure (baseline):**
```text
✅ suite run on the untouched tree before the first edit (`baseline:` in STATE.md) → compare failure sets
✅ already dirty? park own WIP on a scratch branch (explicit paths, untracked included) → checkout <base sha>
   → `git status --porcelain` MUST be empty → run → return   (foreign dirty files ⇒ don't park, stop)
❌ git commit -am on a shared tree (sweeps another session's files, then strips them at checkout)
❌ git stash → run → stash pop (the stash can silently no-op; the "baseline" is your dirty tree)
```

**Build:**
```text
✅ [Run build] [See: exit 0] "Build passes"
❌ "Linter passed" (linter doesn't check compilation)
```

**Requirements:**
```text
✅ Re-read plan → Create checklist → Verify each → Report gaps or completion
❌ "Tests pass, phase complete"
```

**Agent delegation:**
```text
✅ Agent reports success → Check VCS diff → Verify changes → Report actual state
❌ Trust agent report
```

## Why This Matters

From 24 failure memories:
- human partner said "I don't believe you" — trust broken
- Undefined functions shipped — would crash
- Missing requirements shipped — incomplete features
- Time wasted on false completion → redirect → rework
- Violates: "Honesty is a core value. If you lie, you'll be replaced."
