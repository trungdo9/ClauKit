---
name: run-state
description: Durable per-plan run ledger (STATE.md) so a killed multi-phase run resumes with zero re-implementation. Use for any multi-phase run (/ck:cook, /ck:flow, /ck:fix, /ck:refactor), when resuming an interrupted run, after a spend/session kill, or after context compaction. Covers the append-only event contract, the resume protocol (re-derive truth from git + gates, never trust the plan's status claims), and parallel-session safety.
metadata:
  version: "1.0.0"
---

# Run-State — the Durable Ledger

## Why

Progress that lives in TodoWrite + prose plans dies with the session: ≥11 runs across two users were killed mid-phase by spend limits / session loss / 529s, each costing full manual state reconstruction (one needed 4× `continue`; TodoWrite itself failed repeatedly). The ledger is the record that survives.

**Ledger is authoritative over recollection.** After compaction or resume, what you "remember" doing is inadmissible; what `STATE.md` + git say happened is the record. TodoWrite is a UI mirror, never the record.

## Where

`plans/<plan>/STATE.md` — beside the plan it tracks, **committed with the phase it records**, so a resume after a machine loss can pull it from the remote.

**An ignored ledger is a broken ledger.** On start, run `git check-ignore plans/<plan>/STATE.md`. If it matches, the ledger can neither be committed nor survive `git clean -fdx` — warn once and name the fix (the repo's `.gitignore` needs the re-include stanza below; a downstream project that ignores `plans/` inherits the same defect, invisible until the run that needed the ledger is already dead):

```gitignore
plans/**/*
!plans/**/
!plans/**/plan.md
!plans/**/phase-*.md
!plans/**/STATE.md
```

(The directory re-include line must come first — a file cannot be re-included once its parent directory is excluded.)

## Contract

First line names the plan; everything after is **append-only**, one line per event:

```
# run-state — plan: <plan path>

phase <N>: started (base <sha7>)
phase <N>: gate <name> → PASS|FAIL (evidence: <cmd> → <result>)
phase <N>: complete (commits <a7>..<b7>, tests <X/Y>, review clean|<K> parked)
phase <N>: parked — <finding> — ruling: <why>
phase <N>: BLOCKED — <reason>
```

Full event vocabulary + field semantics: [references/state-schema.md](references/state-schema.md).

Write points: append at **every** gate transition — requirements gate, verify-plan, scope-lock, each implement phase, test, review, debug loop rulings, finish — not only inside Implement. Also record environment facts a resume needs (pre-edit baseline, model substitutions, dead-agent redispatches).

## Resume protocol (the core value)

On starting a run whose plan directory already has a `STATE.md`:

1. **Read the ledger.** Last event tells you the claimed position.
2. **Re-derive true state — never trust status claims** (the source data has plans whose own status lines were wrong):
   - `git log --oneline <base>..HEAD` — what was actually committed;
   - `git status --porcelain` — what is half-done in the tree;
   - **re-run the declared exit gates** of every phase the ledger marks complete (plans carry machine-checkable gates — a command + expected result).
3. **Emit a derived-state table before touching code:** phase · ledger claim · gate re-run result · verdict (CONFIRMED / STALE / CONTRADICTED). A CONTRADICTED phase is re-opened, not re-trusted.
4. Resume at the first phase that is not CONFIRMED complete. Zero re-implementation of confirmed work.
5. Append `phase <N>: resumed (derived from ledger + gates, <K> phases confirmed)`.

## Parallel-session safety

- **One ledger per plan, not per repo** — concurrent sessions on different plans never touch the same file.
- Writes are **append-only single lines** (`>>`), so two sessions on the same plan interleave without clobbering.
- A ledger whose first line names a different plan is another run's record: leave it, start your own.

## Rules

- A killed run resumes from `STATE.md` + gate re-runs alone — if resume would need anything else, that thing belongs in the ledger.
- Evidence in gate lines is verbatim (`<cmd> → <result>`), per the code-review skill's Iron Law — "gate passed" without the command is a claim, not a record.
- Commit the ledger with the phase it records (same commit or immediately after).
- Related: `planning` skill (executable exit gates are what make step 2 possible), `code-review` (verification gates), `tdd` (the `baseline:` line a resume needs to tell inherited breakage from regressions).
