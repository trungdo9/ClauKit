# ClauKit vs Superpowers — Comparison

**Date:** 2026-07-30 · **Superpowers version:** 6.2.0 (`obra/superpowers`) · **ClauKit version:** 1.3.9
**Method:** read all 14 Superpowers SKILL.md files, plugin manifests, hooks, tests, docs; measured both repos.

---

## 1 · Measured

| Dimension | ClauKit | Superpowers | Ratio |
|---|---:|---:|---|
| Skills | **129** | 14 | 9× |
| Skill markdown (all `.md` under skills/) | **81,539** lines | 7,169 lines | **11×** |
| SKILL.md lines only | 10,218 (software) | 3,185 | 3× |
| Agents (personas) | **29** (1,324 lines) | **0** | — |
| Commands | **52** (1,386 lines for `/ck:` alone) | **0** | — |
| Workflow docs | **15** (975 lines) | 0 (skills carry the workflow) | — |
| Hooks | 2 (PreToolUse, PostToolUse) | 1 (**SessionStart**) | — |
| Test suites | **2 files**, both for one hook | 12 directories + external eval harness | **1/6** |
| Harnesses supported | 1 (Claude Code) | **11** | 1/11 |
| Distribution | npm CLI, `ck init` copies files | plugin marketplace (official + own) | — |
| Dependencies | node CLI + optional MCP | **zero, by policy** | — |

**Headline:** ClauKit carries ~11× the content mass with ~1/6 the verification rigor and 1/11 the harness reach. Superpowers carries almost no surface area but verifies what it has.

---

## 2 · Different genre, not different quality

The two projects are not competing implementations of the same thing.

**Superpowers is a behaviour-shaping instrument.** Its 14 skills all serve one workflow — spec → plan → subagent-driven execution → review → finish — and each is written to defeat the model's own excuse-generation. The recurring devices:

- **Iron Laws** in a code fence (`NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST`)
- **"Violating the letter of this rule is violating the spirit of this rule"**
- **Common Rationalizations** tables — excuse in the left column, refutation in the right
- **Red Flags — STOP** lists of the exact thoughts that precede the violation
- Explicit self-policy: *"Skills are not prose — they are code that shapes agent behavior"*, and skill changes require eval evidence

**ClauKit is a capability platform.** Its 129 skills are predominantly *reference documentation* — `pptx` (483 lines), `test-automation` (576), `python-development` (428), `frontend-development` (398), 25 imported SEO skills, 23 imported marketing skills. Plus two layers Superpowers does not have at all: 29 agent personas with declarative tool subsets + model tiers, and 52 commands with argument parsing and composable mode flags.

ClauKit is genuinely a **hybrid**: `debugging`, `code-review`, and the `cook` gates are written in the Superpowers genre (they were ported from it), sitting inside a library that otherwise documents capability. That mix is coherent — but it means the *behavioural* core is ~5 skills out of 129, and it is thinner than its Superpowers counterpart in every case.

---

## 3 · Where Superpowers is decisively ahead

### 3.1 Enforcement is mechanical, not advisory
Superpowers ships **one SessionStart hook** (`hooks/session-start`) that injects the entire `using-superpowers` skill into the context wrapped in `<EXTREMELY_IMPORTANT>`, matching `startup|clear|compact`.

The `compact` matcher is the detail that matters: **the discipline is re-injected after every compaction.** They also state the acceptance test for a real integration — send "Let's make a react todo list", and `brainstorming` must auto-trigger before any code. Anything that requires per-session opt-in is declared not an integration.

ClauKit relies on `CLAUDE.md` being loaded by the harness, with advisory phrasing ("**IMPORTANT:** Analyze the skills catalog and activate the skills that are needed"). No injection hook, no rationalization table, no acceptance test that the activation actually happens. → plan tasks **T5.1** (activation gate) and **T5.4** (evals).

