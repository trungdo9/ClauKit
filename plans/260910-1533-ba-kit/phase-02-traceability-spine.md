# Phase 02 — Traceability spine: per-entity files + derived index


**Depends on:** 01 (the trees exist). **Blocks:** 05–08.
**Why it is wave 0:** risk R4 🔴 — IDs added after wave 3 means rewriting every generator.
**Revised for D-6:** source of truth is **one file per entity**, not a monolithic index. The index is derived, regenerable and git-ignored. This buys multi-BA support later with **zero format migration and zero locking now** — the D-6 rationale, adopted verbatim. Precedent: `to-tickets` (*"one file per ticket, never one combined file"*).

**Interfaces**
- Consumes: nothing.
- Produces:
  - `.claude/scripts/ba/lib/spine-parse.cjs` — exports
    `parseEntity(absPath: string, projectDir: string) => { node: Node|null, errors: ParseError[] }`
    `DOC_ID: RegExp` · `ITEM_ID: RegExp` · `KIND_ORDER: string[]` · `DOC_KINDS: Set<string>` · `PARENT_KINDS: Record<string,string[]>` — **9 kinds** (D-10), not 16
  - `.claude/scripts/ba/lib/spine-index.cjs` — exports
    `buildIndex(projectDir: string) => { index: Index, errors: ParseError[] }`
    `writeIndex(projectDir: string, index: Index) => string`  (absolute path written)
    `findGaps(index: Index) => { orphans: Orphan[], unsourced: string[] }`
    `validate(index: Index, errors: ParseError[]) => Violation[]`
  - `.claude/scripts/ba/traceability.cjs` — CLI; `module.exports = { main, ...require('./lib/spine-index.cjs') }`
  - `.claude/skills/ba/traceability/SKILL.md` + `references/id-scheme.md` + `references/entity-template.md`
