---
name: code-review
description: Use when receiving code review feedback (especially if unclear or technically questionable), when completing tasks or major features requiring review before proceeding, or before making any completion/success claims. Covers four practices - edge-case scouting before review, receiving feedback with technical rigor over performative agreement, requesting reviews via code-reviewer subagent, and verification gates requiring evidence before any status claims. Essential for subagent-driven development, pull requests, and preventing false completion claims.
---

# Code Review

Guide proper code review practices emphasizing technical rigor, evidence-based claims, and verification over performative responses.

## Core Principle

Technical correctness over social comfort. Verify before implementing. Ask before assuming. Evidence before claims. Always honor YAGNI, KISS, DRY. Be honest, brutal, straight to the point, concise.

## Practices (with optional pre-review scout)

| Practice | When | Reference |
|---|---|---|
| Pre-review edge-case scout | Before reviewer on complex change | inline below |
| Receiving feedback | Code review comments arrive | `references/code-review-reception.md` (+ `-examples.md`) |
| Requesting review | After task/feature, pre-merge | `references/requesting-code-review.md` |
| Verification gates | Before any success claim | `references/verification-before-completion.md` (+ `verification-patterns.md`) |

## Quick Decision Tree

```
SITUATION?
├─ Received feedback
│  ├─ Unclear items? → STOP, ask for clarification first
│  ├─ From human partner? → Understand, then implement
│  └─ From external reviewer? → Verify technically before implementing
├─ Completed work
│  ├─ Complex change? → Scout edge cases first (see below)
│  ├─ Major feature/task? → Request code-reviewer subagent review
│  └─ Before merge? → Request code-reviewer subagent review
└─ About to claim status
   ├─ Have fresh verification? → State claim WITH evidence
   └─ No fresh verification? → RUN verification command first
```

## Edge Case Scouting (Pre-Review)

Before dispatching the code-reviewer on a complex change: `/ck:scout edge cases for <feature>`. Surfaces files affected beyond modified files, data-flow paths likely to break, boundary conditions, side effects. Output focuses reviewer attention → review becomes targeted and faster.

## Verification Gates (The Iron Law)

**NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE**

Gate function: IDENTIFY command → RUN full command → READ output → VERIFY confirms claim → THEN claim. Skip any step = lying, not verifying.

| Claim | Required Evidence |
|---|---|
| Tests pass | Test output: 0 failures |
| Build succeeds | Build command exit 0 |
| Bug fixed | Test on original symptom passes |
| Requirements met | Line-by-line checklist verified |

**Red flags — STOP:** "should" / "probably" / "seems to", satisfaction before verification, committing without verification, trusting agent reports without diff check, ANY wording implying success without running verification.

## Receiving Feedback (Summary)

Pattern: READ → UNDERSTAND → VERIFY → EVALUATE → RESPOND → IMPLEMENT.

Forbidden: "You're absolutely right!", "Great point!", "Thanks for [anything]", implementation before verification. Required: restate requirement, ask questions, push back with technical reasoning, or just start working. YAGNI check before implementing suggested "proper" features (grep usage first).

## Requesting Review (Summary)

1. Get SHAs: `BASE_SHA=$(git rev-parse HEAD~1)` and `HEAD_SHA=$(git rev-parse HEAD)`.
2. Dispatch code-reviewer subagent via Task tool with: WHAT_WAS_IMPLEMENTED, PLAN_OR_REQUIREMENTS, BASE_SHA, HEAD_SHA, DESCRIPTION.
3. Act on feedback: fix Critical immediately, High before proceeding, note Medium/Low for later.

## Common Use Cases

- **External feedback** — reviewer suggests adding error handling: grep usage before implementing; YAGNI-check first.
- **Task completion** — just finished refactor: dispatch code-reviewer with BASE/HEAD SHAs before next task.
- **Pre-commit evidence** — about to commit fix: run full test suite, show output, then claim pass.
- **Unclear feedback** — "improve error handling": STOP, ask which paths/scenarios.
- **YAGNI enforcement** — reviewer suggests caching layer: grep actual usage patterns first.

## Pro Tips

- Never assume success — always verify with fresh evidence.
- Evidence over claims — show command output, not opinions.
- Question unclear feedback — asking before implementing saves rework.
- Activation phrase: "Use code-review skill to verify this completion claim with evidence."

## Related Skills

- `debugging` — evidence-based debugging methodology
- `sequential-thinking` — systematic problem solving
- `planning` — task decomposition and verification

## Bottom Line

Technical rigor over social performance. Systematic review via code-reviewer subagent. Evidence before claims. Verify. Question. Then implement.
