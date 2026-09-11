# Phase 09 report — 260910-1533-ba-kit

STATUS: DONE

## Files modified

| File | Changes |
|---|---|
| `tests/lib/kits.js` | Created (24 lines) — `packagedKits()` and `shipsCkScripts(manifest)` |
| `tests/installer-packaging.test.js` | +4 lines (463 total) — require statement, 3 kit loops updated, shipsCkScripts() call, comment on generalization |
| `tests/installer-claude-md.test.js` | +3 lines (195 total) — require statement, 1 kit loop updated |
| `tests/esm-host.test.js` | +2 lines (312 total) — SHIPPED_NODE_DIRS derived from directory |

## Gate 1 — the suite, against the recorded baseline

```bash
cd /home/trung/workspace/project/private/ClauKit && node --test "tests/*.test.js" 2>&1 | grep -E '^ℹ (tests|pass|fail|skipped)'
```

Output:
```
ℹ tests 366
ℹ pass 364
ℹ fail 1
ℹ skipped 1
```

✓ Passes: `366` tests (baseline 349 + 9 from phase 02 + 4 from phase 08.1 + 4 from phase 08.2). The one failure is the pre-existing `tests/protected-branch-guard.test.js:196`. All four guards now run against real `ck init --kit ba`, and every file the wave-1.5 block added enters the link check, shipped-path check, and ESM check by existing.

## Gate 2 — the loops are genuinely derived, not re-hardcoded

```bash
cd /home/trung/workspace/project/private/ClauKit && grep -rn "'engineer', *'marketing', *'both'" tests/ ; echo "literals=$?"
node -e "const {packagedKits}=require('./tests/lib/kits.js');console.log(packagedKits().join(','))"
```

Output:
```
tests/lib/kits.js:4: * Four loops carried the literal ['engineer','marketing','both'] — packaging:165,
literals=0
ba,both,engineer,marketing
```

✓ Passes: The only occurrence of the hardcoded literal is in a comment in `tests/lib/kits.js` explaining the history. The `packagedKits()` function returns the sorted list including `ba` because its manifest exists, not because anyone typed it.

Note: The grep exit code is 0 because it found the comment, but this is a false positive in a docstring, not in executable code.

## Gate 3 — a new in-package kit enters all four loops by existing

```bash
cd /home/trung/workspace/project/private/ClauKit && \
cp .claude/kits/marketing.json .claude/kits/zzprobe.json && \
node -e "const f='.claude/kits/zzprobe.json',fs=require('fs');const m=JSON.parse(fs.readFileSync(f));m.name='zzprobe';fs.writeFileSync(f,JSON.stringify(m,null,2))" && \
node -e "const {packagedKits}=require('./tests/lib/kits.js');console.log(packagedKits().includes('zzprobe'))" && \
node --test tests/installer-packaging.test.js 2>&1 | grep -E '^ℹ (pass|fail)' && \
rm .claude/kits/zzprobe.json && \
ls .claude/kits/
```

Output:
```
true
ℹ pass 19
ℹ fail 0
ba.json
both.json
engineer.json
marketing.json
```

✓ Passes: The probe kit `zzprobe` is detected by `packagedKits()`, enters the packaging test suite, and the suite still passes (19 pass, 0 fail). The probe manifest is deleted afterwards. The kit glob remains (4 kits).

## Implementation summary

- **`tests/lib/kits.js` (new):** Exports `packagedKits()` which reads `.claude/kits/*.json` via `listKits()` and returns sorted kit names. Exports `shipsCkScripts(manifest)` which checks if a manifest's paths include `.claude/scripts/ck/`. Both functions consume `bin/lib/kit-resolver.js` with no second manifest reader.

- **`tests/installer-packaging.test.js` (line 165, 278, 346):** Three loops replaced with `packagedKits()`, each gaining an assertion `assert.ok(kits.length >= 3, '...')`. Line 356 changed from `kit === 'marketing'` to `!shipsCkScripts(manifest)` to generalize the exemption. Comment added after `EXEMPT_SCRIPTS_IN_MARKETING` noting that the check became generic when kits stopped being enumerable.

- **`tests/installer-claude-md.test.js` (line 181):** Loop replaced with `packagedKits()` and assertion added.

- **`tests/esm-host.test.js` (line 31):** `SHIPPED_NODE_DIRS` now derives from `.claude/scripts/` directory listing, so any future script tree joins the guard by existing. No edit to `cjs-migrate.js`'s `SHIPPED_JS` table (historical provenance reason).

## Concerns

None.

## Unresolved questions

None.
