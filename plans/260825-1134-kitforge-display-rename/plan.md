# Plan — Display-name rename: ClauKit → KitForge (branding only)

**Created**: 2026-08-25 · **Type**: docs/branding · **Version impact**: none (no bump, no breaking change)
**Scope**: display/marketing name only. Package name, bin names, repo URL, file paths, config keys all stay literal.

---

## Problem

Project display name "ClauKit" ties the brand to Claude/Anthropic and reads as a single-kit Claude add-on. Roadmap plans more kits beyond `engineer`/`marketing`, and `ck convert antigravity|codex` already exports to non-Claude hosts. New display name: **KitForge** — host-neutral, connotes a growing multi-kit platform.

Rename is **prose only**. The npm package id, the two CLI bins, the GitHub repo, and ~90 internal provenance references are functional identifiers and must not move.

### Correction to the brainstorm premise (verified on disk)

The brainstorm noted "the tool already ships `.opencode/` for OpenCode CLI support per package.json `files`". **False.** `package.json` `files` lists `.opencode/` and `AGENTS.md`, but **neither exists in the tree** (`ls .opencode` → no such file; `ls AGENTS.md` → no such file). They are stale manifest entries that ship nothing.

The real multi-host evidence is `ck convert`: `bin/lib/convert/to-codex.js` (generates `.codex/` + `AGENTS.md`) and `ck convert antigravity` (generates `.agents/`). **Copy must rest on `ck convert`, not on `.opencode/`.** Claiming OpenCode support in the new tagline would be false advertising. (Stale `files` entries logged as an unresolved question — out of scope here.)

---

## Global Constraints

Verbatim values. Every phase obeys all of them.

**Rename to `KitForge`** — exact casing, one word, capital K and capital F. Never `Kitforge`, `kitForge`, `Kit Forge`, `KITFORGE`.

**Never change these literals, anywhere:**

| Literal | Where it lives | Why frozen |
|---|---|---|
| `@trungdo9/ClauKit` | `package.json` `name`, `.claude/metadata.json` `name`, `bin/lib/cli-parser.js:64,94` | npm package id |
| `ck`, `claukit` | `package.json` `bin` | installed CLI binaries |
| `https://github.com/trungdo9/ClauKit` (+ `.git`, `/issues`, `/releases`, `/stargazers`) | `package.json:18,30,32`, README badges + Support, docs headers | real, resolving URLs |
| `docs/clauKit-registry.md` | filename + ~15 referrers incl. shipped `.claude/**` | real path; renaming breaks shipped docs and `tests/installer-packaging.test.js` link check |
| `plans/260730-1359-clauKit-upgrade/` | dir name; cited `README.md:93`, `docs/project-roadmap.md:77`, registry header | real path + historical plan id |
| `"1.5.1"` | `package.json` `version` | no version bump in this change |
| `ClauKit-CLI` | `bin/lib/github-client.js:47,69` (HTTP `User-Agent`) | wire identifier |
| `# ClauKit runtime state — machine-local, never useful in history.` | `.claude/.gitignore:1` **and** `bin/lib/gitignore-wire.js:38` | `tests/installer-packaging.test.js:136` asserts the two byte-match; changing one alone fails the suite. Change both or neither — **this plan changes neither** |

**Never edit these files in this change:** `CHANGELOG.md` (semantic-release generated history) · `plans/**` (historical artifacts, incl. `docs/marketing-kit/qa-final.md`-style transcripts) · `tests/**` · `bin/lib/*.js` except `cli-parser.js` help string · `.claude/metadata.json` · `.gitignore` · `.claude/.gitignore` · `.claude/kits/*.json`.

**Commit type must be `chore(brand): …`.** `.releaserc.json` `releaseRules` cuts a **patch release** on `type: docs` + `scope: README`, on `type: refactor`, and on `type: style`. `chore` is not in the rules and the `conventionalcommits` preset does not release on it. A `docs(README): rename to KitForge` commit **would ship v1.5.2** — that violates the "no version bump" requirement.

**Test baseline (measured 2026-08-25, before any edit):** `npm test` → `# tests 329 / # pass 328 / # fail 0 / # skipped 1`. Every phase gate re-asserts this exact line set.

**`FROZEN` regex** — the one regex reused by every phase gate. Define it verbatim in the shell before running any gate:

