---
name: code-review
description: Use when reviewing a branch, a PR, or work-in-progress changes ("review since X"), when receiving code review feedback (especially if unclear or technically questionable), when completing tasks or major features requiring review before proceeding, or before making any completion/success claims. Covers edge-case scouting, pinning the review's fixed point with a merge-base diff, three-axis review (Standards vs Spec vs Security) in parallel subagents reported without reranking, the smell baseline the Standards axis always carries, the four-lens escalation for high-risk diffs, receiving feedback with technical rigor over performative agreement, and verification gates requiring evidence before any status claims. Essential for subagent-driven development, pull requests, and preventing false completion claims.
---

# Code Review

Guide proper code review practices emphasizing technical rigor, evidence-based claims, and verification over performative responses.

## Core Principle

Technical correctness over social comfort. Verify before implementing. Ask before assuming. Evidence before claims. Always honor YAGNI, KISS, DRY. Be honest, brutal, straight to the point, concise.

## Practices (with optional pre-review scout)

| Practice | When | Reference |
|---|---|---|
| Pre-review edge-case scout | Before reviewer on complex change | inline below |
| Requesting review (fixed point · 3 axes) | After task/feature, pre-merge, "review since X" | [references/requesting-code-review.md](references/requesting-code-review.md) |
| Smell baseline (Standards axis) | Pasted into every Standards-axis prompt | [references/smell-baseline.md](references/smell-baseline.md) |
| Receiving feedback | Code review comments arrive | [references/code-review-reception.md](references/code-review-reception.md) (+ [-examples](references/code-review-reception-examples.md)) |
| Verification gates | Before any success claim | [references/verification-before-completion.md](references/verification-before-completion.md) (+ [patterns](references/verification-patterns.md)) |

## Quick Decision Tree

```text
SITUATION?
├─ Received feedback
│  ├─ Unclear items? → STOP, ask for clarification first
│  ├─ From human partner? → Understand, then implement
│  └─ From external reviewer? → Verify technically before implementing
├─ Asked to review a branch / PR / "since X"
│  ├─ Fixed point named? → pin it, three-dot diff, pre-flight check
│  └─ Not named + >1 commit? → ASK, don't default to HEAD~1
├─ Completed work
│  ├─ Complex change? → Scout edge cases first (see below)
│  ├─ Major feature/task? → Request review (Standards · Spec · Security)
│  ├─ High-risk diff? → escalate to the 4 lenses (§ Multi-Lens Review)
│  └─ Before merge? → Request review, fixed point = the PR target branch
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

Full procedure: [references/requesting-code-review.md](references/requesting-code-review.md).

1. **Pin the fixed point** — `HEAD~1` for one commit, the PR target branch pre-PR, the phase's recorded base from `STATE.md` for a multi-commit phase (**never** assume `HEAD~1` there), or whatever the user named. Diff with **three dots** (`git diff <fp>...HEAD`) so the target branch's own commits stay out. Pre-flight: ref resolves, diff non-empty — fail here, not inside a subagent.
2. **Hand the diff as a file** — `node .claude/scripts/ck/review-package.cjs <fp> HEAD [--plan <dir>]` prints the path. Never inline a diff; it stays resident in the orchestrator's context for the whole run.
3. **Locate the spec** — plan file → ticket / issue key → user-supplied path → `./docs/` → ask. Never invent requirements to review against.
4. **Dispatch one subagent per axis, in one message** — Standards (`code-reviewer` + development-rules + code-standards + the smell baseline pasted in full) · Spec (`code-reviewer` + the spec) · Security (`security-auditor` + the `security` skill's Core rules). 400-word cap each.
5. **Report side by side, do not rerank** — `## Standards` / `## Spec` / `## Security`. Standards-pass + Spec-fail is a real outcome; one merged list hides it.
6. **Act on feedback** — inside each axis: Critical immediately, High before proceeding, Medium/Low noted. Re-run only the affected axis.

The three axes are the default shape. High-risk diffs escalate to the four lenses below; the two compose — axes answer *did it follow the rules / do the job / hold the line*, lenses answer *is it actually wrong*.

## Multi-Lens Review (canonical lens table)

**Escalation, not a replacement.** The three axes above run on every review; the four lenses are opt-in on top for high-risk diffs — >~200 changed lines, >3 files, or a diff touching auth / payments / migrations / a cross-service boundary. Fan out 4 independent reviewers, one lens each — perspective diversity catches what redundancy can't:

| Lens | Looks for |
|---|---|
| **ADVERSARY** | assume the implementation is wrong; prove it from the actual diff and live queries, not the description |
| **FIDELITY** | new logic vs legacy behavior on the base branch (`git show`/`git log`); every behavioral divergence, intended or not |
| **BLAST RADIUS** | cascade deletes, dropped status/permission guards, route-level auth gaps, duplicate keys, non-atomic mutation sequences, cross-service deploy-order hazards |
| **CONVENTION** | does the change respect the codebase's own architectural patterns? (a real fix violated an enforced host-separation pattern no reviewer was looking for) |

**Independence rules:**
- **The falsifier gets no reasoning** — each lens receives the diff + the requirement, never the implementer's explanation of why it is correct. A reviewer handed the rationale grades the rationale, not the code.
- **Admissibility:** every finding cites `file:line`, a git ref, or verbatim output. No evidence → discarded as a hallucination.
- **Reconcile:** cross-check lens reports against each other, flag disagreements explicitly, rank Critical/High/Medium, route Critical/High through adversarial verify before fixing.

Trigger: `/ck:review --lenses` (opt-in; default review stays the three axes). Same pinned fixed point and the same review-package file — build it once, hand every lens the path.

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
- `security` — the engine behind the Security axis; `/ck:security` for a scope wider than a diff
- `tdd` — the red-green discipline the Iron Law above assumes on a bug fix

## Bottom Line

Technical rigor over social performance. Pin the diff, split the axes, never rerank them. Evidence before claims. Verify. Question. Then implement.
