---
name: git
description: Git operations with conventional commits (cm, cp, pr, merge, finish) — scoped commits from the claim registry, finish-branch protocol with draft-default PRs + paste-ready auth fallback, and declared delivery-tail execution semantics
category: Git & Version Control
status: active
---

# Git Operations & Conventional Commits

## Purpose

Master Git workflows with conventional commit semantics. Provides structured guidance for staging, committing, pushing, creating PRs, and merging code using industry-standard commit message conventions.

## When to Use

- Staging and committing code changes with semantic commit messages
- Creating pull requests on GitHub/GitLab with proper descriptions
- Merging feature branches and managing release workflows
- Squashing, rebasing, or amending commits
- Implementing pre-commit hooks for code quality (linting, tests)
- Resolving merge conflicts and maintaining clean history
- Automating version bumps based on commit types

**Do NOT use when**: Cherry-picking individual commits from history, reverting multi-commit PRs, or managing submodules (use separate workflow).

## Workflow

1. **Stage Changes** — Use `git add <files>` to stage specific modifications. Avoid `git add .` unless intentional. Review with `git diff --cached`.

2. **Commit with Conventional Format** — Write commits as `<type>(<scope>): <subject>` followed by blank line and body.
   - `feat(auth): add JWT token refresh` (new feature)
   - `fix(database): resolve connection pooling leak` (bug fix)
   - `docs(readme): update installation steps` (documentation)
   - `style(config): format eslint rules` (formatting, no code changes)
   - `refactor(api): consolidate handlers` (restructure without behavior change)
   - `test(unit): add coverage for auth module` (tests only)
   - `chore(deps): bump typescript to 5.0` (maintenance)

3. **Validate with Pre-Commit Hooks** — Hooks automatically check formatting, run linters, and verify tests before commits succeed.

4. **Push to Remote** — Use `git push origin <branch>` to sync local commits. Use `-u` flag on first push for new branches.

5. **Create Pull Request** — Use `git pull-request` CLI or GitHub web UI. Include:
   - Clear title (under 70 chars)
   - Detailed description referencing related issues
   - Screenshot/video for UI changes
   - Checklist of tested scenarios

6. **Merge After Review** — Rebase before merge to maintain clean history. Use `git merge --ff-only` or squash strategy for cleanup.

## Scoped Commits (canonical)

**A commit contains exactly the files this session edited — never the whole tree.** At 43% multi-clauding, `git add -A`/`git commit -am` doesn't just bundle a coworker's WIP; it can stage another live Claude session's half-written files and strand that session on top of your commit.

