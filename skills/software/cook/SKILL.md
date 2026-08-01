---
name: cook
description: Drive a feature from spec to production through hard-gated stages — plan, code, test, docs, deploy — with verification at each gate. Infrastructure-agnostic methodology.
category: Feature Delivery
status: active
---

# Cook

## Purpose

A **feature lifecycle pipeline**: take one feature from written spec to production by walking it through defined stages with mandatory verification at each handoff. Reduces "I thought you tested that" failures.

Distinct from:
- `[[bootstrap]]` — sets up a new project (one-time).
- `/ck:cook <plan> --from-plan` — implements code given an existing plan (one stage).
- `[[team]]` — multi-agent parallel fan-out across independent sessions.
- `[[dynamic-workflow]]` — gated, cost-previewed orchestration recipes (`/ck:flow`).

`cook` is sequential, single-feature, gated.

## Skill vs `/ck:cook` command

The skill defines the methodology and gates. The `/ck:cook` command ([.claude/commands/ck/cook.md](.claude/commands/ck/cook.md)) is the workflow trigger that walks an agent through them with mode flags (`--fast`, `--auto`, `--from-plan`, `--no-test`). The skill is the source of truth; the command is sugar.

Use `/ck:cook <plan> --from-plan` as the fast-path for "plan-already-exists".

## When to Use

- A spec is approved and you need to ship it
- Junior contributor needs guardrails through their first feature
- After repeated incidents where a feature shipped without docs/tests/changelog
- Any time you catch yourself skipping verification "just this once"

Activation phrases: *"cook this feature"*, *"take this from spec to deploy"*, *"feature pipeline for..."*

## The Stages

| # | Stage | Gate to next |
|---|---|---|
| 0 | **Exact-Requirements Gate** — fill the 5 items below before planning | 5 fields filled & confirmed (or `[ASSUMED]`-logged in `--auto`); scope boundary **defended** per the scope lock below |
| 0.5 | **Verify-Plan Gate** — falsify the plan's factual claims before implementing (mandatory with `--from-plan`) | verification table approved; no REFUTED load-bearing claim (see `[[verify-plan]]`) |
| 1 | **Plan** — confirm spec; identify files to change; list risks | Spec linked + impact diff produced |
| 2 | **Code** — fresh implementer subagent per phase (see Implement below) | All new code under existing file-size limits; lint passes; per-phase exit gate green |
| 3 | **Test** — unit + integration tests written and green | `[[scenario]]`-derived test cases cover at least 1 happy + 1 negative + 1 recovery |
| 4 | **Review** — dispatch `code-reviewer` agent per `[[code-review]]` skill protocol | Severity buckets: `Critical = 0 AND High = 0` (else fix → re-test → re-review loop) |
| 5 | **Docs** — update README / changelog / API docs | Reviewer can use the feature with docs alone |
| 6 | **Deploy** — merge, release, verify in prod | Smoke check passes; rollback path documented |

**Gating rule**: a stage cannot start until the prior gate passes. Skipping is a feature, not a bug — but it must be logged with a reason.

**Ledger (cross-cutting, not a stage)**: every gate transition appends one line to `plans/<plan>/STATE.md` per the `[[run-state]]` skill — `phase <N>: gate <name> → PASS|FAIL (evidence: <cmd> → <result>)`. A killed run resumes from the ledger + gate re-runs alone; TodoWrite is a UI mirror, never the record.

**Review stage protocol**: follow `[[code-review]]` skill — get BASE_SHA/HEAD_SHA, optionally scout edge cases first, dispatch `code-reviewer` subagent with WHAT_WAS_IMPLEMENTED + PLAN_OR_REQUIREMENTS + DESCRIPTION. See [`code-review/references/requesting-code-review.md`](../code-review/references/requesting-code-review.md).

## Stage 0 — Exact-Requirements Gate

