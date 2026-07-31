---
name: refactor
description: Use when the user needs a LARGE MECHANICAL change across the codebase — rename a symbol everywhere, extract a module, migrate an API surface, run a codemod, convert patterns (e.g. class→hooks, callbacks→async/await). Distinct from `/ck:cook` (feature work) and `/ck:fix` (issue resolution). Triggers on "/ck:refactor", "rename across repo", "migrate all X to Y", "extract module", "codemod". Enforces atomic commits, dry-run, type-check gates, rollback plan.
metadata:
  version: "1.0.0"
---

# Refactor — Large Mechanical Change Methodology

Methodology for safe, large-scale, behavior-preserving code changes. Replace ad-hoc "find-and-replace + pray" with a gated pipeline: scope → dry-run → batch → verify → commit → rollback-ready.

## Core Principle

**Behavior preservation is non-negotiable.** A refactor that changes external behavior is a feature, not a refactor — handle via `/ck:cook` instead. Every refactor batch must be reversible via a single `git revert`.

Honor **YAGNI / KISS / DRY**. Mechanical changes only — do NOT bundle "while I'm here" improvements. Those go in a separate PR.

**Be honest, brutal, concise.** If the refactor is unsafe (no tests, no types, mixed behavior change), say so before starting.

## When to Use

Activate when the user asks for:
- **Rename** — symbol / file / folder across many files
- **Extract** — pull a module / hook / component / function out into its own file
- **Inline** — opposite of extract
- **Migrate** — API v1 → v2, class → hook, callback → async, library swap
- **Codemod** — pattern-based transformation (regex / AST)
- **Move** — relocate files / folders, update all imports
- **Convert** — TS strict, ESM↔CJS, default export ↔ named export

**Skip / hand off when:**
- New feature → `/ck:cook` + `cook` skill
- Bug fix → `/ck:fix` or `/ck:debug`
- Single-file edit → just Edit; refactor pipeline is overkill
- Architectural redesign (changes behavior) → `/ck:brainstorm` first, then `/ck:plan`

## Pre-flight gate (BLOCK if any fails)

Before any refactor, verify:

1. **Working tree clean** — `git status` must be clean (no uncommitted changes). User can stash if needed.
2. **Tests exist & pass** — `npm test` (or equivalent) green. Without tests, behavior preservation is unverifiable; warn the user and ask for explicit go-ahead.
3. **Type-check passes** — if TypeScript / mypy / etc, baseline must be green.
4. **Branch is correct** — refactor on a dedicated branch, never on `main`.

If any gate fails → STOP, surface to user, ask for resolution before proceeding.

## 7-Phase Refactor Pipeline

### Phase 1 — Scope definition

Capture in writing **before any change**:
- **What** (precise pattern) — e.g. "rename `getUser` → `fetchUser` in `src/api/**`"
- **Why** (1-line motivation)
- **Out of scope** — what NOT to touch
- **Success criteria** — tests still pass, types still clean, no behavior change
- **Estimated blast radius** — files affected (use `grep -l`)

### Phase 2 — Dry-run discovery

Use `grep` / `Glob` / AST tools to enumerate every site. **Do not edit yet.**

Output: file list + occurrence count. Show to user. Confirm scope before mutating.

```bash
grep -rn "getUser(" src/ | wc -l
grep -rln "getUser(" src/
```

### Phase 3 — Batching strategy

Split into **atomic batches** (each batch = one logical commit):

- **By module** — one folder at a time
- **By layer** — types first, then implementations, then callers
- **By file count** — cap ~20 files / batch (reviewable)

For each batch, predict:
- Files touched
- Whether tests/types will pass at the end of the batch (yes = commit; no = either fix in same batch or rethink boundary)

### Phase 4 — Execute one batch

