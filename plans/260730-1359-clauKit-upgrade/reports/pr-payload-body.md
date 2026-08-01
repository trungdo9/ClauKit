## Problem

v1.3.9 was strong on surface area and thin exactly where it mattered — the execution loop. `reports/plan-verification.md` checked 30 load-bearing claims before any code was written: **27 CONFIRMED, 3 cosmetic discrepancies, 1 class UNVERIFIABLE**. The confirmed gaps, each with a `file:line`:

- **G0 — hooks shipped but never installed.** No kit manifest declared `hooks`/`statusline`; all three listed `settings.json` in `config`, so a fresh install had a `settings.json` referencing hook files that were never copied.
- **G26 — workflows shipped but never loaded** (found later by the eval harness, not by review). `ck init` copied `.claude/workflows/*.md`, but Claude Code only auto-reads `CLAUDE.md` and nothing created or updated one. ClauKit's own repo masked it: its root `CLAUDE.md` has a `## Workflows` section, which is the only reason the gates ever fired. Sibling of G0 one level up.
- **G25 — the strongest gate was invisible from the document that advertises the pipeline.** `primary-workflow.md` defined stage 0 as optional Brainstorming and never mentioned the Exact-Requirements Gate; the gate existed only in `cook/SKILL.md:53`, declared UNSKIPPABLE. `CLAUDE.md` points at `primary-workflow.md` first.
- **G4 — `git.md:17,21` said "Stage all files"**, which at 43% multi-clauding can stage another live session's half-written work.
- **G6 — `scout-block` substring-matched blocked dirs**, so `grep -v node_modules` was denied. Reproduced live *during* the verification itself.
- **G12 — `/ck:git pr` dead-ended on auth failure** with no draft fallback; ≥4 real sessions left finished work unmerged retrying auth.
- **G18 — no scope-minimality gate.** Stage 0 recorded a scope boundary but never forced the smallest surface, never checked the change against existing conventions, and nothing forbade unrequested artifacts in a PR-bound branch.
- **G7 — no DB write-safety protocol** (dry-run count → paired rollback → approval) anywhere.

## Approach

Minimal-surface option, picked over the thorough one: **harden the loop that already existed — 0 new agents, 0 new commands.**