- Types (**exact** — phase 05's test and every wave 1+ generator reuse these verbatim):
  ```
  Node       = { id: string, kind: string, title: string, file: string,
                 doc: string|null, parents: string[],
                 source: string|null, confidence: 'high'|'med'|'low'|null,
                 out_of_scope: string|null, touches: string|null }
  Orphan     = { id: string, reason: 'unparented'|'dangling', detail: string }
  ParseError = { file: string, check: string, msg: string }
  Violation  = { id: string|null, file: string, check: string, msg: string }
  Index      = { version: 1, project: string, generated: string, generator: string,
                 nodes: Node[], edges: {from:string,to:string}[],
                 orphans: Orphan[], unsourced: string[] }
  ```
  `ParseError`/`Violation` carry no `line`: an entity file has one frontmatter block, so the file **is** the location. (This is a simplification the per-entity model buys — the previous heading-scan design needed line numbers.)

---

## Task 2.1 — CREATE `skills/ba/traceability/SKILL.md`

Frontmatter (`name`, `description`, `license: MIT`) matching `skills/software/planning/SKILL.md`'s shape. Body ≤ 150 lines, and it must be **the contract, not a tutorial**:

- **What the spine is** — a stable id per requirement plus a machine-readable parent graph. Names the five wave-2 views it makes possible (`gap`, `doc-drift`, `cr`, `dashboard`, `kg`) so nobody rebuilds them as independent features (defect D1).
- **The storage decision, and why** — one file per entity under `plans/ba/<project>/entities/`; the index is derived. State the reason in one sentence (*per-entity files git-merge cleanly; a monolithic index is the hottest write target and would need a migration the moment a second BA appears*) so a later reader cannot "simplify" it back into one file. Cite `to-tickets` as the in-house precedent, and state the deliberate divergence: ticket files use a `# NN: title` body because humans and `cook` read them; entity files use YAML frontmatter because a script indexes them.
- **D-4 is binding on the composed deliverable, not on storage** — the wave-1 composer renders an entity into D-4's exact block (`## FR-012 — …`, `**Actor:** … **Precondition:** …`, `**source:** … **confidence:** …`, Given/When/Then). All four D-4 fields survive verbatim in what a client signs. Say this explicitly; it is the question a reader of D-4 will ask first.
- **The contract**, as "if you generate a BA entity, you MUST": the 8 frontmatter keys (from `references/id-scheme.md`), the filename rule (`<id>.md`), and the body shape (from `references/entity-template.md`).
- **The three helper subcommands** with the exit-code table (`0` clean / `1` findings / `2` usage).
- **The index is git-ignored and regenerable** — never hand-edit `traceability.derived.json`; edit the entity file and re-run `index`.
- **Anti-patterns (auto-reject):** an entity with no `source:` and no `[UNVERIFIED]` · a filename that disagrees with its `id` · an `AC` whose numeric prefix differs from its parent's · an item kind with no `doc:` · a document kind that carries a `doc:` · a hand-edited `traceability.derived.json` · more than one entity per file.

Links counted from `.claude/skills/ba/traceability/`: `references/id-scheme.md` (sibling), `../../../workflows/business-analysis-rules.md`, `../../../commands/ba/plan.md`.

## Task 2.2 — CREATE `skills/ba/traceability/references/id-scheme.md`

Copy **verbatim** from `plan.md` § Global Constraints: the **2** document kinds table, the **7** item kinds table, `DOC_ID`, `ITEM_ID`, `KIND_ORDER`, the AC-prefix rule, the per-kind-per-project numbering rule, and the ten-key frontmatter table (8 required + 2 conditional: `out_of_scope`, `touches`). Single source — `spine-parse.cjs` must not restate the regexes in prose anywhere else.

## Task 2.3 — CREATE `skills/ba/traceability/references/entity-template.md`

The binding entity file from `plan.md` § Spine model, verbatim, plus one worked example **per kind — all nine** (`PRD`, `SRS`, `EPIC`, `FR`, `NFR`, `UC`, `US`, `AC`, `TC`); wave 0 generates every one of them, so none is speculative — Vietnamese bodies, English keywords (D-4), each ≤ 14 lines. Plus a **"how this renders"** section showing the same `FR-012` entity composed into D-4's block, so the storage↔deliverable mapping is visible in one place.

## Task 2.4 — CREATE `.claude/scripts/ba/lib/spine-parse.cjs`

No I/O beyond `fs.readFileSync`. Target ≤ 140 lines.

- `readFrontmatter(text)` — the block between the file's first `---` line and the next `---`. **Hand-rolled, no YAML dependency.** The contract is 9 scalar keys plus one inline array (`parents: [EPIC-001]`); adding `js-yaml` to a zero-dependency package for that is not justified. Reject a file whose first non-blank line is not `---` (`missing-frontmatter`).
- `parseEntity(absPath, projectDir)` — returns `{ node, errors }`. `node.file = path.relative(projectDir, absPath)` with `/` separators, always. `node` is `null` when the file has no usable `id`.
- Checks emitted here as `ParseError` (never thrown), each with a stable `check` slug:
  `missing-frontmatter` · `missing-key` (per absent required key) · `missing-out-of-scope` (an `EPIC` without `out_of_scope` — required, because it is `/ck:cook` Stage-0 item 3 and a field nobody validates is a field nobody fills) · `out-of-scope-on-wrong-kind` (present on anything but `EPIC`/`FR`) · `bad-touches` (`touches` on a kind other than `FR`/`US`) · `bad-id` (matches neither regex) · `filename-id-mismatch` (`basename(file, '.md') !== id`) · `kind-id-mismatch` (the `kind` disagrees with the id prefix) · `unknown-kind` · `bad-confidence` · `bad-project` (≠ `basename(projectDir)`) · `doc-on-document-kind` (a doc kind carrying `doc:`) · `doc-missing` (an item kind without `doc:`) · `empty-title`.
- Exports: `parseEntity`, `DOC_ID`, `ITEM_ID`, `KIND_ORDER`, `DOC_KINDS`, `PARENT_KINDS`.

## Task 2.5 — CREATE `.claude/scripts/ba/lib/spine-index.cjs`

Target ≤ 150 lines.

- `buildIndex(projectDir)` — read `<projectDir>/entities/*.md` (non-recursive; a nested dir is a `nested-entity-dir` violation, because a flat dir is what makes the id greppable by path). **`deliverables/` is outside this scan by construction** — that is what stops `deliverables/SRS-001.md` (the committed artifact, phase 06) being mistaken for `entities/SRS-001.md` (the document entity), which shares its basename. `parseEntity` each. Copy `out_of_scope` and `touches` onto the node from frontmatter (`null` when absent) — phase 05 Gate 1 reads `node.out_of_scope` off the index (ruling R1, verify-plan 2026-09-11). `project = path.basename(projectDir)`, `generator = "ba-traceability/1.0.0"`. `duplicate-id` when two files claim one id. Sort `nodes` by `[KIND_ORDER.indexOf(kind), Number(id.match(/\d+/)[0]), id]`; sort `edges` by `[from, to]`.
- `findGaps(index)` — two orphan classes plus one finding list:
  - `unparented` — `parents.length === 0` **and** `kind !== 'PRD'`; `detail = "no parents declared"`.
  - `dangling` — a parent id absent from the node set; `` detail = `parent ${p} is not in the index` ``.
  - `unsourced` — `source === null` **or** `source === '[UNVERIFIED]'` → `index.unsourced`. A **finding**, not an orphan; `gap` reports both, in separate lists.
  De-duplicate orphans by `id + reason`. A node with two dangling parents yields one `dangling` entry naming both.
- `validate(index, errors)` — the parse `errors`, plus: `parent-kind-not-allowed` (parent's kind ∉ `PARENT_KINDS[child.kind]`) · `ac-prefix-mismatch` · `dangling-doc` (`doc:` names an id not in the index) · `doc-not-a-document-kind` (`doc:` names a node whose kind ∉ `DOC_KINDS`) · `cycle` (DFS over `edges`, each cycle reported once by its lexicographically smallest member).
- `writeIndex(projectDir, index)` — `JSON.stringify(index, null, 2) + '\n'` to `<projectDir>/traceability.derived.json`; returns the path. **The `.derived.json` suffix is load-bearing** (D-9): ClauKit's generic `plans/**/*.derived.json` rule in `PLAN_RULES` is what keeps this file out of git, and the kit declares nothing. Renaming it re-commits every consumer's index.

## Task 2.6 — CREATE `.claude/scripts/ba/traceability.cjs`

Executable, `#!/usr/bin/env node`, ≤ 100 lines. Header comment states *why a script and not a prompt*, in `plan-lint.cjs`'s idiom: a model-generated index does not round-trip byte-stably and cannot be gated by exit code.

- Args `<action> <project-dir> [--json]`; actions `index` · `gap` · `validate`. Unknown/absent action, or a `project-dir` that does not exist ⇒ usage to stderr, **exit 2**. A project dir with no `entities/` subdir ⇒ exit 2 with a message naming the expected layout (this is the most likely first-run mistake).
- `index` — build, write, print `✓ indexed <N> node(s), <E> edge(s), <O> orphan(s) → traceability.derived.json`. **Exit 0 always** — indexing is not a verdict.
- `gap` — build in memory (does not write), print the orphan table `<id>  <reason>  <detail>` then the unsourced list. **Exit 1 if `orphans.length || unsourced.length`, else 0.** Clean run prints `✓ no gaps — <N> node(s) reachable`.
- `validate` — print `[<check>] <file> — <msg>` per violation. **Exit 1 if any, else 0.**
- `--json` — emit only JSON to stdout: the `Index` for `index`, `{orphans, unsourced}` for `gap`, `Violation[]` for `validate`. Exit codes unchanged. This is the machine surface wave 2's `/ba:qc` consumes.
- Inline the 3-line `die(msg, code)`. **Do not `require('../ck/lib/common.cjs')`** — `ba` does not ship `.claude/scripts/ck/`, so that require resolves in this repo and crashes in every `ba` install.
- CommonJS, `.cjs` extension (`tests/esm-host.test.js`; the dir joins its scope in phase 09).

---

## Task 2.7 — CREATE `tests/ba-spine.test.js` — **inside ClauKit's own suite** (§ 8's round-trip metric)

**Lives in ClauKit's `tests/`** (D-12 — the original design; the private-tree detour is gone). The spine needs no install to exercise: plain CommonJS over `node:` builtins, `require('../.claude/scripts/ba/lib/spine-index.cjs')`.

`node:test` + `node:assert`; `before`/`after` create and remove an `os.tmpdir()` workspace. **Fixtures are written by the test into a temp dir**, never into a `plans/` tree.

Fixture builder `synth(dir, { clean = false })` writes **13 entity files** into `<dir>/entities/`:

| file | `kind` | `doc` | `parents` | note |
|---|---|---|---|---|
| `PRD-001.md` | PRD | — | `[]` | root |
| `EPIC-001.md` | EPIC | — | `[PRD-001]` | |
| `SRS-001.md` | SRS | — | `[PRD-001]` | |
| `FR-001.md`…`FR-008.md` | FR | `SRS-001` | `[EPIC-001]` | sourced, `confidence: high` |
| `FR-009.md` | FR | `SRS-001` | `[]` | **planted `unparented`** (`clean` ⇒ `[EPIC-001]`) |
| `FR-010.md` | FR | `SRS-001` | `[EPIC-999]` | **planted `dangling`** (`clean` ⇒ `[EPIC-001]`) |

Eight tests:

1. `'the index round-trips 13 nodes and 11 edges'` — `nodes.length === 13`, `edges.length === 11`, `version === 1`, `project === 'acme'`. Edge arithmetic in a comment (`EPIC-001→PRD-001`, `SRS-001→PRD-001`, `FR-001..FR-008→EPIC-001`).
2. `'gap finds exactly the two planted orphans and nothing else'` — **the § 8 metric.** `deepStrictEqual(orphans.map(o=>o.id).sort(), ['FR-009','FR-010'])` · reasons `['dangling','unparented']` · `deepStrictEqual(unsourced, [], 'zero false positives')`.
3. `'a clean project reports no gaps'` — **negative control.** Without it, test 2 also passes for a `findGaps` that flags everything.
4. `'indexing is deterministic apart from the timestamp'` — build twice, delete `generated`, `deepStrictEqual`.
5. `'the CLI exit codes are the contract'` — `spawnSync`: `index` → 0 · `gap` planted → 1 · `gap` clean → 0 · `validate` with violations → 1 · unknown action → 2 · nonexistent dir → 2 · **a dir with no `entities/` → 2**.
6. `'the filename is part of the contract'` — copy `FR-001.md` to `FR-099.md`; assert `filename-id-mismatch` **and** `duplicate-id`; clean fixture yields `[]`.
7. `'an AC whose prefix disagrees with its parent is a violation'` — add `US-003` + `AC-007.1` with `parents: [US-003]`; assert `ac-prefix-mismatch`; clean fixture yields `[]`.
8. `'the derived index is ignored in a consumer project, entity files are not'` — `git init` a temp project, write ClauKit's `PLAN_RULES` into its `.gitignore`, then `git check-ignore`: `traceability.derived.json` **ignored** (by the generic `plans/**/*.derived.json`), `entities/FR-001.md` **not**. Two properties in one: the D-6 property that makes multi-BA work later without a format migration, and the D-9 coupling — the kit declares no ignore rule, so the filename **is** the contract.

## Task 2.8 — Add the R6 grep guard to the same file

A ninth test:

```
test('no shipped ba doc tells the reader to activate a grouped skill', …)
```
Walk `.claude/skills/ba/**`, `.claude/commands/ba/**`, `.claude/workflows/business-analysis-rules.md`; `assert.deepStrictEqual(hits, [])` for `/[Aa]ctivate the `[a-z-]+` skill/`. Skills at `.claude/skills/<group>/<name>/` are not registered (measured, ClauKit's `CLAUDE.md`); prose that says otherwise burns a failed tool call in every session that believes it.

## Task 2.9 — The derived index is git-ignored (D-9, landing here now)

`traceability.derived.json` is a cache — byte-derivable from the entity tree, regenerated on demand, the hottest merge target in the kit. The **composed deliverables are committed** (D-11, phase 06 task 6.5); only the index is ignored.

**Edit 1** — `bin/lib/gitignore-wire.js`, `PLAN_RULES`:
```js
const PLAN_RULES = [
  "plans/**/reports/review-package-*.md",
  "plans/**/reports/*-brief-*.md",
  "plans/**/*.derived.json",
];
```
**Edit 2** — the identical line in this repo's own root `.gitignore`. **Both or neither:** `installer-packaging.test.js` § *"the plan-artifact rules stay in sync with ClauKit's own root .gitignore"* asserts every entry is declared in both and fails on one alone.

One **generic** rule, not `plans/ba/**/traceability.json`: it serves any kit with zero per-kit work, matches the two pattern rules already beside it, and `.derived.json` documents itself where a `.gitignore` line elsewhere does not. **JSON-only is deliberate — do NOT widen to `plans/**/*.derived.*`**: that would silently ignore `deliverables/SRS-001.md`, the artifact a client signs.

`wireGitignore(projectRoot)` keeps its signature, and the installer wires it — so **D-10's "wave 0 has no installer, print a line by hand" workaround is gone** (R19 superseded by D-12).

---

## Exit gate

**Exit gate:** `node .claude/scripts/ba/traceability.cjs gap $D/acme --json; echo $?` → `{"orphans":[{"id":"FR-009","reason":"unparented"…},{"id":"FR-010","reason":"dangling"…}],"unsourced":[]}` then `1`. Detail in Gate 1–7 below.

### Gate 1 — round-trip on a scratch fixture (§ 8's metric, at its source)

```bash
D=$(mktemp -d) && mkdir -p "$D/acme/entities"
# 13 entity files: PRD-001.md, EPIC-001.md, SRS-001.md, FR-001.md … FR-010.md
#   FR-001..FR-008  parents: [EPIC-001]   doc: SRS-001   sourced, confidence: high
#   FR-009          parents: []           ← planted `unparented`
#   FR-010          parents: [EPIC-999]   ← planted `dangling`
node .claude/scripts/ba/traceability.cjs index "$D/acme"
node .claude/scripts/ba/traceability.cjs gap   "$D/acme" --json; echo "gap exit=$?"
```
→ `index` prints `✓ indexed 13 node(s), 11 edge(s), 2 orphan(s) → traceability.derived.json`, exits **0**.
→ `gap --json` emits **exactly two** orphans — `FR-009`/`unparented` and `FR-010`/`dangling` — with `"unsourced":[]`, and `gap exit=1`.

Edge arithmetic, restated so the number is re-derivable: `EPIC-001→PRD-001`, `SRS-001→PRD-001`, and `FR-001..FR-008 → EPIC-001` (8) = **11**. `FR-009` declares none; `FR-010`'s parent is absent so no edge is emitted. Put this comment in the fixture — a gate whose expected value nobody can re-derive is not a gate.

### Gate 2 — negative control (the gate that makes Gate 1 mean something)

```bash
sed -i 's/^parents: \[\]/parents: [EPIC-001]/' "$D/acme/entities/FR-009.md"
sed -i 's/EPIC-999/EPIC-001/'                  "$D/acme/entities/FR-010.md"
node .claude/scripts/ba/traceability.cjs gap "$D/acme"; echo "exit=$?"
```
→ `✓ no gaps — 13 node(s) reachable`, `exit=0`. Without this, Gate 1 also passes for a `findGaps` that flags everything.

### Gate 3 — determinism

```bash
node .claude/scripts/ba/traceability.cjs index "$D/acme" --json > /tmp/a.json
node .claude/scripts/ba/traceability.cjs index "$D/acme" --json > /tmp/b.json
node -e 'const f=p=>{const o=JSON.parse(require("fs").readFileSync(p));delete o.generated;return JSON.stringify(o)};
         console.log(f("/tmp/a.json")===f("/tmp/b.json")?"DETERMINISTIC":"DRIFT")'
```
→ prints `DETERMINISTIC`.

### Gate 4 — validate catches the per-entity checks

```bash
cp "$D/acme/entities/FR-001.md" "$D/acme/entities/FR-099.md"        # filename-id-mismatch + duplicate-id
printf -- '---\nid: AC-007.1\nkind: AC\nproject: acme\ntitle: t\ndoc: SRS-001\nparents: [US-003]\nsource: "[UNVERIFIED]"\nconfidence: low\n---\n' > "$D/acme/entities/AC-007.1.md"
node .claude/scripts/ba/traceability.cjs validate "$D/acme"; echo "exit=$?"
```
→ output contains `[filename-id-mismatch]`, `[duplicate-id]` and `[ac-prefix-mismatch]`; `exit=1`.

### Gate 5 — the spine suite, inside ClauKit's harness

```bash
cd <repo> && npm test 2>&1 | grep -E '^ℹ (tests|pass|fail)'
```
→ `ℹ tests 9` · `ℹ pass 9` · `ℹ fail 0`. (Phase 04 task 4.4 established the harness; this is its first real content.)

### Gate 6 — the ignore rule lands in both files and spares the deliverable

```bash
grep -c 'plans/\*\*/\*\.derived\.json' <repo>/.gitignore <repo>/bin/lib/gitignore-wire.js
P=$(mktemp -d) && (cd "$P" && git init -q . && node <repo>/bin/ck.js init --kit ba >/dev/null 2>&1)
mkdir -p "$P/plans/ba/demo/entities" "$P/plans/ba/demo/deliverables" "$P/plans/x/reports"
: > "$P/plans/ba/demo/traceability.derived.json"; : > "$P/plans/ba/demo/entities/FR-001.md"
: > "$P/plans/ba/demo/deliverables/SRS-001.md";   : > "$P/plans/x/reports/code-review.md"
(cd "$P" && for f in plans/ba/demo/traceability.derived.json plans/ba/demo/entities/FR-001.md \
                     plans/ba/demo/deliverables/SRS-001.md plans/x/reports/code-review.md; do
   git check-ignore -q "$f" && echo "IGNORED $f" || echo "TRACKED $f"; done)
```
→ both `grep -c` print `1` · `IGNORED …traceability.derived.json` · **`TRACKED …entities/FR-001.md`** (source of truth) · **`TRACKED …deliverables/SRS-001.md`** (the signed artifact — a wider glob would have swallowed it) · **`TRACKED …reports/code-review.md`** (the existing "an ignored report is a 404 in a PR body" invariant, re-asserted because this task touched the list).

### Gate 7 — file sizes (development-rules)

```bash
wc -l .claude/scripts/ba/traceability.cjs .claude/scripts/ba/lib/*.cjs
```
→ every file **< 200**.