1. **Manifest is machine-derived:** `node .claude/hooks/file-claims.js list` — `MINE` rows are this session's files (the file-claims registry survives compaction; recollection does not). Registry unavailable → ask for explicit paths; never widen to `-A`.
2. **Foreign WIP is reported, never staged:** dirty paths owned by another session (or unclaimed paths you didn't author) go in a file→owner table in the output.
3. **Stage by explicit path only.** The `guard-destructive` hook denies whole-tree staging when another live session holds claims — the denial prints the scoped command.
4. Re-check staged content before committing (concurrent-editor churn), lint + targeted tests, then a conventional commit with ticket prefix when the branch/plan names one.

## Finish-Branch Protocol (canonical)

1. **Verify first (Iron Law):** tests + typecheck green, output pasted — a PR/merge is a completion claim.
2. **Detect environment:** normal repo · named-branch worktree · detached HEAD.
3. **Menu (wait for the pick):** merge locally · push + PR · keep as-is (detached HEAD: no local-merge option).
4. **PR is draft-default**; body from [references/pr-body.md](references/pr-body.md) — each placeholder transcribed from a pipeline artifact per the template's fill contract; unfilled `{{...}}` never ships; empty sections carry an explicit negative.
5. **Auth failure ⇒ paste-ready payload, never a retry, never a dead end:** emit PR title + body + branches + the exact `gh`/`glab` command, exit cleanly. ≥4 real sessions left finished work unmerged retrying auth.
6. **Merged/deployed claims need remote truth:** `git fetch origin` then inspect the remote ref (`origin/<branch>`, `git branch -r --contains`) — local state, an old fetch, or "the PR was approved" are not evidence.

## Delivery Tail — execution semantics (canonical)

ClauKit ships the **mechanism** to run a project-declared post-PR step list, and **declares no steps of its own** — any built-in list would encode one team's tracker vocabulary into a generic kit; most trackers cannot even express another suite's step names. Projects declare steps in an optional `## Delivery tail` CLAUDE.md block (see the `/ck:claude-md` template, the only file where vendor names may appear — commented out): one bullet per step with `run` · `needs` · `done-when` · `on-fail` keys.

The runner (`scripts/ck/delivery-tail.js`, invoked by `/ck:git pr` step 5 and re-runnable standalone after an interruption — same single code path):

- **Deterministic, no agent on the default path.** A declared step carries `run` + `done-when`, so it is executable as-is; the runner substitutes `{{placeholders}}`, runs the commands, and compares results itself. It does **not** spawn an LLM to do that. Three reasons: the step whose whole purpose is surviving spend limits must cost nothing; an outcome parsed out of model prose is less reliable than an exit code; and an unattended tool grant derived from the declaration would be derived from the very text it would be guarding against.
- **Declaration order.** Steps run in listed order; no reordering.
- **Check-before-write idempotency:** each step's `done-when` (a command + expected result, same shape as machine-checkable plan gates) is evaluated **first**; already-done ⇒ skip, log, move on. A re-run must produce no second write of anything. A step with no `done-when` runs **once** and is then reported, never retried blind.
- **Unresolved `{{input}}` fails the step** with a paste-ready payload naming the missing key — a literal `{{...}}` is never passed to a shell.
- **Agent steps are opt-in and narrow:** a step needing a connected MCP server declares `run: mcp <server> <tool> [json]`. Only that path spawns `claude -p`, with `--allowedTools mcp__<server>__*` and **no Bash** — narrow because the server is a name, not because free text was parsed.
- **`--dry-run` is the audit:** it resolves every placeholder and prints the exact commands, executing nothing. Run it once before trusting a tail.
- **Failure = paste-ready, exit 0:** auth failure or missing input emits the payload the user can run by hand, writes the `STATE.md` line, and continues with the next step (finish-branch rule 5). No retries, no prompts — a declared step carries `run` + `done-when` and is deterministic by construction; anything needing judgement belongs in the plan, not the tail.
- **One `STATE.md` line per step:** `finish: tail <step> → DONE|SKIPPED (idempotent)|FAILED (paste-ready emitted)`.
- **An unparseable declaration is reported and skipped — it never aborts the PR.**
- Absent/empty block ⇒ no tail, no notice, exit 0.

## Key Concepts

### Conventional Commits
Specification (conventionalcommits.org) standardizes commit messages for:
- Semantic versioning (auto-increment patch/minor/major)
- Changelog generation (parse commits to extract features/fixes)
- Better code review context (type signals intent immediately)

Format: `<type>(<optional-scope>): <description>` + optional body + footer.

**Types**:
- `feat`: New feature (bumps minor version)
- `fix`: Bug fix (bumps patch version)
- `breaking`: Breaking change (bumps major version) — mark in footer `BREAKING CHANGE: <description>` or with `!` after scope
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons)
- `refactor`: Code restructuring without behavior change
- `test`: Test additions or updates
- `chore`: Dependency, config, tooling changes
- `perf`: Performance optimization
- `ci`: CI/CD changes

### Staging Strategy
- **Granular commits**: One logical change per commit (easier to revert/bisect)
- **Interactive staging**: Use `git add -p` to stage hunks, avoiding noisy commits
- **Review before push**: Always `git diff HEAD` before `git push` to verify correctness

### Merge Strategies
- **Fast-forward**: Linear history (preferred for small features)
- **Squash & merge**: Single commit per PR (clean history, loses individual commits)
- **Rebase & merge**: Replayed commits on target branch (linear without merge commit)

## Example

```bash
# Stage specific files
git add src/auth.js tests/auth.test.js

# Review staged changes
git diff --cached

# Commit with semantic message
git commit -m "feat(auth): implement JWT token refresh

- Add refresh token endpoint (GET /api/refresh)
- Implement 7-day rotation policy
- Add secure cookie storage

Closes #1234"

# Push and track remote
git push -u origin feature/jwt-refresh

# View commit before push (if using pre-commit hooks)
git log -1 --stat
```

## Common Pitfalls

- **Ambiguous commit messages**: "fix stuff" → unclear intent. Use specific: "fix(api): handle null request body in POST /users"
- **Large monolithic commits**: Mix of unrelated changes → hard to review/revert. Use `git add -p` to split logically.
- **Merge commits pollute history**: Use rebase or squash merge to keep linear history.
- **Ignoring pre-commit hooks**: Bypassing checks with `--no-verify` → breaks CI. Fix issues first.
- **Not syncing before merge**: Working on outdated base → merge conflicts. Always `git pull --rebase origin main` first.

## References

- [Conventional Commits](https://www.conventionalcommits.org/) — Specification and best practices for semantic commit messages
- [Pro Git Book: Chapter 2 (Git Basics)](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository) — Comprehensive staging, committing, and history management
- [Pro Git Book: Chapter 3 (Branching & Merging)](https://git-scm.com/book/en/v2/Git-Branching-Branch-Management) — Merge strategies, rebasing, and workflow patterns
