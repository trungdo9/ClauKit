---
name: worktree
description: Git worktree isolation for parallel development
category: Git & Version Control
status: active
---

# Git Worktree for Parallel Development

## Purpose

Leverage `git worktree` to maintain multiple isolated working trees from a single repository, enabling simultaneous work on different branches without stashing/context-switching overhead.

**One worktree per concurrent session.** When more than one Claude session (or a session + a human) works the same repository, each takes its own worktree — two sessions in separate worktrees *physically cannot* stage, stash, or clean each other's files, and the file-claims registry partitions along the same boundary. This removes the hazard `guard-destructive` only mitigates.

## Provisioning — use the scripts, not raw commands

Knowledge alone was not enough: worktrees were a top source of lost work when provisioned by hand. Use the tooling:

- `node scripts/ck/wt-new.cjs <id>` — absolute path outside the repo, per-worktree deps, **smoke gate** (typecheck + tests on the untouched base commit; hard-fails red; full-suite result cached per base SHA). A session must never start editing in an environment whose baseline is unproven.
- `node scripts/ck/wt-doctor.cjs [path]` — diagnoses broken/circular `node_modules` symlink, dependency version skew (declared range vs installed), missing env/API keys. Exit non-zero = unhealthy = do not edit there.
- `node scripts/ck/wt-clean.cjs <path>` — teardown via `git worktree remove` with path validation; reports reclaimed disk. `--list` shows stale worktrees and their sizes.

## Non-negotiable constraints

Each constraint cites the incident that earned it:

1. **Absolute paths only, outside the repo root** — a relative-path `git worktree add` nested inside the repo, followed by `rm -rf`, deleted real nested directories.
2. **Teardown via `git worktree remove`, never `rm -rf`** — same incident; `rm -rf` also leaves corrupt worktree metadata behind.
3. **Install deps inside the worktree; `node_modules` is NOT shared between worktrees** — a subagent's `npm ci` at the repo root destroyed a shared `node_modules` symlink → `tsc`/`vitest` exit 216, full toolchain rebuild.
4. **Never run `npm ci`/frozen installs at the repo root from a subagent** — same incident. The `guard-destructive` hook refuses a frozen install when `node_modules` resolves to a symlink.
5. **`git clean -fdx` destroys git-ignored scratch** (including per-worktree caches and any ignored ledger) — blocked at Tier A; delete explicit paths only.
6. **Remove worktrees when done** (`wt-clean.js`) — ~20GB of stale worktrees accumulated silently.
7. **never by `git stash`** — rule and rationale live once in the [`tdd` skill](../../tdd/SKILL.md) § Baseline.

## When to Use

- **Any run where another session is live in the same tree** (file-claims registry shows foreign claims, or the tree is dirty with work you didn't do) — provision before the first edit
- Working on parallel features/fixes without stashing current work
- Emergency hotfixes while mid-refactor on main branch
- Running tests/builds on multiple branches concurrently
- Long-lived experimental branches in isolated directories
- Establishing a trustworthy baseline for a bug fix (base commit, untouched)

**Do NOT use when**: Simple branch switching (use `git checkout`), small single-file edits, or when storage space is critical (each worktree duplicates repo size).

## Workflow

1. **Create New Worktree** — `git worktree add [-b <new-branch>] <path> [<commit-ish>]`
   - Creates directory at `<path>` with linked checkout
   - Optionally creates new branch (`-b`) from specified commit

2. **Switch to Worktree** — Navigate to worktree directory and work normally (Git commands, builds, tests all work as usual).

3. **Commit Changes** — Stage, commit, and push from worktree (changes are tracked in main repository).

4. **List Worktrees** — `git worktree list` to see all active worktrees and their branches.

5. **Remove Worktree** — `git worktree remove <path>` after merging/deleting the branch.

6. **Clean Stale Entries** — `git worktree prune` removes entries referencing deleted directories.

## Key Concepts

### Worktree Isolation
Each worktree maintains its own:
- `HEAD` pointer and checked-out branch
- Working directory state and staged changes
- Per-worktree configuration (via `git config --worktree`)

Shared across worktrees:
- Object database (`.git/objects`) — avoids duplication
- Ref database (branches/tags) — synchronized
- Configuration (unless per-worktree override)

### Locking & Protection
Prevent accidental removal (e.g., portable drives):
```bash
git worktree lock <path> --reason "external hard drive"
git worktree remove -f <path>  # Requires --force for locked
```

### Per-Worktree Configuration
```bash
git config --worktree core.fileMode false  # Only applies to this worktree
git config --worktree --list                # View worktree-specific config
```

### Moving Worktrees
Relocate worktree safely:
```bash
git worktree move <current-path> <new-path>
# Manual move requires: git worktree repair
```

## Example

```bash
# Main branch: long refactoring session
$ git worktree add -b hotfix ../hotfix origin/main
# Creates ../hotfix/ worktree on new 'hotfix' branch from origin/main

$ cd ../hotfix
$ git log --oneline -2  # Verify correct base
$ echo "fix" > bug.txt
$ git add bug.txt && git commit -m "fix(critical): patch production bug"
$ git push -u origin hotfix

# Return to main worktree
$ cd ../project
$ git worktree list
path                     branch
/home/user/project       refs/heads/main
/home/user/hotfix        refs/heads/hotfix

# Cleanup after PR merged
$ cd ../project
$ git worktree remove ../hotfix
$ git worktree prune  # Remove stale entries
```

## Common Pitfalls

- **Checking out same branch in multiple worktrees**: Git prevents this — one branch can only be checked out once. Use `git worktree add -d --detach` for experimental detached heads.
- **Forgetting to remove worktrees**: Accumulates disk usage. Use `git worktree list` regularly and `git worktree remove` after merging.
- **Moving worktrees manually**: Breaks internal links. Always use `git worktree move` or `git worktree repair` if moved manually.
- **Locking without documentation**: Other developers won't know why locked. Always provide `--reason` for locked worktrees.
- **Stale entries after external deletion**: Directory deleted but Git entry remains. Fix with `git worktree prune` or `git worktree repair`.

## References

- [Git Worktree Documentation](https://git-scm.com/docs/git-worktree) — Official git-scm reference with all commands and options
- [Atlassian: Git Worktree Guide](https://www.atlassian.com/git/tutorials/monorepos/git-worktree) — Practical use cases and workflow patterns for parallel development
- [Pro Git Book: Chapter 10 (Git Internals)](https://git-scm.com/book/en/v2/Git-Internals-The-Refspec) — Understanding repository structure and worktree mechanics
