---
name: requesting-code-review
description: Use when completing tasks, implementing major features, or before merging - pins the review's fixed point with a merge-base diff, locates the spec, then dispatches subagents on separate Standards / Spec / Security axes that are reported side by side without reranking
---

# Requesting Code Review

Dispatch review subagents to catch issues before they cascade.

**Core principle:** Review early, review often. **Scope the diff before you scope the reviewer.**

## When to Request Review

**Mandatory:**
- After each task in subagent-driven development
- After completing a major feature
- Before opening a PR

**Optional but valuable:**
- When stuck (fresh perspective)
- Before refactoring (baseline check)
- After fixing a complex bug

## 1. Pin the fixed point

Every review is the diff between `HEAD` and **one** fixed point. Name it before anything else.

| Reviewing | Fixed point |
|---|---|
| The one commit just made | `HEAD~1` |
| A whole feature branch, pre-PR | the PR target — `origin/<default-branch>`, or the project's integration branch |
| Work since a plan started | the base SHA recorded in the plan's `STATE.md` (`started (base <sha>)`) |
| Whatever the user named | their SHA / branch / tag, verbatim |

If the user said "review since X", X is the fixed point. If nothing was named and the change is more than one commit, **ask** — do not silently default to `HEAD~1`.

**Use three dots for the diff.** `...` compares against the merge-base, so commits that landed on the target branch *after* you branched off are not attributed to your change:

```bash
FIXED_POINT=origin/main                     # or a SHA, a tag, HEAD~1 ...
git diff "$FIXED_POINT"...HEAD              # the diff under review
git log  "$FIXED_POINT"..HEAD --oneline     # the commits under review (two dots — log is not symmetric)
```

`git diff A..B` is a plain two-endpoint diff, so it leaks the target branch's own commits into the review, inverted. Two dots are safe only when the fixed point is a known ancestor of `HEAD` (e.g. `HEAD~1`). `.claude/scripts/ck/review-package.cjs` already uses the three-dot form for its diff and the two-dot form for its log.

**Pre-flight — fail here, not inside a subagent:**

```bash
git rev-parse --verify "$FIXED_POINT" >/dev/null || exit 1     # ref resolves?
git diff --quiet "$FIXED_POINT"...HEAD && echo "EMPTY DIFF"    # anything to review?
```

A bad ref or an empty diff stops the request. Letting three parallel subagents each discover it costs three contexts and returns three confusing reports.

**Hand the diff as a file, never inline.** An inlined diff stays resident in the orchestrator's context for the rest of the run:

```bash
node .claude/scripts/ck/review-package.cjs "$FIXED_POINT" HEAD [--plan <plan-dir>]   # prints the path
```

## 2. Locate the spec (for the Spec axis)

Search in this order, stop at the first hit:

1. **Plan file** — `plans/<YYMMDD-HHmm-slug>/plan.md` matching the branch or feature. Authored by `/ck:plan`; usually the answer.
2. **Ticket** — `plans/<dir>/tickets/NN-*.md` from `/ck:tickets`, or an issue key in the branch name or in the commits from step 1 (fetch via a connected Atlassian MCP `getJiraIssue`).
3. **A path the user passed** as an argument.
4. **A spec under `./docs/`** matching the branch or feature.
5. **Nothing found** → ask the user. If they confirm there is no spec, skip the Spec axis and say so in the report. Never invent requirements and then review against them.

Harvest ticket keys from the commits under review:

```bash
git log "$FIXED_POINT"..HEAD --format='%s%n%b' | grep -oE '\b[A-Z][A-Z0-9]+-[0-9]+' | sort -u
```

## 3. Scout edge cases (optional, recommended for complex changes)

```bash
/ck:scout edge cases for <feature>
```

Surfaces files affected beyond the modified ones, data-flow paths, boundary conditions, side effects. Hand the scout report to the reviewers so attention lands where breakage is most likely.

## 4. Dispatch — one subagent per axis, in parallel

Parallel subagents keep the axes from polluting each other's context. All three go out **in one message**.

| Axis | Question | Agent | Sources handed to it |
|---|---|---|---|
| **Standards** | Does the code follow this project's documented standards? | `code-reviewer` | [.claude/workflows/development-rules.md](../../../../workflows/development-rules.md), `./docs/code-standards.md` when present, **plus [smell-baseline.md](smell-baseline.md) pasted in full** |
| **Spec** | Does the code do what the spec asked — no more, no less? | `code-reviewer` | the plan file / ticket from step 2 |
| **Security** | Does the diff hold the security line? | `security-auditor` | the `security` skill's Core rule tier, diff-scoped |

