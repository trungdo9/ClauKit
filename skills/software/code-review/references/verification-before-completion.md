---
name: verification-before-completion
description: Use when about to claim work is complete, fixed, or passing, before committing or creating PRs - requires running verification commands and confirming output before making any success claims; evidence before assertions always
---

# Verification Before Completion

Claiming work is complete without verification is dishonesty, not efficiency.

**Core principle:** Evidence before claims, always. **Violating the letter of this rule is violating the spirit of this rule.**

## The Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If you haven't run the verification command in this message, you cannot claim it passes.

## The Gate Function

```
BEFORE claiming any status or expressing satisfaction:

1. IDENTIFY: What command proves this claim?
2. RUN:      Execute the FULL command (fresh, complete)
3. READ:     Full output, check exit code, count failures
4. VERIFY:   Does output confirm the claim?
             - If NO:  state actual status with evidence
             - If YES: state claim WITH evidence
5. ONLY THEN: make the claim

Skip any step = lying, not verifying
```

## Required Evidence Per Claim

| Claim | Requires | Not Sufficient |
|---|---|---|
| Tests pass | Test command output: 0 failures | Previous run, "should pass" |
| Linter clean | Linter output: 0 errors | Partial check, extrapolation |
| Build succeeds | Build command: exit 0 | Linter passing, logs look good |
| Bug fixed | Test original symptom: passes | Code changed, assumed fixed |
| Regression test works | Red-green cycle verified | Test passes once |
| Agent completed | VCS diff shows changes | Agent reports "success" |
| Requirements met | Line-by-line checklist | Tests passing |
| Merged / deployed | `git fetch origin` then inspect the **remote** ref (`origin/<branch>`, `git branch -r --contains`) | Local branch state, a previous fetch, "the PR was approved" |
| Failure is pre-existing | Base commit checked out **in a separate worktree**, suite run there | `git stash` baseline (silently no-ops) |

## Red Flags — STOP

- Using "should", "probably", "seems to"
- Expressing satisfaction before verification ("Great!", "Perfect!", "Done!")
- About to commit/push/PR without verification
- Trusting agent success reports
- Relying on partial verification
- Thinking "just this once"
- Tired and wanting work over
- **ANY wording implying success without having run verification**

## When To Apply

**ALWAYS before:** any variation of success/completion claims · any expression of satisfaction · any positive statement about work state · committing, PR creation, task completion · moving to next task · delegating to agents.

**Applies to:** exact phrases, paraphrases, synonyms, implications of success, ANY communication suggesting completion/correctness.

## See also

- `verification-patterns.md` — concrete patterns per claim type (tests, regression, build, requirements, agent delegation), rationalization-prevention table, why this matters.

## Bottom Line

**No shortcuts for verification.** Run the command. Read the output. THEN claim the result. This is non-negotiable.
