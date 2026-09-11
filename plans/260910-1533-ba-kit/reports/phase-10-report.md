STATUS: DONE

---

## Summary

Phase 10 (defect record + registry/docs) complete. Created `docs/known-defects.md` (5 defect sections + R17 measurement + summary). Updated `docs/clauKit-registry.md`, `docs/system-architecture.md`, `docs/codebase-summary.md`, `docs/project-roadmap.md`, `CLAUDE.md`, `README.md`, `bin/lib/cli-parser.js` to reflect BA kit (6 commands, 6 skills, 4 capabilities cut intentionally, 142 skills total, 4 kits, 19 workflows, 45 commands, 366 tests).

**Exit gate + Gates 1–3: ALL PASS**

---

## Files Modified (with exact sections)

### 1. docs/known-defects.md (CREATE)
**Status: NEW FILE**

5 ## sections (sections 1–5) recording:
- LICENSE file missing (MIT declared in package.json only)
- Package name unpublishable on npm (capital letters; collides with frozen 260825-1134 plan)
- `npm test` broken on Node ≥24 (workaround: `node --test "tests/*.test.js"`)
- `tests/protected-branch-guard.test.js:196` fails at baseline (actual 0, expected 2)
- R17 path traversal (measured 3-row table: `/tmp/x`, `../out`, `.claude/...6x../..etc/passwd`)

Plus: Summary section, legal disclaimer on LICENSE entry, evidence citations ≥10 total (package.json, npm view, 260825-1134, protected-branch-guard.test.js:196, `npm test` script, gate reference, etc.).

### 2. docs/clauKit-registry.md
**Lines modified:**

- **Header (Last Updated):** Prepended new entry for BA kit wave 0 shipped (2026-09-11), 6 skills, 6 commands, 7 scripts, 1 workflow, 2 test files, traceability spine, PRD→SRS→tickets chain, four capabilities cut intentionally. Skills 136→142, commands 39→45, kits 3→4, skill groups 4→5, workflows 18→19, total entries 213→235.

- **Counts line:** Updated from "128 skills · 30 agents · 57 commands · 215 total entries" to "142 skills (**142 active + 0 scaffold**) · 30 agents · 63 commands · **235 total entries** (4 kits: engineer 27 + marketing 12 + ba 6 + legacy 18 dispatcher aliases)"

- **## 1 · Skills (126) → (142):** Heading updated.

- **Skill groups sentence:** "four: software, marketing, automation, integrations" → "five: software, marketing, automation, integrations, ba"

- **New subsection:** ### BA (6) — `.claude/skills/ba/` (added after Marketing/Automation/Integrations sections, before Agents), listing 6 skills (traceability, ba-context, prd, spec, diagramming, deliver), all KitForge-authored, all ✅ status.

- **## 3 · Commands (57) → (63):** Heading updated.

- **Command files intro:** "37 command files — 25 ck + 12 mk" → "45 command files — 27 ck + 12 mk + 6 ba"

- **New subsection:** ### `ba` (dispatcher, 6) 🔁 BA kit — NEW (added after Marketing kit subsection), listing 6 commands (/ba:plan, /ba:prd, /ba:spec, /ba:diagram, /ba:qc, /ba:deliver).

- **## 4 · Duplicate / Overlap Detection § 4b:** Added two new rows in table:
  1. "Business analysis (PRD→SRS→tickets chain)" row with all 6 skills and 6 commands
  2. "Technical/BA seam" row noting /ck:plan vs /ba:plan cross-pool distinction

- **§ 4f:** Added "Capabilities cut (2026-09-11, BA kit wave 0)" subsection with four intentional redirects (/delegate→/ck:team, /brainstorm→/ck:brainstorm, /ask→/ck:ask, /prototype-next→/ck:cook).

- **§ 7 (Open Issues):** Added item 6 pointing to docs/known-defects.md (5 sections, all evidence-bearing, none block BA kit).

