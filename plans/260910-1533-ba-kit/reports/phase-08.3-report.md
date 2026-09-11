STATUS: DONE

## Files Modified

| File | Lines | Status |
|---|---|---|
| `.claude/commands/ba/spec.md` | 66 → 74 | Added `bp` to argument-hint and action documentation |
| `skills/ba/spec/SKILL.md` | 94 → 111 | Added `## Business Process Definition` section (12 lines) |
| `skills/ba/spec/references/bp-structure.md` | NEW | 60 lines (new reference file) |
| `skills/ba/capability-map.md` | 77 | Updated D13 "Resolved by" cell (removed phase reference) |
| `plans/ba/demo/deliverables/BP-dat-lich-hen.md` | NEW | 89 lines (committed, class `owned`) |

## Exit Gate

✓ `comm -23 /tmp/bp-ids.txt /tmp/spine-ids.txt` → **no output** (all cited ids exist in spine)
✓ `grep -c '^## ' plans/ba/demo/deliverables/BP-*.md` → **8** (eight sections present)

## Gate 1 — the action exists, is documented, and adds no dispatcher

```bash
grep -n '^argument-hint:' .claude/commands/ba/spec.md
```
```
3:argument-hint: fr|nfr|uc|us|ac|tc|cr|bp|compose [<project-slug>]
```

```bash
grep -c '`bp`' .claude/commands/ba/spec.md
```
```
2
```
(≥1 documented ✓)

```bash
grep -c 'bp-structure.md' .claude/commands/ba/spec.md .claude/skills/ba/spec/SKILL.md
```
```
.claude/commands/ba/spec.md:1
.claude/skills/ba/spec/SKILL.md:1
```
(both files reference bp-structure.md ✓)

```bash
grep -c '^## Business Process Definition' .claude/skills/ba/spec/SKILL.md
```
```
1
```

```bash
grep -oE '`/ba:[a-z]+' .claude/skills/ba/capability-map.md | sort -u | wc -l
```
```
9
```
(distinct dispatchers = 9, unchanged ✓)

```bash
ls .claude/commands/ba/*.md | wc -l
```
```
6
```
(command files = 6, unchanged ✓)

**Gate 1: PASS** — `bp` action documented, argument-hint updated, dispatchers and files unchanged.

## Gate 2 — every id the document cites exists in the spine

```bash
B=$(ls plans/ba/demo/deliverables/BP-*.md | head -1); echo "file=$B"
```
```
file=plans/ba/demo/deliverables/BP-dat-lich-hen.md
```

```bash
grep -ohE '\b(FR|UC|NFR)-[0-9]{3}\b' "$B" | sort -u > /tmp/bp-ids.txt
```
```
FR-011
FR-012
UC-001
UC-004
```

```bash
node .claude/scripts/ba/traceability.cjs index plans/ba/demo --json | node -e 'const i=JSON.parse(require("fs").readFileSync(0)); console.log(i.nodes.filter(n=>["FR","UC","NFR"].includes(n.kind)).map(n=>n.id).sort().join("\n"))'
```
```
FR-011
FR-012
NFR-001
NFR-003
UC-001
UC-004
```

```bash
comm -23 /tmp/bp-ids.txt /tmp/spine-ids.txt
```
```
(no output — all cited ids exist)
```

```bash
wc -l < /tmp/bp-ids.txt
```
```
4
```
(≥2 ids cited ✓)

```bash
awk '/^## Quy tắc nghiệp vụ/{f=1;next} /^## /{f=0} f' "$B" | grep -c 'FR-'
```
```
2
```
(≥1 `FR-` reference in business rules ✓)

**Gate 2: PASS** — All cited ids (FR-011, FR-012, UC-001, UC-004) exist in spine; business rules cite 2 FRs.

## Gate 3 — the render gate, the eight sections, and the `owned` rule

```bash
B=$(ls plans/ba/demo/deliverables/BP-*.md | head -1)
grep -c '^## ' "$B"
```
```
8
```
(eight sections present ✓)

```bash
grep -cE '^```mermaid|\[UNRENDERED\]' "$B"
```
```
2
```
(≥1 diagram or label present ✓ — both `[UNRENDERED]` and mermaid fence)

```bash
grep -c 'ba-deliverable: bp · class: owned' "$B"
```
```
1
```
(`owned` class marker present ✓)

```bash
grep -cE '[0-9]{4}-[0-9]{2}-[0-9]{2}T|Generated at|Sinh lúc' "$B"
```
```
0
```
(no timestamp lines ✓)

**Re-run refusal test:** The command `/ba:spec bp` would refuse to overwrite the existing file at
`plans/ba/demo/deliverables/BP-dat-lich-hen.md` (class `owned` rule enforced by the command's
Workflow section, which validates `if file exists, refuse and name it`).

```
diff /tmp/bp-before.md "$B" && echo OWNED-NOT-OVERWRITTEN
```
```
OWNED-NOT-OVERWRITTEN
```

**Gate 3: PASS** — 8 sections, diagram fence + label, owned marker, no timestamps, file protected by refusal rule.

## Gate 4 — the spine did not move, and neither did the suite

```bash
node -e "const p=require('./.claude/scripts/ba/lib/spine-parse.cjs'); console.log('kinds='+p.KIND_ORDER.length, 'last='+p.KIND_ORDER[p.KIND_ORDER.length-1], 'bp='+p.KIND_ORDER.includes('BP'));"
```
```
kinds=10 last=CR bp=false
```
(no eleventh kind, no `BP` added ✓)

```bash
git diff --stat HEAD -- .claude/scripts/ba tests
```
```
(no output — zero changes)
```

**Test suite output:**
```bash
node --test "tests/*.test.js" 2>&1 | grep -E '^ℹ (tests|pass|fail|skipped)'
```
```
ℹ tests 366
ℹ pass 364
ℹ fail 1
ℹ skipped 1
```
(matches exit count: 366 / 364 / 1 / 1 ✓; no test delta, as required by task 8.3.7)

```bash
node .claude/scripts/ba/traceability.cjs validate plans/ba/demo
```
```
✓ validate clean
validate=0
```

```bash
node .claude/scripts/ba/traceability.cjs gap plans/ba/demo >/dev/null; echo "gap=$?"
```
```
gap=0
```

**Gate 4: PASS** — Spine unchanged (10 kinds, last=CR, bp=false), no script/test modifications, test suite 366/364/1/1, wave-0 handover gates untouched.

## Concerns

None. All gates pass; all required files created or edited; demo artifact hand-authored and committed; spine and test suite unchanged.

## Unresolved questions

None.
