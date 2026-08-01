---
name: verify-plan
description: Falsify a plan's factual claims before implementing against them. Use before executing any plan written in another session (/ck:cook --from-plan), via /ck:plan verify <path>, or whenever a plan asserts existing-behaviour facts (a root cause, "X currently does Y", affected row counts, "already done"). Produces a claim → verdict → evidence table; no code until it is approved.
metadata:
  version: "1.0.0"
---

# Verify-Plan — Falsify Before You Build

## Why

Implementing against unverified plan claims is the top measured source of first-pass defects (buggy_code 12 + wrong_approach 7 in one dataset; a wrong root cause shipped in **3 merged PRs** in another, then cost corrective + cleanup PRs). A plan is not evidence — it is a set of **falsifiable hypotheses** written by someone (often a past session) who could be wrong.

## Method

1. **Extract every factual claim.** The claim classes that fail in practice:
   - root cause ("the bug is caused by X")
   - current behaviour ("X currently does Y", "the legacy path handles Z")
   - data claims (affected row counts, "only N records match")
   - code-path claims ("this handler runs on every request")
   - status claims ("already done", "phase 2 is complete", "this migration ran")
2. **Prove or disprove each** with evidence, never with plausibility:
   - `git log` / `git blame` / `git show` — did the change actually land? when? what did legacy behaviour look like?
   - direct file reads — does the cited code do what the plan says at that `file:line`?
   - **read-only** queries (`SELECT`, `EXPLAIN`) — do the row counts / data shapes hold?
   - run the cited command and paste its output.
3. **Fill the fixed table** → `plans/<plan>/reports/plan-verification.md`:

   | # | Claim | Verdict (CONFIRMED / REFUTED / UNVERIFIABLE) | Evidence (`file:line`, git ref, or verbatim output) | Impact if wrong |

4. **Verdict discipline:**
   - CONFIRMED requires evidence in the row — a citation-free CONFIRMED is a guess and gets downgraded to UNVERIFIABLE.
   - UNVERIFIABLE names the check that *would* settle it and why it wasn't run.
   - REFUTED quotes the disproving evidence verbatim.

## Hard rules

- **No code until the table is approved.**
- Any REFUTED **load-bearing** claim (the plan's approach depends on it) → back to `planner`; do not patch around it.
- **All-REFUTED is a legitimate outcome.** One verified migration plan proved to be a complete no-op — finding that before implementation is the gate's biggest win, not a failure of the gate.
- Verification is read-only: no edits, no writes, no mutating queries.
- Append the gate result to `plans/<plan>/STATE.md` (`[[run-state]]`): `phase 0: gate verify-plan → PASS|FAIL (evidence: <K> claims, <c>/<r>/<u>)`.

## When it triggers

- **Mandatory:** `/ck:cook --from-plan` — a plan authored in another session is exactly the case that failed.
- **Auto-trigger elsewhere:** the plan asserts ≥1 falsifiable claim about *existing* behaviour. A greenfield feature plan has nothing to falsify — running the gate there is pure cost.
- **Standalone:** `/ck:plan verify <path>`.
- Also runs inside `/ck:fix` after its root-cause gate, on the diagnosis itself (the root cause is a claim like any other).

## Cross-links

`[[planning]]` (executable exit gates make claims checkable), `[[cook]]` (Stage 0.5), `[[run-state]]`, `[[code-review]]` (same Iron Law: evidence or it didn't happen), `[[debugging]]` (root-cause tracing supplies the evidence for cause claims)