```bash
FROZEN='trungdo9/ClauKit|clauKit-registry|260730-1359-clauKit-upgrade|ClauKit-CLI|`claukit`|"claukit"|ClauKit/'
```

**The gate shape (used by phases 1–3 and 5)** — every surviving `ClauKit`/`claukit` occurrence must sit inside a frozen literal, so the two counts must be **equal**:

```bash
chk(){ a=$(grep -o -i 'claukit' "$1"|wc -l); b=$(grep -oE "$FROZEN" "$1"|wc -l); echo "$1 total=$a frozen=$b $([ "$a" = "$b" ] && echo OK || echo FAIL)"; }
```

This catches under-replacement (a missed prose mention) **and** over-replacement (a mangled URL or package id) — including on **mixed lines** that carry both a frozen URL and brand prose. A line-level allowlist cannot do that, which is why the gate counts occurrences, not lines. Baseline `total`/`frozen` per file is in the census table below; the target is always `total == frozen`.

---

## Decision 1 — Transition-period copy: **"KitForge" alone + two anchored identity notes**

Chosen: **Option A**. Prose says `KitForge` and only `KitForge`. The package↔brand mapping is stated **exactly twice**, at the two moments a reader types a literal name: the README Quick Start, and `ck --help`.

Rejected: **Option B** — "KitForge (the `@trungdo9/ClauKit` package)" on every mention. 54 README mentions × a 4-word parenthetical is noise, it re-raises the question it answers each time, and it makes the old name the more memorable of the two. Violates KISS and DRY.

**Decisive fact that shrinks the problem:** the package is **not on npm**. `README.md:26` reads `npm install -g https://github.com/trungdo9/ClauKit.git`; `README.md:54` reads `npx github:trungdo9/ClauKit init`. The literal a user types is a **GitHub URL**, which is frozen anyway and reads as a repo, not a brand. `@trungdo9/ClauKit` surfaces to users in exactly one place — `ck --help` (`bin/lib/cli-parser.js:64,94`). So the only genuine confusion risk is inside `ck --help`, and Phase 4 fixes it in one line.

**Identity note (verbatim, README — insert directly under the Quick Start `## ` heading, before the fenced block):**

```markdown
> **Names:** the project is **KitForge**. The GitHub repo, the npm package id (`@trungdo9/ClauKit`) and the CLI binaries (`ck`, `claukit`) keep their original names — install and run exactly as before.
```

**Identity note (verbatim, CLI banner line in `bin/lib/cli-parser.js:60`):**

```
KitForge v${packageJson.version}   ·   package @trungdo9/ClauKit   ·   cli: ck | claukit
```

One line, carries all three names, zero per-mention tax.

## Decision 2 — Tagline: drop "for Claude Code" from the H1, keep it truthful in the subtitle

Current `README.md:1`:
`# ClauKit — The Opinionated Multi-Agent Orchestration Framework for Claude Code`

New H1 (verbatim):
`# KitForge — The Opinionated Multi-Agent Orchestration Framework for Coding Agents`

New subtitle, `README.md:3` (verbatim):
`*126 skills · 30 agents · 57 gated commands · atomic-commit safety · MCP-ready · 3 installable kits · runs in Claude Code, exports to Codex + Antigravity via `ck convert`*`

Rationale: distances the **brand** without hiding the **runtime**. KitForge does run inside Claude Code — deleting that from the README would mislead a first-time reader worse than the old name did. `ck convert codex` / `ck convert antigravity` are real (`bin/lib/convert/to-codex.js`, `bin/lib/cli-parser.js:92-93`), so the subtitle claim is verifiable. No OpenCode claim (see Correction above).

Every other body mention of "Claude Code" as the host platform is factual and **stays**.

---

## Scope options

| Option | Layers touched | Conventions followed / broken | Recommended |
|---|---|---|---|
| **A (minimal)** | `README.md`, `MARKETING.md`, `CLAUDE.md`, `guide/*.md`, `docs/*.md`, `skills/marketing/README.md`, `package.json` `description`, `bin/ck.js` + `bin/lib/cli-parser.js` user-visible strings — **12 files, ~120 lines** | Follows: prose-vs-identifier split, no-version-bump, frozen-literal table. Breaks: nothing | ✓ |
| B (thorough) | A + the 60 `skills/marketing/*/SKILL.md` attribution footers + `scripts/generate-marketing-*.js` templates + `bin/lib/*.js` provenance comments + `tests/**` comments — **~95 files** | Breaks: touches shipped skill bodies and the `.gitignore` sync assertion for zero user-visible gain; balloons the diff so the brand change is unreviewable | |

