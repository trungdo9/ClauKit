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
```
✅ [Run test command] [See: 34/34 pass] "All tests pass"
❌ "Should pass now" / "Looks correct"
```

**Regression tests (TDD Red-Green):**
```
✅ Write → Run (pass) → Revert fix → Run (MUST FAIL) → Restore → Run (pass)
❌ "I've written a regression test" (without red-green verification)
```

**Merged / deployed status:**
```
✅ git fetch origin && git branch -r --contains <sha>  [See: origin/main] "Merged to origin/main"
❌ "The branch shows merged locally" / "the PR was approved" (stale local state reported as fact — happened twice in the source data)
```

**Pre-existing failure (baseline):**
```
✅ node scripts/ck/wt-new.cjs baseline --base <sha> → run suite in that worktree → compare failure sets
❌ git stash → run → stash pop (the stash can silently no-op; the "baseline" is your dirty tree)
```

**Build:**
```
✅ [Run build] [See: exit 0] "Build passes"
❌ "Linter passed" (linter doesn't check compilation)
```

**Requirements:**
```
✅ Re-read plan → Create checklist → Verify each → Report gaps or completion
❌ "Tests pass, phase complete"
```

**Agent delegation:**
```
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
