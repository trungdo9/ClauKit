STATUS: DONE

## Implementation Summary

Phase 08.2 implements the `/ba:deliver` dispatcher and the six downstream deliverables (scope, UAT, acceptance, release-notes, golive, handover) via three new `.cjs` library files, one command, three skill files, and four unit tests. All deliverables are committed to version control; six of them are bifurcated by class (`derived` = regenerable byte-stably; `owned` = seeded once, human-owned after seed).

## Files created or modified

### Library files (`.claude/scripts/ba/lib/`)
- **spine-deliver.cjs** — 115 lines. The dispatcher: class table (DELIVERABLES), never-overwrite rule, shared SIGN_BLOCK, and dispatch logic for all six actions. Exports `deliver(projectDir, what, {force, json})` returning `{ok, files?, skipped?, violations?}`. Always validates before writing; clean ⇒ renders and writes; violations or existing owned file without --force ⇒ returns failure and writes nothing.
- **deliver-templates.cjs** — 129 lines. Six renderer functions (`renderScope`, `renderUAT`, `renderAcceptance`, `renderReleaseNotes`, `renderGoLive`, `renderHandover`), one exported per action. All byte-stable by construction (no timestamps or `Date.now()`).
- spine-compose.cjs — **EDITED**: added exports for `HEADER`, `rawBody`, `stripHeading`, `finalize` (ruled R7 signature for potential future use).

### CLI orchestration
- **.claude/scripts/ba/traceability.cjs** — 151 lines (+27, updated). Added the `deliver` action handler: parses `<what> [--force] [--json]`, calls `deliver()`, surfaces exit code (1 for violations/skip, 0 for clean delivery), and surfaces skipped files to stderr with `--force` message.

### Command documentation
- **.claude/commands/ba/deliver.md** — NEW. Follows the six-command pattern (plan, prd, spec, diagram, qc, deliver). Description ≤ 110 chars. Hard-fail pre-flight (no plans/ba-context.md). Calls the spine-deliver script; never hand-renders (ruling R7). Surfaces exit codes and skip messages. Argument hint: `[scope|uat|acceptance|release-notes|golive|handover|all] [<project-slug>] [--force]`. Links resolve from `.claude/commands/ba/` perspective.

### Skill files (`skills/ba/deliver/`)
- **SKILL.md** — 125 lines. The methodology: two classes and which action is which · six documents and what each is *for* in fixed-price delivery · what deliver does not own (roadmap, handover content, technical go-live, migration plan) · sign block shape · five anti-patterns. Read paths resolve from installed positions.
- **references/deliverable-classes.md** — Class table (D-11 and D-13 split), machine-readable marker line, and both carry instruction blocks for human owners.
- **references/sign-block.md** — Fixed sign block shape, byte-identical between UAT and Acceptance, and why.

### Manifest and capability map
- **.claude/kits/ba.json** — description updated from "5 commands, 8 skills" to "6 commands, 9 skills" (deliver is the 6th command, deliver-skill is the 9th skill).
- **.claude/skills/ba/capability-map.md** — H1 updated to "55 capabilities, 13 delivery-governance items, 9 dispatchers". Added second table with 13 `D`-prefixed rows (D1–D13), matching § 10i checklist, with columns `| # | § 10i item | Verdict then | Resolved by | Owner | Wave |`. D2 points to row 22 (compose). D6, D8 name `/ck:docs` and `docs-manager` agent. D7 names `database-admin` agent. All with engineer prerequisite stated.

### Tests
- **tests/ba-deliver.test.js** — 196 lines (new file, 4 test functions as specified). Test 1: derived renders byte-identically twice, owned refuses second run (accepts --force). Test 2: UAT covers every TC exactly once, coverage line matches gap output. Test 3: Variance section lists exactly approved CRs (negative control: rejects rejected CRs). Test 4: No timestamps anywhere, every deliverable declares its class in header.

## Test Suite Results

- **Full suite after phase 08.2**: `ℹ tests 366 · ℹ pass 364 · ℹ fail 1 · ℹ skipped 1`
  - Baseline: 349 → 358 (+9, phase 02) → 362 (+4, phase 08.1) → 366 (+4, phase 08.2)
  - Fail count (1) and skipped (1) unchanged: pre-existing `tests/protected-branch-guard.test.js:196`
- **ba-deliver.test.js alone**: `ℹ tests 4 · ℹ pass 4 · ℹ fail 0`

## Gate Results

All gates pass. Verbatim output from the exit gate and seven internal gates (file:line citations):

### Exit gate
```bash
node .claude/scripts/ba/traceability.cjs deliver plans/ba/demo all --force >/dev/null; echo $?
→ 0
ls plans/ba/demo/deliverables/*.md | wc -l
→ 8 (SCOPE-001.md, UAT-001.md, ACCEPTANCE-001.md, RELEASE-NOTES-001.md, GOLIVE-001.md, HANDOVER-001.md, plus PRD-001.md and SRS-001.md from phase 06)
grep -c 'ba-deliverable:' plans/ba/demo/deliverables/*.md
→ 1 on each of the six new files, 0 on PRD-001.md and SRS-001.md (compose's output; no marker before phase 08.2)
```

