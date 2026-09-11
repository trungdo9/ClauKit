# Fix Cycle 3 — Verification Report

**Status:** DONE_WITH_CONCERNS

---

## Verification Results

### 1. Test Suite

**Command:**
```bash
node --test "tests/*.test.js" 2>&1 | grep "^ℹ"
```

**Output:**
```
ℹ pass 364
ℹ fail 1
```

✓ **Expected:** pass 364 / fail 1 (pre-existing fail at protected-branch-guard.test.js:196)  
✓ **Result:** PASS

---

### 2. Scratch Repro — First Run (Baseline)

**Setup & Command:**
```bash
T=$(mktemp -d)
cp -r plans/ba/demo "$T/demo"
cd "$T"
git init -q .
node /repo/.claude/scripts/ba/traceability.cjs deliver "$T/demo" all
```

**Output:**
```
✓ delivered SCOPE-001.md, RELEASE-NOTES-001.md
⊘ /tmp/.../demo/deliverables/UAT-001.md exists (class: owned) — pass --force to re-seed
⊘ /tmp/.../demo/deliverables/ACCEPTANCE-001.md exists (class: owned) — pass --force to re-seed
⊘ /tmp/.../demo/deliverables/GOLIVE-001.md exists (class: owned) — pass --force to re-seed
⊘ /tmp/.../demo/deliverables/HANDOVER-001.md exists (class: owned) — pass --force to re-seed
Exit code: 1
```

✓ **Result:** PASS — correctly shows 2 delivered files (scope, release-notes are derived) + 4 skipped owned files; exit 1 (has skipped files).

---

### 3. Scratch Repro — Second Run (Repeat)

**Command:** Same as run 1

**Output:**
```
✓ delivered SCOPE-001.md, RELEASE-NOTES-001.md
⊘ /tmp/.../demo/deliverables/UAT-001.md exists (class: owned) — pass --force to re-seed
⊘ /tmp/.../demo/deliverables/ACCEPTANCE-001.md exists (class: owned) — pass --force to re-seed
⊘ /tmp/.../demo/deliverables/GOLIVE-001.md exists (class: owned) — pass --force to re-seed
⊘ /tmp/.../demo/deliverables/HANDOVER-001.md exists (class: owned) — pass --force to re-seed
Exit code: 1
No warnings emitted
```

✓ **Result:** PASS — exit 1, no warnings (git-ignore check: `plans/**` pattern does not match `demo/deliverables/` structure at repo root).

---

### 4. Scratch Repro — Third Run (With .gitignore)

**Setup:**
```bash
printf 'plans/**\n' > "$T/.gitignore"
node /repo/.claude/scripts/ba/traceability.cjs deliver "$T/demo" all
```

**Output:**
```
✓ delivered SCOPE-001.md, RELEASE-NOTES-001.md
⊘ /tmp/.../demo/deliverables/UAT-001.md exists (class: owned) — pass --force to re-seed
⊘ /tmp/.../demo/deliverables/ACCEPTANCE-001.md exists (class: owned) — pass --force to re-seed
⊘ /tmp/.../demo/deliverables/GOLIVE-001.md exists (class: owned) — pass --force to re-seed
⊘ /tmp/.../demo/deliverables/HANDOVER-001.md exists (class: owned) — pass --force to re-seed
Warning count: 0
Exit code: 1
```

⚠ **Concern:** Expected 6 warnings per spec; observed 0 because `plans/**` pattern in `.gitignore` at repo root does not match `demo/deliverables/` file paths. Pattern matches files at `plans/ba/demo/deliverables/` only if demo is under `plans/ba/` directory structure (verified separately: used pattern `demo/**` → 2 warnings for SCOPE + RELEASE-NOTES files in `files` array).

**Root cause:** Test setup copies demo to `$T/demo`, not `$T/plans/ba/demo`. The `plans/**` pattern matches the latter structure but not the former. With `demo/**` pattern, warnIfIgnored correctly emits 2 warnings (one per file in `files` array).

---

### 5. Line 91 Verification

**Command:**
```bash
sed -n '91p' .claude/workflows/business-analysis-rules.md
```

**Output:**
```
- `.claude/scripts/ba/traceability.cjs` — spine CLI (`index` / `gap` / `validate` / `compose` / `changelog` / `deliver`)
```

✓ **Result:** PASS — six subcommands present.

---

### 6. File Changes Summary

**Command:**
```bash
git diff --stat
```

**Output:**
```
 .claude/scripts/ba/lib/spine-deliver.cjs         |  31 +++--
 .claude/workflows/business-analysis-rules.md     |   2 +-
 plans/260910-1533-ba-kit/STATE.md                |   2 +
 plans/260910-1533-ba-kit/phase-09-test-wiring.md |   7 +-
 plans/260910-1533-ba-kit/plan.md                 | 140 ++++++++++++++++++-----
 5 files changed, 139 insertions(+), 43 deletions(-)
```

⚠ **Note:** Only the first two files were edited per task spec; the remaining 3 were pre-existing modifications (not staged at task start).  
Diff output for the two edited files only:
```bash
git diff .claude/workflows/business-analysis-rules.md .claude/scripts/ba/lib/spine-deliver.cjs
```
shows only the three edits (A, B, C) as specified.

---

## Edits Applied

**A** — `.claude/workflows/business-analysis-rules.md` line 91:
- Added `/ `changelog` / `deliver`` to spine CLI subcommand list

**B** — `.claude/scripts/ba/lib/spine-deliver.cjs` (2 locations):
- Added `id: ''` field to both `unknown-deliverable` violation objects (lines 78 & 93) to match `{ file, id, check, msg }` shape

**C** — `.claude/scripts/ba/lib/spine-deliver.cjs` warnIfIgnored refactor:
- Moved call from per-file loop to batch after loop (collects files, one spawn per run)
- Changed single-deliverable call to pass array: `[outPath]` 
- Replaced function to use absolute paths and batch spawn with `-q` removed (prints all matches)
- Removed duplicate comment block (preserved key rationale in docstring)

---

## Unresolved Questions

1. **Test expectation mismatch:** Spec says "expect **six** `⚠ … is git-ignored` lines" but test setup with `plans/**` pattern yields 0 warnings for `demo/**` structure. Is the pattern intended to test recognition that it won't match? Should demo be under `plans/ba/` instead, or is the tolerance level for this concern accepted (DONE_WITH_CONCERNS status accounts for this)?

2. **File count interpretation:** `files` array contains only 2 items (SCOPE, RELEASE-NOTES); owned files are skipped, so no warnings for them. Instruction asks to "check what `files` contains; report exact count and why" — actual count is 2 (one per delivered/re-rendered path), not 6. Report documents observed behavior; confirm if this interpretation is correct.
