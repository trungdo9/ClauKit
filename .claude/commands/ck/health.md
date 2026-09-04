---
description: Workspace health check — kit drift, backup age, memory index, router size, dead links, inline secrets, orchestrator coverage
---

# /ck:health — is the workspace in a good state?

Run the deterministic check, then act on what it reports. **Never answer this from a doc.** These
checks exist precisely because docs go stale: an install-state table in one workspace was wrong
within hours of being written, and reading it instead of the stamp files produced a wrong report
twice before the script caught it.

```bash
node .claude/scripts/workspace-health.cjs
```

`--json` when another step consumes the result. Exit 0 = all pass · 1 = something to look at ·
2 = the script itself failed. It discovers the repo nodes itself — nothing to configure.

## What each finding means, and what to do

| Check | On WARN/FAIL |
|---|---|
| **kit drift** | A repo is behind its upstream kit. Update it **from inside that repo** — a workspace root that is deliberately bespoke must not be updated by the kit CLI at all, because an overlay lets upstream win on any name collision. An `unstamped` tree has no version to compare, so an update there applies unconditionally: review that first diff. |
| **root backup** | An untracked root with no recent snapshot has no recovery path at all. Run `.claude/scripts/backup-workspace-config.sh`. FAIL here means one `rm -rf` is permanent. |
| **memory index** | `MEMORY.md` is nearing the size where it stops loading. Compact it: one line per entry, merge duplicates, retire entries whose fact is now enforced by a build gate — the gate is the enforcement, the memory is only a reminder of it. |
| **router size** | `CLAUDE.md` costs this on **every turn of every session**. Extract prose to `docs/` and leave a pointer. Never drop a directive to hit a number: a defensible 250-line router beats a 150-line one missing a rule. |
| **doc links** | A dead pointer reads as a missing rule. Fix the path — but if the target does not exist anywhere, the doc is describing code that was removed. Say so instead of repointing the link at whatever is nearest. |
| **inline secrets** | A credential in an always-loaded file reaches every subagent context and every transcript. Move the value into `.claude/.env` and leave the **variable name** behind. Do not echo it while moving it. |
| **orchestrator coverage** | Repos listed as flat dispatch have no owning orchestrator. That is a legitimate choice — confirm it is still the intended one rather than an omission. |

## Reporting

Say what **changed** since the last run when you know it, not just the current status. A check that
flips PASS → WARN is the signal; one that has been WARN for weeks is a decision someone already made.
If a finding contradicts a workspace doc, **the measurement wins** — fix the doc in the same pass and
say that you did.
