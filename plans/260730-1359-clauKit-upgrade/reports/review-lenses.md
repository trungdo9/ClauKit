# Multi-lens review — `cdbe5e0..d114c7b`

**Date:** 2026-07-31 · **Scope:** 90 files, +4940/−405 · **Method:** 4 concurrent `code-reviewer` lenses (ADVERSARY · BLAST RADIUS · FIDELITY · CONVENTION), each given the diff + spec and **not** the author's reasoning. Admissibility: `file:line`, git ref, or verbatim output, else dropped.

**Verdict: do not push.** Three CRITICAL defects confirmed by independent re-execution, two of them remote-reachable. Separately, the behavioural eval layer is now proven to verify nothing.

---

## Resolution status (2026-07-31, after the review)

Every finding above is addressed across six commits (`23b0187`, `b4d4832`, `724a57d`, `ad9e8d0`, `3f88d50`, `d4d7422`, `b1d5a18`, `adc0c36`). Suite: **180 tests, 179 pass, 0 fail**, up from 111.

| Group | State |
|---|---|
| C1 heredoc bypass · C2 ref injection · C3 tail injection | fixed, each re-verified by the probe that originally proved it, and each regression test checked for sensitivity by reverting the fix |
| 7 guard bypasses (`stash -a`, `checkout -f`, `add :/`, `rm -Rf`, escape-hatch scope, `rm -rf /`, `DROP DATABASE`) + unimplemented `INSERT` | fixed |
| Tier B over-denial | now intersects claims with the op's real reach; uncovered a pre-existing substrate bug (`--porcelain` collapses untracked directories, so claims on files in a new directory were pruned as clean) |
| Installer: inert hooks on upgrade · `--force` deleting user files · consumer `.gitignore` · npm tarball | fixed, with an end-to-end upgrade test |
| Scripts: NUL byte, compaction race, `rg -g`, realpath containment ×2, CI verdict exit code | fixed |
| Docs: registry 53→56/216, README marketing counts, codebase-summary, roadmap, two plan self-contradictions | fixed |
| Trio-rule duplication (5 protocols) | commands reduced to pointers |
| 6 insensitive scenarios | rewritten — **not yet re-verified**, see below |

**Still open, deliberately:** `wt-new` provisioning is non-atomic (a red smoke gate leaves a registered worktree and branch behind, and the printed recovery path needs `--force` plus a branch delete); `delivery-tail` re-runs a step that declares no `done-when`; solo users can trip Tier B against their own previous session after a CLI restart. All three fail safe.

**Not verified:** the six rewritten scenarios need `run-scenario.sh --all --negative` — 12 `claude -p` runs — before any of them counts as evidence again.

---

## Confirmed CRITICAL (re-verified by the orchestrator, not taken on report)

### C1 · Heredoc bodies bypass the whole guard — regression introduced by the previous review's own fix
`.claude/hooks/guard-destructive.js:49-54`

`stripHeredocs()` treats every heredoc body as inert data. But `bash <<EOF`, `sh <<EOF`, `psql <<SQL` feed that body to an interpreter, so wrapping any Tier A shape in a heredoc disarms Tier A completely.

```
bash <<EOF + git reset --hard   -> exit 0   (allowed)
plain git reset --hard          -> exit 2   (denied)
```

Provenance matters here: `stripHeredocs` was added one turn earlier to fix a false positive where a *commit message describing* `git clean -fdx` was denied. The fix over-corrected from "prose in a heredoc is data" to "every heredoc is data". The correct rule is conditional on the segment's binary: a heredoc feeding `cat > file` is data; a heredoc feeding `bash`/`sh`/`zsh`/`psql`/`mysql` is code and must be re-analysed. The accompanying test (`tests/guard-destructive.test.js:269`) asserts a destructive command *after* a heredoc is caught, and never one *inside* — so it reads as covering this and does not.

### C2 · Git refs interpolated into `execSync` — command injection
`scripts/ck/review-package.js:37-45` · `scripts/ck/ci-review.js:42-44` · `scripts/ck/wt-new.js:78` (all via `lib/common.js:10`)

