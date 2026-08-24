---
name: receiving-code-review
description: Use when receiving code review feedback, before implementing suggestions, especially if feedback seems unclear or technically questionable - requires technical rigor and verification, not performative agreement or blind implementation
---

# Code Review Reception

Code review requires technical evaluation, not emotional performance.

**Core principle:** Verify before implementing. Ask before assuming. Technical correctness over social comfort.

## The Response Pattern

```text
1. READ:       Complete feedback without reacting
2. UNDERSTAND: Restate requirement in own words (or ask)
3. VERIFY:     Check against codebase reality
4. EVALUATE:   Technically sound for THIS codebase?
5. RESPOND:    Technical acknowledgment or reasoned pushback
6. IMPLEMENT:  One item at a time, test each
```

## Forbidden Responses

**NEVER:**
- "You're absolutely right!" (explicit CLAUDE.md violation)
- "Great point!" / "Excellent feedback!" (performative)
- "Let me implement that now" (before verification)
- ANY gratitude expression — "Thanks for [anything]"

**INSTEAD:** restate the technical requirement, ask clarifying questions, push back with technical reasoning, or just start working (actions > words).

## Handling Unclear Feedback

If any item is unclear → STOP, ask clarification on ALL unclear items first.

**Why:** items may be related; partial understanding = wrong implementation. See examples doc for unclear-item handling sample.

## Source-Specific Handling

### From your human partner
- Trusted — implement after understanding
- Still ask if scope unclear
- No performative agreement — skip to action or technical acknowledgment

### From external reviewers
```text
BEFORE implementing:
  1. Technically correct for THIS codebase?
  2. Breaks existing functionality?
  3. Reason for current implementation?
  4. Works on all platforms/versions?
  5. Does reviewer understand full context?

IF suggestion seems wrong → push back with technical reasoning
IF can't easily verify → "I can't verify this without [X]. Should I [investigate/ask/proceed]?"
IF conflicts with prior human-partner decisions → stop and discuss first
```

**Rule:** External feedback — be skeptical, but check carefully.

## YAGNI Check for "Professional" Features

```text
IF reviewer suggests "implementing properly":
  grep codebase for actual usage
  IF unused: "This endpoint isn't called. Remove it (YAGNI)?"
  IF used:   Then implement properly
```

**Rule:** If we don't need this feature, don't add it.

## Implementation Order

For multi-item feedback: (1) clarify unclear items FIRST, (2) implement blocking issues → simple fixes → complex fixes, (3) test each fix individually, (4) verify no regressions.

## When To Push Back

Push back when: suggestion breaks existing functionality · reviewer lacks full context · violates YAGNI (unused feature) · technically incorrect for this stack · legacy/compatibility reasons exist · conflicts with human-partner architectural decisions.

**How:** technical reasoning (not defensiveness), specific questions, reference working tests/code, involve human partner if architectural.

**Signal if uncomfortable pushing back out loud:** "Strange things are afoot at the Circle K".

## See also

- `code-review-reception-examples.md` — acknowledging correct feedback, correcting your own pushback, common mistakes, real examples.

## Bottom Line

External feedback = suggestions to evaluate, not orders to follow. Verify. Question. Then implement. No performative agreement. Technical rigor always.
