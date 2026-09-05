# KitForge — The Opinionated Multi-Agent Orchestration Framework for Coding Agents

*126 skills · 30 agents · 57 gated commands · atomic-commit safety · MCP-ready · 3 installable kits · runs in Claude Code, exports to Codex + Antigravity via `ck convert`*

[![GitHub stars](https://img.shields.io/github/stars/trungdo9/ClauKit?style=social)](https://github.com/trungdo9/ClauKit/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/github/v/release/trungdo9/ClauKit)](https://github.com/trungdo9/ClauKit/releases)
[![Topic](https://img.shields.io/badge/topic-claude--code--template-blue)](https://github.com/topics/claude-code-template)

Claude Code gives you the primitives — but no opinions on how to combine them. You're left to invent your own workflows, manage parallel agents by hand, and hope you don't `git push` a broken refactor. Most Claude Code templates throw a thousand skills at the wall and call it a day.

**KitForge is the opinionated alternative.** 126 curated skills, 30 specialized agents, 57 gated commands — each one earns its place. Built-in pre-flight checks block destructive operations. Multi-agent orchestration via `/ck:team` and `/ck:flow` runs parallel Claude Code work safely. **3 installable kits** — engineer (default), marketing, both.

> Plan once. `/clear` context. Cook with confidence. That's the KitForge workflow.

## Why KitForge

- **Gated pipelines, not gambling.** `/ck:refactor` and `/ck:cook` enforce pre-flight gates — clean working tree, tests green, not on `main`. See [`.claude/workflows/primary-workflow.md`](./.claude/workflows/primary-workflow.md). Skip the gates and the command refuses to run.
- **Trio architecture — one concept, one entry point.** Every skill (knowledge) maps to an agent (persona) and a command (`/ck:<name>` trigger). No tool roulette. Full map in [`docs/clauKit-registry.md`](./docs/clauKit-registry.md).
- **Curated, not crawled.** 126 skills hand-selected for AI dev workflows — research, planning, refactoring, testing, code review, SEO, payments. Each maintained, each documented, each in the registry. No abandoned scaffolds.

## Quick Start

> **Names:** the project is **KitForge**. The GitHub repo, the npm package id (`@trungdo9/ClauKit`) and the CLI binaries (`ck`, `claukit`) keep their original names — install and run exactly as before.

```bash
# 1. Install from GitHub (not yet on npm)
npm install -g https://github.com/trungdo9/ClauKit.git

# 2. Drop KitForge into your project — pick a kit
cd /path/to/your-project
ck init                       # Engineer kit (default): /ck: namespace
ck init --kit marketing       # Marketing + automation: /mk: namespace
ck init --kit both            # Both kits combined
ck init --kit list            # List available kits

# 3. Launch Claude Code — try /ck:find to discover commands
claude
```

`ck init` also wires the kit's workflows into your `CLAUDE.md` — creating a minimal one if you have none, appending a `## Workflows` section if you do, and doing nothing if you already reference them. This is load-bearing, not cosmetic: Claude Code only auto-reads `CLAUDE.md`, so without that pointer the gates in `.claude/workflows/` are files nobody opens. Run `/ck:claude-md init` afterwards to expand the stub with your project's build commands, architecture, and constraints.

> Pull latest with `ck update`. Other install paths (npx, clone-as-template, MCP setup) are collapsed below.

<details>
<summary><strong>Other install options (npx · clone · MCP)</strong></summary>

### Prerequisites
- [Claude Code](https://code.claude.com) installed and configured
- Git for version control
- Node.js 18.0.0 or higher

### Option 2: Run without installation

```bash
npx github:trungdo9/ClauKit init
```

### Option 3: Clone and customize

```bash
git clone https://github.com/trungdo9/ClauKit.git your-project-name
cd your-project-name
claude
```

### Option 4: GitHub MCP Integration (Optional)

```bash
cp .claude/.env.example .claude/.env
# Add your GitHub Personal Access Token from https://github.com/settings/tokens/new?scopes=repo
# Edit .claude/.env and set GITHUB_TOKEN=ghp_xxx...
# Restart Claude Code to activate MCP
```

### CLI Commands

```bash
ck init              # Copy .claude folder to current directory
ck init --force      # Overwrite existing files (back up local changes first)
ck update            # Pull latest version from GitHub
ck help              # Show help information
```

> `ck init` copies `.claude/` — everything it installs, including `.claude/scripts/ck/` (the context-hygiene and headless helpers), lives under that one directory — merges hook entries into an existing `.claude/settings.json`, wires the kit's workflows into your root `CLAUDE.md`, and adds two ignore rules for KitForge's regenerable plan artifacts to your root `.gitignore` (hand-written plan files and reports are deliberately *not* ignored — they are linked from PR bodies). Other assets shipped in the package (`.opencode/`, `AGENTS.md`, `docs/`) are only available via Option 3 (clone-as-template).

</details>

---

## What's New — Durability · Evidence · Cost (since v1.3.9)

v1.3.9 was strong on **surface area** and thin exactly where it mattered: the execution loop. This upgrade was derived from **295 real sessions across two end-users** (1,452 + 1,364 messages) — and the measured failures were never "a missing skill". They were runs killed mid-phase that lost all state, code written against plan claims nobody checked, and whole-tree git commands eating a parallel session's work.

So this release adds almost no surface: **0 new agents, 0 new commands.** It hardens the loop that already existed. Full rationale: [`plans/260730-1359-clauKit-upgrade/plan.md`](./plans/260730-1359-clauKit-upgrade/plan.md).

| | v1.3.9 | now |
|---|---|---|
| Skills | 129 | **129** — `run-state`, `verify-plan`, `tdd` added; `programmatic-seo`, `worktree` + `obsidian` removed |
| Agents · command actions | 29 · 53 | 29 · **56** |
| Workflows | 14 | **15** — `skill-activation` hard gate |
| Hooks wired in `settings.json` | 2 | **5** — `guard-destructive`, `file-claims`, `branch-guard` |
| `.claude/scripts/ck/` helpers | 0 | **7** (+ a shared lib) |
| Automated tests | 2 shell scripts, both for one hook | **349 tests** (`npm test`) + 10 behavioral scenarios |

**Stop losing work.** A durable per-plan ledger (`plans/<plan>/STATE.md`) means a run killed by a spend limit or a crash resumes by *re-deriving* truth from git and re-running gates — never by trusting the plan's own status claims. See [Flow 9](#flow-9---resume-an-interrupted-run). A two-tier `guard-destructive` hook blocks irreversible shapes (`git stash -u`, `reset --hard`, `clean -fdx`, unguarded `DELETE`/`TRUNCATE`) and declines over-broad staging (`git add -A`, `git commit -am`) **only when a claim registry proves another live session owns an affected file** — then prints the scoped command to run instead. A second guard, `branch-guard`, denies a git command that **moves HEAD** (`checkout -b`, `switch`, a detach) while that same registry shows another live session sharing the tree — sessions no longer get a worktree each, so one branch switch relocates everyone. A third, `protected-branch-guard`, refuses a `git push` or `git merge` that would publish to a long-lived shared branch (`main`, `master`, `staging`, `uat`, `production`, `prod`) — including the *implicit* case, a bare `git push` while HEAD is already standing on one, which is the shape real incidents take: nobody types the branch name. All three fail open. The first two take `CK_AUTO_MODE=1` / `CK_ALLOW_DESTRUCTIVE=1` as consent; the third deliberately **does not** take `CK_AUTO_MODE` — moving a shared HEAD is local and recoverable, publishing to `staging` is neither — and has its own `CK_ALLOW_PROTECTED_PUSH=1`. Concurrent sessions **coordinate rather than isolate**: editing stays on unclaimed paths, `/ck:team` gives each editing teammate a disjoint path set, and overlaps are serialized instead of forked into separate trees.

**Evidence before code.** `verify-plan` treats a plan as falsifiable hypotheses — every factual claim gets CONFIRMED / REFUTED / UNVERIFIABLE with a `file:line`, git ref, or verbatim output, and no code is written until the table is approved. `tdd` enforces red-before-green, with the baseline taken from the untouched tree **before the first edit** and recorded in `STATE.md` (a `git stash` baseline silently no-ops). A scope-lock gate forces a minimal-vs-thorough choice *before* planning. `/ck:review --lenses` fans out four reviewers — adversary, fidelity, blast-radius, convention — none of which ever sees the implementer's reasoning.

**Cost.** Implementation moves to a fresh subagent per phase with artifacts handed over **as file paths**, so the orchestrator's context stops accumulating diffs; a model-tiering matrix makes `model=` mandatory on every dispatch; review and the post-PR delivery tail run headless.

> **Verification status — stated plainly.** The 349 unit tests prove the hooks and scripts behave correctly *when called*. They cannot prove a model obeys a gate under pressure, and most of this release is prompt text. That is what `tests/behavior/` exists for. All 10 gate runs pass — but a green run is only evidence about the *rule* under a control, so each gate is labelled by what it actually demonstrates: `plan-before-code` clears both bars (absent in all 3 ablated runs, *and* a one-line positive control flips it); `verify-plan-fires` and `scope-lock` are positive-controlled; `iron-law` separates 2 of 3 under ablation but no single line flips it, so that rule is distributed rather than concentrated; the remaining five are **not discriminating** — with the rule removed the model still does the right thing, which is a fact about the model, not a verdict on the rule. Stated plainly rather than rounded up. Details, and the method's measured ceiling, in [`tests/behavior/README.md`](./tests/behavior/README.md).

---

## Use Cases & Workflows

This section maps **every common situation** a developer faces to the exact KitForge commands to use. Start with the master decision tree, then drill into the matching flow.

### 🧭 Master decision tree — which flow do I need?

```mermaid
flowchart TD
    Start([I want to use KitForge]) --> Q1{What's the situation?}
    Q1 -->|Brand new project| F1[Flow 1<br/>Bootstrap]
    Q1 -->|Cloned existing repo| F2[Flow 2<br/>Onboard]
    Q1 -->|Build new feature| F3[Flow 3<br/>Feature]
    Q1 -->|Fix a bug| F4[Flow 4<br/>Debug + Fix]
    Q1 -->|Rename / migrate at scale| F5[Flow 5<br/>Refactor]
    Q1 -->|Port from public repo| F6[Flow 6<br/>Port]
    Q1 -->|Daily session start / end| F7[Flow 7<br/>Daily]
    Q1 -->|Controlled audit / migration / cross-checked review| F8[Flow 8<br/>Controlled Flow]
    Q1 -->|Run was killed mid-phase| F9[Flow 9<br/>Resume]
    Q1 -->|Not sure which tool| Find["/ck:find &lt;task&gt;"]
    Find -.recommends.-> Q1
```

> **Lost?** Run `/ck:find <task description>` — it recommends the best skill / agent / command for your task from the local registry.

---

### Flow 1 — 🆕 Brand new project (greenfield)

Start from zero — scaffold project, decide architecture, ship first version.

```mermaid
flowchart LR
    A[npm i -g github:trungdo9/ClauKit] --> B[ck init]
    B --> C{Bootstrap style?}
    C -->|step-by-step| D["/ck:bootstrap"]
    C -->|minimal Q&A| E["/ck:bootstrap auto"]
    C -->|parallel fast| F["/ck:bootstrap fast"]
    D --> G
    E --> G
    F --> G["/ck:brainstorm<br/>optional architecture"]
    G --> H["/ck:plan"]
    H --> I["user approves<br/>then /clear"]
    I --> J["/ck:cook"]
    J --> K["/ck:test"]
    K --> L["/ck:review"]
    L --> M["/ck:git pr"]
```

**When to use**: empty folder, fresh idea. Pick `auto` if you trust KitForge defaults; `fast` for max parallelism; default for full control.

---

### Flow 2 — 👋 Joined existing project (onboarding)

Just cloned a repo — get oriented in 10 minutes, ready to work.

```mermaid
flowchart LR
    A[git clone repo] --> B["read README + CLAUDE.md + docs/"]
    B --> C{Need more?}
    C -->|map entry points / drill into files| D["/ck:scout"]
    C -->|architectural Q| E["/ck:ask"]
    C -->|recent activity| F["/ck:watzup"]
    D --> G[Ready to work]
    E --> G
    F --> G
```

**When to use**: new joiner OR returning after long absence. Start from the existing docs, then `/ck:scout` to map entry points, `/ck:ask` for architecture questions, and `/ck:watzup` for recent activity — orient only, does NOT regenerate docs.

---

### Flow 3 — ✨ Build a new feature

Feature idea → production. Primary workflow.

```mermaid
flowchart LR
    A[Feature idea] --> B{Architectural<br/>uncertainty?}
    B -->|yes| C["/ck:brainstorm"]
    B -->|no| D[skip]
    C --> E["/ck:plan"]
    D --> E
    E --> V["/ck:plan verify<br/>falsify plan claims"]
    V --> SL[scope lock<br/>A/B pick]
    SL --> F[user approves plan]
    F --> G["/clear<br/>fresh context"]
    G --> H["/ck:cook"]
    H --> I["/ck:test"]
    I --> J{Tests pass?}
    J -->|no| K["/ck:fix test"]
    K --> I
    J -->|yes| L["/ck:review"]
    L --> M["/ck:git pr"]
```

**When to use**: any non-trivial change with feature semantics (new endpoint, new screen, new flow). Skip `/ck:brainstorm` for well-understood patterns.

**Gates along the way** (primary-workflow.md is the map): the **Exact-Requirements Gate** (5 items, unskippable) runs before planning; **Verify-Plan** falsifies the plan's factual claims before any code (mandatory for `--from-plan`); the **scope lock** presents minimal-vs-thorough and waits for the pick; every gate appends to `plans/<plan>/STATE.md` so an interrupted run resumes without re-implementation (Flow 9).

---

### Flow 4 — 🐛 Fix a bug

Investigate → fix → verify → ship.

```mermaid
flowchart LR
    A[Bug report] --> B["/ck:debug"]
    B --> C{Root cause?}
    C -->|simple| D["/ck:fix &lt;variant&gt;"]
    C -->|complex| E["/ck:plan"]
    E --> D
    D --> F["/ck:test"]
    F --> G{Pass?}
    G -->|yes| H["/ck:git cm"]
    G -->|no| B
```

**`/ck:fix` variants** — pick the matching context:

| Variant | Use when |
|---|---|
| `/ck:fix ci` | GitHub Actions / CI pipeline failing |
| `/ck:fix logs` | Error logs from server / runtime |
| `/ck:fix test` | Failing tests (suite already red) |
| `/ck:fix tdd` | Production symptom, no red test yet — red-green loop: failing test first, pre-edit baseline, then the fix |
| `/ck:fix types` | TypeScript / mypy errors |
| `/ck:fix ui` | UI / styling / layout issues |

Combinable flags: `--auto` · `--review` · `--quick` · `--parallel`.

---

### Flow 5 — 🔄 Refactor at scale

Rename · extract · migrate · codemod. Behavior-preserving mechanical change.

```mermaid
flowchart LR
    A[Mechanical change<br/>needed] --> B["/ck:refactor &lt;pattern&gt;"]
    B --> C{Pre-flight gate}
    C -->|fail| X[Fix:<br/>clean tree<br/>tests green<br/>on branch]
    X --> C
    C -->|pass| D[Scope + dry-run]
    D --> E[Atomic batch N]
    E --> F["/ck:test"]
    F --> G{Pass?}
    G -->|no| H[git reset<br/>rethink]
    H --> D
    G -->|yes| I[Commit batch]
    I --> J{More batches?}
    J -->|yes| E
    J -->|no| K["/ck:review"]
    K --> L["/ck:git pr"]
```

**When to use**: distinct from `/ck:cook` (feature) and `/ck:fix` (bug). If the change alters behavior → use `/ck:cook` instead. Pre-flight gate blocks if working tree dirty, tests red, or on `main`.

---

### Flow 6 — 📦 Port a feature from a public GitHub repo

Found a feature in someone else's repo, want to bring it in (and improve / adapt).

```mermaid
flowchart LR
    A[Spotted feature<br/>in GitHub repo] --> B["/ck:port &lt;url&gt;"]
    B --> C[External scout<br/>+ analyze]
    C --> D["/ck:plan adapt to<br/>local conventions"]
    D --> E["/ck:cook"]
    E --> F["/ck:test"]
    F --> G["/ck:review"]
    G --> H["/ck:git pr"]
```

**Flags**: `--improve` (apply local-codebase patterns) · `--compare` (side-by-side diff with existing).

---

### Flow 7 — 📅 Daily working session

Resume → work → wrap up. Lightweight loop.

```mermaid
flowchart LR
    A[Session start] --> B["/ck:watzup<br/>see recent activity"]
    B --> C[Work]
    C --> D{Stuck on<br/>tool choice?}
    D -->|yes| E["/ck:find &lt;task&gt;"]
    D -->|no| F[Continue]
    E --> F
    F --> G[Session end]
    G --> H["/ck:journal<br/>capture decisions"]
    H --> I["/ck:git cm or cp<br/>scoped commit"]
    I --> J["/ck:git pr<br/>draft PR + declared tail"]
```

**Tip**: `/ck:find` is your meta-helper across 126 skills + 57 commands. Use it whenever you think "there's probably a KitForge tool for this".

**Wrap-up notes**: `/ck:git cm` commits only *your session's* files (manifest from the file-claims registry — foreign WIP is reported, never staged). `/ck:git pr` finishes the branch: verify green → **draft-default** PR with an evidence-backed body → your project's declared post-PR steps (if any — see the `Delivery tail` block in `/ck:claude-md init`). If `gh`/`glab` auth fails, you get a paste-ready PR block instead of a dead end.

---

### Flow 8 — 🎛 Controlled audit / migration / cross-checked review

Deterministic large-ish fan-out + verification, **under explicit control** — gated, cost-previewed, inspectable. `/ck:flow` re-creates Claude Code's dynamic-workflow model on KitForge's own controllable primitives; it does **NOT** use the native `ultracode` runtime.

```mermaid
flowchart LR
    A["/ck:flow &lt;task&gt;"] --> B[Plan phases]
    B --> C{Cost preview<br/>gate}
    C -->|approve| D[Fan-out / pipeline<br/>over 30 agents]
    C -->|abort| Z[Stop]
    D --> E[Adversarial verify<br/>per finding]
    E --> F[Synthesize<br/>confirmed-only report]
    F --> G["/ck:flow save &lt;name&gt;<br/>→ reusable recipe"]
```

Also available as flag-variants on existing commands: `/ck:fix --flow` (gates as agent stages + adversarial-verify root cause before implement) and `/ck:review --flow` (dimension fan-out → per-finding verify → confirmed-only report). They **complement** the canonical pipelines, never replace them.

---

### Flow 9 — ⏯ Resume an interrupted run

Spend limit, session kill, or a 529 ended a multi-phase run mid-flight. Nothing is reconstructed by hand — every gated run keeps a durable ledger at `plans/<plan>/STATE.md` (`run-state` skill).

```mermaid
flowchart LR
    A[Fresh session] --> B["read plans/&lt;plan&gt;/STATE.md"]
    B --> C["re-derive truth:<br/>git log + tree + gate re-runs"]
    C --> D[derived-state table<br/>CONFIRMED / STALE / CONTRADICTED]
    D --> E[resume at first<br/>unconfirmed phase]
    E --> F[zero re-implementation]
```

**How it works**: every gate transition appended one line (`phase N: gate <name> → PASS (evidence: <cmd> → <result>)`); phases declare **executable** exit gates, so the resume re-runs them instead of trusting status claims. Point a fresh session at the plan path (`/ck:cook plans/<plan>/plan.md`) — it reads the ledger before touching code. TodoWrite is a UI mirror; the ledger is the record.

---

### 📋 Quick reference — scenario → command

Specialized journeys with single-command entry points.

| Scenario | Command | Chain after |
|---|---|---|
| 🆕 New project scaffold | `/ck:bootstrap [auto\|fast]` | → `/ck:plan` → `/ck:cook` |
| ❓ Codebase Q&A (read-only) | `/ck:ask <question>` | (standalone) |
| 🔍 Find files / symbols | `/ck:scout <prompt>` | (standalone) |
| 🌐 External research | `/ck:research <topic>` | → `/ck:plan` |
| 💡 Architectural debate | `/ck:brainstorm <topic>` | → `/ck:plan` |
| 📋 Plan implementation | `/ck:plan [fast\|hard\|two\|ci\|cro] [-o md\|html]` | → `/clear` → `/ck:cook` |
| 🍳 Implement feature | `/ck:cook` | → `/ck:test` → `/ck:review` |
| 🧪 Run tests | `/ck:test` | → `/ck:fix test` if failing |
| 🔍 Code review | `/ck:review` | → `/ck:fix` |
| 🐛 Debug issue | `/ck:debug <issue>` | → `/ck:fix` |
| 🔧 Fix issue | `/ck:fix [ci\|logs\|test\|tdd\|types\|ui]` | → `/ck:test` |
| ⏯ Resume killed run | `/ck:cook plans/<plan>/plan.md` (reads `STATE.md`) | → continues at first unconfirmed phase |
| ✅ Verify a plan before executing | `/ck:plan verify <path>` | → `/ck:cook --from-plan` |
| 🔄 Large refactor | `/ck:refactor <pattern>` | → `/ck:test` → `/ck:review` |
| 📦 Port from GitHub | `/ck:port <url> [--improve\|--compare]` | → `/ck:cook` |
| 🎨 UI / UX design | `/ck:design [fast\|good\|3d\|...]` | → `/ck:cook` |
| 🖼 Fix UI issue | `/ck:fix ui` | → `/ck:test` |
| 📚 Init docs | `/ck:docs init` | (one-shot) |
| 📚 Update docs | `/ck:docs update` | (after feature) |
| 📚 Docs summary | `/ck:docs summarize` | (read-only) |
| 📐 CLAUDE.md create / audit / slim | `/ck:claude-md [init\|verify\|refactor]` | (standalone) |
| 💳 SePay payment | `/ck:sepay <tasks>` | → `/ck:test` |
| 🔌 Use MCP server | `/ck:use-mcp <server-name>` | (standalone) |
| 👥 Parallel team | `/ck:team <template> [...]` | (orchestration) |
| 🎛 Controlled orchestration | `/ck:flow <task>` · `/ck:fix --flow` · `/ck:review --flow` | (gated fan-out/pipeline) |
| 📝 Write journal | `/ck:journal` | (end-of-session) |
| 📊 Recent changes | `/ck:watzup` | (start-of-session) |
| 📤 Git commit | `/ck:git cm` | (or `cp` to push) |
| 🔀 Open PR | `/ck:git pr [to] [from]` | (after `cm`) |
| 🔀 Merge PR | `/ck:git merge [pr#\|branch]` | (interactive) |
| 🤷 Don't know which tool | `/ck:find <task>` | recommends + chains |

---

### 🎯 Workflow patterns at a glance

**The trio rule**: most concepts have a `skill` (knowledge) + `agent` (persona) + `command` (trigger). Always start with the command — the skill/agent activate automatically. See [`docs/clauKit-registry.md`](./docs/clauKit-registry.md) for the full map.

**Plan → /clear → Cook**: for non-trivial features, always plan first, then `/clear` to reset context, then implement. This is enforced in `primary-workflow.md`.

**Plan output formats**: `/ck:plan` writes markdown by default (`plan.md` + `phase-*.md`) — always the source of truth that `/ck:cook` consumes. Add `-o html` to ALSO render a single self-contained `plan.html` view (TOC nav, collapsible phases, status badges + progress bar, diagrams, highlighted code — opens offline, zero dependencies). It's a one-directional snapshot; markdown stays primary. Re-render anytime — including for a plan made earlier — with `/ck:plan <path-to-plan.md> -o html` (skips planning, just converts).

**Gated pipelines**: `/ck:refactor` and `/ck:cook` enforce pre-flight + verification gates. Don't bypass — they exist because skipping them caused incidents.

**Dispatcher commands** (positional args, no dash): `/ck:plan`, `/ck:fix`, `/ck:git`, `/ck:docs`, `/ck:design`, `/ck:bootstrap`, `/ck:scout`. Combinable `--flags`: `/ck:cook` (`--fast/--auto/--from-plan/--no-test` — `--auto` is the only mode that runs Deploy), `/ck:fix` (`--auto/--review/--quick/--parallel/--flow`), `/ck:review` (`--flow`).

**Controlled orchestration**: `/ck:flow` re-creates Claude Code's dynamic-workflow model on KitForge's own controllable primitives (markdown recipes + Agent-tool fan-out/pipeline over the 30 agents, 4-axis inheritance, gated + cost-previewed) — it does **NOT** use the native `ultracode` runtime. Use it (or `/ck:fix --flow` / `/ck:review --flow`) for deterministic audits, migrations, and cross-checked reviews; use `/ck:team` when workstreams need persistent sessions + discussion.

## Multi-Agent Orchestration: `/ck:team` vs `/ck:flow`

KitForge ships two orchestration commands — each for a different kind of parallel work. Picking the wrong one wastes tokens; picking the right one saves hours.

### Quick decision

| Situation | Use |
|---|---|
| 3+ workstreams that need to **discuss / hand off context** mid-flight | `/ck:team` |
| Deterministic fan-out over repo/N-files, **gated + cost-previewed** | `/ck:flow` |
| Single-turn parallel reads, no inter-agent discussion | direct Agent tool (cheapest) |
| Full autonomous orchestration (no explicit control needed) | — KitForge does not expose `ultracode` |

---

### `/ck:team` — Persistent multi-session teammates

Spawns independent Claude Code sessions as **persistent teammates** — each with its own context window, task ownership, and cross-session memory (`.claude/agent-memory/<name>/`). Teammates communicate, discuss findings, and hand off context mid-flight. Unlike subagents (fire-and-forget), teammates are persistent and event-driven.

**Templates**

| Template | Teammates | Best for | Token budget |
|---|---|---|---|
| `research` | 2–4 researchers | Competitive analysis, multi-source investigation | 150–300K (haiku) |
| `cook` | 1 lead + N devs | Parallel feature implementation | 400–800K (sonnet+haiku) |
| `review` | 2–3 reviewers | Code quality, security, performance audits | 100–200K (haiku) |
| `debug` | 3 debuggers | Root-cause via competing hypotheses | 200–400K (sonnet) |

**Usage**
```
/ck:team <template> [context] [flags]

/ck:team cook "implement auth + notifications + dashboard" --devs 3
/ck:team debug "race condition in payment flow" --plan-approval
/ck:team research "compare React state management" --researchers 2
/ck:team review --reviewers 2
```

Flags: `--devs N` · `--researchers N` · `--reviewers N` · `--debuggers N` · `--plan-approval` (lead approves before teammates code) · `--delegate` (lead coordinates only, never touches code).

> Requires Claude Code ≥ 2.1.33 (or `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` on older). Falls back to subagent delegation if unavailable.

**Avoid** `/ck:team` when: task is single-focused, fully sequential, or token budget is tight — use a subagent instead.

---

### `/ck:flow` — Controllable deterministic fan-out

Orchestrates from **within the main session** — decomposes a task into phases, fans out over the 21 KitForge agents, gates between phases, and synthesizes a single confirmed-only report. Re-creates Claude Code's dynamic-workflow model on KitForge's own primitives. **Does NOT use the native `ultracode` runtime or `Workflow` tool.**

**4-stage execution**

1. **PLAN** — decompose task → phases, each with a persona (`subagent_type`), shape (fan-out | pipeline), gate set, model.
2. **PREVIEW (mandatory gate)** — cost estimate range shown; user approves / adjusts / aborts. Nothing runs without approval. `--dry-run` stops here.
3. **ORCHESTRATE** — execute phases; inspect/abort offered between each phase (control advantage over the native runtime).
4. **SYNTHESIZE** — orchestrator consolidates child reports into a single confirmed-only report.

**Quality patterns** (borrowed from the native dynamic-workflow model, expressed as KitForge fan-out/pipeline):

| Pattern | What it does |
|---|---|
| **Adversarial verify** | N skeptic agents per finding, each prompted to *refute*. Filters plausible-but-wrong results. |
| **Judge panel** | N independent attempts from different angles → score → synthesize from winner. |
| **Loop-until-dry** | Re-spawn finders until K consecutive rounds yield nothing new. Catches the tail a single pass misses. |
| **Multi-modal sweep** | Parallel agents each searching a different way (by-container, by-content, by-entity). |
| **Completeness critic** | Final agent asks "what's missing?" → its findings become the next round. |

**Usage**
```
/ck:flow <task>
/ck:flow <task> --model opus --dry-run   # preview plan + estimate, no orchestration
/ck:flow save <name>                     # persist last run as reusable recipe
/ck:flow list                            # list saved recipes in .claude/workflows/
```

Flag variants on existing commands: `/ck:fix --flow` · `/ck:review --flow`.

**Best for**: whole-repo security audit, N-file migration, cross-checked code review, multi-angle planning.

---

### KitForge orchestration vs Claude Code native features

Claude Code ships built-in primitives: the **Agent tool** (subagents), **dynamic workflows** (research preview, native `ultracode` runtime), and **worktrees**. KitForge's two orchestration commands build on the first two. The third it deliberately does *not* extend: KitForge coordinates concurrent sessions through the file-claims registry and disjoint path sets rather than provisioning a tree per session — auto-provisioning fired on every concurrent session, paid a full dependency install each time, and left stale trees on disk.

| Capability | Claude Code native (Agent tool / ultracode) | `/ck:team` | `/ck:flow` |
|---|---|---|---|
| **Execution context** | Background JS runtime (ultracode) or inline subagent | Independent CC sessions | Main session — orchestrator stays in control |
| **Inter-agent communication** | Structured output only | Full discussion + task messaging | Shared `plans/<plan>/reports/` dir |
| **Persistent cross-session memory** | No | Yes (`.claude/agent-memory/`) | No |
| **Cost preview gate** | No | No | Yes — mandatory before any fan-out |
| **Mid-run inspect / abort** | No | Via `TaskList` | Yes — offered between every phase |
| **Pre-flight safety gates** | No | Inherited from KitForge | Inherited from KitForge |
| **Reusable saved recipes** | No | No | Yes — `/ck:flow save <name>` |
| **Token budget** | — | Higher (N × full context windows) | Moderate (fan-out per phase, haiku/opus mix) |
| **Best for** | One-turn quick reads | 3+ workstreams that need to discuss | Audits, migrations, cross-checked reviews |

**Rule of thumb:**

```
one-turn parallel reads, no discussion  →  Agent tool directly (cheapest)
3+ workstreams + discussion + handoff   →  /ck:team
deterministic fan-out + gates + cost    →  /ck:flow
ultracode / native dynamic-workflow     →  not used — /ck:flow is the KitForge substitute
```

---

## 🎯 Marketing Kit

Install with `ck init --kit marketing` (or `--kit both`). Adds the **`/mk:` namespace** — 50 marketing skills, 12 agents, 12 commands, plus WordPress publishing. Every `/mk:` command (except `/mk:plan`) **hard-fails without `plans/marketing-context.md`** — the hub holding your ICP, positioning, brand voice, competitors, goals, and channels.

> **The marketing rule**: `/mk:plan` once → it writes the context hub → every other `/mk:` command reads from it. Plan once, run many.

**→ Full marketing guide** (introduction, audience, workflow diagrams, use cases): **[`MARKETING.md`](./MARKETING.md)**. Kit-internal reference (skills, agents, MCP setup): [`skills/marketing/README.md`](./skills/marketing/README.md).

---

## KitForge vs Other AI Coding Tools

Different tools for different jobs. **Cursor** and **Windsurf** are agentic IDEs — they replace your editor. **Aggregate Claude Code templates** (community-curated, often 1000+ skills) take the kitchen-sink approach. **Google Antigravity** is an autonomous agent runtime. **KitForge** is a curated framework that runs *inside* Claude Code — opinionated workflows, gated safety, multi-agent orchestration. Pick the right tool for the job; they're complementary, not exclusive.

| Capability | KitForge | Aggregate CC templates | Cursor | Windsurf | Antigravity |
|---|---|---|---|---|---|
| Category | Framework | Template | Agentic IDE | Agentic IDE | Autonomous runtime |
| Multi-agent orchestration | ✅ `/ck:team` | Partial | Composer | Cascade | ✅ |
| Pre-flight safety gates | ✅ atomic commits | ❌ | ❌ | ❌ | Partial |
| Skill + agent + command trio | ✅ | Skills only | ❌ | ❌ | ❌ |
| MCP server integration | ✅ | ✅ | ✅ | ✅ | Partial |
| Runs inside Claude Code | ✅ | ✅ | ❌ own runtime | ❌ own runtime | ❌ |
| Curated vs comprehensive | Curated (80) | Comprehensive (1000+) | N/A | N/A | N/A |
| License | MIT | MIT | Commercial | Commercial | Commercial |

### When NOT to use KitForge

KitForge isn't for everyone. If you want an editor with AI baked in → use [Cursor](https://cursor.com) or [Windsurf](https://windsurf.com). If you want every Claude Code skill ever published → browse [`github.com/topics/claude-code-template`](https://github.com/topics/claude-code-template) for aggregate templates. If you need a fully autonomous agent that runs unsupervised → look at AutoGPT or Antigravity. KitForge is for developers who want **opinionated workflows inside Claude Code** with safety gates and curation — not raw scale.

> *Comparison reflects published feature sets as of 2026-05-23. Sources: [Cursor docs](https://docs.cursor.com/), [Windsurf docs](https://docs.windsurf.com/), [Anthropic Claude Code](https://code.claude.com/docs), [Google Antigravity blog](https://antigravity.google/). Capabilities marked ✅/❌/Partial reflect each vendor's flagship offering and may evolve.*

## Project Structure

```
ClauKit/                     # repo root — GitHub repo name, unchanged
├── .claude/                    # Claude Code configuration
│   ├── agents/                 # Specialized agent definitions (30 agents: 18 engineering/ + 12 marketing/)
│   ├── commands/               # Slash command implementations (57 commands)
│   ├── hooks/                  # PreToolUse/PostToolUse hooks (6 wired in settings.json)
│   ├── skills/                 # Specialized skills library (126 skills)
│   ├── scripts/ck/             # Shipped helpers (7 + lib/): context hygiene, gates, headless
│   ├── workflows/              # Development workflow definitions
│   ├── settings.json           # Claude Code settings
│   ├── metadata.json           # Project metadata
│   ├── .env.example            # Environment template
│   ├── .gitignore              # Git exclusions
│   ├── .mcp.json.example       # MCP configuration template
│   ├── statusline.sh           # Bash statusline script
│   ├── statusline.ps1          # PowerShell statusline script
│   └── statusline.cjs           # Node.js statusline script
├── .opencode/                  # OpenCode CLI configuration
│   ├── agent/                  # Agent definitions
│   └── command/                # Command definitions
├── .github/                    # GitHub configuration
│   └── workflows/              # CI/CD workflows
├── docs/                       # Project documentation
├── plans/                      # Implementation plans and reports
├── scripts/                    # Dev-only tooling (NOT shipped)
├── CLAUDE.md                   # Project instructions for Claude
├── README.md                   # This file
├── package.json                # Node.js dependencies
├── .releaserc.json             # Semantic release configuration
├── .commitlintrc.json          # Commit linting rules
├── (CHANGELOG.md)              # Auto-generated by semantic-release on first release
└── LICENSE                     # MIT License
```

## Core Features

### AI Agent System

**30 Specialized Agents** — 19 engineer-kit (`.claude/agents/engineering/`) + 11 marketing-kit (`.claude/agents/marketing/`, only with `--kit marketing`/`both`):

| Category | Agents |
|----------|--------|
| Planning | `planner`, `researcher`, `brainstormer` |
| Development | `frontend-developer`, `backend-developer` |
| Quality | `tester`, `code-reviewer`, `debugger`, `performance-agent`, `security-auditor` |
| Documentation | `docs-manager`, `journal-writer` |
| Operations | `git-manager`, `project-manager`, `database-admin`, `integration-agent` |
| Implementation | `scout` |

Marketing kit (12): `campaign-manager`, `content-strategist`, `copywriter`, `crm-specialist`, `email-specialist`, `market-researcher`, `seo-content`, `seo-geo`, `seo-schema`, `seo-technical`, `video-producer` — see [`skills/marketing/README.md`](./skills/marketing/README.md).

### Slash Commands (25 files · 56 actions)

All dispatcher commands use **positional args** (no dash prefix) for mode selection. Only `/ck:fix` and `/ck:cook` use `--flags` for combinable modifiers.

| Command | Modes / Usage |
|---------|---------------|
| `/ck:ask` | `<question>` |
| `/ck:bootstrap` | `[auto\|fast]` |
| `/ck:brainstorm` | `<topic>` |
| `/ck:claude-md` | `[init\|verify\|refactor] [path]` |
| `/ck:cook` | `[task or plan-path] [--fast] [--auto] [--from-plan] [--no-test]` (composable; `--auto` runs autonomously incl. Deploy — other modes end ready-to-merge) |
| `/ck:debug` | `<issue>` |
| `/ck:design` | `[fast\|good\|3d\|screenshot\|describe\|ui-ux-pro-max] <request>` |
| `/ck:docs` | `[init\|update\|summarize]` |
| `/ck:find` | `<task-description>` |
| `/ck:fix` | `[ci\|logs\|test\|types\|ui] [--auto] [--review] [--quick] [--parallel] <issue>` |
| `/ck:flow` | `[save\|list] <task>` |
| `/ck:git` | `[cm\|cp\|pr\|merge]` |
| `/ck:journal` | `(no args)` |
| `/ck:plan` | `[fast\|hard\|two\|ci\|cro] <task> [-o md\|html]` · `<plan.md> -o html` (convert existing plan → HTML) |
| `/ck:port` | `<github-url> [feature] [--improve\|--compare]` |
| `/ck:refactor` | `<refactor-pattern>` |
| `/ck:research` | `<topic>` |
| `/ck:review` | `[tasks-or-prompt] [--flow]` |
| `/ck:scout` | `<prompt> [scale]` |
| `/ck:security` | `[scope] [--en]` |
| `/ck:sepay` | `<tasks>` |
| `/ck:team` | `<template> [context] [--devs\|--reviewers\|--researchers\|--debuggers N]` |
| `/ck:test` | `(no args)` |
| `/ck:use-mcp` | `<server-name>` |
| `/ck:watzup` | `(no args)` |

### Workflows

- **Primary Workflow** (`primary-workflow.md`) - Implementation cycle
- **Development Rules** (`development-rules.md`) - Coding standards
- **Orchestration Protocols** (`orchestration-protocol.md`) - Agent coordination
- **Documentation Management** (`documentation-management.md`) - Doc maintenance

## Development Principles

- **YAGNI** - You Aren't Gonna Need It
- **KISS** - Keep It Simple, Stupid
- **DRY** - Don't Repeat Yourself
- Files under 200 lines for optimal context management
- Try-catch error handling
- Security-first development

## Configuration

### Claude Code Settings

Configure in `.claude/settings.json`:

```json
{
  "hooks": {
    "BeforeBash": [{
      "type": "command",
      "command": "node ${CLAUDE_PROJECT_DIR}/.claude/hooks/scout-block.cjs"
    }]
  }
}
```

### Environment Variables

Copy `.claude/.env.example` to `.claude/.env` and configure:

- `ANTHROPIC_API_KEY` - Anthropic API key
- `GEMINI_API_KEY` - Google Gemini API key (optional)

## Documentation

All documentation is maintained in `./docs`:

- [Project Overview & PDR](./docs/project-overview-pdr.md)
- [Codebase Summary](./docs/codebase-summary.md)
- [Code Standards](./docs/code-standards.md)
- [System Architecture](./docs/system-architecture.md)
- [Project Roadmap](./docs/project-roadmap.md)
- [Design Guidelines](./docs/design-guidelines.md)
- [Deployment Guide](./docs/deployment-guide.md)

## Frequently Asked Questions

<details>
<summary><strong>What is KitForge and how is it different from aggregate Claude Code templates?</strong></summary>

KitForge is an opinionated multi-agent orchestration framework for Claude Code with 126 curated skills, 30 agents, and 57 gated commands. Unlike aggregate Claude Code templates (often 1000+ skills, kitchen-sink approach), KitForge hand-selects each skill, enforces pre-flight safety gates on destructive operations, and ships a trio architecture (skill + agent + command) so every concept has exactly one entry point. See the [comparison table](#kitforge-vs-other-ai-coding-tools) for side-by-side capabilities.

</details>

<details>
<summary><strong>How do I write a good CLAUDE.md file with KitForge?</strong></summary>

CLAUDE.md best practices in KitForge: keep workflows in `.claude/workflows/` (referenced from CLAUDE.md), point to `docs/clauKit-registry.md` as single source of truth for available tools, and enforce the trio rule (skill = knowledge, agent = persona, command = trigger). See this repo's [CLAUDE.md](./CLAUDE.md) as a working example. To bootstrap a new project's CLAUDE.md, run `/ck:claude-md init`; audit an existing one with `/ck:claude-md verify`, slim a bloated one with `/ck:claude-md refactor`.

</details>

<details>
<summary><strong>Can I run multiple Claude Code agents in parallel?</strong></summary>

Yes — via `/ck:team <template>`. KitForge spins up independent Claude Code sessions (devs, reviewers, researchers, debuggers) and coordinates outputs through a shared report directory. Pre-flight gates ensure no session pushes broken code. See [Flow 7 — Daily working session](#use-cases--workflows) and the [`team` skill](./.claude/skills/software/team/SKILL.md) for parallel agent execution patterns.

</details>

<details>
<summary><strong>How does KitForge handle Claude Code multi-session coordination?</strong></summary>

Each `/ck:team` session writes atomic commits on a **disjoint path set** declared up front, with results aggregated into a shared `plans/<plan-name>/reports/` directory. The orchestrator session reads these reports and produces a unified outcome. Two teammates whose paths would overlap are serialized, not parallelized. Multi-session coordination is gated — no session can push without passing `/ck:test` and `/ck:review`.

</details>

<details>
<summary><strong>Does KitForge support MCP (Model Context Protocol) servers?</strong></summary>

Yes. Run `/ck:use-mcp <server-name>` to integrate any MCP server (GitHub, Atlassian, Linear, Notion, Slack, custom). Configuration template at [`.claude/.mcp.json.example`](./.claude/.mcp.json.example). Claude Code loads MCP tool schemas on demand (deferred), and `/ck:use-mcp` calls them natively — isolating any verbose calls in a `general-purpose` subagent to keep the main context clean.

</details>

<details>
<summary><strong>How is KitForge different from Cursor or Windsurf?</strong></summary>

Cursor and Windsurf are agentic IDEs — they replace your editor. KitForge is a framework that runs *inside* Claude Code (which itself runs alongside your editor). They are complementary: use Cursor/Windsurf as your IDE, then invoke KitForge's `/ck:cook` or `/ck:plan` when you need structured multi-agent workflows. See the [full comparison table](#kitforge-vs-other-ai-coding-tools).

</details>

<details>
<summary><strong>How do I automate my Claude Code workflow with KitForge?</strong></summary>

KitForge ships 57 commands that codify common Claude Code workflows: `/ck:plan` → `/ck:cook` → `/ck:test` → `/ck:review` → `/ck:git pr`. Each command activates the right skill + agent automatically. For full visual workflow maps see [Use Cases & Workflows](#use-cases--workflows) — covers greenfield, onboarding, feature build, bug fix, refactor, and daily session loops.

</details>

<details>
<summary><strong>Is KitForge production-ready? Can I use it on commercial projects?</strong></summary>

KitForge is MIT-licensed — commercial use is allowed. Version 1.6.1 ships gated workflows that block destructive operations (dirty tree refactors, refactors on `main`, tests-red commits, pushes and merges onto shared branches). See [`.claude/workflows/primary-workflow.md`](./.claude/workflows/primary-workflow.md) for safety guarantees and [GitHub Releases](https://github.com/trungdo9/ClauKit/releases) for release history. The framework is in active use; expect breaking changes between minor versions until 2.0.

</details>

## Dependencies

**Development**:
- `@commitlint/cli` ^18.4.3
- `@semantic-release/*` packages
- `husky` ^8.0.3
- `semantic-release` ^22.0.12

## License

MIT License - see LICENSE file for details.

## Support

- GitHub Issues: https://github.com/trungdo9/ClauKit/issues
- Repository: https://github.com/trungdo9/ClauKit

<!--
Schema.org JSON-LD — embedded in HTML comment so GitHub strips the
script tags but Google still indexes the structured data when crawling
the raw markdown. Enables SoftwareApplication + FAQPage rich-result
eligibility in SERP.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "KitForge",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Cross-platform",
  "description": "Opinionated multi-agent orchestration framework for coding agents — 126 curated skills, 30 agents, and 57 gated commands. Runs in Claude Code; exports to Codex and Antigravity.",
  "url": "https://github.com/trungdo9/ClauKit",
  "license": "https://opensource.org/licenses/MIT",
  "author": { "@type": "Person", "name": "trungdo9" },
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is KitForge and how is it different from aggregate Claude Code templates?",
      "acceptedAnswer": { "@type": "Answer", "text": "KitForge is an opinionated multi-agent orchestration framework for Claude Code with 126 curated skills, 30 agents, and 57 gated commands. Unlike aggregate Claude Code templates (often 1000+ skills, kitchen-sink approach), KitForge hand-selects each skill, enforces pre-flight safety gates on destructive operations, and ships a trio architecture (skill + agent + command)." }
    },
    {
      "@type": "Question",
      "name": "How do I write a good CLAUDE.md file with KitForge?",
      "acceptedAnswer": { "@type": "Answer", "text": "Keep workflows in .claude/workflows/ (referenced from CLAUDE.md), point to docs/clauKit-registry.md as single source of truth for available tools, and enforce the trio rule (skill = knowledge, agent = persona, command = trigger). To bootstrap a new project's CLAUDE.md, run /ck:claude-md init; audit with /ck:claude-md verify, slim down with /ck:claude-md refactor." }
    },
    {
      "@type": "Question",
      "name": "Can I run multiple Claude Code agents in parallel?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes via /ck:team. KitForge spins up independent Claude Code sessions (devs, reviewers, researchers, debuggers) and coordinates outputs through a shared report directory. Pre-flight gates ensure no session pushes broken code." }
    },
    {
      "@type": "Question",
      "name": "How does KitForge handle Claude Code multi-session coordination?",
      "acceptedAnswer": { "@type": "Answer", "text": "Each /ck:team session writes atomic commits on a disjoint path set declared up front, with results aggregated into a shared plans/<plan-name>/reports/ directory. The orchestrator session reads these reports and produces a unified outcome. Multi-session coordination is gated — no session can push without passing /ck:test and /ck:review." }
    },
    {
      "@type": "Question",
      "name": "Does KitForge support MCP (Model Context Protocol) servers?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. Run /ck:use-mcp <server-name> to integrate any MCP server (GitHub, Atlassian, Linear, Notion, Slack, custom). Configuration template at .claude/.mcp.json.example. Claude Code loads MCP tool schemas on demand (deferred), and /ck:use-mcp calls them natively, isolating any verbose calls in a general-purpose subagent to keep the main context clean." }
    },
    {
      "@type": "Question",
      "name": "How is KitForge different from Cursor or Windsurf?",
      "acceptedAnswer": { "@type": "Answer", "text": "Cursor and Windsurf are agentic IDEs — they replace your editor. KitForge is a framework that runs inside Claude Code (which itself runs alongside your editor). They are complementary: use Cursor/Windsurf as your IDE, then invoke KitForge's /ck:cook or /ck:plan when you need structured multi-agent workflows." }
    },
    {
      "@type": "Question",
      "name": "How do I automate my Claude Code workflow with KitForge?",
      "acceptedAnswer": { "@type": "Answer", "text": "KitForge ships 57 commands that codify common Claude Code workflows: /ck:plan → /ck:cook → /ck:test → /ck:review → /ck:git pr. Each command activates the right skill + agent automatically. Visual workflow maps in the Use Cases & Workflows section cover greenfield, onboarding, feature build, bug fix, refactor, and daily session loops." }
    },
    {
      "@type": "Question",
      "name": "Is KitForge production-ready? Can I use it on commercial projects?",
      "acceptedAnswer": { "@type": "Answer", "text": "KitForge is MIT-licensed — commercial use is allowed. Version 1.6.1 ships gated workflows that block destructive operations (dirty tree refactors, refactors on main, tests-red commits, pushes and merges onto shared branches). The framework is in active use; expect breaking changes between minor versions until 2.0." }
    }
  ]
}
</script>
-->

