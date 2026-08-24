---
name: code-review-reception-examples
description: Examples for receiving code review feedback - acknowledging correct feedback without performative gratitude, gracefully correcting your own pushback when wrong, common mistakes table, real before/after examples
---

# Code Review Reception — Examples

Companion to `code-review-reception.md` (protocol). Loads on demand when concrete patterns are needed.

## Acknowledging Correct Feedback

```text
✅ "Fixed. [Brief description of what changed]"
✅ "Good catch — [specific issue]. Fixed in [location]."
✅ [Just fix it and show in the code]

❌ "You're absolutely right!"
❌ "Great point!"
❌ "Thanks for catching that!"
❌ "Thanks for [anything]"
❌ ANY gratitude expression
```

**Why no thanks:** actions speak. Just fix it. The code itself shows you heard the feedback.

**If you catch yourself about to write "Thanks":** DELETE IT. State the fix instead.

## Gracefully Correcting Your Pushback

If you pushed back and were wrong:

```text
✅ "You were right — I checked [X] and it does [Y]. Implementing now."
✅ "Verified this and you're correct. My initial understanding was wrong because [reason]. Fixing."

❌ Long apology
❌ Defending why you pushed back
❌ Over-explaining
```

State the correction factually and move on.

## Common Mistakes

| Mistake | Fix |
|---|---|
| Performative agreement | State requirement or just act |
| Blind implementation | Verify against codebase first |
| Batch without testing | One at a time, test each |
| Assuming reviewer is right | Check if breaks things |
| Avoiding pushback | Technical correctness > comfort |
| Partial implementation | Clarify all items first |
| Can't verify, proceed anyway | State limitation, ask for direction |

## Real Examples

**Performative agreement (bad):**
```text
Reviewer: "Remove legacy code"
❌ "You're absolutely right! Let me remove that..."
```

**Technical verification (good):**
```text
Reviewer: "Remove legacy code"
✅ "Checking... build target is 10.15+, this API needs 13+. Need legacy for backward compat.
   Current impl has wrong bundle ID — fix it or drop pre-13 support?"
```

**YAGNI (good):**
```text
Reviewer: "Implement proper metrics tracking with database, date filters, CSV export"
✅ "Grepped codebase — nothing calls this endpoint. Remove it (YAGNI)?
   Or is there usage I'm missing?"
```

**Unclear item (good):**
```text
human partner: "Fix items 1-6"
You understand 1,2,3,6 but not 4,5.
✅ "Understand 1,2,3,6. Need clarification on 4 and 5 before implementing."
```