Before any planning, derive these 5 items from the task. This is a **hard gate**: if any item cannot be derived, STOP and ask the user ONE clarifying question at a time — do NOT fill fields by probability. AI coding fails far more often from a vague spec the model silently guesses around than from model weakness.

1. **Expected output** — the concrete artifact the user will see/use (an endpoint, a screen, a CLI file — not "improve X").
2. **Acceptance criteria** — input→output pass/fail conditions that are verifiable.
3. **Scope boundary** — what is explicitly NOT done this round (anti scope-creep). Not merely *recorded* — **defended**, via the scope lock below.
4. **Non-negotiable constraints** — stack, file locations, naming, compatibility.
5. **Touchpoints** — which module/file/contract will be touched (blast radius).

### Scope lock (item 3, defended)

Over-scoping is a distinct failure from a wrong root cause: the diagnosis can be right and the change still three times too large (measured: `wrong_approach 10` + `excessive_changes 4`, each costing a full plan-write cycle). Whenever the task *could* span more than one repo or layer, three sub-gates apply **before planning**:

1. **Two options, minimal first.** Present **(A) minimal-surface** and **(B) thorough**. For each: which repos and layers are touched, and **which existing codebase patterns/conventions it follows or breaks**. Recommend one; **wait for the pick before planning or coding**. Default to the narrowest surface; justify any expansion. In `--auto`: pick A and `[ASSUMED]`-log it — never silently expand.
2. **Convention check.** Name the architectural patterns the change touches and assert compliance explicitly (a real fix registered a DB context in the wrong host, violating a host-separation pattern the codebase enforced but the plan never consulted).
3. **No unrequested artifacts.** Do not create files the user did not ask for — no backfill SQL, no scratch scripts, no helper docs — in a branch destined for a PR. Need one anyway → name it and ask first.

