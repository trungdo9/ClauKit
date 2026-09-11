# Standards-axis re-review — Fix Cycle 3: 3e1f6d5 → c97482d

Read-only verification of closed items from cycle 2 + NEW delta findings.

## Table

| item | verdict | evidence file:line |
|---|---|---|
| business-analysis-rules.md § 11 — six subcommands | CLOSED | `.claude/workflows/business-analysis-rules.md:91` — `index / gap / validate / compose / changelog / deliver` |
| spine-deliver.cjs — unknown-deliverable violations have `id` field | CLOSED | `.claude/scripts/ba/lib/spine-deliver.cjs:48,64` — both violations include `id: ''` in shape `{ file: '', id: '', check: 'unknown-deliverable', msg: … }` |
| warnIfIgnored refactored: array param, single spawn, absolute paths | CLOSED | `:72` (after `all` loop, one call with `files` array) · `:71` (single-deliverable, pass `[outPath]` array) · `:119` grep-c=1 (`spawnSync('git', ['check-ignore', ...abs]`) · `:116-117` (`path.resolve(projectDir)` and `outPaths.map(p => path.resolve(p))`) · `:18` (`const path = require('path')` present) |

**Totals:** 3 CLOSED, 0 OPEN, 0 REGRESSION.

---

## NEW in delta

**a) `String(r.stdout || '')` error handling:** When `git` is not installed or directory not a repo, `spawnSync` returns `status` null or 128 with `stdout` empty/undefined. The pattern `String(r.stdout || '')` converts null/undefined to `''`, splits on newline, filters empty strings, and iterates zero times. ✓ No throw; null/128 cases handled. **CLEAN**

**b) Warning print order:** Warnings (stderr) execute during `deliver()` → `warnIfIgnored()` calls, **before** the CLI layer prints `✓ delivered ...` (stdout). Technically stderr appears before stdout, not after. Interleaving is avoided (separate streams). **ACCEPTABLE** — a future refactor could defer warnings until post-delivery summary, but current order is sound.

**c) `path` requirement:** Yes. Line 18: `const path = require('path')` is present. Used at `:116-117` for `path.resolve(projectDir)` and `path.resolve(p)`. **REQUIRED & PRESENT**

---

## Verdict

**CLEAN**
