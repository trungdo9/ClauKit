---
description: Git operations dispatcher (flags cm cp pr merge finish)
argument-hint: cm | cp | pr [to-branch] [from-branch] [--no-handoff] [--ready] | merge [pr-number|target-branch] | finish
---

## Variables

ACTION: $1 (one of `cm`, `cp`, `pr`, `merge`, `finish`)
ARG1: $2
ARG2: $3
FLAGS: `--no-handoff` (skip declared handoff steps — WIP PR mid-ticket) · `--ready` (open PR non-draft)

## Workflow

Dispatch to the matching operation based on {ACTION}. Use `git-manager` agent for all git/GitHub work. The `git` skill is the canonical knowledge (scoped commits, finish-branch, delivery-tail semantics); this command is the trigger.

### `cm` — commit only (scoped) / `cp` — commit + push

**Never stage the whole tree.** The scoped-commit protocol (git skill "Scoped Commits" is the source of truth):

1. **Derive the session manifest from the claim registry** — `node .claude/hooks/file-claims.js list` → the `MINE` rows are the files this session edited (machine-derived; survives compaction). Registry unavailable/empty → fall back to asking the user which files are theirs; never fall back to `-A`.
2. `git status --porcelain` + `git stash list`; diff against the manifest. **Report foreign WIP explicitly**, attributed to the owning session where known (`FOREIGN` rows). Foreign WIP is never staged.
3. `git add <manifest paths>` — explicit paths only; never `-A`, `.` or `commit -am` (the guard-destructive hook denies these when another live session holds claims).
4. Re-check your edits are still present in the staged diff (concurrent-editor churn).
5. Lint + targeted tests on the staged scope; abort red.
6. Conventional commit (`type(scope): description`); prefix the ticket ID if the branch or plan names one. `cp` additionally pushes.

### `pr` — finish the branch: verify → self-review → draft PR → handoff tail → teardown

TO_BRANCH: {ARG1} (defaults to `main`) · FROM_BRANCH: {ARG2} (defaults to current branch)

1. **Verify first (Iron Law):** tests + typecheck green — run them, paste the result. Red → stop; a PR is a claim the work is done.
2. **Self-review the diff, scoped to session files only** (manifest from step `cm`.1): read `git diff <TO_BRANCH>...HEAD`, confirm no unrequested artifacts, no secrets, no foreign WIP.
3. **PR description from the pipeline's own artifacts** via the `pr-body.md` template ([.claude/skills/software/git/references/pr-body.md](.claude/skills/software/git/references/pr-body.md)) + its fill contract — every placeholder transcribed from an upstream artifact, never composed at PR time. Zero `{{...}}` may survive; a section with nothing to say gets an explicit negative (`Tradeoffs: none — <reason>`). A project may override the template via its CLAUDE.md.
4. **Open the PR draft-default** (`gh pr create --draft` / `glab mr create --draft`). `--ready` opts out. Reviewer time is expensive; a wrong root cause reaching "ready" is how bad merges happen. Update an existing PR's body **in place, never append**.
5. **Run the project's declared handoff steps, in declaration order** — the optional `## Delivery tail` block in the project's CLAUDE.md (see git skill "Delivery Tail" semantics). Execute via `node scripts/ck/delivery-tail.js` — a deterministic executor (no LLM: declared steps carry `run` + `done-when`), the single code path, re-runnable standalone after an interruption. A tail runs only once approved on this machine (`--approve`); an unseen or edited declaration is refused with the steps printed, because `CLAUDE.md` is tracked and a merged PR could otherwise add steps that run unattended. Review with `--dry-run`, which resolves placeholders and prints the exact commands without executing. **ClauKit declares no steps of its own: absent/empty block ⇒ no tail, no notice.** `--no-handoff` skips this step.
6. **Worktree teardown** via `node scripts/ck/wt-clean.js <path>` once the PR is open (if this run provisioned one; path is in `STATE.md`).

**Auth failure → do not retry.** `gh`/`glab` unauthenticated or token invalid: emit a **paste-ready block** — PR title · full body · source branch · target branch · the exact `gh pr create`/`glab mr create` command — then exit cleanly (steps 5–6 still run where possible). Never let a finished feature die at the auth step; zero retry attempts.

### `finish` — verify → menu → done

1. Tests green first (Iron Law) — run, paste result.
2. Detect environment: normal repo / named-branch worktree / detached HEAD.
3. Present the menu and wait:
   - **merge locally** (into TO_BRANCH, `--ff-only` preferred)
   - **push + PR** (→ `pr` action above)
   - **keep as-is** (report branch + how to resume)
   On detached HEAD: only push+PR (after creating a branch) or keep-as-is.
4. After the pick: execute; if a worktree is done with, offer `wt-clean.js`.

### `merge` — merge PR or branch (interactive)
Detect context, then **ask the user** to confirm the merge strategy before acting:
1. Detect: is `gh` available? Does the current branch have an open PR? Is {ARG1} a PR number or a target branch name?
2. Offer choices (pick the relevant ones):
   - **Merge via `gh pr merge`** (squash / merge-commit / rebase, optionally `--delete-branch`) — preferred when a PR exists.
   - **Local merge** — checkout target branch, pull, merge current branch in, push.
3. Wait for user's choice, then execute.
4. If {ARG1} is a number → treat as PR number. If a string → treat as target branch.
5. **Merged-status claims require remote truth:** `git fetch origin` + inspect `origin/<branch>` / `git branch -r --contains` before reporting anything merged — local branch state is not evidence.

## Notes
- If {ACTION} is missing or not one of the five above, print usage and exit.
- Append one `STATE.md` line per delivery-tail step and for the PR itself (run-state skill).
- **NEVER** force-push, reset hard, or skip hooks unless the user explicitly asks (the guard-destructive hook enforces this).
- No AI attribution anywhere: commits, PR bodies, trailers (`includeCoAuthoredBy: false` + development rules).
