# Ticket format — the verification contract

One format for every ticket ClauKit writes or refines: a slice from `/ck:tickets`, a bug
write-up from `/ck:debug`, an existing tracker issue a lead has analysed. Its job is to let
**the `tester` agent verify the work from the ticket alone** — every acceptance criterion
carries the exact check and the exact expected result, so nobody re-derives scope, re-reads
the codebase, or guesses what "works" means.

It also maps 1:1 onto `/ck:cook`'s Stage-0 gate (see the table at the end), so cook extracts
its five items from the ticket instead of asking or `[ASSUMED]`-logging them.

## Template

```markdown
---
ticket: PROJ-123            # tracker key, or NN-<slug> for a local slice
type: bug                   # bug | change | feature
status: draft               # draft | ready | in-progress | done
blocked_by: []              # ticket ids; [] = can start immediately
covers: phase-02-api.md     # parent plan phase, when there is one; else omit
---

# PROJ-123: <title — the behaviour, not the task>

## Problem
- **Actual:** what happens today (bug) · what exists today (change/feature)
- **Expected:** what must happen instead, observable
- **Repro:** 1. … 2. … 3. …   (bug: required · change/feature: omit)
- **Impact:** who/what is affected, how often

## Root cause
(bug: required · change/feature: omit the section)
- **Cause:** one sentence
- **Evidence:** `path/file.ts:42`, log line, query result — never "probably"
- **Refuted?** what was tried to disprove it, and the result

## Solution
- **Chosen:** the approach, in a few lines
- **Rejected:** alternative — why not
- **Touchpoints:** modules, endpoints, tables, files it changes
- **Out of scope:** what this ticket deliberately does not touch
- **Risks:** blast radius · migration + rollback when data changes · feature flag

## Acceptance criteria
- [ ] **AC1** (golden) — Given <state> · When <action> · Then <observable result>
  - Verify: `<command, test id, request, or exact manual step>`
  - Expect: <concrete value — status code, field value, row count, message text>
- [ ] **AC2** (negative) — …
  - Verify: `…`
  - Expect: …
- [ ] **AC3** (regression) — the Repro steps above no longer reproduce
  - Verify: `…`
  - Expect: …

## Test data & environment
- **Preconditions / seed:** …
- **Accounts / roles:** …
- **Env / flags:** …
- **Cleanup:** …

## Verification
(filled by `tester`, never by the author)
| AC | Result | Evidence |
|---|---|---|
```

## Rules — what makes a ticket `ready`

A ticket stays `draft` until every rule holds. `ready` is the claim that a tester can verify
it without asking anyone.

1. **Every AC has `Verify` and `Expect`.** `Verify` is runnable or an exact manual step;
   `Expect` is a concrete value. "Works correctly", "is handled", "no errors" are not values.
2. **AC types are balanced** — at least one `golden`, one `negative`, and for a bug one
   `regression` that replays the Repro. Types come from the `scenario` skill
   (golden · role · negative · recovery · data · boundary).
3. **A bug has a Root cause with evidence.** No evidence → the ticket is still an
   investigation: run `/ck:debug`, don't mark it ready.
4. **Out of scope is written down**, even when it is "none" — it is what stops the tester
   from failing the ticket for something nobody asked for.
5. **Data changes name their rollback** (`Risks`), per the `databases` skill's safe-writes
   protocol.
6. **Title and Expected describe behaviour**, not implementation ("Order total includes VAT",
   not "Add VAT to OrderService").

## Tracker variant

A tracker is business-facing: English only, and **no repo paths or code** — they go stale.
Keep every section, with two changes:

- **Evidence** and **Touchpoints** name components and behaviour, not files
  ("checkout API", "orders table"); the file-level detail stays in the local ticket or plan.
- **Verify** is behaviour-level: a request and its response, a UI step and what appears, a
  report and its number — never `npm test -- …`.

`## Verification` is filled locally; post it to the tracker only on explicit approval.

## How each consumer reads it

| Consumer | Reads | Uses it for |
|---|---|---|
| `tester` | Acceptance criteria · Test data & environment · Out of scope | Runs each `Verify`, compares with `Expect`, fills `## Verification` — one row per AC |
| `/ck:cook` Stage 0 | see mapping below | Its five items, without asking or `[ASSUMED]` |
| `/ck:debug` | — | Writes Problem · Root cause · Solution · AC from its findings |
| `/ck:tickets` | — | Writes one ticket per slice in this format |

| Cook Stage-0 item | Ticket section |
|---|---|
| Expected output | Problem → Expected, Solution → Chosen |
| Acceptance criteria | Acceptance criteria (with Verify / Expect) |
| Scope boundary | Solution → Out of scope |
| Constraints | Solution → Risks · Test data & environment |
| Touchpoints | Solution → Touchpoints |
