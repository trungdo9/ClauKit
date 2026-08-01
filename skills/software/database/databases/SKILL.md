---
name: postgresql
description: PostgreSQL database guide — SQL queries, JOINs, CTEs, window functions, indexing, EXPLAIN/ANALYZE, user management, backups, replication, psql CLI. Use when writing SQL queries, designing schemas, optimizing performance, or administering PostgreSQL databases. For Supabase-specific RLS, SDK, and Postgres tuning see the `supabase` skill.
license: MIT
---

# PostgreSQL

Core guide for working with PostgreSQL — queries, schema design, performance, and administration.

## When to Use

- Writing SQL queries (SELECT, JOINs, subqueries, CTEs, window functions)
- Designing and migrating schemas
- Optimizing indexes and analyzing query performance
- Managing database users and permissions
- Setting up backups, replication, and maintenance
- Using psql CLI

> For Supabase-specific concerns (RLS policies, connection pooling, Edge Functions, supabase-js) → activate `supabase` skill instead.

## Quick Start

```bash
# Ubuntu/Debian install
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Connect
psql -U postgres -d mydb
```

## Common Operations

```sql
-- Create table
CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE, created_at TIMESTAMPTZ DEFAULT NOW());

-- CRUD
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');
SELECT * FROM users WHERE created_at > NOW() - INTERVAL '7 days';
UPDATE users SET name = 'Bob' WHERE id = 1;
DELETE FROM users WHERE id = 1;

-- Index
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status_created ON users(status, created_at DESC);

-- EXPLAIN
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'alice@example.com';
```

## References

- **[postgresql-queries.md](references/postgresql-queries.md)** — SELECT, JOINs, subqueries, CTEs, window functions
- **[postgresql-psql-cli.md](references/postgresql-psql-cli.md)** — psql commands, meta-commands, scripting
- **[postgresql-performance.md](references/postgresql-performance.md)** — EXPLAIN, query optimization, vacuum, indexes
- **[postgresql-administration.md](references/postgresql-administration.md)** — User management, backups, replication, maintenance
- **[safe-writes.md](references/safe-writes.md)** — **the DB write protocol (mandatory for every mutation)**: reviewed script file → dry-run SELECT with exact row count → paired rollback in the same commit → explicit approval → single-statement comment-free SQL → post-evidence re-count

## Resources

- https://www.postgresql.org/docs/
- https://www.postgresqltutorial.com/
