# Phase 1 — README.md (flagship brand surface)

**Exit gate:** `a=$(grep -oi claukit README.md|wc -l); b=$(grep -oE "$FROZEN" README.md|wc -l); echo "$a $b $(grep -c '#claukit' README.md)"` → `22 22 0` (full gate block at the end of this file)

**File**: `/home/trung/workspace/project/private/ClauKit/README.md` (modify — the only file this phase touches)
**Baseline**: 82 occurrences of `claukit` (case-insensitive), 19 inside frozen literals, **63 to rewrite** across 52 lines.
**Target after**: `total=22 frozen=22`.

**Interfaces**
- Consumes: nothing (first phase).
- Produces — the naming contract every later phase reuses verbatim:
  - Display name string: `KitForge`
  - H1: `# KitForge — The Opinionated Multi-Agent Orchestration Framework for Coding Agents`
  - Heading anchor: `#kitforge-vs-other-ai-coding-tools` (was `#claukit-vs-other-ai-coding-tools`)
  - Identity-note block (Phase 4 restates a one-line CLI variant of it):
    `> **Names:** the project is **KitForge**. The GitHub repo, the npm package id (`@trungdo9/ClauKit`) and the CLI binaries (`ck`, `claukit`) keep their original names — install and run exactly as before.`

---

## 1.1 — Header block (lines 1–14)

| Line | Now | After |
|---|---|---|
| 1 | `# ClauKit — The Opinionated Multi-Agent Orchestration Framework for Claude Code` | `# KitForge — The Opinionated Multi-Agent Orchestration Framework for Coding Agents` |
| 3 | `*126 skills · 30 agents · 57 gated commands · atomic-commit safety · MCP-ready · 3 installable kits*` | `*126 skills · 30 agents · 57 gated commands · atomic-commit safety · MCP-ready · 3 installable kits · runs in Claude Code, exports to Codex + Antigravity via `ck convert`*` |
| 5, 7 | shields.io + github.com badge URLs containing `trungdo9/ClauKit` | **unchanged** (frozen) |
| 12 | `**ClauKit is the opinionated alternative.**` | `**KitForge is the opinionated alternative.**` |
| 14 | `> Plan once. `/clear` context. Cook with confidence. That's the ClauKit workflow.` | `… That's the KitForge workflow.` |
| 16 | `## Why ClauKit` | `## Why KitForge` |

Line 19 contains only `docs/clauKit-registry.md` → **unchanged**.

Subtitle rationale (do not weaken it): `ck convert codex` and `ck convert antigravity` are real — `bin/lib/convert/to-codex.js`, `bin/lib/cli-parser.js:92-93`. Do **not** add an OpenCode claim: `package.json` `files` lists `.opencode/` but no such directory exists in the tree.

## 1.2 — Quick Start (lines 22–60) + identity note

- Insert the identity-note blockquote (verbatim text in **Interfaces** above) immediately **after** the `## Quick Start` heading and **before** the fenced `bash` block.
- Line 26 `npm install -g https://github.com/trungdo9/ClauKit.git` → **unchanged** (frozen URL; also the literal a user types).
- Line 28 comment `# 2. Drop ClauKit into your project — pick a kit` → `# 2. Drop KitForge into your project — pick a kit`.
- Line 54 `npx github:trungdo9/ClauKit init` → **unchanged**.
- Line 60 `git clone https://github.com/trungdo9/ClauKit.git your-project-name` → **unchanged**.

## 1.3 — Body prose

Rewrite `ClauKit` → `KitForge` on these lines, leaving every URL and every `docs/clauKit-registry.md` / `plans/260730-1359-clauKit-upgrade/` path intact:

`83` · `116` · `122` · `146` · `162` · `312` · `320` · `406` · `410` · `419` · `456` · `465` · `489` · `491` · `500` (two occurrences) · `511` · `526` · `528` · `530` · `541` · `543` (two occurrences) · `687` · `689` (two occurrences) · `694` · `696` · `703` · `708` · `715` · `722` · `724` (two occurrences) · `729` · `731` · `736` · `738`

Line-specific notes:

