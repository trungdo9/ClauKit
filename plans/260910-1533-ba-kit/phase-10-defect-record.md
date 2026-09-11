# Phase 10 — Defect record + registry/docs

**Depends on:** 01–09 (it documents the finished tree; counts are recounted from disk).
**D-12 removed the pointer-only constraint** — `ba` is in the package, so the registry gets **real rows**: 8 skills, 5 commands, the `/ck:plan` ↔ `/ba:plan` cross-pool entry, and the four cut items recorded in § 4f as decisions.

**Interfaces**
- Consumes: phases 01–02 (the shipped behaviour it describes).
- Produces: edits to `docs/clauKit-registry.md`, `docs/system-architecture.md`, `docs/codebase-summary.md`, `docs/project-roadmap.md`, and a new `docs/known-defects.md`. **No new code.**

---

## Task 10.1 — CREATE `docs/known-defects.md`

ClauKit debt this plan measured and deliberately did not take on. **None of it blocks the BA kit** — D-12 made the kit public and in-package, so MIT covers it automatically.

Four entries, each: what is wrong · evidence · blast radius · why it is not fixed here.

1. **No `LICENSE` file exists.** `package.json` declares `"license": "MIT"` and its `files` array promises `"LICENSE"`, and no such file is on disk, tracked, or ignored (`git ls-files`, `git check-ignore`). **The MIT grant currently lives only in a JSON field.** The five `LICENSE.txt` under `skills/` are vendored third-party, not the project's own. **MIT covers `ba` automatically** (D-12), so this is not a BA-kit blocker — it is a ClauKit defect that predates this plan. **State facts; state no legal conclusion.**
2. **The package name cannot be published.** `npm view @trungdo9/ClauKit` → `E404 … name can no longer contain capital letters`. `@trungdo9/claukit` returns a plain 404 — the name is free. Distribution today is git-URL install, which requires the repo to stay public (verified: `visibility: public`, unauthenticated 200). **Blast radius:** `README.md` install lines (×2) · `bin/lib/cli-parser.js:64,94` · `.claude/metadata.json` · `bin/lib/github-client.js:47,69` (`ClauKit-CLI` User-Agent) · `package.json` · docs naming the package. **And a direct collision:** `plans/260825-1134-kitforge-display-rename/phase-05-verify-and-manual-steps.md:52` asserts `p.name === "@trungdo9/ClauKit"` as a frozen-literal gate, so a rename **fails that plan's own verification step**. That freeze is the thing to revisit first. **Noted, not planned.**
3. **`npm test` runs zero tests on Node ≥ 24.** The script is `node --test tests/`; Node v24.14.1 resolves the trailing-slash directory as a module entry point (`Cannot find module '…/tests'`). CI reports one failure that reads like a test failure and is actually **complete absence of coverage**. One-line fix (`node --test "tests/*.test.js"`), its own change. **Do not fix here** — every gate in this plan already uses the working form.
4. **`tests/protected-branch-guard.test.js:196` fails on a clean tree** — *"spawned in a real repository, the exit codes are the gate"*, `actual: 0, expected: 2`. Pre-existing, unrelated, and the reason every gate in this plan states `fail 1` as the expected baseline rather than `fail 0`. **Do not chase.**

## Task 10.1b — Record R17 as a pre-existing ClauKit defect (not this kit's work)

`path.join` does not contain, and `resolveSourcePath` joins every manifest path against `PACKAGE_ROOT`. Measured:

| input | `path.join(root, input)` |
|---|---|
| `/tmp/x` | `<root>/tmp/x` — an absolute path is silently **rebased** |
| `../out` | escapes the root; how far depends on root depth |
| `.claude/` + 6× `../` + `etc/passwd` | `/etc/passwd` from a 5-deep root — **the attacker compensates; depth is a cost, not a defence** |

Reachable only via `ck init --kit <custom.json>` — an external manifest a user did not write. **Nobody ships one today**, which is why D-12 dropped the fix from this plan: it is a real bug with no current exposure, and fixing it is its own change. Record the measurement so whoever takes it does not re-derive it, **and note the fix shape that was already worked out**: a module-level `SOURCE_ROOT` + `setSourceRoot()` (never a threaded parameter — `resolveSourcePath` is a bare `(rel)=>abs` callback at 7 internal sites across 3 modules, and `checkKitPathsAvailable` calls it with nothing to thread), plus a second `resolvePackagePath` so the maintenance passes stay pinned to `PACKAGE_ROOT`.

## Task 10.2 — EDIT `docs/clauKit-registry.md`

**A pointer, not an inventory.** Three edits:

1. **Header `**Last Updated**`** — a dated entry in the existing dense-prose style: the **`ba` kit** (3rd kit, `/ba:` namespace, 5 commands, 8 skills, traceability spine, PRD→SRS→tickets chain), the four kit loops derived rather than hardcoded, `SHIPPED_NODE_DIRS` + the scripts exemption derived, the generic `plans/**/*.derived.json` rule. **Recount every number from disk** — the header records four figures previously carried forward and later corrected.
2. **`## 1 · Skills`** — new `### BA (8) — `.claude/skills/ba/`` subsection, all ✅, all KitForge-authored. Note that `README.md` and `capability-map.md` are **not** skills (no `SKILL.md`) and are not counted. Skill groups **4 → 5**.
3. **`## 3 · Commands`** — new `### `ba` (dispatcher, 5 of 8) 🔁 BA kit` subsection: `/ba:plan` `/ba:prd` `/ba:spec` `/ba:diagram` `/ba:qc`. One line: the other 3 dispatchers are planned for waves 2–4 and are **not on disk**; the 55 capability names live in `.claude/skills/ba/capability-map.md`, never as command files.
4. **`## 4 · Duplicate / Overlap Detection`** — § 4b gains `/ck:plan` (technical implementation plan) vs `/ba:plan` (BA project context hub): same verb, disjoint objects, different namespaces, **intentional**. § 4f records the four items cut *because they already exist*: `/delegate`→`/ck:team`, `/brainstorm`→`/ck:brainstorm`, `/ask`→`/ck:ask`, `/prototype-next`→`/ck:cook`. **That is how the "0 new duplicate entries" metric is met — by deciding in writing, not by silence.**
5. **`## 7 · Open Issues`** — one line pointing at `docs/known-defects.md`.
6. **`## 9b · Scripts`** — a `.claude/scripts/ba/` block (3 files, purpose, exit-code contract) and the note that `traceability.derived.json` is derived and git-ignored while `deliverables/` is committed.

## Task 10.3 — EDIT `docs/system-architecture.md`

- Line 9: `…three installable kits (`engineer`, `marketing`, `both`)` → **four** (`engineer`, `marketing`, `both`, `ba`).
- Command table: add a `BA kit (5 of 8 planned, `/ba:` namespace)` row — `/ba:plan`, `/ba:prd`, `/ba:spec`, `/ba:diagram`, `/ba:qc`. Recount the command-file total.
- Skill groups line: recount, **5 groups**, add a `**`ba/`** (8)` bullet.
- One line on the BA→dev seam: `/ba:spec compose` output is a first-class `/ck:tickets` source, so the two kits compose in one project — and that composition, not a new integration, is why `requires.shared` stays at three files.

## Task 10.4 — EDIT `docs/codebase-summary.md`

- Line 25 kit-manifest comment: `engineer/marketing/both` → **`engineer/marketing/both/ba`**.
- Add `.claude/scripts/ba/` to the tree diagram beside `.claude/scripts/ck/`, and `tests/lib/kits.js` + `tests/ba-spine.test.js` to the test-harness listing.
- Line 249's workflow count is **already stale** (reads 15 against 18 on disk). Recount with `ls .claude/workflows | wc -l` and fix it while here — do not add a fourth wrong number beside three existing ones.

## Task 10.5 — EDIT `docs/project-roadmap.md`

One milestone: **BA kit wave 0 shipped** — the PRD→SRS→spine→tickets chain, 5 of 8 dispatchers, traceability spine. Waves 2–4 with the § 9 estimates (W2 `reverse` + `qc drift|cr`, **hard stop for real-project validation**; W3 `api`; W4 `export`).

Plus the four items from `docs/known-defects.md` as roadmap entries — missing `LICENSE`, the npm rename and its `260825-1134/phase-05:52` freeze collision, the `npm test` script, and R17's containment fix. **None blocks the BA kit**; they are ClauKit debt this plan measured and deliberately did not take on.

---

## Exit gate

**Exit gate:** `find skills -name SKILL.md | wc -l` equals the registry's `**Counts**` skills figure, and `ls -d skills/*/ | wc -l` → `5`. Detail in Gate 1–3 below.

### Gate 1 — the defect record is complete and evidence-bearing

```bash
cd <repo>
test -f docs/known-defects.md && grep -c '^## ' docs/known-defects.md
grep -cE 'package\.json|npm view|260825-1134|protected-branch-guard\.test\.js:196' docs/known-defects.md
grep -ci 'legal\|counsel' docs/known-defects.md
```
→ **5** sections (4 defects + R17); evidence citations **≥ 4**; **≥ 1** hit for the sentence stating the licensing entry draws no legal conclusion; and the R17 section carries the measured `path.join` table (**≥ 3** rows).

### Gate 2 — `ba` is documented as a real kit, and the map stays single-source

```bash
grep -c '/ba:' docs/clauKit-registry.md docs/system-architecture.md README.md CLAUDE.md
grep -c '^| *[0-9]* *|' README.md docs/system-architecture.md
grep -c 'ck:team\|ck:brainstorm\|ck:ask\|ck:cook' docs/clauKit-registry.md
node -e "console.log(require('./.claude/kits/ba.json').name)"
```
→ every doc names `/ba:` (**≥ 1** each) · **neither README nor system-architecture has grown a numbered capability table** (the 55 rows stay single-source in `.claude/skills/ba/capability-map.md`) · the four cut items appear in § 4f (**≥ 4**) · `ba`.

### Gate 3 — the counts still match the disk, and nothing shipped changed

```bash
echo "skills:   $(find skills -name SKILL.md | wc -l)"
echo "workflows:$(ls .claude/workflows | wc -l)  vs codebase-summary: $(grep -oE 'Workflow files: [0-9]+' docs/codebase-summary.md | grep -oE '[0-9]+')"
echo "kits:     $(ls .claude/kits/*.json | wc -l)"
node --test tests/installer-packaging.test.js 2>&1 | grep -E '^ℹ (pass|fail)'
```
→ the two workflow numbers are **equal**; **`kits: 4`**; `ℹ fail 0`.
