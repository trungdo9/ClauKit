---
name: supabase
description: Complete Supabase skill — platform layer (Auth, RLS policies, Client SDK JS/Dart/Swift, Storage, Realtime, Edge Functions, CLI migrations) + Postgres SQL layer (query optimization, indexing, connection pooling, schema design, locking, monitoring). Use when integrating Supabase into an app, writing RLS policies, calling supabase-js, handling storage, subscribing to realtime, deploying Edge Functions, or optimizing Postgres queries and schema.
license: MIT
metadata:
  type: knowledge
  category: database/platform
  version: "2.0.0"
  date: 2026-05-30
---

# Supabase — Complete Skill

Two complementary layers:
- **Platform layer** — Auth/RLS (app-side), Client SDK, Storage, Realtime, Edge Functions, CLI migrations
- **Postgres layer** — Query optimization, indexing, connection pooling, schema design, locking, monitoring

## When to Apply

### Platform layer
- Writing or reviewing RLS policies that reference `auth.uid()` / `auth.jwt()`
- Deciding between `anon`, `authenticated`, and `service_role` keys
- Calling Supabase from a client (supabase-js, Flutter, Swift) — type-safe / error-safe patterns
- Designing Storage buckets and access control
- Subscribing to Realtime channels (postgres_changes, broadcast, presence)
- Writing Edge Functions in Deno that talk to the database under a user's JWT
- Running `supabase` CLI for local dev, `db diff`, `db push`, and policy deployment

### Postgres layer
- Writing SQL queries or designing schemas
- Implementing indexes or query optimization
- Reviewing database performance issues
- Configuring connection pooling or scaling
- Optimizing for Postgres-specific features
- Working with Row-Level Security at the SQL performance level

## References

### Platform Layer

| Prefix | Category | Files |
|--------|----------|-------|
| `auth-` | Auth + RLS policies (app-layer) | auth-rls-policies, auth-service-role-vs-anon |

Client SDK, Storage, Edge Functions and CLI/migrations have **no local reference** — read the official docs below (fetch them; do not answer from memory).

### Postgres Layer (by priority)

| Priority | Prefix | Category | Impact |
|----------|--------|----------|--------|
| 1 | `query-` | Query performance + indexes | CRITICAL |
| 2 | `conn-` | Connection management | CRITICAL |
| 3 | `security-` | RLS performance (SQL level) | CRITICAL |
| 4 | `schema-` | Schema design | HIGH |
| 5 | `lock-` | Concurrency & locking | MEDIUM-HIGH |
| 6 | `data-` | Data access patterns | MEDIUM |
| 7 | `monitor-` | Monitoring & diagnostics | LOW-MEDIUM |
| 8 | `advanced-` | Full-text search, JSONB | LOW |

## Official Docs

- https://supabase.com/docs/guides/auth
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/reference/javascript
- https://supabase.com/docs/guides/storage
- https://supabase.com/docs/guides/realtime
- https://supabase.com/docs/guides/functions
- https://supabase.com/docs/guides/local-development
- https://www.postgresql.org/docs/current/
- https://wiki.postgresql.org/wiki/Performance_Optimization
