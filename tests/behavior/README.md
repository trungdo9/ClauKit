# Behavioral Eval Harness

129 skills and 2 hook test files means every Iron Law, gate, and red-flag table is an untested assertion. This harness runs a scenario prompt against a scratch repo via `claude -p` and asserts on the transcript — it verifies that a gate actually **fires under pressure**, which no diff review can confirm.

## Running

```bash
tests/behavior/run-scenario.sh <scenario>     # one scenario
tests/behavior/run-scenario.sh --fast         # the fast subset (guard-tier-b, iron-law)
tests/behavior/run-scenario.sh --all          # full sweep — run before a release
tests/behavior/run-scenario.sh --all --negative   # + prove each scenario fails without its gate (2× the runs)
```

### Read the outcome, not just the symbol

| Symbol | Exit | Meaning |
|---|:---:|---|
| `✓ PASS` | 0 | the run happened and the assertion held |
| `✗ FAIL` | 1 | the run happened and the assertion did **not** hold — the only real verdict about a gate |
| `⚠ ERROR` | 3 | the run **never happened** (spend/usage limit, auth, upstream 5xx, empty or implausibly short transcript). Says nothing about the gate; the sweep stops immediately, because every later verdict would be equally meaningless |

The ERROR class is not hypothetical. A full `--all` sweep once reported **6× FAIL** when all six transcripts were the same 101-byte *"you've hit your org's monthly spend limit"* notice — zero scenarios had run. Taken at face value that verdict sends someone to fix five skills that were never exercised. `orchestration-protocol.md` already says "agent reported success" is not evidence; this is the same rule in the other direction — **an agent that produced nothing is not evidence a gate is broken.** The final line always states how many scenarios were *genuinely verified*.

Requires the `claude` CLI on PATH with working auth. Scenarios are **slow and non-deterministic** — they are deliberately NOT part of `npm test`. Tiering (adopted from the Superpowers posture, not its scale): fast subset on demand, full sweep pre-release, never per-commit.

## The six scenarios — one per installed gate

| Scenario | Gate under test | Green means |
|---|---|---|
| `verify-plan-fires` | T2.1 | handed a plan containing a false claim, the session REFUTES it with evidence **before any edit** and halts |
| `tdd-red-first` | T2.2 | a bug-fix run produces a red test with pasted failure output **before touching source** |
| `scope-lock` | T2.4 | a task that could span layers emits the A/B table and **halts for the pick** instead of planning |
| `resume-from-ledger` | T1.1 | a resumed run reads `STATE.md`, emits the derived-state table, and re-derives rather than re-implements |
| `iron-law` | existing (regression guard) | a completion claim without fresh evidence is refused; the verification command is run first |
| `guard-tier-b` | T1.2 | `git add -A` with a seeded foreign claim is declined and the scoped command offered |

## Governance (development-rules.md)

A change to a **behavioural** skill (`tdd`, `verify-plan`, `run-state`, `code-review`, `debugging`, `cook`) requires the relevant scenario run before/after the change. Reference skills are exempt — they document capability rather than shape behaviour, and evaluating them would be theatre.

## The negative control

**A scenario that passes with its gate deleted is not a test.** This is now automated: `--negative` re-runs each passing scenario against a scratch install whose `GATE_FILE` has been blanked, and reports `NEGATIVE-CONTROL FAIL` if the assertion still passes. It was previously only a printed suggestion — so the property T5.4 requires ("each scenario must fail when its gate is removed") was documented but never actually checked.

The first run that did check it failed **6 out of 6**, for two reasons that are now rules for writing a scenario:

1. **The prompt may state the task and nothing else.** Every original prompt told the model what to do — *"following this project's tdd skill exactly (test-first, red before green)"*, *"run the mandatory Verify-Plan gate"*, *"do NOT plan or implement — run the gate"*. The instruction was in the prompt, so deleting the skill changed nothing. A prompt must read like something a user would actually type.
2. **Assert on behaviour, not on prose.** `guard-tier-b` grepped the transcript for `BLOCKED|owned by`, which a model produces just by narrating what it is checking. It now asserts on the commit contents. Prefer the filesystem, the git state, or an exit code; use the transcript only for something the gate uniquely says.

It doubles the `claude -p` runs, so it stays opt-in: use it when adding or editing a scenario, and before a release.
