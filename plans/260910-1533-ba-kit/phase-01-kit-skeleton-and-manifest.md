# Phase 01 — Kit skeleton + `.claude/kits/ba.json`

**Depends on:** nothing. **Blocks:** every other phase (they write into the tree this declares).
**D-12 collapsed three phases into this one.** `ba` is a third **in-package** kit in the same shape as `marketing`, so the private-tree scaffolding (`LICENSE`, `.gitignore`, `package.json`, "no `.claude/skills` symlink") and the separate manifest+install phase are all gone. `ck init --kit ba` works with **zero CLI change** — `CLAUDE.md`'s *"adding a kit = drop a JSON file, no CLI changes"* is true again.

**Interfaces**
- Consumes: `bin/lib/kit-resolver.js` — reads **only** `name`, `version`, `description`, `paths.*` (arrays) and `requires.*`. `namespace` is for humans; **`extends` is inert** (`getKitPaths` reads only `paths` and `requires` — verified), which is why no combination manifest is planned.
- Produces:
  - `.claude/kits/ba.json`
  - the empty directories later phases fill: `skills/ba/` (repo) → `.claude/skills/ba/` (installed), `.claude/commands/ba/`, `.claude/scripts/ba/`
- **Authoring rule returns:** author skills under **`skills/ba/`** in the repo. `.claude/skills` is a symlink to `./skills` here; `resolveSourcePath` de-symlinks on a published tarball. The manifest still declares the `.claude/`-prefixed path.

---

## Task 1.1 — CREATE `.claude/kits/ba.json`

```json
{
  "name": "ba",
  "description": "BA Kit — business analysis, /ba: namespace. PRD → SRS → spine → tickets. 5 commands, 8 skills.",
  "namespace": "ba",
  "version": "0.1.0",
  "paths": {
    "commands":  [".claude/commands/ba/"],
    "skills":    [".claude/skills/ba/"],
    "scripts":   [".claude/scripts/ba/"],
    "workflows": [".claude/workflows/business-analysis-rules.md"],
    "hooks":     [".claude/hooks/"],
    "statusline":[".claude/statusline.cjs", ".claude/statusline.sh", ".claude/statusline.ps1"],
    "config":    [".claude/settings.json", ".claude/mcp.json", ".claude/.env.example", ".claude/.mcp.json.example"]
  },
  "requires": {
    "shared": [
      ".claude/skills/software/scenario/SKILL.md",
      ".claude/workflows/primary-workflow.md",
      ".claude/workflows/development-rules.md"
    ]
  }
}
```

### `requires.shared` — three entries, not six. This is a correction to the directive.

D-12 proposed six, adding `to-tickets/SKILL.md`, `agents/engineering/ticket-slicer.md` and `commands/ck/tickets.md` so a `ba`-only install could reach the ticket handoff. **Those three cannot ship**, and the reason is mechanical, not stylistic — measured on disk:

| candidate | markdown links it carries |
|---|---|
| `commands/ck/tickets.md` | `../../agents/engineering/ticket-slicer.md` · `cook.md` · `git.md` · `plan.md` · `refactor.md` · `scout.md` · `../../skills/software/planning/SKILL.md` · `../../skills/software/to-tickets/SKILL.md` |
| `skills/software/to-tickets/SKILL.md` | `ticket-slicer.md` · `cook.md` · `plan.md` · `scout.md` · `tickets.md` |
| `skills/software/scenario/SKILL.md` | **none** — and no backticked `.claude/` path either |

`installer-packaging.test.js` § *"no shipped doc links to a file the install does not have"* installs each kit and resolves **every** relative `.md` target. Shipping `tickets.md` therefore drags in `cook.md`, `plan.md`, `scout.md`, `refactor.md`, `git.md` — each with its own links — and the transitive closure is most of the engineer kit. **That is not a `requires.shared`; it is a dependency on `engineer`.**

The precedent agrees: `marketing.json`'s `requires.shared` lists five files that its own prose **names** — `planner.md`, `planning/SKILL.md`, `html-output.md`, and two workflows. **No `commands/ck/*` anywhere.** `requires.shared` covers files named by prose, not command surfaces.

So:

- **`scenario/SKILL.md`** — ships. Verified link-clean, and it is a genuine read-time dependency: `/ba:spec tc` reads its § Design Process and § Scenario Template instead of re-authoring test methodology (phase 06).
- **`primary-workflow.md` + `development-rules.md`** — ship, for marketing's exact reason: `ba` declares `hooks/`, and `.claude/hooks/README.md` backticks `.claude/workflows/development-rules.md`.
- **The `/ck:tickets` handoff is a documented prerequisite, not a manifest entry.** The rules file and README name `/ck:tickets` as a **bare slash string** — never a markdown link, never a backticked path — and state: *the BA→dev handoff needs the `engineer` kit installed in the same project (`ck init --kit engineer`, or `--kit both`).* `ck init` unions kits onto one project by file (`ck.js:66-78`), so the two-kit project is the normal case and costs nothing.

