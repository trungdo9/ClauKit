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
| 0 | **Exact-Requirements Gate** — fill the 5 items below before planning | 5 fields filled & confirmed (or `[ASSUMED]`-logged in `--auto`) |
| 1 | **Plan** — confirm spec; identify files to change; list risks | Spec linked + impact diff produced |
| 2 | **Code** — implement, locally test | All new code under existing file-size limits; lint passes |
| 3 | **Test** — unit + integration tests written and green | `[[scenario]]`-derived test cases cover at least 1 happy + 1 negative + 1 recovery |
| 4 | **Review** — dispatch `code-reviewer` agent per `[[code-review]]` skill protocol | Severity buckets: `Critical = 0 AND High = 0` (else fix → re-test → re-review loop) |
| 5 | **Docs** — update README / changelog / API docs | Reviewer can use the feature with docs alone |
| 6 | **Deploy** — merge, release, verify in prod | Smoke check passes; rollback path documented |

**Gating rule**: a stage cannot start until the prior gate passes. Skipping is a feature, not a bug — but it must be logged with a reason.

**Review stage protocol**: follow `[[code-review]]` skill — get BASE_SHA/HEAD_SHA, optionally scout edge cases first, dispatch `code-reviewer` subagent with WHAT_WAS_IMPLEMENTED + PLAN_OR_REQUIREMENTS + DESCRIPTION. See [`code-review/references/requesting-code-review.md`](../code-review/references/requesting-code-review.md).

## Stage 0 — Exact-Requirements Gate

Before any planning, derive these 5 items from the task. This is a **hard gate**: if any item cannot be derived, STOP and ask the user ONE clarifying question at a time — do NOT fill fields by probability. AI coding fails far more often from a vague spec the model silently guesses around than from model weakness.

1. **Expected output** — the concrete artifact the user will see/use (an endpoint, a screen, a CLI file — not "improve X").
2. **Acceptance criteria** — input→output pass/fail conditions that are verifiable.
3. **Scope boundary** — what is explicitly NOT done this round (anti scope-creep).
4. **Non-negotiable constraints** — stack, file locations, naming, compatibility.
5. **Touchpoints** — which module/file/contract will be touched (blast radius).

**Mode behavior:**
- **Default / `--fast`:** gate is mandatory. `--fast` only skips research, NOT this gate.
- **`--auto`:** fill all 5 best-effort from context; LOG each assumed field marked `[ASSUMED]` (inline in run output / plan file, same place waivers go) instead of stopping to ask.
- **`--from-plan`:** EXTRACT the 5 items from the plan file (don't ask the user); any item the plan doesn't settle → fill best-effort and `[ASSUMED]`-log it. A hand-written plan without acceptance criteria must not silently un-anchor the goal.

Gate passes only when all 5 are filled & user-confirmed (default / `--fast`) or all 5 are filled & `[ASSUMED]`-logged (`--auto` / `--from-plan`).

**Closing the loop:** the 5 items are not write-once — the final report re-verifies each acceptance criterion against fresh evidence (criterion → test output / command result), per `[[code-review]]` verification gates.

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

- Gate fails → don't proceed; either fix or **explicitly waive** with a reason in the PR/plan.
- **Loop cap:** max 3 fix cycles per gate (Test, Review). On the 3rd consecutive failure: halt, run `[[retro]]`, ask the user — don't burn tokens iterating on a broken scope.
- Multiple gates fail → halt and run a `[[retro]]` on the spec or estimation; cook again on a refined scope.
- Production smoke fails → execute the documented rollback path before debugging.

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

`[[bootstrap]]`, `[[team]]`, `[[dynamic-workflow]]`, `[[planning]]`, `[[scenario]]`, `[[test-automation]]`, `[[code-review]]`, `[[retro]]`