`sh(\`git rev-parse --short ${base}\`)` builds a shell string from an unvalidated ref. Git permits `;`, `` ` ``, `$`, `|`, `&` in branch names.

```
review-package.js exit=0
marker created? YES -> INJECTION CONFIRMED
```

`.github/workflows/ck-review.yml.template:19` wires `origin/${{ github.base_ref }}` straight into this sink inside a job holding `ANTHROPIC_API_KEY` and a `pull-requests: write` token. The template uses `pull_request` (not `pull_request_target`), which keeps fork PRs from receiving secrets — that is the only reason this is not immediately remote-exploitable, and it also means the CI review is red on every external contribution.

Fix is mechanical and already modelled in the same file: `run('git', ['rev-parse', '--short', base])` — argv, no shell. `ci-review.js:89` already does this correctly for `gh`.

### C3 · `delivery-tail` substitutes untrusted values into `shell: true`
`scripts/ck/delivery-tail.js:102-104,116-120,124-126`

`{{branch}}` and `--context k=v` values are pasted textually into a command run through a shell, unquoted and unvalidated.

```
branch: x;touch${IFS}/tmp/ck-c3/PWNED
declared step: run: `echo shipped {{branch}}`
DONE: notify
TAIL COMPLETE: 1/1 done, 0 skipped, 0 failed
PWNED created -> CONFIRMED
```

The step reports `DONE`. Reachable by `gh pr checkout <n>` on a fork PR, whose head-ref name the contributor chooses — the project's own benign tail then executes their payload, with nothing visible in the diff.

**Related, same file:** `delivery-tail` executes the `## Delivery tail` block out of the target project's `CLAUDE.md`, a tracked file that arrives via `git pull` or a merged PR. A four-line docs-looking PR becomes code execution on every maintainer's next `/ck:git pr`. And `parseSteps` strips only HTML comments, so a fenced ```` ```markdown ```` block — the natural way to *document* the format — is parsed as live steps.

---

## HIGH — guard bypasses (each with executed proof in the lens reports)

| Shape | File | Note |
|---|---|---|
| `(cd sub && git reset --hard)` | `guard-destructive.js:66,70` | `segments()` never strips `(`/`)`, so `--hard)` ≠ `--hard`. The standard monorepo idiom is unguarded; `$(…)` and backticks too |
| `git stash -a` / `--all` | `:109` | Checks only `u`. `-a` additionally sweeps git-ignored files — strictly worse than the `-u` the rule was written for. Test at `:66` uses `-au`, which passes only because the string contains `u` |
| `git checkout -f <branch>` · `git restore --worktree :/` | `:122-125` | Keys on the literal pathspec `.`; same data loss as the denied `reset --hard` |
| `git add :/` · `git add *` | `:179-181` | Tier B enumerates `-A/--all/./-u`. `:/` demonstrably sweeps a foreign session's file from an unrelated subdirectory — the retry an agent reaches for after Tier B denies `-A` |
| `rm -Rf` · `rm --recursive --force` | `:96,142` | `hasCombinedFlag` tests the token case-insensitively but `a.includes(letter)` case-sensitively. `-R` is the macOS-idiomatic spelling |
| `CK_ALLOW_DESTRUCTIVE=1 npm ci && git reset --hard` | `:269` | The escape hatch is matched against the whole command before segmentation, so scoping it to one segment disarms the rest — and the guard's own denial message teaches this shape |
| `rm -rf /` · `rm -rf ~` · `rm -rf $HOME` | `:147` | `w.startsWith(abs + path.sep)` yields `'//'` when `abs === '/'`, so no worktree matches; `~`/`$HOME` are never expanded. `rm -rf .` is denied while `rm -rf /` is allowed |

## HIGH — distribution and upgrade path

| # | Finding | Evidence |
|---|---|---|
| H8 | **The entire safety layer is inert for existing users.** On `ck init` without `--force` the new hook files install but the pre-existing `.claude/settings.json` is skipped, so nothing ever wires `guard-destructive` or `file-claims` | `⚠️ SKIP (exists): .claude/settings.json` while both hooks sit on disk unreferenced |
| H9 | **`ck init --force` deletes a top-level user directory.** This diff added `"scripts": ["scripts/ck/"]` — the first destination outside `.claude/` — and `--force` does `fs.rmSync(dst, {recursive:true, force:true})` | a pre-existing `scripts/ck/my-own-deploy.js` was destroyed with no warning; the user's `settings.json` allowlist and custom hooks were replaced |
| H10 | `wt-new` anti-nesting guard compares lexical paths, no `realpath` — a symlinked `--dir` lands the worktree physically inside the repo, the exact shape its own message says "deleted real nested directories" | worktree created at `/tmp/.../nest/sub/nest-wt-n2`, showing as `?? sub/` inside the repo |
| H11 | **`file-claims.js` is binary to git.** A literal NUL at byte 4148 (`c.session + '\0' + c.file` written as U+0000) makes git treat it as binary — 199 lines of security-relevant code shipped with no reviewable diff, including in the package supplied for this review | `Binary files /dev/null and b/.claude/hooks/file-claims.js differ` |
| H12 | `scout-block` puts `-g/--glob/--iglob` in `GREP_EXCLUDE_FLAGS`, but ripgrep's `-g` is an **include** glob unless prefixed `!` (already handled separately). `rg -g node_modules …` is now allowed — a real traversal, not a false-positive fix | old=DENY new=ALLOW on `rg -g node_modules foo` |