Per batch:
1. Apply edits (prefer `Edit` with `replace_all` for trivial rename; AST tool for structural).
2. Run type-check.
3. Run tests (at least the affected slice; full suite at milestone batches).
4. If green → commit (Phase 5). If red → fix within batch OR `git restore --source=HEAD -- <batch paths>` + rethink. (Scoped restore, never a whole-tree hard reset — it rolls back exactly the batch and leaves other sessions' files and untracked scratch untouched.)

### Phase 5 — Atomic commit per batch

Commit message format:
```
refactor(<scope>): <verb> <what> (batch N/M)

- Files: <count>
- Tests: passing
- Behavior: unchanged
```

Each batch must be revertible individually.

### Phase 6 — Verification gate (between batches)

After each batch, before starting the next:
- Full test suite (if not run during batch)
- Lint
- Type-check
- Spot-check 2-3 random call sites manually (regex misses edge cases)

If any check fails after commit → revert and rethink boundary.

### Phase 7 — Final verification + cleanup

After all batches:
1. Full test suite
2. Build (if applicable)
3. Run the app — smoke test the affected feature
4. `git log --oneline` review — should read as a coherent refactor story
5. Remove dead code revealed by the refactor (in a SEPARATE commit, not bundled)

## Codemod tooling (recommend, don't force)

For pattern-based changes, prefer AST tools over regex when available:

| Stack | Tool |
|---|---|
| JS/TS | `jscodeshift`, `ts-morph`, `ast-grep` |
| Python | `libcst`, `bowler`, `rope` |
| Go | `gofmt -r`, `gopls rename` |
| Rust | `rust-analyzer rename`, `rerast` |
| Multi-lang | `ast-grep`, `comby` |

Use editor LSP rename for symbol-rename when blast radius is small (<50 sites).

## Anti-patterns (do NOT do)

- ❌ **Bundle behavior changes** — "while I rename this, let me also fix the bug" → split into two commits / PRs.
- ❌ **Skip dry-run** — always enumerate before mutating.
- ❌ **Skip tests** — if no tests, write characterization tests first OR warn user explicitly.
- ❌ **One giant commit** — un-reviewable, un-revertible.
- ❌ **Refactor on `main`** — always a branch.
- ❌ **Refactor without scope doc** — drift inevitable.
- ❌ **Continue when verification fails** — revert and rethink, don't push through.

## Rollback plan (always have one)

Default rollback = `git revert <commit>` for the affected batch(es).

For more complex cases (DB migration coupled to code refactor):
- Document rollback steps in the scope doc
- Test the rollback before committing

## Output Format

When refactor concludes, produce a brief summary:

```markdown
# Refactor Summary — <scope>

## Scope
<what + why>

## Stats
- Batches: N
- Files touched: M
- Commits: <list>
- Test suite: green
- Type-check: green

## Verification
- Full tests run: yes/no
- Build: green
- Smoke test: <result>

## Rollback
`git revert <range>` reverts the entire refactor.

## Follow-ups (separate PRs)
- Dead code removal: <list>
- Bug fixes spotted: <list>
- Doc updates: <list>
```

## Hard Rules

- **Behavior preservation is non-negotiable.** Any behavior change = not a refactor.
- **One concern per batch.** No bundled cleanups.
- **Working tree clean before start.** No uncommitted work mixed in.
- **Tests pass before AND after.** Red→Green→Refactor, not Refactor→Hope.
- **Every batch revertible.** `git revert <hash>` must restore working state.
- **No fabricated APIs or pattern claims.** Verify with `grep` before claiming "all sites updated".
- **Sacrifice grammar for concision** in reports.
- **List follow-ups separately** — never bundle into the refactor.

## Related Skills / Agents / Commands

- `/ck:refactor` command — primary trigger (this skill activates from it)
- `/ck:cook` — when the work is a new feature, not a mechanical change
- `/ck:fix` — when the goal is fixing a bug, not preserving behavior
- `/ck:port` — when porting a refactored version from an external repo
- `code-reviewer` agent — recommended between batches and at the end
- `tester` agent — for running the test suite between batches
- `git-manager` agent — for atomic commits + branch hygiene
- `scout` agent — for parallel discovery in Phase 2 (dry-run)