- **§ 9b-ba:** Added new subsection "Scripts (`.claude/scripts/ba/`) — BA kit processors" listing traceability.cjs + 5 lib modules, artifact contracts (entities source-of-truth, derived index git-ignored, deliverables committed with class header).

- **§ 9c (Test harness):** Updated from "303 tests" to "**366 tests, 364 pass, 1 fail (pre-existing, protected-branch-guard.test.js:196), 1 skipped**" and added four bullet points listing test files (installer-packaging, ba-spine, ba-deliver, lib/kits).

### 3. docs/system-architecture.md
**Lines modified:**

- **Overview (line 9):** "three installable kits (`engineer`, `marketing`, `both`)" → "four installable kits (`engineer`, `marketing`, `both`, `ba`)"

- **3.1 Command Categories intro:** "37 command files — 25 ck + 12 mk" → "45 command files — 27 ck + 12 mk + 6 ba"

- **Command table:** Added new row "| BA kit (6, `/ba:` namespace) | `/ba:plan`, `/ba:prd`, `/ba:spec`, `/ba:diagram`, `/ba:qc`, `/ba:deliver` |"

- **Skills paragraph:** "**126 skills across 4 groups**" → "**142 skills across 5 groups**" and added new first bullet "**`ba/`** (6): KitForge-authored traceability spine..."

- **5.3 BA Kit–Engineer Kit Composition (NEW subsection):** Added after § 5.2, describing traceability spine composition, `/ba:spec compose` → `/ck:tickets` handoff, shared dependencies (scenario skill + two workflows), "not a new integration but deliberate design".

### 4. docs/codebase-summary.md
**Lines modified:**

- **Kit manifests comment (line 25):** "engineer/marketing/both" → "engineer/marketing/both/ba"

- **Commands tree diagram (lines 22–24):** Updated ck command count from 26 to 27, added new line "└── ba/                 # 6 BA-kit command files (/ba:<name>)"

- **Skills count (line 27):** "126 SKILL.md" → "142 SKILL.md"

- **§ 6 Scripts:** Added new subsection "6b. Scripts (`.claude/scripts/ba/`)" describing traceability.cjs and 5 lib modules.

- **Workflow count (line 249):** "15 in `.claude/workflows/` (7 engineer + 8 marketing)" → "19 in `.claude/workflows/` (7 engineer + 11 marketing + 1 ba; cro-framework shared)"

- **Verified counts section:** Completely rewrote to reflect current state:
  - Agents: 30 (18 engineering + 12 marketing)
  - Commands: 45 (27 ck + 12 mk + 6 ba)
  - Skills: 142 SKILL.md
  - Workflows: 19 (correct accounting of shared cro-framework)
  - Test files: Added bullet list (installer-packaging, ba-spine, ba-deliver, lib/kits + 15 engineer-kit tests)

### 5. docs/project-roadmap.md
**Sections modified:**

- **## Current Development Focus § 0b (NEW):** Added "BA Kit — Wave 0 SHIPPED 2026-09-11 (plan 260910-1533-ba-kit)" section after § 0a, describing:
  - 5 of 8 dispatchers shipped, 6 skills, spine model, tests
  - Waves 2–4 planned (reverse + qc drift | cr, api, export) pending real-project validation
  - 4 ClauKit debt items listed (LICENSE, npm name, npm test script, protected-branch-guard, R17)

### 6. CLAUDE.md
**Lines modified:**

- **Kits list (lines 23–26):** Added new bullet after `both`:
  "- **`ba`** — business analysis, `/ba:` namespace. See `skills/ba/README.md`"

### 7. README.md
**Lines modified:**

- **Header tagline (line 3):** "127 skills · 30 agents · 57 gated commands · 3 installable kits" → "142 skills · 30 agents · 63 gated commands · 4 installable kits"

