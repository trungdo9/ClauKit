# Phase 3 — `docs/` (shipped documentation set)

**Exit gate:** `for f in docs/*.md; do chk $f; done` → every line ends `OK` (per-file totals in the gate block at the end of this file)

Eight files. `package.json` `files` includes `docs/`, so every one of these ships into a consuming project via Option 3 (clone-as-template) and is read by agents on every task (`CLAUDE.md` routes task context to `docs/codebase-summary.md` + `docs/system-architecture.md`).

Independent of Phases 1, 2, 4 — may run in parallel.

**Interfaces**
- Consumes: from Phase 1 — the display-name string `KitForge`; the H1/tagline wording is **not** reused here (docs headers use the plain name).
- Produces: nothing consumed downstream. Phase 5 re-runs the residue gate over these files.

**Frozen throughout this phase** (each appears on at least one line below):
`https://github.com/trungdo9/ClauKit` · `@trungdo9/ClauKit` · `docs/clauKit-registry.md` (and the bare filename `clauKit-registry.md`) · `260730-1359-clauKit-upgrade` · `` `ck`/`claukit` `` bin listings · the tree root `ClauKit/`.

Several lines below are **mixed** — one frozen literal and one brand mention on the same line. Rewrite the brand half only.

---

## 3.1 — `docs/codebase-summary.md` (16 occurrences, 2 to change)

| Line | Action |
|---|---|
| 5 | `**Repository**: https://github.com/trungdo9/ClauKit` → **unchanged** |
| 9 | `ClauKit is an opinionated multi-agent orchestration framework that runs inside Claude Code.` → `KitForge is an opinionated…` (rest of paragraph unchanged) |
| 16 | tree root `ClauKit/` → **unchanged** (real clone directory name) |
| 48 | **mixed** — `├── package.json                # `@trungdo9/ClauKit` npm package (bin: `ck`, `claukit`)` → **unchanged**, both halves are identifiers |
| 58 | **mixed** — `- **Package**: `@trungdo9/ClauKit` (CLI binaries `ck` / `claukit`)` → **unchanged** |
| 90, 96, 118, 180, 235 | `docs/clauKit-registry.md` / `clauKit-registry.md` references → **unchanged** |
| 111 | `… + 2 ClauKit-authored (`product-marketing`, `kit-builder`)` → `… + 2 KitForge-authored (…)` |
| 175 | `- **package.json**: Dependencies and scripts (`ck`/`claukit` bin)` → **unchanged** |
| 264 | `- `/package.json` — Node.js config (`@trungdo9/ClauKit`)` → **unchanged** |
| 285 | `**Repository**: https://github.com/trungdo9/ClauKit` → **unchanged** |

Target: `total=14 frozen=14`.

## 3.2 — `docs/project-roadmap.md` (9 occurrences, 5 to change)

| Line | Action |
|---|---|
| 5 | `**Repository**: https://github.com/trungdo9/ClauKit` → **unchanged**. **This is the line the brief flagged**: a real, resolving URL, not brand prose. It must keep the literal old name — the GitHub repo is not being renamed. |
| 9 | **mixed** — `ClauKit is an opinionated multi-agent orchestration framework for Claude Code, distributed as the `@trungdo9/ClauKit` npm package.` → `KitForge is an opinionated multi-agent orchestration framework for coding agents, distributed as the `@trungdo9/ClauKit` npm package.` (first half only; package id frozen) |
| 77 | `### 0. Durability–Evidence–Cost upgrade — SHIPPED 2026-07-31 (plan `260730-1359-clauKit-upgrade`)` → **unchanged** (plan-dir id) |
| 89 | `… only where a content digest proves ClauKit shipped that exact file …` → `… proves KitForge shipped that exact file …` |
| 194 | `… on ClauKit primitives (markdown recipes + Agent-tool fan-out/pipeline …)` → `… on KitForge primitives …` |
| 205 | `… and no ClauKit pipeline ever routed to it …` → `… and no KitForge pipeline ever routed to it …` |
| 339 | `… (see `docs/clauKit-registry.md` § 5)` → **unchanged** |
| 380 | `**Maintained By**: ClauKit maintainers` → `**Maintained By**: KitForge maintainers` |

Target: `total=4 frozen=4`.

