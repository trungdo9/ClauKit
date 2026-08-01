# Primary Workflow

**IMPORTANT:** Analyze the skills catalog and activate the skills that are needed for the task — the hard gate is `./.claude/workflows/skill-activation.md` (invoke skills BEFORE any response or action).
**IMPORTANT**: Ensure token efficiency while maintaining high quality.

Integer stages are the long-standing pipeline; decimal stages are gates inserted where the measured failures happened. Every gate names its owning skill — the skill is the source of truth, this document is the map.

**Ledger (cross-cutting, not a stage):** every gate transition below (0.5, 1.5, 1.7, each phase of 3, 4, 5, 7, 8) appends one line to `plans/<plan>/STATE.md` per the `run-state` skill — `phase <N>: gate <name> → PASS|FAIL (evidence: <cmd> → <result>)`. A resume reads the ledger at stage 0 and re-derives true state from git + gate re-runs; TodoWrite is a UI mirror, never the record.

#### 0. Brainstorming (Optional — user-triggered) — `brainstormer`
- For complex/architectural decisions, user may invoke `/ck:brainstorm` BEFORE planning (7-phase: Scout → Discovery → Research → Analysis → Debate → Consensus → Finalize; report → `./plans/<plan-name>/brainstorm-report.md`, handoff to `planner`).
- Skip for simple tasks or when the approach is already decided.

#### 0.5. Exact-Requirements Gate — **MANDATORY, UNSKIPPABLE** — `cook`
- 5 items before any planning: **expected output · acceptance criteria · scope boundary · non-negotiable constraints · touchpoints**. Any item not derivable → **STOP and ask ONE question**; never fill by probability.
- The 5 items and their mode behaviour (`--auto` fills + `[ASSUMED]`-logs; `--from-plan` extracts from the plan file) live in `cook/SKILL.md` Stage 0 — **that file is the single source of truth; this row is a pointer**, because duplicating the items into two documents is how they drift apart.
- Sits *after* optional Brainstorm because acceptance criteria and touchpoints are hard to state before the approach is settled; when stage 0 is skipped, **0.5 is the first thing that happens**.

#### 1. Planning — `planning` + `planner`
- Delegate to `planner`; parallel `researcher` agents feed it. Plan lands in `./plans/<timestamp>-<slug>/`.
- Plans carry the five rigor blocks (planning skill): **Global Constraints (verbatim values) · Interfaces per phase · No Placeholders · executable exit gate per phase · scope options table** — the executable gates are what makes stage-0 resume derivation possible.

#### 1.5. Verify-Plan — `verify-plan`
- Treat the plan as falsifiable hypotheses: claim → verdict (CONFIRMED/REFUTED/UNVERIFIABLE) → evidence table → `plans/<plan>/reports/plan-verification.md`. **No code until the table is approved**; REFUTED load-bearing claim → back to `planner`.
- Mandatory for `--from-plan`; auto-triggers when the plan asserts existing-behaviour claims.

#### 1.7. Scope Lock — `cook` (Stage 0 item 3, defended)
- When the task could span >1 repo/layer: **(A) minimal vs (B) thorough** table with per-option repos/layers + conventions followed/broken; wait for the pick. Convention check. **No unrequested artifacts.** *Explicitly an upgrade of gate item 3 at 0.5.*

#### 2. Plan Review & Clear Context
- User reviews the plan; after approval the user runs `/clear` (context reset between planning and coding — a user step, not a subagent step). Begin coding only after the handoff.

#### 2.5. Environment Pre-flight — `git/worktree`
- **Detect early (free):** `node .claude/hooks/file-claims.cjs list` — a FOREIGN claim or dirty work you didn't author = concurrent session. **Provision late:** planning/verification are read-only, so isolation is needed before the **first edit**, not the first thought — and a plan that Verify-Plan proves is a no-op must not have paid for provisioning first.
- Provision via `node scripts/ck/wt-new.cjs <slug>` (absolute path outside the repo, per-worktree deps, smoke gate on the untouched base commit) + `node scripts/ck/wt-doctor.cjs`; **refuse to proceed if unhealthy**. Record the worktree path in `STATE.md`.

#### 3. Implementation — `cook` (Implement)
- **Fresh implementer subagent per phase**; main session keeps only the loop, gates, and ledger. Dispatch = 1 context line + brief file path (`scripts/ck/phase-brief.cjs`) + interfaces + ambiguity resolutions + report path — **never session history, <2k chars** (artifacts as files, `orchestration-protocol.md`).
- After each phase: compile/typecheck; verify the agent produced a diff before recording complete; append the phase line to `STATE.md`.
- **DO NOT** create new enhanced files — update existing files directly.

#### 4. Testing — `tdd` + `tester`
- **Bug fixes are TDD-first**: red test on the exact symptom → verify red → green → sweep (`/ck:fix tdd`). Baseline for "pre-existing?" = base commit in a separate worktree, **never `git stash`**.
- No fake data, mocks-to-pass, cheats, or temporary solutions just to pass the build. Fix failing tests and re-run via `tester` until green — never finish with a red suite.

#### 5. Code Review — `code-review`
- Dispatch `code-reviewer` per the skill protocol (BASE/HEAD SHAs, review-package file, evidence-or-discard). High-risk diffs: `/ck:review --lenses` — 4 lenses (ADVERSARY · FIDELITY · BLAST RADIUS · CONVENTION), cross-checked; the falsifier never sees the implementer's reasoning.
- Critical/High findings survive adversarial verify before entering the fix loop.

#### 6. Integration & Documentation — `docs-manager`
- Follow the plan; API contracts precisely; document breaking changes; `docs-manager` updates `./docs` if affected.

#### 7. Debugging — `debugging` + `debugger`
- Bugs/CI failures → `debugger` for root cause → fix → back to stage 4. **Loop cap 3 per gate**, then the breaker: adjudicate each open finding → `parked — <ruling>` or `BLOCKED` in `STATE.md` (silent discard forbidden), run `retro`, ask the user.

#### 8. Finish — `git`
- `/ck:git pr` (or `finish`): verify green → self-review scoped diff → **draft-default PR** with the `pr-body.md` fill contract → **project-declared handoff tail** (ships empty; declared in the project CLAUDE.md, run headless + idempotent) → **worktree teardown** (`wt-clean.js`).
- Auth failure ⇒ paste-ready payload, zero retries. Merged/deployed claims require `git fetch origin` + remote-ref evidence.
