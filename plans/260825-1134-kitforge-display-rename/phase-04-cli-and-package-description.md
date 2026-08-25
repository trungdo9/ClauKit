# Phase 4 — CLI-visible strings + `package.json` description

**Exit gate:** `node bin/ck.js help | head -1` → `KitForge v1.5.1   ·   package @trungdo9/ClauKit   ·   cli: ck | claukit` (full gate block at the end of this file)

The only phase that touches executable files. Three files, **five string edits**, zero logic changes.

Independent of Phases 1–3 (disjoint file set) — may run in parallel.

**Interfaces**
- Consumes: from Phase 1 — the display name `KitForge` and the identity-note concept (this phase renders the one-line CLI variant).
- Produces — the CLI banner contract, asserted by the gate below:
  - `bin/ck.js` init banner: `` console.log(`🚀 KitForge v${packageJson.version}`); ``
  - `bin/ck.js` update banner: `` console.log(`🚀 KitForge Updater v${packageJson.version}\n`); ``
  - `bin/lib/cli-parser.js` help line 1: `KitForge v${packageJson.version}   ·   package @trungdo9/ClauKit   ·   cli: ck | claukit`

---

## Why the CLI banner is in scope

`bin/ck.js:43` and `:185` print `🚀 ClauKit v1.5.1` — the **first thing** a user sees after running `ck init`. That string is a display name, not an identifier: nothing parses it, no test asserts it (verified: `grep -rn 'ClauKit v' tests/` → no hits), and it is exactly the surface the rename exists to change. The brief's "bin entries stay unchanged" covers the `package.json` `bin` **keys** (`ck`, `claukit`), which this phase does not touch.

## 4.1 — `bin/ck.js` (7 occurrences, **2** to change)

| Line | Now | After |
|---|---|---|
| 4 | `` * ClauKit CLI - Initialize Claude configuration in your project.`` | **unchanged** — internal file-header comment; grouped with the frozen provenance comments below |
| **43** | `` console.log(`🚀 ClauKit v${packageJson.version}`); `` | `` console.log(`🚀 KitForge v${packageJson.version}`); `` |
| 93 | `// ClauKit's CommonJS files used to ship as `.js` …` | **unchanged** (frozen provenance comment) |
| 107 | `// … only where a content digest proves ClauKit shipped that exact file …` | **unchanged** (frozen) |
| 119 | `` console.log(`\n   🔧 migrated ClauKit's CommonJS files to .cjs …`); `` | **unchanged** — see note |
| **185** | `` console.log(`🚀 ClauKit Updater v${packageJson.version}\n`); `` | `` console.log(`🚀 KitForge Updater v${packageJson.version}\n`); `` |
| 188 | `` … \|\| "trungdo9/ClauKit"; `` | **unchanged** (frozen — GitHub `owner/repo` fallback used to build an API URL) |

**Line 119 note** — it is a user-visible `console.log`, but its subject is *provenance*: "these are the files the package shipped, and we migrated them". `tests/esm-host.test.js:306` asserts on that exact wording:

```js
assert.ok(!/migrated ClauKit's CommonJS files/.test(res.stdout), 'nothing left to migrate');
```

Changing the string without changing the test turns that assertion into a permanent pass — it would stop detecting a failed migration and never fail. **Frozen.** Rewording it belongs in a separate change that updates the assertion in the same commit.

## 4.2 — `bin/lib/cli-parser.js` (4 occurrences, **1** to change)

| Line | Now | After |
|---|---|---|
| **60** | `ClauKit v${packageJson.version}` | `KitForge v${packageJson.version}   ·   package @trungdo9/ClauKit   ·   cli: ck \| claukit` |
| 61 | `${packageJson.description}` | **unchanged** (interpolates the new description from 4.3) |
| 64 | `  npx @trungdo9/ClauKit <command>` | **unchanged** (frozen package id) |
| 66 | `  claukit <command>` | **unchanged** (frozen bin name) |
| 94 | `  npx @trungdo9/ClauKit init --kit marketing` | **unchanged** |

This single line is where the whole transition-period problem lives (see `plan.md` § Decision 1) — the help text is the only user-facing place `@trungdo9/ClauKit` appears, so the mapping is stated here and nowhere else in the CLI.

Rendered result:

```
KitForge v1.5.1   ·   package @trungdo9/ClauKit   ·   cli: ck | claukit
Multi-agent orchestration for coding agents — 126 curated skills, 30 agents, 57 gated commands, 3 installable kits. Installs into any project via `ck init`.

Usage:
  npx @trungdo9/ClauKit <command>
  ck <command>
  claukit <command>
…
```

## 4.3 — `package.json` `description` (0 brand occurrences — a **rewrite**, not a rename)

Current line 4:

```json
"description": "A CLI tool to initialize Claude agents configuration in your project.",
```

It never contained "ClauKit", so no rename applies. It is in scope because it is brand-facing (the brief lists it) and because it is Claude-anchored and describes an old, narrower product.

Proposed replacement (confirm wording — question 2 in `plan.md`):

```json
"description": "Multi-agent orchestration for coding agents — 126 curated skills, 30 agents, 57 gated commands, 3 installable kits. Installs into any project via `ck init`.",
```

**Do not touch** on the same edit: `name` (`@trungdo9/ClauKit`), `version` (`1.5.1`), `bin` (`ck`, `claukit`), `repository.url`, `bugs.url`, `homepage`, `files`.

Consequence to accept: the committed `.claude/metadata.json` keeps the old `description`. It is a build artifact regenerated by `bin/lib/metadata-writer.js` on every `ck init`, so consumers get the new text; the committed copy is already stale in the same way (question 3 in `plan.md`).

Optional, if wanted in the same commit: add `"kitforge"` to `package.json` `keywords` (currently `["ai-agents","development-template","boilerplate","automation","cli-tools"]`). Purely additive; no npm publish happens here.

---

## Exit gate

```bash
cd /home/trung/workspace/project/private/ClauKit
grep -n 'console.log(`🚀' bin/ck.js
sed -n '60p' bin/lib/cli-parser.js
node -e 'const p=require("./package.json");console.log("name="+p.name);console.log("version="+p.version);console.log("bin="+Object.keys(p.bin).join(","));console.log("desc="+p.description)'
node bin/ck.js help | head -3
npm test 2>&1 | tail -6
```

**Expected, exactly:**

```
43:  console.log(`🚀 KitForge v${packageJson.version}`);
185:  console.log(`🚀 KitForge Updater v${packageJson.version}\n`);
KitForge v${packageJson.version}   ·   package @trungdo9/ClauKit   ·   cli: ck | claukit
name=@trungdo9/ClauKit
version=1.5.1
bin=ck,claukit
desc=Multi-agent orchestration for coding agents — 126 curated skills, 30 agents, 57 gated commands, 3 installable kits. Installs into any project via `ck init`.
```

`node bin/ck.js help | head -3` → first line reads `KitForge v1.5.1   ·   package @trungdo9/ClauKit   ·   cli: ck | claukit`, second line is the new description, third line is blank.

`npm test` → `# tests 329` · `# pass 328` · `# fail 0` · `# skipped 1`. A failure in `tests/esm-host.test.js` means line 119 of `bin/ck.js` was edited — revert that one line.

`name=@trungdo9/ClauKit`, `version=1.5.1` and `bin=ck,claukit` are the no-breaking-change assertions: if any of those three lines differs, the phase is wrong regardless of how the banner reads.
