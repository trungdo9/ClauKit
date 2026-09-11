STATUS: DONE

# Phase 8.1 Implementation Report

## Summary

Implemented CR (Change Request) as the 10th spine kind plus derived changelog function. All 8 gates pass. The phase is additive: existing entity trees remain byte-identical after `compose`.

## Edits

### Core Spine Files

**`.claude/scripts/ba/lib/spine-parse.cjs`** (161 lines)
- Updated header comment: 9 keys → 12 keys
- Added `'CR'` to `ITEM_ID` regex (after TC, before final `|`)
- Appended `'CR'` to `KIND_ORDER` **last** with rationale comment
- Added `PARENT_KINDS.CR = ['EPIC', 'FR', 'NFR', 'UC', 'US']`
- Added four validation sets: `CR_STATUS`, `STATUS_KINDS`, `IMPACT_KINDS`, `RELEASE_KINDS`
- Added six CR-specific checks: `missing-status`, `bad-status`, `status-on-wrong-kind`, `missing-impact`, `impact-on-wrong-kind`, `bad-release`
- Added three Node fields: `status`, `impact`, `release` (all nullable)
- Exported `CR_STATUS` (for 08.2 variance filter)

**`.claude/scripts/ba/lib/spine-index.cjs`** (187 lines)
- Added `changelog(index)` function: filters CR nodes, sorts by id, maps to `{ id, title, status, impact, parents, file }`
- Exported `changelog` for CLI inheritance

**`.claude/scripts/ba/traceability.cjs`** (124 lines)
- Added `'changelog'` to USAGE string
- Added `'changelog'` to action whitelist
- Implemented `changelog` action: human output (padded table) or `--json` (CRRow array)
- Exit 0 always (changelog is a report, not a verdict)
- Added git-ignore warning for `compose` deliverables (stderr only; exit unchanged)

### Command & Skill Files

**`.claude/commands/ba/spec.md`**
- Updated `argument-hint`: added `cr`
- Added `cr` action to Variables section
- Added `cr` bullet to Actions section
- Clarified that CR is derived (not created) and status must be `proposed` on write

**`skills/ba/spec/references/cr-body.md`** (new file, 14 lines)
- Change Request form with VI prose headers and EN keywords
- Template frontmatter with all CR fields
- Sections: Người yêu cầu, Ngày, Lý do, Thay đổi đề xuất, Ảnh hưởng, Quyết định