- **Layers touched:** installer (`bin/lib/`), hooks (`.claude/hooks/`), scripts (`scripts/ck/`), skills (`skills/software/`), workflows (`.claude/workflows/`), kit manifests, docs. Single repo — no cross-repo surface.
- **Durability:** `run-state` per-plan `STATE.md` ledger; 2-tier `guard-destructive` (Tier A irreversible shapes, Tier B over-broad staging refused *only* when a claim registry proves another live session owns an affected file); `file-claims` per-worktree registry; worktree fleet (`wt-new`/`wt-doctor`/`wt-clean`) with a smoke gate on the untouched base commit.
- **Evidence:** `verify-plan` (claim → CONFIRMED/REFUTED/UNVERIFIABLE + evidence, no code until the table is approved); `tdd` red-before-green with the baseline taken from a base-commit worktree, never `git stash`; scope-lock A/B gate; `/ck:review --lenses` (4 lenses, falsifier never sees the implementer's reasoning).
- **Cost:** fresh implementer subagent per phase with artifacts handed over **as file paths**; mandatory `model=` per dispatch (model-tiering matrix); headless review + post-PR delivery tail.
- **Install fixes:** manifests now carry `hooks`/`scripts`/`statusline`; `claude-md-wire.js` wires workflows into the consumer's `CLAUDE.md` (create / append `§Workflows` / no-op), which is what makes every gate above actually load.

## Tradeoffs & decisions

Transcribed from the plan's `B.2.3 — Explicitly rejected` section:

- **Rejected: `PostToolUse` auto-`tsc --noEmit` on every Edit.** O(edits) cost on a large TS repo, and it fires mid-multi-file-change when the tree is *expected* to be red. The right enforcement point is the phase exit gate, not every keystroke. Documented as an opt-in, not a default.
- **Rejected: hardcoding one team's tracker/VCS/stack vocabulary into skills.** Violates the plan's Global Constraints. Pattern lives in the skill, specifics in the `CLAUDE.md` template — this is why the delivery tail ships as a *mechanism with zero declared steps*.
- **Accepted cost — the scope-lock gate adds a stop that could get rubber-stamped.** Bounded: it fires only when a task could span >1 layer/repo, and `--auto` picks minimal and logs `[ASSUMED]`. The failure mode it prevents cost a full plan-write cycle every time it occurred.
- **Accepted cost — most of this change is prompt text**, which unit tests cannot validate. That is what `tests/behavior/` exists for; see Review focus for its honest state.

## Review focus

From `STATE.md` parked/BLOCKED rulings — this is what was *not* proven:

- **BLOCKED: the post-fix behavioural re-run never happened.** `verify-plan-fires` and `scope-lock` failed pre-fix because of G26; after the fix, the confirming re-run stopped on the org monthly spend limit (every transcript the same 101-byte notice, correctly reported ERROR not FAIL by the hardening the same task added). **The installer fix currently rests on a one-variable positive control plus unit tests, not on a green scenario.**
- **Parked: 3 of 6 scenarios pass with their gate blanked** — `tdd-red-first`, `resume-from-ledger`, `iron-law`. A capable base model writes the regression test, reads the `STATE.md` in front of it, and re-runs the suite unprompted. **Their PASS is not evidence those gates work.** Ruling: sharpening needs tool-call *ordering* assertions (`--output-format stream-json`), not a reworded grep.
- **The first full sweep returned 0 of 6 gates demonstrated** (2 FAIL + 4 PASS-with-failing-negative-control). It did its job — it caught the P0.
- **Blast radius worth a reviewer's eyes:** `guard-destructive` Tier B denies staging based on the claim registry — a false positive blocks a legitimate commit (one already fired this session on an `echo` string that merely *contained* a blocked pattern). `claude-md-wire.js` writes into the consumer's `CLAUDE.md`, the one file a user is most likely to have hand-authored; idempotency is covered by 3 installer tests.
- **UNVERIFIABLE claim class, stated plainly:** all User A/B session statistics (295 sessions, 43%/29% multi-clauding, the 3-PR wrong root cause) could not be checked — the source HTML reports are not in the repo. Internal consistency holds; the task list itself stands on repo-verified gaps, not on those numbers.

## Plan

- Plan file: [plans/260730-1359-clauKit-upgrade/plan.md](plans/260730-1359-clauKit-upgrade/plan.md) — status ✅ implemented, all 31 tasks. Reports: [plan-verification.md](plans/260730-1359-clauKit-upgrade/reports/plan-verification.md) · [code-review.md](plans/260730-1359-clauKit-upgrade/reports/code-review.md) · [review-lenses.md](plans/260730-1359-clauKit-upgrade/reports/review-lenses.md)

## Testing

- **What was tested**: the full `node:test` suite — 185 tests over the installer (kit resolution, settings merge, hook shipping, `CLAUDE.md` wiring), both PreToolUse hooks (`guard-destructive` 18 Tier-A + 16 benign + 3 Tier-B; `scout-block` 12 allow + 9 deny), the claim registry, and all 8 `scripts/ck/` helpers. 1 skipped is the PowerShell suite, correctly skipped on Linux. **No typecheck or lint gate exists in this repo** — `npm run lint` is a stub (`echo "Linting passed"`) and there is no TypeScript; the suite is the whole automated signal, and that limit is the point of the Review-focus section.
- **How it was tested**: `npm test` →
  ```
  1..185
  # tests 185
  # pass 184
  # fail 0
  # skipped 1
  # duration_ms 4788.095079
  ```
- **Edge cases**: covered — happy (fresh `ck init` into an empty repo: 20 paths, every file `settings.json` references present, both hooks exit 0), negative (over-broad stage with a seeded foreign claim declined and the scoped command offered; unparseable delivery-tail declaration skipped without aborting the PR; an unresolved declaration placeholder fails its step with a paste-ready payload rather than reaching a shell), recovery (`wt-clean` removes a known worktree and reports reclaimed disk; a re-run of an already-done delivery-tail step is skipped by `done-when`, producing no second write). **Named gap:** the behavioural class — whether a model *obeys* a gate under pressure — is not covered by these; see Review focus.