## Task 1.2 — Create the three empty trees

`skills/ba/`, `.claude/commands/ba/`, `.claude/scripts/ba/`. Nothing else. **A manifest path that does not exist aborts `ck init` for every user** (`bin/ck.js:49`, `checkKitPathsAvailable`), so the manifest cannot ship before phases 02–08 fill these — see the gate ordering below.

**Do not declare `.claude/agents/ba/`** — wave 0 ships no agent.

## Task 1.3 — Two things this phase deliberately does **not** do

1. **No CLI change, no installer change, no test-loop change here.** `printKitList()` globs `.claude/kits/*.json`, so `ck --kit list` picks `ba` up by existing. `bin/lib/cli-parser.js`'s help string lists `engineer|marketing|both|<custom.json>`; adding `ba` is a one-line courtesy edit, and it belongs with the other doc work in phase 10, not here.
2. **No `both.json` rename, no combination manifest.** A BA installs `ba`, a dev installs `engineer`, in the same project, and `ck init` unions them. A combo would be `all.json` re-listing every path (since `extends` is inert) — a separate decision nobody has asked for.

---

## Exit gate

**Exit gate:** `node bin/ck.js init --kit list | grep -c '^  ba '` → `1`, and `node bin/ck.js init --kit ba` in a scratch dir → `exit=0`. **Run the second only after phases 02–08 have filled the trees** — before that it correctly reports missing paths. Detail in Gate 1–3 below.

### Gate 1 — the kit is listed, and the manifest is well-formed

```bash
cd <repo>
node bin/ck.js init --kit list
node -e "const m=require('./.claude/kits/ba.json');
  console.log('name='+m.name,'ns='+m.namespace,'v='+m.version);
  console.log('pathKeys='+Object.keys(m.paths).join(','));
  console.log('shared='+m.requires.shared.length);
  console.log('allDotClaude='+Object.values(m.paths).flat().concat(m.requires.shared).every(p=>p.startsWith('.claude/')));"
```
→ header reads `📦 Available kits (4):` with a `ba  v0.1.0  BA Kit — business analysis` row · `name=ba ns=ba v=0.1.0` · `shared=3` · **`allDotClaude=true`** (an install writes nothing outside `.claude/`).

### Gate 2 — `ck init --kit ba` installs clean (**the returned metric**)

```bash
P=$(mktemp -d) && (cd "$P" && git init -q .) && (cd "$P" && node <repo>/bin/ck.js init --kit ba); echo "exit=$?"
ls "$P"/.claude/commands/ba/plan.md "$P"/.claude/skills/ba/README.md \
   "$P"/.claude/scripts/ba/traceability.cjs "$P"/.claude/workflows/business-analysis-rules.md \
   "$P"/.claude/skills/software/scenario/SKILL.md
ls "$P/skills" 2>&1 | grep -q 'No such file' && echo NO-ROOT-SKILLS-OK
grep -c 'Business analysis rules' "$P/CLAUDE.md"
```
→ `exit=0`, `✅ Kit 'ba' installed!` · every `ls` target present, **including the `scenario` skill from `requires.shared`** · `NO-ROOT-SKILLS-OK` · CLAUDE.md label count `1`, reading **"Business analysis rules"** (the `labelFor` fallback on `business-analysis-rules.md`; verified — `ba-rules.md` would have read "Ba rules", which is why the file is named as it is).

### Gate 3 — a two-kit project is the normal case

```bash
P=$(mktemp -d) && (cd "$P" && git init -q .)
(cd "$P" && node <repo>/bin/ck.js init --kit engineer >/dev/null 2>&1); echo "engineer=$?"
(cd "$P" && node <repo>/bin/ck.js init --kit ba       >/dev/null 2>&1); echo "ba=$?"
ls "$P"/.claude/commands/ck/tickets.md "$P"/.claude/commands/ba/plan.md
node -e "const s=require('$P/.claude/settings.json');console.log('hooks='+Object.keys(s.hooks||{}).length)"
(cd "$P" && node <repo>/bin/ck.js init --kit ba 2>&1 | grep -c 'added .* rule')
```
→ both `exit=0` · both command trees present, so `/ba:spec compose → /ck:tickets` works in one project · the settings merge left the hook set intact · the re-run adds `0` rules (idempotent).
