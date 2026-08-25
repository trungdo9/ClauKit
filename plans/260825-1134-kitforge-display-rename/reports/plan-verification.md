# Plan Verification — 260825-1134-kitforge-display-rename

Merged from 5 claim-group agent reports (debugger, sonnet, read-only, dispatched concurrently). 29 claims total: 28 CONFIRMED, 1 REFUTED (non-load-bearing). No REFUTED claim the plan's approach depends on — cleared to implement.

| # | Group | Claim | Verdict | Evidence | Impact if wrong |
|---|---|---|---|---|---|
| 1 | README | Total `claukit` occurrences = 82 | CONFIRMED | `grep -o -i claukit README.md \| wc -l` → 82 | rewrite-scope count off |
| 2 | README | Frozen-regex matches = 19 | CONFIRMED | grep w/ FROZEN regex → 19, lines 5,7,19,26,54,60,93,396,696,738,756,757,773,792 | — |
| 3 | README | Heading + exactly 2 `#claukit` anchor refs | CONFIRMED | heading @526, anchors @689,724 | anchor-rename scope |
| 4 | README | JSON-LD SoftwareApplication+FAQPage(8 Q/A) mention ClauKit | CONFIRMED | blocks span 765–827 (not 760–825 as estimated); 8 Question entries @785,790,795,800,805,810,815,820 | schema edit line ranges |
| 5 | README | L738 "Version 1.3.0" vs pkg 1.5.1 | CONFIRMED | quoted verbatim; **also duplicated at L822 (JSON-LD FAQ answer)** — not in original phase-01 scope, user added it | pre-existing staleness, now in scope by user decision |
| 6 | README | L1 exact H1 text | CONFIRMED | verbatim match | rename target accurate |
| 7 | README | L26/L54 install URLs | CONFIRMED | exact line match | frozen-URL lines correct |
| 8-12 | Phase2 docs | MARKETING.md 1/0, CLAUDE.md 3/2, guide/SKILLS.md 3/1, guide/COMMANDS.md 6/2, skills/marketing/README.md 6/1 (total/frozen) | ALL CONFIRMED | grep counts match; 19 cited line/content pairs spot-checked verbatim | phase-02 scope accurate |
| 13-20 | docs/ folder | 8 files' total/frozen counts (codebase-summary 16/14, roadmap 9/4, pdr 11/6, arch 7/3, code-standards 6/0, deploy 4/2, design 3/1, registry 16/2) | ALL CONFIRMED | grep counts match exactly | phase-03 scope accurate |
| 21 | docs/ folder | Frozen repo-URL lines (roadmap:5, codebase-summary:5,285, pdr:7, deploy:17) | CONFIRMED | verbatim `**Repository**: https://github.com/trungdo9/ClauKit` etc. | must-not-touch lines correct |
| 22 | docs/ folder | Dated historical entries in roadmap.md @89,194,205 | CONFIRMED | quoted section headers | phase-03 rewrite-vs-freeze decision informed |
| 23 | CLI/pkg | bin/ck.js 7 hits @4,43,93,107,119,185,188 | CONFIRMED | exact | phase-04 scope (on hold) |
| 24 | CLI/pkg | cli-parser.js 4 hits @60,64,66,94 | CONFIRMED | plan prose slightly imprecise ("npx line twice") but table itself lists distinct lines correctly — no impact | — |
| 25 | CLI/pkg | tests/esm-host.test.js:306 assertion text | CONFIRMED | verbatim | frozen-line justification correct |
| 26 | CLI/pkg | package.json name/version/bin/description current values | CONFIRMED | exact | phase-04 baseline correct |
| 27 | CLI/pkg | npm test baseline 329/328/0/1 | CONFIRMED | reproduced | — |
| — | CLI/pkg | Concurrent `ck convert` edits to bin/ck.js/cli-parser.js do NOT overlap the plan's target lines; current line numbers still match plan citations | CONFIRMED (as of check time) | diff regions distinct | **caveat: re-verify line numbers immediately before Phase 4 patches — another session is actively editing these files** |
| 28 | Global | `.claude/.gitignore:1` == `gitignore-wire.js:38` byte-identical | CONFIRMED | both quoted, match | — |
| 29 | Global | `tests/installer-packaging.test.js:136` asserts the two headers byte-match | **REFUTED** | that assertion compares the `RULES` pattern array, not `HEADER` text — zero grep hits for header string in test file | The stated *reason* for freezing `.claude/.gitignore`/`gitignore-wire.js` is wrong (no test enforces header-text match today). Freezing them is still correct practice (no phase touches them; not load-bearing to any in-scope phase) — not blocking |
| 30 | Global | `docs/clauKit-registry.md` referrers ≈15 | CONFIRMED but undercounted | actual = 23 | only matters if that file is ever renamed (deferred, separate future plan per plan.md Q5) — not blocking this plan |
| 31 | Global | `plans/260730-1359-clauKit-upgrade/` exists + referenced README:93, roadmap:77 | CONFIRMED | dir exists, both lines quoted | — |
| 32 | Global | `ClauKit-CLI` User-Agent @github-client.js:47,69 | CONFIRMED | verbatim | — |
| 33 | Global | `.releaserc.json` releaseRules: docs+README/refactor/style → patch; chore absent | CONFIRMED | array quoted | commit-type constraint (`chore(brand):`) is correct |
| 34 | Global | `.opencode/`, `AGENTS.md` in package.json `files` but absent on disk | CONFIRMED | `ls` → no such file, both | supports Correction-to-brainstorm-premise in plan.md |

## Load-bearing check

Only claim #29 is REFUTED. It is **not load-bearing** — no phase in this plan edits `.claude/.gitignore` or `bin/lib/gitignore-wire.js` (both are in the "never edit" list regardless of the test's actual assertion scope), so the plan's approach does not depend on the refuted claim. **Gate passes — cleared to implement.**

## Unresolved (carried from group reports, non-blocking)

- Claim 4: JSON-LD blocks actually span 765–827, not the estimated 760–825 (informational only, phase-01 brief already uses correct ranges).
- Claim 30: registry.md referrer count is 23, not ~15 — relevant only to a future filename-rename plan (out of scope here).
