# Phase 09 — Test wiring: derived kit loops, generic exemptions

**Depends on:** 01 for the mechanism; **runs after 08.3** in execution order (D-13). **Blocks:** nothing in track A; track B's phase 08 relies on the mechanism it proves.
**Runs last of the code phases, on purpose.** The four guard loops derive from `.claude/kits/*.json`, so every file the wave-1.5 block ships (08.1–08.3) enters the link check, the shipped-path check and the ESM check **by existing** — but only for files that are on disk when this phase runs. Running it before the block would leave `deliver.md`, the `deliver` skill and two new `.cjs` files unguarded, which is the defect class the literals caused in the first place.
**Still parameterize rather than add a fourth literal.** `ba` *is* in the package now (D-12), so `['engineer','marketing','both','ba']` would work — but deriving the list from `.claude/kits/*.json` costs the same and is strictly better: a fifth kit then enters all four guards **by existing**, which is the defect the literals caused in the first place.

**Interfaces**
- Consumes: `bin/lib/kit-resolver.js` — `listKits()`, `getKitPaths()` · `.claude/kits/ba.json` (phase 01).
- Produces:
  - `tests/lib/kits.js` — `packagedKits(): string[]` (derived from `.claude/kits/*.json`, sorted) · `shipsCkScripts(manifest): boolean`.
  - Edited: `tests/installer-packaging.test.js` · `tests/installer-claude-md.test.js` · `tests/esm-host.test.js`.

---

## Task 9.1 — CREATE `tests/lib/kits.js`

```js
/**
 * The kit list, derived rather than declared.
 *
 * Four loops carried the literal ['engineer','marketing','both'] — packaging:165,
 * :275, :341 and claude-md:179 — so a fourth in-package kit would have been
 * invisible to every guard that exists to catch exactly its class of defect.
 * Deriving from `.claude/kits/*.json` closes that permanently: a new manifest
 * enters all four loops by existing. Out-of-tree kits are covered by
 * external-kit.test.js instead, because by construction they are not here.
 */
function packagedKits() { return listKits().map(k => k.manifest.name).sort(); }
```

`listKits()` already skips a malformed manifest with a warning, so a broken file cannot silently shrink the list to nothing — but assert `packagedKits().length >= 3` in each consuming test so an empty glob fails loudly rather than passing vacuously. **A loop over zero kits passes every assertion in it**; that is the failure mode this task exists to prevent, and it is worth one line per call site.

## Task 9.2 — EDIT the four hardcoded loops

| File:line | Change |
|---|---|
| `installer-packaging.test.js:165` | `for (const name of packagedKits())` |
| `installer-packaging.test.js:275` | `for (const kit of packagedKits())` |
| `installer-packaging.test.js:341` | `for (const kit of packagedKits())` |
| `installer-claude-md.test.js:179` | `for (const kit of packagedKits())` |

Each gains `assert.ok(kits.length >= 3, 'the kit glob returned nothing — the loop would pass vacuously')`.

## Task 9.3 — Derive the two remaining hardcoded lists (R10, R12, generically)

**R10 — the scripts exemption.** Currently `kit === 'marketing'` gates `EXEMPT_SCRIPTS_IN_MARKETING`. The exemption was always about the **absence of `.claude/scripts/ck/`**, never about which kit was absent. Derive it from the manifest:

```js
const shipsCkScripts = (manifest) =>
  getKitPaths(manifest).some(p => p.startsWith('.claude/scripts/ck/'));
…
if (!shipsCkScripts(manifest) && /^\.claude\/scripts\/ck\//.test(target)) continue;
```

Keep the existing rationale comment verbatim — it explains that omitting the tree is deliberate, that `hooks/branch-guard.cjs` fails open on that layout, and that shipping the helpers to silence this check breaks `relocate-scripts.test.js`'s "a kit that installs no scripts" fixture. Add one line recording that the name list became a derivation when kits stopped being enumerable.

Do **not** loosen `EXEMPT_TARGET` or `EXEMPT_FILE`, and do **not** narrow the `LINK` regex back to `^\.\.?/` — that exemption is what hid 38 violations.

**R12 — `esm-host.test.js` `SHIPPED_NODE_DIRS`.** Currently `['.claude/hooks', '.claude/scripts/ck']`. Derive:

```js
const SHIPPED_NODE_DIRS = ['.claude/hooks',
  ...fs.readdirSync(path.join(REPO, '.claude/scripts'), { withFileTypes: true })
       .filter(e => e.isDirectory()).map(e => `.claude/scripts/${e.name}`)];
```
Any future script tree joins *"no CommonJS file is shipped as .js into a host project"* by existing. Do **not** add anything to `cjs-migrate.js`'s `SHIPPED_JS` — that table is historical provenance resolved against git by *"the SHIPPED_JS digests are real blobs of the real history"*, and a file with no `.js` past would be unresolvable there.

---

## Exit gate

**Exit gate:** `node --test "tests/*.test.js" 2>&1 | grep -E '^ℹ (tests|pass|fail|skipped)'` → `ℹ tests 366` · `ℹ pass 364` · `ℹ fail 1` · `ℹ skipped 1` (baseline 349/347/1/1; **+9** `tests/ba-spine.test.js` from phase 02, **+4** more in the same file from 08.1, **+4** `tests/ba-deliver.test.js` from 08.2 — this phase widens guard *coverage* without adding test count). Detail in Gate 1–3 below.

### Gate 1 — the suite, against the recorded baseline

```bash
cd <repo> && node --test "tests/*.test.js" 2>&1 | grep -E '^ℹ (tests|pass|fail|skipped)'
```
→ `ℹ tests 366` · `ℹ pass 364` · `ℹ fail 1` · `ℹ skipped 1`. The `fail 1` is the pre-existing `tests/protected-branch-guard.test.js:196`. **A second failing test fails this gate** — and the four guards now run against a real `ck init --kit ba`, so any `ba` link or path defect surfaces right here, **including every file the wave-1.5 block added**.

### Gate 2 — the loops are genuinely derived, not re-hardcoded

```bash
grep -rn "'engineer', *'marketing', *'both'" tests/ ; echo "literals=$?"
node -e "const {packagedKits}=require('./tests/lib/kits.js');console.log(packagedKits().join(','))"
```
→ `literals=1` (grep found none left); **`ba,both,engineer,marketing`** — `ba` is in the list because its manifest exists, not because anyone typed it.

### Gate 3 — a new in-package kit enters all four loops by existing

```bash
cp .claude/kits/marketing.json .claude/kits/zzprobe.json
node -e "const f='.claude/kits/zzprobe.json',fs=require('fs');const m=JSON.parse(fs.readFileSync(f));m.name='zzprobe';fs.writeFileSync(f,JSON.stringify(m,null,2))"
node -e "const {packagedKits}=require('./tests/lib/kits.js');console.log(packagedKits().includes('zzprobe'))"
node --test tests/installer-packaging.test.js 2>&1 | grep -E '^ℹ (pass|fail)'
rm .claude/kits/zzprobe.json
```
→ `true`, and the packaging suite still reports `ℹ fail 0` (the clone is a valid manifest). This is the defect the four literals caused, proven closed. **Delete the probe manifest afterwards** — the last line is part of the gate, not cleanup advice.