## MEDIUM (selected)

- **Tier B denies on any foreign claim, not on files the op can reach.** `git add -u` is denied over an *untracked* foreign file it provably cannot stage; `git add .` in an unrelated subdirectory likewise. The module docstring promises intersection semantics (`file-claims.js:12`); the code has none (`guard-destructive.js:232`). This is the false-positive class the codebase itself names as what teaches people to disable guards — and the workaround it pushes toward is `git add :/`, which is unguarded.
- **Solo users trip Tier B against themselves.** A new `session_id` per CLI restart means yesterday's claim reads as "another live session", with a message that is factually wrong.
- **Claim registry is not gitignored for consumers** (found independently by three lenses). The rule was added to ClauKit's own `.gitignore`; `ck init` ships no `.gitignore` and `grep -rn gitignore bin/ scripts/` is empty. Session ids and edited-file paths become committable in every installing repo. Same for `.claude/.ck-smoke-cache.json`.
- **npm tarball ships 680 KB of internal review dumps** — `files: ["plans/"]` whitelists artifacts that `.gitignore` excludes; `npm pack --dry-run` shows `review-package-*.md` as the largest file in the package.
- **`ci-review` never fails CI.** The review body can say `VERDICT: FAIL` while the step exits 0.
- **Registry command count is wrong**: header/§3/§6 say 53, the §3 tables hold 56 rows (4 added this range, count bumped by 1). Total should be 216. Skills/agents/workflows match exactly.
- **`INSERT` is specified as Tier A and not implemented** — the one named DB incident in the plan's own evidence base (`32-row backfill INSERT`) is the shape the guard does not cover.
- **`git commit -am` is Tier A in the acceptance criterion, Tier B in the design section of the same task.** Implementation chose Tier B; the status table's "18 Tier-A shapes" over-claims against the criterion that names it.
- **Trio-rule violations**: the canonical lens table, scoped-commit protocol, finish-branch protocol, delivery-tail semantics, and verify-plan method are each duplicated near-verbatim from their skill into the command that declares the skill canonical one line earlier (`review.md:70`, `git.md:15`, `plan.md:116`). `primary-workflow.md:16` models the correct pointer form.
- **`tests/behavior/` and the CI template are shipped by nothing** — no kit manifest, not in `package.json:files` — yet `development-rules.md:55` makes a behavioural-scenario run a *mandatory* gate for consumers.
- **Two production files exceed the repo's own 200-line budget** (`guard-destructive.js` 292, `delivery-tail.js` 248) while shipping the hook that enforces it.

---

## The behavioural eval layer verifies nothing

`run-scenario.sh --all --negative`, first real execution:

```
✓ verify-plan-fires PASS   ✗ NEGATIVE-CONTROL FAIL
✓ tdd-red-first     PASS   ✗ NEGATIVE-CONTROL FAIL
✓ scope-lock        PASS   ✗ NEGATIVE-CONTROL FAIL
✓ resume-from-ledger PASS  ✗ NEGATIVE-CONTROL FAIL
✓ iron-law          PASS   ✗ NEGATIVE-CONTROL FAIL
✓ guard-tier-b      PASS   ✗ NEGATIVE-CONTROL FAIL
── 6 scenario(s) genuinely verified (with negative control)
```

**All six pass with their gate deleted.** Every scenario asserts something the model does anyway — from the prompt, from general competence, or from a sibling rule — so none of them is evidence about the gate it claims to test. The `--fast` PASS reported earlier in this session was therefore not evidence either; that claim is withdrawn.

This is the negative control doing exactly its job on its first run, and it is the single most valuable output of this session: six green checks that meant nothing now read as six red ones that mean something.

---

## Unresolved questions

1. `.github/workflows/ck-review.yml.template` on `pull_request` is red for every fork PR (no `ANTHROPIC_API_KEY`); switching to `pull_request_target` would make C2 remotely exploitable. Which trade-off is intended?
2. Tier B's docstring (intersection with the op's pathspec) and its code (any foreign claim) disagree — which is the intended semantics?
3. Is `ck init` meant to manage a consumer `.gitignore` and `CLAUDE.md`? Three findings (registry not ignored, smoke cache not ignored, `skill-activation.md` shipped with nothing loading it) all reduce to this one unowned question.
4. Is `tests/behavior/` meant to reach consumers? `development-rules.md:55` makes it mandatory for them; nothing ships it.
