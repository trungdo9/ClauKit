---
name: requesting-code-review
description: Use when completing tasks, implementing major features, or before merging to verify work meets requirements - dispatches code-reviewer subagent to review implementation against plan or requirements before proceeding
---

# Requesting Code Review

Dispatch code-reviewer subagent to catch issues before they cascade.

**Core principle:** Review early, review often.

## When to Request Review

**Mandatory:**
- After each task in subagent-driven development
- After completing major feature
- Before merge to main

**Optional but valuable:**
- When stuck (fresh perspective)
- Before refactoring (baseline check)
- After fixing complex bug

## How to Request

**0. Scout edge cases first (optional, recommended for complex changes):**

```bash
/ck:scout edge cases for <feature>
```

Surfaces files affected beyond modified files, data-flow paths, boundary conditions, side effects. Hand the scout report to the reviewer so attention lands where breakage is most likely.

**1. Get git SHAs:**
```bash
BASE_SHA=$(git rev-parse HEAD~1)  # or origin/main
HEAD_SHA=$(git rev-parse HEAD)
```

**2. Dispatch code-reviewer subagent:**

Use Task tool with `code-reviewer` type, fill template at `code-reviewer.md`

**Placeholders:**
- `{WHAT_WAS_IMPLEMENTED}` - What you just built
- `{PLAN_OR_REQUIREMENTS}` - What it should do
- `{BASE_SHA}` - Starting commit
- `{HEAD_SHA}` - Ending commit
- `{DESCRIPTION}` - Brief summary

**3. Act on feedback:**
- Fix Critical issues immediately
- Fix High issues before proceeding
- Note Medium/Low issues for later
- Push back if reviewer is wrong (with reasoning)

## Example

```
[Just completed Task 2: Add verification function]
BASE_SHA=a7981ec  HEAD_SHA=3df7661

[Dispatch code-reviewer]
  WHAT_WAS_IMPLEMENTED: verifyIndex() + repairIndex() with 4 issue types
  PLAN_OR_REQUIREMENTS: Task 2 from docs/plans/deployment-plan.md
  DESCRIPTION: verification and repair functions for conversation index

[Returns] Issues — High: missing progress indicators · Low: magic number 100
You: [fix progress indicators] → continue Task 3
```

## Integration with Workflows

- **Subagent-driven development:** review after EACH task — catch issues before they compound.
- **Executing plans:** review after each batch (3 tasks), apply feedback, continue.
- **Ad-hoc development:** review before merge or when stuck.

## Red Flags

**Never:** skip review because "it's simple" · ignore Critical issues · proceed with unfixed High issues · argue with valid technical feedback.

**If reviewer is wrong:** push back with technical reasoning, show code/tests proving it works, request clarification.

See template at: `requesting-code-review/code-reviewer.md`.