- **93** — `Full rationale: [`plans/260730-1359-clauKit-upgrade/plan.md`]…` → **unchanged**, real path.
- **122** — mermaid node `Start([I want to use ClauKit])` → `Start([I want to use KitForge])`.
- **146** — mermaid node `A[npm i -g ClauKit] --> B[ck init]` → `A[npm i -g github:trungdo9/ClauKit] --> B[ck init]`. Not a brand fix only: the package is not on npm, so `npm i -g ClauKit` is a false instruction today. Verify the diagram still renders (mermaid node text with `:` and `/` needs no quoting inside `[...]`; if the renderer complains, use `A["npm i -g github:trungdo9/ClauKit"]`).
- **396** — `docs/clauKit-registry.md` only → **unchanged**.
- **500** — table row `| **Pre-flight safety gates** | No | Inherited from ClauKit | Inherited from ClauKit |` → both cells become `Inherited from KitForge`. Markdown tables do not need column alignment; no padding work.
- **511** — inside a fenced ASCII diagram: `ultracode / native dynamic-workflow     →  not used — /ck:flow is the ClauKit substitute`. `KitForge` is 8 chars vs `ClauKit` 7. Re-check the block's column alignment after the edit and adjust the run of spaces on that line only.
- **526** — `## ClauKit vs Other AI Coding Tools` → `## KitForge vs Other AI Coding Tools`. **Anchor changes.** Update both in-page links in the same edit: line `689` `(#claukit-vs-other-ai-coding-tools)` and line `724` `(#claukit-vs-other-ai-coding-tools)` → `(#kitforge-vs-other-ai-coding-tools)`.
- **550** — Project Structure tree root `claukit/` → `ClauKit/                     # repo root — GitHub repo name, unchanged`. Keeps the tree truthful (a `git clone` produces `ClauKit/`) and adds the one clarification a reader needs at that spot.
- **696** — rewrite `CLAUDE.md best practices in ClauKit:` → `… in KitForge:`; the `docs/clauKit-registry.md` later in the same line stays.
- **738** — rewrite `ClauKit is MIT-licensed`; the GitHub Releases URL later in the same line stays. (The same line's stale `Version 1.3.0` claim vs `package.json` `1.5.1` is question 6 in `plan.md` — do not change it without an answer.)
- **756, 757, 773** — Support + JSON-LD URLs → **unchanged**.

## 1.4 — JSON-LD structured data (lines 765–825)

Both `<script type="application/ld+json">` blocks sit inside an HTML comment; Google still indexes them from raw markdown, so a stale brand here keeps the old name in rich results.

- **769** — `"name": "ClauKit",` → `"name": "KitForge",`
- **772** — `"description": "Opinionated multi-agent orchestration framework for Claude Code with 126 curated skills, 30 agents, and 57 gated commands."` → `"description": "Opinionated multi-agent orchestration framework for coding agents — 126 curated skills, 30 agents, and 57 gated commands. Runs in Claude Code; exports to Codex and Antigravity."`
- **773** — `"url": "https://github.com/trungdo9/ClauKit",` → **unchanged**.
- FAQPage entries — rewrite the brand word in every `"name"` and `"text"` on lines **786, 787, 791, 797, 801, 806, 811, 812, 816, 817, 821, 822**. Line **792** carries only `docs/clauKit-registry.md` → **unchanged**.
- The `<summary>` questions at **687, 694, 703, 708, 715, 722, 729, 736** are the human-readable twins of those FAQPage `name` values — **keep the two sets textually identical** after the rewrite, or the structured data stops matching the visible page.

**JSON validity**: both blocks must still parse. Gate below checks this, not eyeballs.

---

## Exit gate

```bash
cd /home/trung/workspace/project/private/ClauKit
FROZEN='trungdo9/ClauKit|clauKit-registry|260730-1359-clauKit-upgrade|ClauKit-CLI|`claukit`|"claukit"|ClauKit/'
a=$(grep -o -i 'claukit' README.md | wc -l); b=$(grep -oE "$FROZEN" README.md | wc -l)
echo "residue total=$a frozen=$b"
echo "stale anchors: $(grep -c '#claukit' README.md)"
echo "kitforge mentions: $(grep -o -i 'kitforge' README.md | wc -l)"
node -e 'const m=require("fs").readFileSync("README.md","utf8").match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)||[];m.forEach((s,i)=>{JSON.parse(s.replace(/<\/?script[^>]*>/g,""));console.log("json-ld block "+i+" parses")});console.log("blocks="+m.length)'
```

**Expected, exactly:**

```
residue total=22 frozen=22
stale anchors: 0
kitforge mentions: 60 or more
json-ld block 0 parses
json-ld block 1 parses
blocks=2
```

`total == frozen`, `stale anchors: 0` and both JSON-LD blocks parsing are the hard conditions — any one of them off means the phase is not done. The `kitforge mentions` count is advisory (63 rewritten + 1 in the identity note = 64 if every line above is hit one-for-one); a lower number means re-read the line list, it is not an automatic failure.

Plus, unchanged from baseline:

```bash
npm test 2>&1 | tail -6
```
→ `# tests 329` · `# pass 328` · `# fail 0` · `# skipped 1`
