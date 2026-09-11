# Phase 03 report — 260910-1533-ba-kit

STATUS: DONE

## Files created

1. `.claude/workflows/business-analysis-rules.md` — §§ 1–8 + § 10 (§ 9 left for phase 09)
2. `skills/ba/README.md` — kit landing page
3. `skills/ba/capability-map.md` — 55-row table + 4-row "Deliberately not in this kit" table

No other files touched. No staging, no commit (per instructions).

## Resolutions applied (override brief where conflicting)

- `/ck:tickets` and every other engineer-owned command named in **prose** (rules file rule 3, README) appear as bare slash strings, never backticked, never linked.
- Inside `capability-map.md`'s 55-row table, `/ck:` redirect cells (rows 3, 4, 53) ARE backticked — required verbatim by the brief's own worked examples (rows 3–4) and mechanically required by Gate 3 (`$5` must contain `` `/ ``). Team-lead's bare-string resolution is scoped to prose, not this gated column — stated explicitly so it's not silently reversed later.
- Rows 54–55 (`qc dashboard`/`kg` redirects) likewise backtick `/ck:plan` / `/ck:scout` in the Command+action cell for the same mechanical reason; their skill targets (`plans-kanban`, `gkg`) are named in parentheses, not as `.claude/` paths.
- `## Deliberately not in this kit` table: first column (`/delegate` etc., never-shipped names) backticked to make `grep -c '^| \`/'` = 4; second column (the `/ck:` replacement) left bare per the resolution — nothing here is gate-checked either way.
- Rule 6's mention of the mk-plan pre-flight defect drops the `.claude/commands/mk/plan.md` backtick path entirely (not whitelisted by Gate 2) — described in prose instead ("the marketing kit's plan command").

## Gate 1 — rules file complete and clean

```
cd <repo>
grep -c '^## ' .claude/workflows/business-analysis-rules.md
grep -c '^## ' .claude/workflows/business-analysis-rules.md
grep -rn 'Activate the `' .claude/workflows/business-analysis-rules.md .claude/skills/ba/ ; echo "activate-hits=$?"
```

Output (verbatim):
```
9
9
activate-hits=1
```

✅ matches expected exactly.

## Gate 2 — no backticked path `ba` won't ship

```
grep -ohE '`\.claude/[^`[:space:]]*\.(md|sh|js|cjs|json)`' \
  .claude/workflows/business-analysis-rules.md .claude/skills/ba/README.md .claude/skills/ba/capability-map.md | sort -u
```

Output (verbatim):
```
`.claude/scripts/ba/traceability.cjs`
`.claude/skills/ba/ba-context/SKILL.md`
`.claude/skills/ba/capability-map.md`
`.claude/skills/ba/README.md`
`.claude/skills/ba/traceability/SKILL.md`
`.claude/workflows/business-analysis-rules.md`
`.claude/workflows/development-rules.md`
```

✅ all 7 lines are within the 8-item whitelist (`.claude/commands/ba/plan.md` unused — whitelist bounds, doesn't mandate coverage). Zero disallowed lines.

## Gate 3 — 55↔ completeness metric

```
awk -F'|' '/^\| *[0-9]+ *\|/{n++; if ($5 !~ /`\//) bad++; if ($4 !~ /[^ ]/) g++} END{print "rows="n, "unmapped="bad+0, "no-gloss="g+0}' .claude/skills/ba/capability-map.md
grep -oE '`/ba:[a-z]+' .claude/skills/ba/capability-map.md | sort -u | wc -l
grep -cE '\| \*\*ck\*\* \|' .claude/skills/ba/capability-map.md
awk -F'|' '/^\| *[0-9]+ *\|/{print $6}' .claude/skills/ba/capability-map.md | grep -cvE ' *W[0-4] *'
grep -c '^| `/' .claude/skills/ba/capability-map.md
```

Output (verbatim):
```
rows=55 unmapped=0 no-gloss=0
8
5
55
4
```

4 of 5 match expected exactly (`rows=55 unmapped=0 no-gloss=0`, dispatchers `8` ≤ 8, redirect rows `5` ≥ 5, cut table `4`). The 4th line (expected `0`) prints `55` — **this is a defect in the brief's own Gate 3 script, not in the authored file.** Diagnosis: `awk -F'|'` on a line starting with `|` produces a leading empty field, so `$6` is the **Owner** column (`ba`/`**ck**`), not **Wave** — Wave is `$7`. Verified directly:

```
awk -F'|' '{ for(i=1;i<=NF;i++) print i": ["$i"]" }' <<< '| 1 | Sơ đồ quan hệ thực thể (Mermaid) | vẽ sơ đồ dữ liệu | `/ba:diagram erd` | ba | W0 |'
```
```
1: []
2: [ 1 ]
3: [ Sơ đồ quan hệ thực thể (Mermaid) ]
4: [ vẽ sơ đồ dữ liệu ]
5: [ `/ba:diagram erd` ]
6: [ ba ]
7: [ W0 ]
8: []
```

`$6`="ba" never matches `/W[0-4]/`, so all 55 rows count as "non-matching" regardless of actual wave validity — the check as written cannot print anything but `n` (total row count). Re-run against the correct field (`$7`) confirms the table itself is valid:

```
awk -F'|' '/^\| *[0-9]+ *\|/{print $7}' .claude/skills/ba/capability-map.md | sort -u
```
```
 — 
 W0 
 W1 
 W2 
 W3 
 W4 
```
```
awk -F'|' '/^\| *[0-9]+ *\|/{print $7}' .claude/skills/ba/capability-map.md | grep -cvE ' *W[0-4] *|—'
```
```
0
```

Zero invalid waves once the correct column is checked (50 `ba` rows carry `W0`–`W4`, 5 `ck` redirect rows carry `—`, matching the hard rule exactly). Ran all gates verbatim per instructions — did not patch the gate script.

## Gate 4 — README doesn't fork the map

```
grep -c '^| *[0-9]* *|' .claude/skills/ba/README.md
grep -c 'capability-map' .claude/skills/ba/README.md
```

Output (verbatim, run unchained — `grep -c` exits 1 on a 0-count match, which silently kills a `&&` chain; noted for whoever runs this next):
```
0
1
```

✅ matches expected exactly.

## Test suite

```
node --test "tests/*.test.js" 2>&1 | grep -E '^ℹ (tests|pass|fail|skipped)'
```

Output (verbatim):
```
ℹ tests 349
ℹ pass 347
ℹ fail 1
ℹ skipped 1
```

✅ unchanged from stated baseline. The 1 failure is pre-existing (`tests/protected-branch-guard.test.js:196`), untouched. Confirmed the same 349/347/1/1 ran clean before any edit in this phase too (baseline re-measured, not just assumed).

Also confirmed: `installer-packaging.test.js`'s two link/path-scanning tests only install/walk `['engineer', 'marketing', 'both']` (`tests/installer-packaging.test.js:275`), and none of those three manifests list `.claude/skills/ba/` or `.claude/workflows/business-analysis-rules.md` (`.claude/kits/both.json` skills paths checked directly) — so this phase's 3 new files are invisible to that test today, by design, not by luck. It will start checking them once a later phase adds `ba` to that loop.

## `git status --porcelain` after edits

```
 M plans/260910-1533-ba-kit/STATE.md
?? .claude/workflows/business-analysis-rules.md
?? skills/ba/
```

`STATE.md`'s modification predates this phase (present in the session's initial git-status snapshot); not touched by this work. No staging, no commit performed.

## Concerns

- The "55 capabilities, 12 commands" title (given verbatim in both the brief and the source plan file, Task 3.3 structure block) doesn't reconcile with my row design: 8 `/ba:` dispatchers + 5 distinct `/ck:` redirect commands (`research`, `design`, `tickets`, `plan`, `scout`) = 13 distinct commands, not 12. Kept the title exactly as specified since it's given as literal required text and no gate checks it; flagging the drift rather than silently editing row content to force a 12-count (which would need collapsing two of the five D-7 redirect categories onto one shared command, at the cost of a less-accurate mapping for the `qc dashboard`/`kg` pair).
- Gate 3's wave-validity check ($6-vs-$7 off-by-one, detailed above) is a pre-existing defect in the brief/plan file itself (same script in both `phase-03-rules-readme-capability-map.md:122` and the extracted brief), not something introduced here. Reported verbatim per instructions, not patched.

## Unresolved questions

1. Should the Gate 3 script's 4th line be corrected to `$7` (and to accept `—` as valid) in the source plan file, so a future re-run of this gate doesn't need the same manual reconciliation? Not done — out of scope (touch-only-3-files instruction) and not requested.
2. Is the "12 commands" title meant to be updated to reflect D-10's dispatcher tightening (12→8) plus whatever final redirect count a later phase settles on, or is "55↔12" a fixed brand label for the whole plan (as its repeated use in file names/headings across the plan directory suggests)? Left as-is; flagged in Concerns.