**Picked: A.** Phase 6 carries B's *one defensible slice* (the 60 marketing attribution footers) as **optional / deferred** — it is a generator-template change, cleanly separable, and worth a later commit.

---

## Occurrence census (measured 2026-08-25, `FROZEN` as defined above)

Per-file baseline for the in-scope 16 files. `chg` = occurrences this plan rewrites; after the phase, `total == frozen`.

| File | total | frozen | chg | Phase |
|---|---:|---:|---:|---|
| `README.md` | 82 | 19 | 63 | 1 |
| `MARKETING.md` | 1 | 0 | 1 | 2 |
| `CLAUDE.md` | 3 | 2 | 1 | 2 |
| `guide/SKILLS.md` | 3 | 1 | 2 | 2 |
| `guide/COMMANDS.md` | 6 | 2 | 4 | 2 |
| `skills/marketing/README.md` | 6 | 1 | 5 | 2 |
| `docs/codebase-summary.md` | 16 | 14 | 2 | 3 |
| `docs/project-roadmap.md` | 9 | 4 | 5 | 3 |
| `docs/project-overview-pdr.md` | 11 | 6 | 5 | 3 |
| `docs/system-architecture.md` | 7 | 3 | 4 | 3 |
| `docs/code-standards.md` | 6 | 0 | 6 | 3 |
| `docs/deployment-guide.md` | 4 | 2 | 2 | 3 |
| `docs/design-guidelines.md` | 3 | 1 | 2 | 3 |
| `docs/clauKit-registry.md` | 16 | 2 | 8 | 3 (lines 3+5 = 6 historical occurrences frozen) |
| `package.json` | 5 | 5 | 0 | 4 (`description` field carries no brand word — a rewrite, not a rename) |
| `bin/lib/cli-parser.js` | 4 | 2 | 2 | 4 |
| `bin/ck.js` | 7 | 0 | 2 | 4 (5 provenance comments frozen — line-targeted gate, not `chk`) |

Note: `README.md` after Phase 1 reads `total=22 frozen=22` — 19 pre-existing frozen, +1 from `claukit/` → `ClauKit/` (Project Structure tree root), +2 from the identity note (`@trungdo9/ClauKit`, `` `claukit` ``).

Repo-wide split:

`grep -ric 'claukit'` over the repo, node_modules and `.git` excluded — 124 files. Split:

| Bucket | Files | Hits | Action |
|---|---|---|---|
| **Brand prose — in scope** | 12 | ~120 | Phases 1–4 |
| Marketing skill attribution footers | 60 | 60 | Phase 6 (optional) |
| `CHANGELOG.md` | 1 | 104 | frozen — generated history |
| `plans/**` | 9 | ~90 | frozen — historical artifacts |
| `bin/lib/*.js` provenance comments ("a file ClauKit shipped") | 12 | ~70 | frozen — internal semantics |
| `tests/**` comments | 6 | ~20 | frozen |
| `.claude/**` internal refs (mostly `docs/clauKit-registry.md` paths) | 14 | ~25 | frozen |
| `.gitignore` / `.claude/.gitignore` / `.claude/metadata.json` | 3 | 5 | frozen (sync assertion) |

---

## Phases

| # | File | Scope | Est. |
|---|---|---|---|
| 1 | [phase-01-readme.md](./phase-01-readme.md) | `README.md` — H1, tagline, 54 prose mentions, 2 anchors, JSON-LD ×2 | 60 min |
| 2 | [phase-02-repo-brand-docs.md](./phase-02-repo-brand-docs.md) | `MARKETING.md`, `guide/SKILLS.md`, `guide/COMMANDS.md`, `skills/marketing/README.md`, `CLAUDE.md` | 25 min |
| 3 | [phase-03-docs-folder.md](./phase-03-docs-folder.md) | 8 files under `docs/` — headers + prose, URLs frozen | 35 min |
| 4 | [phase-04-cli-and-package-description.md](./phase-04-cli-and-package-description.md) | `bin/ck.js` banners, `bin/lib/cli-parser.js` help, `package.json` `description` | 25 min |
| 5 | [phase-05-verify-and-manual-steps.md](./phase-05-verify-and-manual-steps.md) | full-repo residue sweep, `npm test`, commit shape, **manual GitHub About/topics** | 20 min |
| 6 | [phase-06-optional-marketing-attribution.md](./phase-06-optional-marketing-attribution.md) | **OPTIONAL / DEFERRED** — 60 SKILL.md footers + 2 generators | 30 min |

