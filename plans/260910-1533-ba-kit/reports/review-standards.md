# Standards axis — ba kit (744c271..3b0f793)

## Standards

### Critical — none.

### High

**H1** `spine-compose.cjs:31`, `spine-index.cjs:38` — bare `readFileSync`/`readdirSync`, while `spine-compose.cjs:158` and `spine-deliver.cjs:46` both promise *"Never throws"*. Delete an entity mid-run, or require `buildIndex` directly (`ba-spine.test.js:17`) ⇒ raw ENOENT out of a CLI contracted to exit 0/1/2 (`traceability.cjs:6`). Breaks `development-rules.md:27` + `code-standards.md:317` (always try-catch). Wrap, or drop the claim.

### Medium

**M2** `skills/ba/traceability/SKILL.md:29-34` "The three helper subcommands" — omits `compose`/`changelog`/`deliver`; `business-analysis-rules.md:91` and `traceability.cjs:4` list 4 of 6. That SKILL is the contract every `/ba:` command reads.
**M3** `.claude/kits/ba.json:3` claims "9 skills"; 6 ship. User-visible in `ck init --kit list`. (`README.md:3` "142" verified correct.)
**M4** `tests/ba-deliver.test.js:12` — fixed `os.tmpdir()/test-proj-N` not `mkdtempSync`; collides across concurrent runs/users. `code-standards.md:459` independent tests. Suite idiom elsewhere is `mkdtempSync`.
**M5** `tests/ba-deliver.test.js:192-195` — cleanup inside test 4, not `after()`; tests 1-3 leak if 4 is filtered or an earlier test throws. Same rule.

### Low

**L2** `bin/lib/gitignore-wire.js:53` "the **two** regenerable NAME PATTERNS" — `:58-62` now holds three. `code-standards.md:273`.
**L3** `business-analysis-rules.md:43` "the nine kinds and nothing else" vs `spine-parse.cjs:18` `KIND_ORDER` (ten; CR). An agent obeying rule 7 refuses the `CR-###` that `/ba:spec cr` needs.
**L4** `skills/ba/ba-context/SKILL.md:3` "Activated by /ba:plan" — the one phrase the kit's own rule 5 (`business-analysis-rules.md:23`) legislates against.
**L5** `tests/ba-deliver.test.js:30,45,53,65,76,97,115,125,153` — `execSync` with unquoted interpolated `repoRoot` + embedded `2>&1`; breaks on a path with a space. Suite idiom is `spawnSync(cmd,[args])`. Also ESM (`:1`) vs CJS (`ba-spine.test.js:9`) in one feature's two test files.

### Parked items — ruled

**P1 `tests/ba-spine.test.js` >200.** Ledger says 216; actual **333** — stale by 117, correct the record. `code-standards.md:128` calls 200 a hard limit, `development-rules.md:8` guidance (governs). **Accept:** independent `test()` blocks, nothing to extract. Split past ~400.
**P2 `deliver <owned> --json` prints ⊘ to stderr, nothing to stdout. → Medium, not cosmetic.** Root cause: `spine-deliver.cjs:48` destructures `json` and never reads it; `traceability.cjs:131-136` skips `json` on the `!ok` branch. Consumers get exit 1 + empty stdout, indistinguishable from a crash, while `traceability.cjs:126` advertises `--json`. Fix: emit `{skipped:[…]}`, or delete the dead param. It currently does neither.

Clean: every `ba.json` path `.claude/`-prefixed · 28 shipped links resolve from installed position · no pointer to `plans/ba/demo/**` or root `skills/` · all shipped Node `.cjs` · six modules 113-187 lines.

### Baseline smells (judgement calls)

*Each: "Judgement call: no documented rule covers this."*

possible **Duplicated Code** — `traceability.cjs:27-30` / `spine-deliver.cjs:39-42`: identical `die()`; the second is never called. → delete the dead copy.

possible **Duplicated Code** — `traceability.cjs:93-96` / `spine-deliver.cjs:105-108`: same `git check-ignore` + same `⚠ …(D-11)` string; `deliver all` (`spine-deliver.cjs:68-73`) omits it, so the warning depends on the branch. → one `warnIfIgnored()`.

possible **Duplicated Code** — `traceability.cjs:126`, `spine-deliver.cjs:81`, `:96`: deliver usage string verbatim 3×. → one `DELIVER_USAGE` from `Object.keys(DELIVERABLES)`.

possible **Duplicated Code** — `spine-index.cjs:94`, `:127`, `spine-compose.cjs:164`, `deliver-templates.cjs:33`, `:53`: `byId` map built 5×. → build once in `buildIndex`.

possible **Repeated Switches** — `spine-parse.cjs:123-141`: five copies of `if (!blank(data.X) && !X_KINDS.has(prefix)) push(…)`. → one key→kinds table, one loop.

possible **Repeated Switches** — `traceability.cjs:44-146`: six `action ===` arms each re-doing `if (json) … else …`; `index`/`compose` `return` while four `process.exit`. → one action map, one emit.

possible **Speculative Generality** — `spine-deliver.cjs:95-98`: `if (!render)` unreachable — `templates` keys == `DELIVERABLES` keys, already validated at `:79`. → delete.

possible **Middle Man** — `traceability.cjs:151`: `{ main, ...spine }` re-exports the spine through the CLI; `ba-spine.test.js:17` requires it directly. → export `{ main }`.

---

**Total: 10 findings** — 0 Critical · 1 High · 4 Medium · 4 Low (+2 parked ruled) · 8 smells.
**Worst: H1** — two docstrings guarantee "never throws" over unguarded file I/O, against a try-catch rule in both rule files.

## Unresolved questions

1. `code-standards.md:625` requires `name:` in command frontmatter; none of the repo's 45 commands carry it, ba included. Fix the standard, not the diff?
2. `code-standards.md:128` ("MUST be refactored") vs `development-rules.md:8` ("keep under") — live contradiction, resolved for P1 by the brief. Reconcile the files?
3. Is `deliver all`'s missing git-ignore warning deliberate? Decides whether P2's fix must cover both branches.
