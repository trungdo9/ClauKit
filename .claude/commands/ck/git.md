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

→ **Four protocols are canonical in the [`git` skill](../../skills/software/git/SKILL.md)** and are deliberately not restated here — this file declared that skill their owner one line above, and a protocol written down twice drifts:
> **Scoped Commits** · **Branch Policy in a Shared Tree** · **Finish-Branch Protocol** · **Delivery Tail — execution semantics**

**Branch policy applies to every action below**, and two different hooks enforce two different halves of it:

- **HEAD is shared.** Concurrent sessions share one working tree, so any `checkout`/`switch` relocates them mid-run. The `branch-guard` PreToolUse hook blocks a HEAD move while another live session holds a claim, and names the owning session in the refusal. To decide *before* proposing a command (better than being refused), run `node .claude/scripts/ck/branch-guard.cjs "<git command>"` — exit 1 ⇒ don't run it. `--auto` is the only mode that may move HEAD unasked, and it travels as `CK_AUTO_MODE=1`.
- **Shared branches are not yours to publish to.** The `protected-branch-guard` PreToolUse hook refuses a push or merge that would land on `main`/`master`/`staging`/`uat`/`production`/`prod` — including the *implicit* case, a bare `git push` while HEAD is already standing on one. It fires for subagent tool calls too. `CK_AUTO_MODE` does **not** override it; the deliberate override is `CK_ALLOW_PROTECTED_PUSH=1 <command>`, and an agent must never set it for itself.

The two are not interchangeable: `branch-guard` is about *not relocating other sessions* and is silent when you are alone in the tree, while `protected-branch-guard` is about *not publishing to integration state* and applies whether or not anyone else is working.

Only the dispatch differences live below.

### `cm` — commit only (scoped) / `cp` — commit + push

→ git skill § **Scoped Commits**. Manifest comes from `node .claude/hooks/file-claims.cjs list` (the `MINE` rows). `cp` additionally pushes.

### `pr` — non-interactive finish: verify → self-review → draft PR → declared tail

TO_BRANCH: {ARG1} — defaults to the repo's **integration branch**, not to `main`. FROM_BRANCH: {ARG2} (defaults to current branch)

**Resolve it, do not assume it.** A repo running a `feature → staging → [uat] → PROD` ladder takes
feature PRs on `staging`; defaulting to `main` there aims every PR at production and skips two tiers.
Resolve once and reuse:

```bash
# first of these that exists on the remote, else the remote's own default branch
for b in staging develop; do git show-ref -q --verify "refs/remotes/origin/$b" && TO_BRANCH=$b && break; done
: "${TO_BRANCH:=$(git symbolic-ref -q --short refs/remotes/origin/HEAD | sed 's|^origin/||')}"
: "${TO_BRANCH:=main}"     # detached or no remote HEAD recorded
```

Promotion PRs are the exception and are always explicit: `staging → uat`, `uat → PROD`. Pass {ARG1}
when you mean one of those — never let a promotion be a default.

→ git skill § **Finish-Branch Protocol** for the ordering, the Iron-Law gate, draft-default, the `pr-body.md` fill contract and the auth-failure paste-ready rule.
→ git skill § **Delivery Tail** for step 5's semantics. Runner: `node .claude/scripts/ck/delivery-tail.cjs` (`--dry-run` to review, `--approve` to arm).

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
   - **Local merge** — checkout target branch, pull, merge current branch in, push. **Moves HEAD:** run `branch-guard.cjs` first; with another live session, offer the `gh pr merge` path instead (it touches no local HEAD) or wait for the claim to clear.
3. Wait for user's choice, then execute.
4. If {ARG1} is a number → treat as PR number. If a string → treat as target branch.
5. **Merged-status claims require remote truth:** `git fetch origin` + inspect `origin/<branch>` / `git branch -r --contains` before reporting anything merged — local branch state is not evidence.

## Notes
- If {ACTION} is missing or not one of the five above, print usage and exit.
- Append one `STATE.md` line per delivery-tail step and for the PR itself (run-state skill).
- **NEVER** force-push, reset hard, or skip hooks unless the user explicitly asks — `guard-destructive` enforces this, and `protected-branch-guard` separately refuses publishing to a shared branch at all. Neither refusal is something to work around: do not re-point the remote, add a refspec, or set an override variable. Report and stop.
- No AI attribution anywhere: commits, PR bodies, trailers (`includeCoAuthoredBy: false` + development rules).