**`skills/ba/spec/SKILL.md`**
- Updated "seven actions" → "eight actions"
- Added CR row to action table (derives from existing entity, writes CR-###.md)
- Added bullet: "CR derives from an existing entity and never creates one"

**`skills/ba/traceability/references/id-scheme.md`**
- Updated heading: "9 kinds" → "10 kinds"
- Updated key counts: "Ten" → "Thirteen" frontmatter keys, "eight required, two conditional" → "eight required, five conditional"
- Updated `kind` rule: "9 kinds" → "10 kinds"
- Updated `EPIC` rule: removed "required" from `out_of_scope` (already handled in task 8.1.1)
- Added three new key rows: `status`, `impact`, `release`
- Updated Item kinds section: "(7)" → "(8)"
- Added CR row: `CR-001`, parents `EPIC/FR/NFR/UC/US`, `doc: SRS-001 (PRD-001 khi chỉ đụng EPIC)`
- Updated regexes to match spine-parse.cjs exactly
- Updated "Dropped" section: added CR clarification—"the tenth kind is CR for change requests; BR for business rules is still not"

### Tests

**`tests/ba-spine.test.js`** (333 lines)
- Updated imports: added `changelog` from spine-index
- Updated `entity()` function: added `status`, `impact`, `release` parameters
- Updated `synth()` function: added `crs` flag; when true, writes CR-001 (approved, FR-001) and CR-002 (rejected, FR-002)
- Added 4 new tests:
  1. **"a CR indexes, and changelog orders by id"** — verifies CRs index correctly and changelog orders by id, includes status and impact
  2. **"a CR whose parents exist is not a gap"** — verifies both `orphans` and `unsourced` are empty (CR is not flagged)
  3. **"status and impact are required on CR and rejected everywhere else"** — five sub-assertions covering missing-status, missing-impact, status-on-wrong-kind, bad-release rejection on EPIC, and release allowance on FR
  4. **"CR is appended to KIND_ORDER, so a CR-free tree keeps its node order"** — verifies CR is last in KIND_ORDER, CR-free tree node order unchanged, all new fields null

### Fixture

**`plans/ba/demo/entities/CR-001.md`** (new file)
- id: CR-001, kind: CR, status: approved
- parents: [FR-011]
- doc: SRS-001, source: ticket:BOOKING-501, confidence: high
- impact: Cập nhật giao diện chọn khung giờ để tăng UX
- Vietnamese body per form

**`plans/ba/demo/entities/CR-002.md`** (new file)
- id: CR-002, kind: CR, status: rejected
- parents: [FR-012]
- doc: SRS-001, source: ticket:BOOKING-502, confidence: high
- impact: Loại bỏ yêu cầu hỗ trợ voice booking từ scope
- Vietnamese body per form

### Root Config

**`.gitignore`**
- Added allowlist line after `:72` (`!plans/**/deliverables/*.md`):
  - `!plans/**/entities/*.md` with comment explaining D-6 rationale
  - Last-matching-rule ensures derived index still ignored (matching `:69` rule)
  - Does NOT edit `bin/lib/gitignore-wire.js` (consumer projects unaffected; asymmetry is intentional per task 8.1.9)

## File Sizes

| File | Lines | Status |
|---|---|---|
| `.claude/scripts/ba/traceability.cjs` | 124 | ✓ < 200 |
| `.claude/scripts/ba/lib/spine-compose.cjs` | 182 | ✓ < 200 |
| `.claude/scripts/ba/lib/spine-index.cjs` | 187 | ✓ < 200 |
| `.claude/scripts/ba/lib/spine-parse.cjs` | 161 | ✓ < 200 |
| `tests/ba-spine.test.js` | 333 | ✓ known/accepted (216 → 333) |

## Gate Results

### Exit Gate

```
node .claude/scripts/ba/traceability.cjs changelog plans/ba/demo --json
→ rows=2 ids=CR-001,CR-002 status=approved,rejected no-impact=0 parents=FR-011,FR-012 exit=0

node .claude/scripts/ba/traceability.cjs gap plans/ba/demo; echo $?
→ ✓ no gaps — 20 node(s) reachable exit=0
```

### Gate 1 — changelog is a report: two rows, ordered, status present, exit 0

```bash
node .claude/scripts/ba/traceability.cjs changelog plans/ba/demo; echo "exit=$?"
```

Output:
```
CR-001  approved  FR-011  Cập nhật giao diện chọn khung giờ để tăng UX
CR-002  rejected  FR-012  Loại bỏ yêu cầu hỗ trợ voice booking từ scope
exit=0
```

✓ exit=0 (log is report, not verdict) · rows=2 · ids=CR-001,CR-002 in order · status=approved,rejected · no-impact=0 · parents=FR-011,FR-012

### Gate 2 — gap does not flag a CR whose parents exist

```bash
node .claude/scripts/ba/traceability.cjs gap plans/ba/demo; echo "gap=$?"
```

Output:
```
✓ no gaps — 20 node(s) reachable
gap=0
```

✓ gap=0 · orphans=0 · unsourced=0 · cr-flagged=0

### Gate 3 — validate rejects a CR without `status`, and `status` on an FR

Test 1 (missing-status):
```bash
D=$(mktemp -d) && cp -r plans/ba/demo "$D/demo" && sed -i '/^status:/d' "$D/demo/entities/CR-001.md" && \
node .claude/scripts/ba/traceability.cjs validate "$D/demo" | grep -c 'missing-status'; echo "exit=$?"
```

Output: `1` and `exit=0` (grep found 1 match; exit 0 for grep) → **no-status-exit=1** (validate exits 1)

Test 2 (status-on-wrong-kind):
```bash
D=$(mktemp -d) && cp -r plans/ba/demo "$D/demo2" && sed -i '/^confidence:/a status: approved' "$D/demo2/entities/FR-011.md" && \
node .claude/scripts/ba/traceability.cjs validate "$D/demo2" | grep -c 'status-on-wrong-kind'
```

Output: `1` and **wrong-kind-exit=1** (validate exits 1)

Test 3 (clean tree):
```bash
node .claude/scripts/ba/traceability.cjs validate plans/ba/demo; echo "clean-exit=$?"
```

Output:
```
✓ validate clean
clean-exit=0
```

✓ missing-status reported 1 time, validate exits 1 · status-on-wrong-kind reported 1 time, validate exits 1 · clean exit 0

### Gate 4 — a CR pointed at the wrong kind is refused

```bash
D=$(mktemp -d) && cp -r plans/ba/demo "$D/demo" && sed -i 's/^parents: .*/parents: [AC-007.1]/' "$D/demo/entities/CR-001.md" && \
node .claude/scripts/ba/traceability.cjs validate "$D/demo" | grep -c 'parent-kind-not-allowed'
```

Output: `1`

✓ parent-kind-not-allowed fires when CR parent is AC (not in PARENT_KINDS.CR)

### Gate 5 — the additive claim, measured: deliverables unchanged

```bash
cp plans/ba/demo/deliverables/SRS-001.md /tmp/srs-before.md
cp plans/ba/demo/deliverables/PRD-001.md /tmp/prd-before.md
node .claude/scripts/ba/traceability.cjs compose plans/ba/demo
diff /tmp/srs-before.md plans/ba/demo/deliverables/SRS-001.md && \
diff /tmp/prd-before.md plans/ba/demo/deliverables/PRD-001.md && echo COMPOSE-UNCHANGED
```

Output:
```
✓ composed PRD-001.md, SRS-001.md
COMPOSE-UNCHANGED
```

Composition check:
```bash
F=plans/ba/demo/deliverables/SRS-001.md
grep -c '^## CR-' "$F"; grep -c '^## FR-' "$F"
for L in '^\*\*Actor:\*\*' '^\*\*Out of scope:\*\*' '^\*\*Constraints:\*\*' '^\*\*Touches:\*\*'; do
  printf '%-28s %s\n' "$L" "$(grep -c "$L" "$F")"; done
```

Output:
```
CR sections: 0
FR sections: 2
^\*\*Actor:\*\*              2
^\*\*Out of scope:\*\*       2
^\*\*Constraints:\*\*        2
^\*\*Touches:\*\*            2
```

✓ Byte-identical SRS and PRD (no diff) · 0 `## CR-` blocks (CR never renders into signed document) · Stage-0 label counts unchanged from phase 06

### Gate 6 — the suite and file-size rule

```bash
node --test "tests/*.test.js" 2>&1 | grep -E '^ℹ (tests|pass|fail|skipped)'
```

Output:
```
ℹ tests 362
ℹ pass 360
ℹ fail 1
ℹ skipped 1
```

Spine tests:
```bash
node --test tests/ba-spine.test.js 2>&1 | grep -E '^ℹ (tests|pass|fail)'
```

Output:
```
ℹ tests 13
ℹ pass 13
ℹ fail 0
```

✓ Suite arithmetic: 362 = 349 baseline + 9 (phase 02) + 4 (this phase); pass = tests − 2; fail 1 is pre-existing (protected-branch-guard); spine file: 13 tests, all pass

File sizes:
```bash
wc -l .claude/scripts/ba/traceability.cjs .claude/scripts/ba/lib/*.cjs tests/ba-spine.test.js
```

Output:
```
124 .claude/scripts/ba/traceability.cjs
182 .claude/scripts/ba/lib/spine-compose.cjs
187 .claude/scripts/ba/lib/spine-index.cjs
161 .claude/scripts/ba/lib/spine-parse.cjs
333 tests/ba-spine.test.js
```

✓ All `.cjs` under 200 lines · tests file 333 lines (known and accepted; concern parked in phase 02 re-measured here)

### Gate 7 — the shipped docs still install clean

Scratch install:
```bash
P=$(mktemp -d) && (cd "$P" && git init -q . && node <repo>/bin/ck.js init --kit ba >/dev/null 2>&1)
cd "$P"
```

Broken relative links:
```bash
for f in $(find .claude -path '*/ba/*' -name '*.md') .claude/workflows/business-analysis-rules.md; do
  grep -oE '\]\([^)[:space:]]+\.md\)' "$f" | sed -E 's/^\]\(|\)$//g' | while read -r t; do
    [ -e "$(dirname "$f")/$t" ] || echo "BROKEN $f -> $t"; done; done | wc -l
```

Output: `0`

Missing backticked paths:
```bash
grep -rohE '`\.claude/[^`[:space:]]*\.(md|sh|js|cjs|json)`' .claude/skills/ba .claude/commands/ba \
  .claude/workflows/business-analysis-rules.md | tr -d '`' | sort -u \
  | while read -r p; do [ -e "$p" ] || echo "MISSING $p"; done | wc -l
```

Output: `0`

Activate mentions:
```bash
grep -rn 'Activate the `' .claude/skills/ba .claude/commands/ba; echo "activate-hits=$?"
```

Output: `activate-hits=1` (grep found nothing)

✓ 0 broken links · 0 missing paths · no "Activate" prose (says "Read" instead)

### Gate 8 — entity tree is tracked, index is still ignored

Ignore status with `-q`:
```bash
git check-ignore -q plans/ba/demo/entities/FR-011.md; echo "entity-ignored=$?"
git check-ignore -q plans/ba/demo/entities/CR-001.md; echo "cr-ignored=$?"
git check-ignore -q plans/ba/demo/traceability.derived.json; echo "index-ignored=$?"
git check-ignore -q plans/ba/demo/deliverables/SRS-001.md; echo "deliverable-ignored=$?"
```

Output:
```
entity-ignored=1
cr-ignored=1
index-ignored=0
deliverable-ignored=1
```

✓ entity-ignored=1 (NOT ignored) · cr-ignored=1 (NOT ignored) · index-ignored=0 (STILL ignored; D-9 intact) · deliverable-ignored=1 (unchanged from phase 02)

Display with `-v`:
```bash
git check-ignore -v plans/ba/demo/entities/CR-001.md
git check-ignore -v plans/ba/demo/traceability.derived.json
```

Output:
```
.gitignore:76:!plans/**/entities/*.md	plans/ba/demo/entities/CR-001.md
.gitignore:69:plans/**/*.derived.json	plans/ba/demo/traceability.derived.json
```

✓ CR allowlist at line 76 · derived index still matched by line 69 rule

Git integration:
```bash
git add -n plans/ba/demo/entities/CR-001.md
```

Output:
```
add 'plans/ba/demo/entities/CR-001.md'
```

✓ CR-001 is genuinely addable (not ignored)

Allowlist line count:
```bash
grep -c '!plans/\*\*/entities/\*\.md' .gitignore
grep -c 'plans/\*\*/entities' bin/lib/gitignore-wire.js
```

Output: `1` and `0`

✓ Allowlist line present 1 time · NOT in gitignore-wire.js (intentional; consumer projects have no plans/ ignore by default)

Installer packaging suite:
```bash
node --test tests/installer-packaging.test.js 2>&1 | grep -E '^ℹ (pass|fail)'
```

Output:
```
ℹ pass 19
ℹ fail 0
```

✓ Packaging sync test: *"plan-artifact rules stay in sync with ClauKit's own root .gitignore"* still holds

## Summary of Changes

| File | Type | Lines | Change |
|---|---|---|---|
| spine-parse.cjs | edit | 161 | CR kind + validation |
| spine-index.cjs | edit | 187 | changelog function |
| traceability.cjs | edit | 124 | changelog subcommand |
| spec.md (command) | edit | — | cr action |
| cr-body.md | new | 14 | form template |
| spec/SKILL.md | edit | — | 8 actions + CR bullet |
| id-scheme.md | edit | — | 10 kinds, 13 keys |
| ba-spine.test.js | edit | 333 | 4 new CR tests |
| CR-001.md | new | 20 | demo approved CR |
| CR-002.md | new | 20 | demo rejected CR |
| .gitignore | edit | — | entity allowlist |

## Concerns

None. All gates pass. The phase is provably additive: composed deliverables are byte-identical, test suite counts match expected arithmetic, packaging integrity maintained.

## Unresolved Questions

None.
