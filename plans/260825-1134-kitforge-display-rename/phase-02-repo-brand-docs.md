# Phase 2 — Repo-level brand docs

**Exit gate:** `for f in MARKETING.md guide/SKILLS.md guide/COMMANDS.md skills/marketing/README.md CLAUDE.md; do chk $f; done` → `0 0 OK` / `1 1 OK` / `2 2 OK` / `1 1 OK` / `2 2 OK` (full gate block at the end of this file)

Five files. Independent of Phases 1, 3, 4 (disjoint file set) — may run in parallel with them.

**Interfaces**
- Consumes: from Phase 1 — the display-name string `KitForge` and the identity-note wording. Nothing else.
- Produces: nothing consumed downstream. Phase 5 re-runs the same residue gate over these files.

Shipped-vs-repo-only matters for how visible each edit is: `package.json` `files` ships `skills/` and `CLAUDE.md`; it does **not** ship `MARKETING.md` or `guide/`. Both sets are visible on GitHub, so both are in scope.

---

## 2.1 — `MARKETING.md` (repo-only) — 1 occurrence

| Line | Now | After |
|---|---|---|
| 1 | `# 🎯 ClauKit Marketing Kit — Guide` | `# 🎯 KitForge Marketing Kit — Guide` |

Target: `total=1 frozen=0` → after: `total=0`.
(For this file the `chk` equality gate reduces to "zero occurrences remain".)

## 2.2 — `guide/SKILLS.md` (repo-only) — 2 of 3

| Line | Now | After |
|---|---|---|
| 1 | `# ClauKit Skills Guide` | `# KitForge Skills Guide` |
| 3 | `This guide documents available skills in ClauKit. Skills extend Claude's capabilities…` | `This guide documents available skills in KitForge. Skills extend Claude's capabilities…` (rest of sentence unchanged — it describes the Claude Code runtime, which is factual) |
| 303 | `Repository: https://github.com/trungdo9/ClauKit` | **unchanged** (frozen URL) |

Target: `total=1 frozen=1`.

## 2.3 — `guide/COMMANDS.md` (repo-only) — 4 of 6

| Line | Now | After |
|---|---|---|
| 1 | `# ClauKit Commands Reference` | `# KitForge Commands Reference` |
| 3 | `A comprehensive guide to all available slash commands in ClauKit.` | `… in KitForge.` |
| 23 | `…trigger specialized AI agents and workflows in ClauKit. They follow the simple syntax:` | `… in KitForge. They follow…` |
| 534 | `ClauKit also provides a CLI tool:` | `KitForge also provides a CLI tool:` |
| 538 | `npm install -g https://github.com/trungdo9/ClauKit.git` | **unchanged** |
| 552 | `Repository: https://github.com/trungdo9/ClauKit` | **unchanged** |

Target: `total=2 frozen=2`.

## 2.4 — `skills/marketing/README.md` (**shipped** — `files` includes `skills/`) — 5 of 6

| Line | Now | After |
|---|---|---|
| 1 | `# ClauKit Marketing Kit` | `# KitForge Marketing Kit` |
| 19 | `- 2 ClauKit-authored: `product-marketing` (context hub), `seo-writing` …` | `- 2 KitForge-authored: …` |
| 169 | `… It's the ClauKit-native port of a production n8n workflow …` | `… It's the KitForge-native port …` |
| 233 | `- `CLAUDE.md` (root) — ClauKit master instructions` | `- `CLAUDE.md` (root) — KitForge master instructions` |
| 246 | `- Custom ClauKit — workflows, MCP wrappers, automation agents, integration skills` | `- Custom KitForge — workflows, MCP wrappers, automation agents, integration skills` |
| 237 | `- `docs/clauKit-registry.md` — full resource catalog` | **unchanged** (frozen path) |

Target: `total=1 frozen=1`.

Note: `skills/marketing/README.md` is shipped **and** linked from `MARKETING.md:9` as `[`skills/marketing/README.md`](./skills/marketing/README.md)` — a relative path, not a brand string. No link work needed.

## 2.5 — `CLAUDE.md` (**shipped**) — 1 of 3

| Line | Now | After |
|---|---|---|
| 20 | `ClauKit supports multiple installable kits via `ck init --kit <name>`:` | `KitForge supports multiple installable kits via `ck init --kit <name>`:` |
| 33 | `… single source of truth … is `./docs/clauKit-registry.md` …` | **unchanged** (frozen path) |
| 63 | `├── clauKit-registry.md       # ⭐ Skills + Agents + Commands single source of truth` | **unchanged** (frozen filename) |

Target: `total=2 frozen=2`.

Do **not** touch any other line in `CLAUDE.md`. Its "Repo layout ≠ installed layout" section and the `.claude/skills` symlink rules are operational instructions consumed by every agent run; a brand edit there has no upside and the file is shipped into every install.

---

## Exit gate

```bash
cd /home/trung/workspace/project/private/ClauKit
FROZEN='trungdo9/ClauKit|clauKit-registry|260730-1359-clauKit-upgrade|ClauKit-CLI|`claukit`|"claukit"|ClauKit/'
chk(){ a=$(grep -o -i 'claukit' "$1"|wc -l); b=$(grep -oE "$FROZEN" "$1"|wc -l); echo "$1 total=$a frozen=$b $([ "$a" = "$b" ] && echo OK || echo FAIL)"; }
for f in MARKETING.md guide/SKILLS.md guide/COMMANDS.md skills/marketing/README.md CLAUDE.md; do chk "$f"; done
```

**Expected, exactly:**

```
MARKETING.md total=0 frozen=0 OK
guide/SKILLS.md total=1 frozen=1 OK
guide/COMMANDS.md total=2 frozen=2 OK
skills/marketing/README.md total=1 frozen=1 OK
CLAUDE.md total=2 frozen=2 OK
```

Plus, because `skills/` and `CLAUDE.md` are shipped and this phase edits both:

```bash
npm test 2>&1 | tail -6
```
→ `# tests 329` · `# pass 328` · `# fail 0` · `# skipped 1`

(`tests/installer-packaging.test.js` installs all three kits and validates every relative markdown link in shipped docs. It is the check that a `skills/marketing/README.md` or `CLAUDE.md` edit did not break a link target.)