### 3.2 The execution loop is 4× deeper
`subagent-driven-development` is **503 lines** with a graphviz state machine and: per-plan git-ignored workspace, an identity-stamped ledger, a 5-round fix loop, model escalation at round 4, a **breaker** with explicit adjudication semantics (park-with-ruling vs BLOCKED), a forbidden-silent-discard rule, three helper scripts (`sdd-workspace`, `task-brief`, `review-package`), and a rationalizations table.

ClauKit's equivalent — the `cook` skill (~130 lines) + `orchestration-protocol.md` (~130 lines) — has the stage list and a loop cap of 3, but no ledger, no artifacts-as-files discipline, no breaker semantics, no adjudication record. **This is exactly what both feedback reports complained about.** Neither user said the skill catalog was incomplete; both said long runs lost their state. → **T1.1, T3.1, T3.2, T3.4**.

### 3.3 Behavioural verification exists
Two tiers, documented in `docs/testing.md`:
- `tests/` — 12 directories of non-LLM integration tests, incl. `test-worktree-path-policy.sh`, `test-sdd-workspace.sh`, and `tests/explicit-skill-requests/` with **Haiku-specific and multi-turn** trigger tests
- `evals/` — an external Python harness ("Drill") driving **real tmux sessions** of Claude Code / Codex / Gemini CLI with an LLM actor and verifier judging skill compliance; scenarios 3–30 min each, run on demand rather than in CI

ClauKit has `tests/test-scout-block.{sh,ps1}` — one hook. Nothing verifies that a single gate, rule, or Iron Law fires. → **T5.4** (added to the plan as a direct result of this comparison).

### 3.4 Portability
11 harnesses (Claude Code, Antigravity, Codex App/CLI, Cursor, Factory Droid, Gemini CLI, Copilot CLI, Kimi, OpenCode, Pi), a `docs/porting-to-a-new-harness.md` guide, per-harness tool reference files inside `using-superpowers/references/`, and polyglot hook shims for Windows. ClauKit is Claude Code only and recently *removed* its Gemini paths.

### 3.5 Governance that protects quality
Zero third-party dependencies by policy. Domain-specific skills explicitly refused ("would this be useful to someone on a completely different kind of project?"). Skill content changes require eval evidence. 94% PR rejection rate, stated openly. Their own plans and specs are dogfooded in `docs/superpowers/plans/` + `specs/` using their own plan format — visibly including redesigns of SDD itself.

---

## 4 · Where ClauKit is decisively ahead

### 4.1 A persona layer Superpowers has no analogue for
29 agents with **declarative** tool restrictions and model tiers in frontmatter: `scout` on haiku with no Edit/Write, `git-manager` on haiku, `code-reviewer`/`planner`/`debugger` on opus, `security-auditor` with a hand-picked tool subset. Superpowers dispatches `general-purpose` subagents and expresses model choice as *prose guidance inside a skill* — which its own text admits is easy to defeat ("an omitted model inherits your session's model... which silently defeats this section"). ClauKit's frontmatter cannot be forgotten.

### 4.2 An explicit command surface
52 commands with argument parsing, dispatch tables, and composable flags (`/ck:cook --fast --auto --from-plan --no-test`, `/ck:fix ci|logs|test|types|ui`, `/ck:plan fast|hard|two|ci|cro -o html`). Superpowers is auto-trigger + Skill tool only. For a user who wants to *choose* the pipeline, ClauKit gives handles; Superpowers deliberately does not.

### 4.3 Kits — composable, manifest-driven installation
`ck init --kit engineer|marketing|both`, with kits as pure JSON manifests: adding a kit is dropping a file, no CLI change (`getKitPaths` flattens whatever keys exist — verified). Superpowers is deliberately monolithic. ClauKit can ship an audience-scoped subset; Superpowers cannot.

### 4.4 Breadth into domains Superpowers refuses on principle
51 marketing skills, 25-skill SEO engine, WordPress integrations, document skills, infrastructure, payments. Superpowers' contributor policy would reject every one of these as domain-specific. That is not a defect on either side — it is opposite scope choices. It does mean **ClauKit's widest coverage is where Superpowers has none, and ClauKit's thinnest layer is exactly where Superpowers is deepest.**

