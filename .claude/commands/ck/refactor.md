---
description: ⚡⚡⚡ Large mechanical refactor (rename · extract · migrate · codemod) with atomic-commit + rollback gates
argument-hint: [refactor-pattern]
---

## Refactor request
<request>$ARGUMENTS</request>

## Instructions

**Activate the `refactor` skill** ([.claude/skills/software/refactor/SKILL.md](.claude/skills/software/refactor/SKILL.md)) and follow its full pipeline:

- **Pre-flight gate** — clean tree · tests green · types green · dedicated branch (BLOCK if any fails)
- **7-Phase pipeline** — Scope → Dry-run → Batching → Execute → Atomic Commit → Verify → Final Verify
- **Behavior preservation is non-negotiable** — any behavior change = not a refactor, redirect to `/ck:cook`
- **One concern per batch** — no bundled cleanups
- **Every batch revertible** — `git revert <hash>` must restore working state

The `refactor` skill is the single source of truth for methodology; this command is only the trigger.

## When request is ambiguous

If `<request>` does not clearly identify:
- The exact symbol / pattern to change
- Which directories / files are in scope
- The target form (rename to what? migrate to what API?)

→ Ask **one focused clarifying question** before proceeding. Do not start dry-run with ambiguous scope.

## Agent delegation

- `scout` agent — Phase 2 (parallel dry-run discovery if blast radius large)
- `tester` agent — Phase 4/6 (run test suite between batches)
- `code-reviewer` agent — Phase 6 (verification gate) + Phase 7 (final review)
- `git-manager` agent — Phase 5 (atomic commits with conventional-commit format)

## Environment Pre-flight (before the first edit)

1. `node .claude/hooks/file-claims.js list` → any `FOREIGN` claim = another live session is editing this tree. A large refactor in a shared tree is how batches sweep up foreign work.
2. If a foreign claim exists **or** the tree is dirty: provision an isolated worktree first — `node scripts/ck/wt-new.js <refactor-slug>`, then `node scripts/ck/wt-doctor.js`; **unhealthy → refuse to proceed**.
3. Record the worktree path in `plans/<plan>/STATE.md` so a resume lands in the right tree.

## Hard Rules

- **No behavior change.** If the task changes behavior → STOP, redirect to `/ck:cook`.
- **Clean tree required.** Refuse to start with uncommitted work.
- **Tests must pass before AND after.**
- **Dedicated branch — never `main`.**
- **Sacrifice grammar for concision** in reports.
- **List follow-ups separately** — never bundled into the refactor.

## Related

- `/ck:cook` — when work is a feature, not mechanical
- `/ck:fix` — when work is bug fix
- `/ck:port` — when porting refactored version from external repo
- `code-reviewer`, `tester`, `git-manager`, `scout` agents