Lines 89, 194 and 205 are dated historical roadmap entries. They are rewritten anyway (unlike `CHANGELOG.md`) because the roadmap is a living, agent-read document describing current behaviour, not a generated release log. If the maintainer prefers historical entries frozen, drop 89/194/205 and the target becomes `total=7 frozen=4` — record that choice in `STATE.md`, since it changes the Phase 5 repo-wide expectation.

## 3.3 — `docs/project-overview-pdr.md` (11 occurrences, 5 to change)

| Line | Action |
|---|---|
| 3 | `**Project Name**: ClauKit` → `**Project Name**: KitForge` |
| 7 | `**Repository**: https://github.com/trungdo9/ClauKit` → **unchanged** |
| 11 | **mixed** — `ClauKit is an opinionated multi-agent orchestration framework for Claude Code, distributed as the npm package `@trungdo9/ClauKit` (CLI: `ck`/`claukit`).` → `KitForge is an opinionated multi-agent orchestration framework for coding agents, distributed as the npm package `@trungdo9/ClauKit` (CLI: `ck`/`claukit`).` |
| 81 | `… re-creates the dynamic-workflow model on ClauKit primitives …` → `… on KitForge primitives …` |
| 144 | `- `/ck:find <task>` - Recommend the right ClauKit skill/agent/command` → `… the right KitForge skill/agent/command` |
| 538 | `- [ClauKit Registry](./clauKit-registry.md) — …` → `- [KitForge Registry](./clauKit-registry.md) — …` (**display text only**; the link target `./clauKit-registry.md` is a real filename and stays) |
| 544, 545 | GitHub Issues + Repository URLs → **unchanged** |

Target: `total=6 frozen=6`.

## 3.4 — `docs/system-architecture.md` (7 occurrences, 4 to change)

| Line | Action |
|---|---|
| 5 | `**Project**: ClauKit` → `**Project**: KitForge` |
| 9 | `ClauKit implements a multi-agent AI orchestration architecture …` → `KitForge implements …` |
| 91, 112, 284 | `docs/clauKit-registry.md` references → **unchanged** |
| 232 | `… on ClauKit primitives — 4-axis inheritance, phase gates, cost preview …` → `… on KitForge primitives …` |
| 285 | `… coreyhaines31-sourced (…), ClauKit-authored (`product-marketing`, `kit-builder`)` → `… KitForge-authored (…)` |

Target: `total=3 frozen=3`.

## 3.5 — `docs/code-standards.md` (6 occurrences, all 6 change)

| Line | Action |
|---|---|
| 5 | `**Applies To**: All code within ClauKit project` → `**Applies To**: All code within the KitForge project` |
| 9 | `… best practices for ClauKit. All code must adhere …` → `… best practices for KitForge. …` |
| 283 | ` * @author ClauKit` (inside a JSDoc code fence) → ` * @author KitForge` |
| 691 | `### Every Node file ClauKit installs is `.cjs` — never `.js`` → `### Every Node file KitForge installs is `.cjs` — never `.js`` |
| 714 | `` `bin/` is exempt — it executes inside ClauKit's own package, under ClauKit's `` → `… inside KitForge's own package, under KitForge's` (two occurrences on one line) |

Target: `total=0 frozen=0`.

Note line 691 is a heading — check for in-page links to `#every-node-file-claukit-installs-is-cjs-never-js` before editing. `grep -rn 'every-node-file-claukit' .` currently returns nothing; re-run it as part of the gate.

## 3.6 — `docs/deployment-guide.md` (4 occurrences, 2 to change)

| Line | Action |
|---|---|
| 5 | `**Project**: ClauKit` → `**Project**: KitForge` |
| 9 | **mixed** — `… for projects built with the ClauKit template (`@trungdo9/ClauKit`, installed via `ck init`).` → `… with the KitForge template (`@trungdo9/ClauKit`, installed via `ck init`).` |
| 17 | `git clone https://github.com/trungdo9/ClauKit.git your-project` → **unchanged** |

Target: `total=2 frozen=2`.

## 3.7 — `docs/design-guidelines.md` (3 occurrences, 2 to change)

| Line | Action |
|---|---|
| 5 | `**Project**: ClauKit` → `**Project**: KitForge` |
| 9 | **mixed** — `… for projects built with the ClauKit template (`@trungdo9/ClauKit`, installed via `ck init`).` → `… with the KitForge template (`@trungdo9/ClauKit`, …).` |