### 4.5 Cost governance is explicit
`/ck:flow`'s `dynamic-workflow` skill mandates a **cost preview before any fan-out**, with a named 4-axis inheritance contract and a documented decision matrix vs `/ck:team` vs plain subagents. Superpowers' cost control is the Model Selection prose in SDD ("turn count beats token price" — a genuinely good insight ClauKit should steal, see T3.3) but there is no preview or budget gate.

### 4.6 A registry with duplicate detection
`docs/clauKit-registry.md`: 210 entries, status markers, overlap flags, and a stated rule that one concept gets one entry point. At 129 skills this is load-bearing; at 14 Superpowers does not need it. It is also what caught the `/ck:ship` duplication in this very plan.

---

## 5 · Verdict

The projects fail in opposite directions.

**Superpowers' risk is narrowness** — 14 skills, one opinionated workflow, nothing for marketing, docs, infra, or domain work, and no persona/command surface for a user who wants to steer.

**ClauKit's risk is unverified mass** — 81k lines of skill content with no test that any behavioural rule fires, an execution loop a quarter the depth of the one it borrowed from, and advisory rather than mechanical enforcement. Both feedback reports (295 sessions, 943 hours) failed on **exactly the thin layer**, never on missing capability.

**The single most transferable idea is not a skill — it is the posture:** treat behaviour-shaping content as code, and gate changes on evidence that the behaviour changed. Superpowers implements that with a SessionStart injection + an eval harness. ClauKit imported the skills' *text* (`debugging`, `code-review`) without the enforcement or verification machinery around them — which is why they read well and cannot be shown to work.

### What the comparison changed in the plan

| Finding | Plan change |
|---|---|
| No behavioural verification anywhere in ClauKit | **T5.4 added** — 6 eval scenarios, each required to fail when its gate is deleted; governance rule limiting evals to the ~5 behavioural skills |
| Enforcement is advisory, and nothing survives compaction | T5.1 strengthened — activation gate + rationalization table; consider a SessionStart injection matching `startup\|clear\|compact` |
| Execution loop lacks ledger / breaker / artifacts-as-files | already T1.1, T3.1, T3.2, T3.4 — **confirmed as the priority**, since both users' failures land here |
| "Turn count beats token price" | folded into T3.3's tiering matrix |
| Model choice as prose is defeatable | ClauKit's frontmatter approach is **better** — keep it, and make explicit `model=` mandatory on every dispatch (T3.3) |
| Superpowers dogfoods plans+specs in-repo | ClauKit already has `plans/`; no change needed |

### Not worth copying

- **Their voice** ("your human partner") — deliberate on their side, tested, and not ClauKit's register.
- **The 5-round fix loop.** ClauKit's cap of 3 + `retro` is a defensible different choice; only the **breaker/adjudication semantics** are worth taking (T3.4).
- **Multi-harness support.** 11 harnesses is a large maintenance surface for a kit whose value is Claude Code-specific (agents, commands, kits, hooks). Revisit only if ClauKit is ever published for another runtime.
- **Refusing domain skills.** That policy is what keeps Superpowers at 14 skills; ClauKit's marketing kit is a deliberate product decision in the other direction.

---

## Unresolved

1. Should ClauKit add a **SessionStart hook** that injects the activation gate on `startup|clear|compact`? It is the mechanism behind Superpowers' reliability, but ClauKit installs into a project's own `.claude/` rather than shipping as a plugin, so the hook competes with the user's own settings. Currently folded into T5.1 as an option, not a commitment.
2. Is `ck init`'s copy-into-project model a liability? `ck update` only reports the latest version — it does not sync content — so installed kits drift from upstream permanently. Superpowers' plugin model propagates updates. Out of scope for this plan; worth its own decision.