The Security axis is diff-scoped and short by design. For a wider scope — whole repo, a subtree, a release window — or a saved report, run [`/ck:security`](../../../../commands/ck/security.md) alongside; it is the only path that reaches the `security` skill's LARGE-mode parallel fan-out (a delegated subagent has no `Task` tool).

Every axis prompt carries the **review-package path** from step 1, the two git commands verbatim, its own sources, and a **400-word cap** on the report. The subagent has no other access to the smell baseline — paste it.

**Standards brief:** "Report per file/hunk: (a) every place the diff breaks a documented standard — cite the rule file and the rule; (b) every baseline smell you spot — name it, quote the hunk. Documented-standard breaches can be hard violations; baseline smells are always judgement calls, and a documented rule overrides the baseline. Skip anything tooling already enforces. Under 400 words."

**Spec brief:** "Report: (a) requirements the spec asked for that are missing or partial; (b) behaviour in the diff nobody asked for (scope creep); (c) requirements that look implemented but are implemented wrong. Quote the spec line — or the ticket's acceptance criterion — behind each finding. Under 400 words."

Fill the [code-reviewer](../../../../agents/engineering/code-reviewer.md) prompt with: `{WHAT_WAS_IMPLEMENTED}` · `{PLAN_OR_REQUIREMENTS}` · `{FIXED_POINT}` · `{DESCRIPTION}`.

No spec available → skip that axis and note it. Never fold Spec findings into Standards.

**Scaling up.** Standards may take more than one `code-reviewer` when the change spans subsystems; Spec and Security stay one each. When the diff is large *and* risky, the axes are not enough — escalate to the four-lens fan-out in [SKILL.md § Multi-Lens Review](../SKILL.md), which runs the same fixed point through ADVERSARY / FIDELITY / BLAST RADIUS / CONVENTION.

## 5. Report the axes separately — do not rerank

Present findings under `## Standards`, `## Spec`, `## Security` headings, verbatim or lightly cleaned. **Do not merge them into one severity-ranked list.** A change can pass one axis and fail another:

- Follows every standard, implements the wrong thing → Standards pass, **Spec fail**.
- Does exactly what the ticket asked, breaks every convention → Spec pass, **Standards fail**.

A single list hides that. Close with per-axis totals and the worst finding *within each axis* — never one winner across axes; that reranking is what the separation exists to prevent.

Severity triage applies **inside** an axis: fix Critical immediately, High before proceeding, note Medium/Low for later. Push back with technical reasoning when a reviewer is wrong (see [code-review-reception.md](code-review-reception.md)).

## Example

```text
[Just finished Task 2: Add verification function, branch feat/verify-index]

FIXED_POINT=origin/main
  git rev-parse --verify origin/main      → ok
  git diff --quiet origin/main...HEAD     → non-empty
  review-package.cjs origin/main HEAD     → /tmp/ck-review-x1/review-package-a7981ec..3df7661.md
Spec source: plans/260821-1108-verify-index/plan.md (step 2 hit #1)

[Dispatch, one message, parallel]
  code-reviewer    axis=Standards  + development-rules + code-standards + smell-baseline.md
  code-reviewer    axis=Spec       + plan.md
  security-auditor axis=Security   + security Core rules

[Returns]
  ## Standards — High: missing progress indicator · Low: magic number 100
                 judgement call: possible Data Clumps on (index, path, mtime)
  ## Spec     — plan step 2.3 "repair reports per-issue counts" not implemented
  ## Security — clean
You: fix the High + the missing spec item → re-run the Spec axis only → continue Task 3
```

## Integration with Workflows

- **Subagent-driven development:** review after EACH task — catch issues before they compound. `FIXED_POINT=HEAD~1` is right here.
- **Executing plans (`/ck:cook`):** review after each batch, apply feedback, continue. Fixed point = the phase's recorded base from `STATE.md`, never `HEAD~1`.
- **Pre-PR:** `FIXED_POINT` = the PR target branch. This is the review that matters — run all three axes.
- **Ad-hoc development:** review before merge or when stuck.

## Red Flags

**Never:** skip review because "it's simple" · review with an unpinned or empty diff · use a two-dot diff against a moving branch · hand a reviewer an inline diff · fold Spec findings into Standards · ignore Critical issues · proceed with unfixed High issues · argue with valid technical feedback.

**If a reviewer is wrong:** push back with technical reasoning, show the code or tests proving it works, request clarification.

## See also

- [smell-baseline.md](smell-baseline.md) — the 12-smell baseline the Standards axis always carries.
- [code-review-reception.md](code-review-reception.md) — how to receive the findings that come back.
- [verification-before-completion.md](verification-before-completion.md) — the gate before claiming the fixes are done.