Target: `total=1 frozen=1`.

## 3.8 — `docs/clauKit-registry.md` (16 occurrences, 8 to change)

**The filename stays `clauKit-registry.md`** — frozen. ~15 referrers, several inside shipped `.claude/agents/**` and `.claude/commands/**` files, plus `CLAUDE.md:33` and `CLAUDE.md:63`. Renaming it needs its own plan (question 5 in `plan.md`).

**Lines 3 and 5 are frozen** — they are the dated `**Last Updated**` / `**Prior**` changelog blobs (6 non-path brand occurrences between them). Same rule as `CHANGELOG.md`: a dated record of what a past release said is not brand prose.

Change these 8:

| Line | Action |
|---|---|
| 1 | `# ClauKit Registry` → `# KitForge Registry` |
| 41 | `… + 1 ClauKit-authored pipeline (`seo-writing`):` → `… + 1 KitForge-authored pipeline (`seo-writing`):` |
| 70 | table cell `ClauKit-authored — 6-stage article-production pipeline …` → `KitForge-authored — …` |
| 99 | `**ClauKit-authored (2):**` → `**KitForge-authored (2):**` |
| 104 | `Build custom ClauKit marketing components — skills, agents, workflows …` → `Build custom KitForge marketing components — …` |
| 300 | `Recommend ClauKit skill/agent/command for a task — …` → `Recommend KitForge skill/agent/command for a task — …` |
| 675 | `… ClauKit declares **zero** steps; no `## Delivery tail` block ⇒ no-op, exit 0.` → `KitForge declares **zero** steps; …` |
| 679 | `… **zero new dependencies** — ClauKit is installed by other projects, so a test framework in `dependencies` …` → `… — KitForge is installed by other projects, …` |

Target (lines 3 and 5 excluded): `total=0 frozen=0`.

**Cross-check after editing line 300**: `.claude/commands/ck/find.md:2` carries the same sentence as its `description:` frontmatter (`⚡ Find ClauKit skill/agent/command for a task…`). That file is **out of scope** (frozen — it is a shipped command definition whose description string is matched by the skill-activation layer). The registry and the command file will read differently after this phase; that is accepted, not a defect. Logged in `STATE.md`.

---

## Exit gate

```bash
cd /home/trung/workspace/project/private/ClauKit
FROZEN='trungdo9/ClauKit|clauKit-registry|260730-1359-clauKit-upgrade|ClauKit-CLI|`claukit`|"claukit"|ClauKit/'
chk(){ a=$(grep -o -i 'claukit' "$1"|wc -l); b=$(grep -oE "$FROZEN" "$1"|wc -l); echo "$1 total=$a frozen=$b $([ "$a" = "$b" ] && echo OK || echo FAIL)"; }
for f in docs/codebase-summary.md docs/project-roadmap.md docs/project-overview-pdr.md docs/system-architecture.md docs/code-standards.md docs/deployment-guide.md docs/design-guidelines.md; do chk "$f"; done
sed '3d;5d' docs/clauKit-registry.md > /tmp/ck-reg-check.md; chk /tmp/ck-reg-check.md; rm -f /tmp/ck-reg-check.md
echo "stale heading refs: $(grep -rn 'every-node-file-claukit' --include=*.md . | grep -vc node_modules)"
npm test 2>&1 | tail -6
```

**Expected, exactly:**

```
docs/codebase-summary.md total=14 frozen=14 OK
docs/project-roadmap.md total=4 frozen=4 OK
docs/project-overview-pdr.md total=6 frozen=6 OK
docs/system-architecture.md total=3 frozen=3 OK
docs/code-standards.md total=0 frozen=0 OK
docs/deployment-guide.md total=2 frozen=2 OK
docs/design-guidelines.md total=1 frozen=1 OK
/tmp/ck-reg-check.md total=0 frozen=0 OK
stale heading refs: 0
```

and from `npm test`: `# tests 329` · `# pass 328` · `# fail 0` · `# skipped 1`.

Every line must read `OK`. A `FAIL` on a file whose `total` went **up** means a URL or package id was mangled; a `FAIL` where `total` exceeds `frozen` means a prose mention was missed.