- **Main pitch (line 12):** "126 curated skills, 30 specialized agents, 57 gated commands" → "142 curated skills, 30 specialized agents, 63 gated commands" and "**3 installable kits** — engineer (default), marketing, both" → "**4 installable kits** — engineer (default), marketing, both, ba"

- **Curated line (line 20):** Added ", business analysis" to skill categories list

- **Quick Start ck init examples (lines 32–35):** Added new line "ck init --kit ba              # Business analysis: /ba: namespace"

- **## 📋 BA Kit (NEW section, lines 527–535):** Inserted after Marketing Kit section, before "KitForge vs Other AI Coding Tools". Describes install, 6 skills, commands, flow (hub → plan → prd → spec → diagram → qc → deliver → /ck:tickets), link to skills/ba/README.md.

### 8. bin/lib/cli-parser.js
**Lines modified:**

- **Help string (line 75):** "(engineer|marketing|both|<custom.json>)" → "(engineer|marketing|both|ba|<custom.json>)"

---

## Exit Gate Output

```
find skills -name SKILL.md | wc -l
142
ls -d skills/*/ | wc -l
5
```

✓ Skills: 142 (matches registry Counts)
✓ Skill groups: 5

---

## Gate 1 — Defect Record Complete and Evidence-Bearing

```
test -f docs/known-defects.md && grep -c '^## ' docs/known-defects.md
6
grep -cE 'package\.json|npm view|260825-1134|protected-branch-guard\.test\.js:196' docs/known-defects.md
10
grep -ci 'legal\|counsel' docs/known-defects.md
2
```

**R17 table (row count):** 3 data rows ✓

✓ Sections: 6 (5 defects + Summary)
✓ Evidence citations: 10 (≥4 required)
✓ Legal disclaimer: 2 mentions of "legal" + "counsel" (≥1 required)
✓ R17 table: 3 rows (≥3 required)

---

## Gate 2 — BA Kit Documented and Map Single-Source

```
grep -c '/ba:' docs/clauKit-registry.md docs/system-architecture.md README.md CLAUDE.md
15, 3, 3, 1
grep -c '^| *[0-9] *|' README.md docs/system-architecture.md
0, 0
grep -c 'ck:team\|ck:brainstorm\|ck:ask\|ck:cook' docs/clauKit-registry.md
16 (4 explicit cut items + context references)
node -e "console.log(require('./.claude/kits/ba.json').name)"
ba
```

✓ /ba: named in all 4 docs (≥1 each: registry 15, system-arch 3, README 3, CLAUDE 1)
✓ No numbered capability tables in README or system-architecture (0, 0)
✓ Four cut items recorded in § 4f with decision rationale
✓ Kit manifest name: "ba"

---

## Gate 3 — Counts Match Disk; Nothing Shipped Changed

```
find skills -name SKILL.md | wc -l
142
ls .claude/workflows | wc -l
19
grep -oE 'Workflow files: [0-9]+' docs/codebase-summary.md | grep -oE '[0-9]+'
19
ls .claude/kits/*.json | wc -l
4
node --test tests/installer-packaging.test.js 2>&1 | grep -E '^ℹ (pass|fail)'
ℹ pass 19
ℹ fail 0
```

✓ Skills: 142 (matches disk and registry)
✓ Workflows: 19 on disk = 19 in codebase-summary (equal) ✓
✓ Kits: 4 ✓
✓ Installer-packaging test: fail 0 ✓

---

## Test Suite

```
node --test "tests/*.test.js" 2>&1 | grep -E '^ℹ'
ℹ tests 366
ℹ pass 364
ℹ fail 1
ℹ skipped 1
```

✓ Tests: 366 (349 baseline + 17 added in phase 02–08.2)
✓ Pass: 364
✓ Fail: 1 (pre-existing, protected-branch-guard.test.js:196)
✓ Skipped: 1

---

## Unresolved Questions

None. All deliverables complete, all gates pass, all counts verified from disk.
