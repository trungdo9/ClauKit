# Safe Writes — the DB Write Protocol

Every mutating statement (`INSERT` / `UPDATE` / `DELETE` / DDL) against a shared database follows this protocol. It exists because a 32-row backfill `INSERT` later proved invalid — and the query tool blocked `DELETE`, so rollback was manual. The `guard-destructive` hook routes blocked SQL here.

## The Protocol

1. **Write the statement to a reviewed migration/script file — never ad-hoc.** An ad-hoc mutation has no review trail and no reproducible form.
2. **Dry-run first:** run the SELECT that matches the mutation's predicate and **report the exact affected row count**. `UPDATE t SET … WHERE p` → `SELECT count(*) FROM t WHERE p` first. A count that surprises you is the protocol working.
3. **Ship a paired rollback script in the same commit.** Forward without backward is half a change. If the mutation is not cleanly reversible (destructive `DELETE` without an archive), say so explicitly and capture the pre-image (`CREATE TABLE _backup_<ts> AS SELECT …`) before mutating.
4. **Get explicit approval before mutating.** Present: the statement, the dry-run count, the rollback path. Wait.
5. **Assume the query tool is restricted:** it may block `DELETE` outright and may reject SQL comments. Write **single-statement, comment-free SQL** so the same text runs everywhere.
6. **Post-evidence:** after the write, re-run the dry-run SELECT and report the new count. "The write succeeded" without the re-count is a claim, not evidence.

## Worked example

Task: deactivate legacy API keys created before 2025.

**Before (ad-hoc — what went wrong historically):**

```sql
UPDATE api_keys SET active = false WHERE created_at < '2025-01-01';
```
Run directly in the query tool. No count known beforehand, no rollback, and if the predicate was wrong the damage is silent.

**After (protocol):**

```sql
-- file: migrations/2026-07-31-deactivate-legacy-keys.sql  (statement 1 of 1, no inline comments in the executed text)
SELECT count(*) FROM api_keys WHERE created_at < '2025-01-01' AND active = true;
```
→ dry-run returns **147**. Confirm 147 is expected (cross-check: `SELECT count(*) FROM api_keys` → 3,201 total).

```sql
UPDATE api_keys SET active = false WHERE created_at < '2025-01-01' AND active = true;
```

```sql
-- file: migrations/2026-07-31-deactivate-legacy-keys.rollback.sql (same commit)
UPDATE api_keys SET active = true WHERE created_at < '2025-01-01' AND active = false;
```
(If `active` was not uniformly `true` before, the rollback needs the pre-image instead: `CREATE TABLE _backup_api_keys_260731 AS SELECT id, active FROM api_keys WHERE created_at < '2025-01-01';` — taken **before** the update.)

→ approval → execute → post-evidence: re-run the dry-run SELECT → **0**; report `147 → 0`.

## Rules of thumb

- `UPDATE`/`DELETE` without `WHERE` never leaves a draft (the guard hook denies it through a DB client).
- Row counts in reports are verbatim query output, not estimates.
- Staging first when a staging DSN exists; same protocol there — staging data is someone's test state.
- One logical mutation per script; batch mutations get batch dry-runs.