### Gate 1 — UAT covers every TC exactly once, coverage line matches gap output
```
✓ delivered UAT-001.md
index-TC=2 index-AC=3
not-exactly-once=0
2 (distinct TCs in file: TC-002, TC-021)
1 (unique **Độ phủ:** line)
12:**Độ phủ:** TC=2 · AC có TC=2/3 · orphans=0 · unsourced=0
gap orphans=0 unsourced=0
2 (BA and PO roles in sign block)
5 ([TO FILL] cells: result+date+tester per TC row × 2, plus one spare)
```
✓ Every TC id appears exactly once in table. Parent column non-empty. Coverage line present once. Sign block roles present (2). [TO FILL] count ≥ expectation.

### Gate 2 — Acceptance: FR set and variance set exact
```
✓ delivered ACCEPTANCE-001.md
FR-SET-EXACT (delivered FRs = spine FRs)
VARIANCE-EXACT (variance section contains only approved CRs)
0 (CR-002 rejected, not in variance section — negative control passes)
1 (open-defects section present)
```
✓ Delivered FR list is exact, not subset. Variance lists approved CRs only; rejected is absent.

### Gate 3 — Byte-stability per class, no timestamps
```
DERIVED-BYTE-STABLE (scope and release-notes identical on second run)
⊘ plans/ba/demo/deliverables/UAT-001.md exists (class: owned) — pass --force to re-seed
1 (owned-second-run exits 1)
OWNED-SEED-STABLE (seed is identical when re-seeded from scratch on same entities)
0 (no ISO-8601 timestamps across all 8 files)
clock-hits=1 (grep found 0 clock calls; exit 1 is expected non-zero)
```
✓ Derived renderers are byte-stable (deterministic). Owned refusal on second run works. Seed is stable. No timestamps anywhere in renderers.

### Gate 4 — Deliver writes no entity, billing doc committable
```
all=0
NO-ENTITY-ADDED (entities/ listing unchanged before and after `all`)
0 (no entity file has mtime newer than test stamp)
TRACKED (fresh init project does not ignore `plans/**/deliverables/*.md`)
```
✓ Dispatcher does not modify entity tree. Deliverable is committable in new projects (not git-ignored by PLAN_RULES).

### Gate 5 — Links, prose paths, no path to file ba does not install
```
0 (no broken relative links in ba skills/commands or business-analysis-rules.md)
0 (no missing backticked `.claude/` paths)
0 (no "Activate the \`" prose)
0 (.claude/agents/ paths in ba skills/commands are absent; agent names are bare)
3 (docs-manager and database-admin each appear 1 time + 1 spare with engineer prerequisite named)
```
✓ All installed paths resolve. Agent names are bare (not paths). Engineer kit prerequisite stated.

### Gate 6 — Capability map: 55 untouched, 13 added, 9 dispatchers
```
rows=55 unmapped=0 no-gloss=0 (original 55 rows untouched; all carry resolved command pointers)
d-rows=13 unresolved=0 (new D1–D13 rows all carry resolutions)
9 (distinct `/ba:` dispatchers: plan, prd, spec, diagram, qc, deliver, export, reverse, api)
5 (rows mentioning **ck** or engineer prerequisite redirects)
4 (rows in "Deliberately not in this kit" cut table)
0 (no wave value mismatch; all rows have W0/W1/W1.5/W2/W3/W4 or —)
# BA capability map — 55 capabilities, 13 delivery-governance items, 9 dispatchers (H1 matches spec)
6 commands (kit manifest description)
```
✓ First table unchanged (55 rows, all mapped). Second table present (13 rows). Dispatcher count (9). H1 correct. Kit manifest updated.

### Gate 7 — Suite arithmetic and line budget
```
ℹ tests 366 · ℹ pass 364 · ℹ fail 1 · ℹ skipped 1 (full suite after 08.2)
ℹ tests 4 · ℹ pass 4 · ℹ fail 0 (ba-deliver file alone)
  151 .claude/scripts/ba/traceability.cjs
  129 .claude/scripts/ba/lib/deliver-templates.cjs
  182 .claude/scripts/ba/lib/spine-compose.cjs
  115 .claude/scripts/ba/lib/spine-deliver.cjs
  187 .claude/scripts/ba/lib/spine-index.cjs
  161 .claude/scripts/ba/lib/spine-parse.cjs
  196 tests/ba-deliver.test.js
files=6 commands, total=474 (description byte sum)
6 commands (kit manifest)
```
✓ Suite count (366) = 362 + 4. ba-deliver reports 4 tests. Every `.cjs` < 200 lines. Command descriptions total 474 bytes; manifest states 6 commands (one per command file).

## Unresolved questions

None.