Phases 1–4 are independent (disjoint file sets) and may run in parallel. Phase 5 depends on all of 1–4. Phase 6 depends on nothing and may be dropped entirely.

---

## Risks

| Risk | Mitigation |
|---|---|
| Blind `sed s/ClauKit/KitForge/g` corrupts URLs, the registry path, the plan-dir id, the package name | Every phase lists exact line numbers. Gates use the `ALLOW` residue grep, which fails loudly on an over-eager replace. Never run a repo-wide sed. |
| `docs(README):` commit ships an unwanted v1.5.2 | Global Constraint: commit is `chore(brand): …`. Phase 5 gate reads the commit subject back. |
| Renaming `## ClauKit vs Other AI Coding Tools` silently breaks 2 in-page links | Phase 1 renames heading **and** both `#claukit-vs-other-ai-coding-tools` refs (`README.md:689`, `:724`) in the same edit; gate greps for `#claukit` → 0. |
| Changing `.claude/.gitignore:1` breaks `tests/installer-packaging.test.js:136` | That line is in the frozen table. Not touched. |
| JSON-LD `"name": "ClauKit"` left stale → Google keeps indexing the old brand | Phase 1 covers `README.md:769` (SoftwareApplication) and all 8 FAQPage `name`/`text` entries (`:786`–`:822`). |
| `package.json` `description` change drifts from committed `.claude/metadata.json` `description` | Known, accepted: `.claude/metadata.json` is regenerated by `bin/lib/metadata-writer.js` on every `ck init`. The committed copy is a stale build artifact; leaving it stale is the pre-existing state. Logged as unresolved question. |

---

## Manual steps (cannot be done by file edit) — owner: the user

Detailed in [phase-05-verify-and-manual-steps.md](./phase-05-verify-and-manual-steps.md) § Manual. Summary:

1. **GitHub repo "About" description** → set to the new one-liner (Phase 5 supplies verbatim text).
2. **GitHub repo topics** → add `kitforge`; keep `claude-code-template` (README badge links to `github.com/topics/claude-code-template`, and it is the discovery topic).
3. **Repo name stays `ClauKit`** — explicitly out of scope; renaming it would break every frozen URL in the table above.
4. Optional: GitHub social-preview image, if one carries the old wordmark.

---

## Plan Completeness

- [x] spec coverage — every requirement maps to a phase
- [x] placeholder scan clean
- [x] Interfaces blocks consistent across phases
- [x] every phase gate is a runnable command with a stated expected result
- [x] Global Constraints values verbatim, not referenced
- [x] scope option recorded (A minimal / B thorough) — or N/A, single layer

---

## Unresolved questions

1. **`package.json` `files` lists `.opencode/` and `AGENTS.md`, neither of which exists on disk.** Stale manifest entries shipping nothing. Out of scope here — fix in a separate `fix(pkg)` commit, or the tagline's multi-host claim rests on `ck convert` alone (as planned).
2. **`package.json` `description`** currently reads `"A CLI tool to initialize Claude agents configuration in your project."` — it never said "ClauKit", so Phase 4 is a **rewrite**, not a rename. Proposed replacement text is in Phase 4; confirm wording.
3. **Committed `.claude/metadata.json`** keeps the old `description` after Phase 4. Regenerate it in the same commit, or leave the pre-existing drift? Plan assumes leave.
4. **Phase 6 (60 marketing attribution footers)** — ship now, defer to a follow-up commit, or never? Plan assumes defer.
5. **`docs/clauKit-registry.md` filename** stays literal (frozen). If a future rename to `docs/kitforge-registry.md` is wanted, it needs its own plan: ~15 referrers including shipped `.claude/agents/**` and `.claude/commands/**` files, plus the `tests/installer-packaging.test.js` shipped-doc-link check.
6. **`README.md:738`** asserts "Version 1.3.0 ships gated workflows" while `package.json` is at `1.5.1` — pre-existing staleness, noticed while editing that line. Fix in this pass or leave?