**Mode behavior:**
- **Default / `--fast`:** gate is mandatory. `--fast` only skips research, NOT this gate.
- **`--auto`:** fill all 5 best-effort from context; LOG each assumed field marked `[ASSUMED]` (inline in run output / plan file, same place waivers go) instead of stopping to ask.
- **`--from-plan`:** EXTRACT the 5 items from the plan file (don't ask the user); any item the plan doesn't settle → fill best-effort and `[ASSUMED]`-log it. A hand-written plan without acceptance criteria must not silently un-anchor the goal.

Gate passes only when all 5 are filled & user-confirmed (default / `--fast`) or all 5 are filled & `[ASSUMED]`-logged (`--auto` / `--from-plan`).

**Closing the loop:** the 5 items are not write-once — the final report re-verifies each acceptance criterion against fresh evidence (criterion → test output / command result), per `[[code-review]]` verification gates.

## Stage 0.5 — Verify-Plan Gate

Treat the plan as a set of **falsifiable hypotheses**, per the `[[verify-plan]]` skill: extract every factual claim (root cause, affected rows, which code path runs, "already done" status) and prove or disprove each with `git log`/`git blame`/`git show`, read-only queries, and direct file reads. Output: the claim → verdict → evidence table to `plans/<plan>/reports/plan-verification.md`.

- **Mandatory whenever `--from-plan` is active** — a plan written in another session is exactly the case that shipped a wrong root cause through 3 merged PRs. Elsewhere: run it when the plan asserts ≥1 falsifiable claim about *existing* behaviour; a greenfield plan has nothing to falsify.
- **No code until the table is approved.** Any REFUTED load-bearing claim → back to `planner`. All-REFUTED is a legitimate outcome (one plan's migration proved to be a no-op — finding that early is the win).

## Implement — fresh subagent per phase

Implementation runs in a **fresh implementer subagent per phase** (`backend-developer` / `frontend-developer`), never in the main session. The main session keeps only the loop, the gates, and the ledger — implementing inline accretes every file read, diff, and test output into one context that is re-sent on every later turn (measured dispatch pathology: 42k chars, 99% pasted history).

The dispatch contains exactly:
1. one line on where the phase fits;
2. the **brief file path** ("read this first — your requirements, exact values verbatim"; generate via `scripts/ck/phase-brief.cjs`);
3. interfaces/decisions from earlier phases the brief can't know;
4. resolutions of ambiguity you already spotted;
5. the report-file path + report contract.

**Never the session's history.** Keep dispatches <2k chars.

- Statuses: `DONE` · `DONE_WITH_CONCERNS` · `NEEDS_CONTEXT` · `BLOCKED` — never force the same model to retry unchanged.
- Never dispatch two implementers in parallel on the same tree (one worktree per editing agent — `[[worktree|git/worktree]]`).
- After each phase: run the phase's declared exit gate, append the `STATE.md` line, and **verify the agent actually changed something** (`git diff`) before recording it complete — "agent reported success" is not evidence; a dead agent leaves no diff.

## Worked Example (CI: GitHub Actions)

GitHub Actions is *one* execution substrate; the methodology is independent. Sample mapping:

| Stage | Local check | CI check |
|---|---|---|
| 1 Plan | Spec linked in PR description | `pr-template` action enforces fields |
| 2 Code | `lint` + `typecheck` | Same in CI |
| 3 Test | `npm test` | Test workflow, coverage report |
| 4 Review | `code-reviewer` agent local | PR review bot / required reviewer |
| 5 Docs | README diff checked | `docs-drift` linter |
| 6 Deploy | Manual approval | Release workflow + smoke job |

Same stages map cleanly to GitLab CI, Buildkite, CircleCI, or a Makefile — methodology stays.

## Failure Recovery

- Gate fails → don't proceed; either fix or **explicitly waive** with a reason in the PR/plan (and a `waiver` line in `STATE.md`).
- **Loop cap + breaker:** max 3 fix cycles per gate (Test, Review). At the 3rd failed cycle, don't just ask the user — **adjudicate each open finding and record the ruling in `STATE.md`** (`[[run-state]]`):
  - reviewer wrong / contestable → `parked — <finding> — ruling: <why the code stands>`
  - real but nothing downstream depends on it → parked, marked deferred
  - **real and load-bearing** (a later phase builds on it, or it reveals a plan defect) → `BLOCKED`, stop, surface the finding + the plan text it collides with + the fix history
  A silent discard is forbidden; the final review reads the parked list and triages what must be fixed before merge. Then run `[[retro]]` and ask the user.
- Multiple gates fail → halt and run a `[[retro]]` on the spec or estimation; cook again on a refined scope.
- Production smoke fails → execute the documented rollback path before debugging.
- **Interrupted run (spend limit, session kill, 529)** → resume via the `[[run-state]]` protocol: read the ledger, re-derive true state from git + gate re-runs, emit the derived-state table, continue from the first unconfirmed phase. Zero re-implementation.

## Anti-Patterns

- **Stage 6 first**: deploying then writing tests. Cook order is non-negotiable; if you must hot-fix, do it outside cook.
- **All stages in one PR**: huge diff, impossible review. Split per stage where reasonable, or at least segment commits by stage.
- **No waiver log**: skipping gates silently. Force the waiver to be visible (PR comment, plan checkbox).
- **Planning on a vague spec**: filling the 5 Stage-0 fields by probability instead of asking. If a field is unknowable from the task, ask ONE question — don't guess.

## References

See `references/`:
- `github-actions-deployment.md` — sequential CI/CD task orchestration
- `conventional-commits-semantic-release.md` — automation from commit to release
- `feature-flag-deploy-decoupling.md` — separating deploy from release

## Cross-links

`[[bootstrap]]`, `[[team]]`, `[[dynamic-workflow]]`, `[[planning]]`, `[[scenario]]`, `[[test-automation]]`, `[[code-review]]`, `[[retro]]`, `[[run-state]]`, `[[verify-plan]]`, `[[tdd]]`
