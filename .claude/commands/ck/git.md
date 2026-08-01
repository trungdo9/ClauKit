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

→ **Three protocols are canonical in the [`git` skill](../../skills/software/git/SKILL.md)** and are deliberately not restated here — this file declared that skill their owner one line above, and a protocol written down twice drifts:
> **Scoped Commits** · **Finish-Branch Protocol** · **Delivery Tail — execution semantics**

Only the dispatch differences live below.

### `cm` — commit only (scoped) / `cp` — commit + push

→ git skill § **Scoped Commits**. Manifest comes from `node .claude/hooks/file-claims.cjs list` (the `MINE` rows). `cp` additionally pushes.

### `pr` — non-interactive finish: verify → self-review → draft PR → declared tail → teardown

TO_BRANCH: {ARG1} (defaults to `main`) · FROM_BRANCH: {ARG2} (defaults to current branch)

→ git skill § **Finish-Branch Protocol** for the ordering, the Iron-Law gate, draft-default, the `pr-body.md` fill contract and the auth-failure paste-ready rule.
→ git skill § **Delivery Tail** for step 5's semantics. Runner: `node scripts/ck/delivery-tail.cjs` (`--dry-run` to review, `--approve` to arm).

Flags: `--ready` opens the PR undrafted · `--no-handoff` skips the tail (a WIP PR mid-ticket).

### `finish` — interactive: verify → menu → done

Same protocol, with a stop for the pick instead of going straight to a PR:
- **merge locally** (into TO_BRANCH, `--ff-only` preferred) · **push + PR** (→ `pr` above) · **keep as-is** (report branch + how to resume)
- On detached HEAD the local-merge option is not offered.

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
