# Phase 03a impl — dataset code (tasks 1,2,3,7)

Status: DONE. Not committed. No miner run on real transcripts; synthetic fixtures only.

## Files
- `.gitignore:107-108` comment + `/tests/behavior/routing/data/` (task 1, done first)
- `tests/behavior/routing/scrub-pii.cjs` (94 ln) — `scrub(text, terms)`, `loadTerms(file)`
- `tests/behavior/routing/mine-prompts.cjs` (122 ln) — `mine(root)`, `classify`, `textOf`
- `tests/behavior/routing/split-cases.cjs` (79 ln) — `split(cases,{seed,testFrac})`, `mulberry32`
- `tests/behavior-routing-data.test.js` (197 ln, 14 tests; TDD: seen failing first)

## Behaviour notes
- Miner: string content OR joined `text` blocks; skips arrays with any `tool_result`; skips isMeta/isSidechain; depth-1 `*/*.jsonl` only; `^-tmp` dirs skipped; stdout = counts only, rows carry `projectHash`.
- Scrub: client terms applied first in ONE alternation regex (a term cannot corrupt an earlier placeholder), longest-first; then URL, email, secrets, home paths, IPv4, tickets. Base64-ish runs only if digit+lower+upper mixed (long paths/kebab names survive). Known over-scrub: `UTF-8`, `SHA-256` -> `PROJ-123`.
- Split: strata by `expected[0]`, round(n*0.3) to test, size-1 stratum stays train, registry -> train, order-independent (sorted by id before shuffle).

## CLI
- `node tests/behavior/routing/mine-prompts.cjs [--root <dir>] [--out <file>]` — root also env `CK_ROUTING_PROJECTS_ROOT`, default `~/.claude/projects`; out default `data/candidates.jsonl`.
- `node tests/behavior/routing/scrub-pii.cjs [--in candidates.jsonl] [--out scrubbed.jsonl] [--terms file]` — defaults in `data/` (`scrub-terms.local.txt`); prints counts. Writes `data/scrubbed.jsonl` (my addition, needed by task 4).
- `node tests/behavior/routing/split-cases.cjs [--file data/cases.jsonl] [--seed N] [--force]` — exit 2 if already split without `--force`; warns if registry >20% of train.

## Gate (verbatim tails)
```
$ git check-ignore -v tests/behavior/routing/data/x
.gitignore:108:/tests/behavior/routing/data/	tests/behavior/routing/data/x
$ git check-ignore tests/behavior/routing/data/cases.jsonl
tests/behavior/routing/data/cases.jsonl
$ node --test tests/behavior-routing-data.test.js
# tests 14 / # pass 14 / # fail 0
$ npm test
# tests 443 / # pass 442 / # fail 0 / # skipped 1
$ wc -l tests/behavior/routing/*.cjs tests/behavior-routing-data.test.js
  122 mine-prompts.cjs
   94 scrub-pii.cjs
   79 split-cases.cjs
  197 tests/behavior-routing-data.test.js
  (+ existing route-grade 146, routing-guard 72, routing-stats 86)
```

## Unresolved
- Ticket regex over-scrubs `UTF-8`-style tokens; add allowlist? (cosmetic, only affects prompt text)
- Slash `sourceCmd` stores `command-name` minus leading `/`; phase 01 `commandAliases` normalisation not cross-checked.
