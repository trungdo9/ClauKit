# STATE.md Event Schema

One line per event, append-only. `<sha7>` = 7-char commit SHA. Timestamps optional (git history already stamps commits); when present, ISO-8601 suffix in parentheses.

## Header (line 1, mandatory)

```
# run-state — plan: <repo-relative plan path>
```

A ledger whose header names a different plan belongs to another run — never append to it.

## Events

| Event | Format | When |
|---|---|---|
| Phase start | `phase <N>: started (base <sha7>)` | before the first edit of the phase; `base` = HEAD at start |
| Gate result | `phase <N>: gate <name> → PASS\|FAIL (evidence: <cmd> → <result>)` | every gate transition: requirements, verify-plan, scope-lock, smoke, tests, review |
| Phase complete | `phase <N>: complete (commits <a7>..<b7>, tests <X/Y>, review clean\|<K> parked)` | after the phase exit gate passes |
| Parked finding | `phase <N>: parked — <finding> — ruling: <why the code stands / deferred>` | loop-cap breaker adjudication (cook Failure Recovery); silent discard is forbidden |
| Blocked | `phase <N>: BLOCKED — <reason>` | load-bearing finding, plan defect, or unrepairable env blocker; run stops |
| Resume | `phase <N>: resumed (derived from ledger + gates, <K> phases confirmed)` | after emitting the derived-state table |
| Environment | `env: worktree <absolute path> (branch <name>, base <sha7>)` | worktree provisioned for this run |
| Model substitution | `env: model fallback <from>→<to> — <reason: 529/overload>` | overload resilience (T6.2) |
| Dead agent | `phase <N>: agent died (no diff) — redispatch` | a dispatched subagent produced no VCS diff; never record it complete |
| Delivery-tail step | `finish: tail <step-name> → DONE\|SKIPPED (idempotent)\|FAILED (paste-ready emitted)` | one line per declared handoff step |
| Waiver | `phase <N>: waiver — <rule> — <who approved / why>` | any skipped mandatory step (e.g. `--no-test`) |

## Field semantics

- **evidence** — verbatim command and observed result, compressed (`npm test → 25 pass 0 fail`). Not prose ("tests pass").
- **tests X/Y** — passed/total of the suite actually run; name the suite if not the default.
- **parked** — the finding text plus a ruling; the final review must read the parked list and triage before merge.
- **commits a7..b7** — the phase's commit range; a resume validates it with `git log`.

## Anti-patterns

- Editing or deleting earlier lines (append a correcting event instead).
- Recording a subagent's self-reported success without a VCS diff (see dead-agent event).
- Mirroring the ledger into TodoWrite and treating the mirror as the record.
- Batching many gates into one line — one event per line keeps interleaved concurrent appends parseable.
