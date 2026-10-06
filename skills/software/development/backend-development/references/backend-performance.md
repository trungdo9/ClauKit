# Backend Performance & Scalability

Performance optimization: connection pooling, N+1, caching, load balancing, async processing, CDN.

## Database Performance

### Indexes & Query Plans

Index types, composite/partial/covering indexes, `EXPLAIN ANALYZE`, `pg_stat_statements`, missing-index
queries: owned by the `databases` skill — read
[.claude/skills/software/database/databases/references/postgresql-performance.md](../../../database/databases/references/postgresql-performance.md).

### Connection Pooling

```typescript
// PostgreSQL with pg-pool
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum connections
  min: 5, // Minimum connections
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 2000, // Error if can't connect in 2s
});

// Use pool for queries
const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
```

**Pool Sizing:**
- **DB-side budget:** start near `(db_core_count * 2) + effective_spindle_count` (PostgreSQL wiki heuristic) — this is the total for the *database*, not per app instance
- **Per instance:** `total_budget / instance_count`; with many instances/serverless, put PgBouncer in front
- **Monitor:** pool wait time and saturation in production

### N+1 Query Problem

**Bad: N+1 queries**
```typescript
// Fetches 1 query for posts, then N queries for authors
const posts = await Post.findAll();
for (const post of posts) {
  post.author = await User.findById(post.authorId); // N queries!
}
```

**Good: Join or eager loading**
```typescript
// Single query with JOIN
const posts = await Post.findAll({
  include: [{ model: User, as: 'author' }],
});
```

## Caching Strategies

### Redis Caching

#### Cache-Aside Pattern (Lazy Loading)

```typescript
async function getUser(userId: string) {
  // Try cache first
  const cached = await redis.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);

  // Cache miss - fetch from DB
  const user = await db.users.findById(userId);

  // Store in cache (TTL: 1 hour)
  await redis.setex(`user:${userId}`, 3600, JSON.stringify(user));

  return user;
}
```

#### Write-Through Pattern

```typescript
async function updateUser(userId: string, data: UpdateUserDto) {
  // Update database
  const user = await db.users.update(userId, data);

  // Update cache immediately
  await redis.setex(`user:${userId}`, 3600, JSON.stringify(user));

  return user;
}
```

#### Cache Invalidation

```typescript
// Invalidate on update
async function deleteUser(userId: string) {
  await db.users.delete(userId);
  await redis.del(`user:${userId}`);
  await redis.del(`user:${userId}:posts`); // Invalidate related caches
}

// Pattern-based invalidation — SCAN, never KEYS (KEYS blocks Redis on large keyspaces)
for await (const key of redis.scanIterator({ MATCH: 'user:*', COUNT: 100 })) {
  await redis.unlink(key);
}
// Better: version the prefix (user:v2:*) or track keys in a set, so no scan is needed
```

### Cache Layers

```
Client
  → CDN Cache (static assets)
  → API Gateway Cache (public endpoints)
  → Application Cache (Redis)
  → Database Query Cache
  → Database
```

### Cache Best Practices

1. **Cache frequently accessed data** - User profiles, config, product catalogs
2. **Set appropriate TTL** - Balance freshness vs performance
3. **Invalidate on write** - Keep cache consistent
4. **Use cache keys wisely** - `resource:id:attribute` pattern
5. **Monitor hit rates** - Target >80% hit rate

## Load Balancing

### Algorithms

**Round Robin** - Distribute evenly across servers
```nginx
upstream backend {
    server backend1.example.com;
    server backend2.example.com;
    server backend3.example.com;
}
```

**Least Connections** - Route to server with fewest connections
```nginx
upstream backend {
    least_conn;
    server backend1.example.com;
    server backend2.example.com;
}
```

**IP Hash** - Same client → same server (session affinity)
```nginx
upstream backend {
    ip_hash;
    server backend1.example.com;
    server backend2.example.com;
}
```

### Health Checks

Liveness/readiness endpoints and probe config: [backend-devops.md](backend-devops.md) → "Health Checks".

## Asynchronous Processing

### Message Queues for Long-Running Tasks

```typescript
// BullMQ (successor to Bull)
import { Queue, Worker } from 'bullmq';

const connection = { host: 'localhost', port: 6379 };

// Producer - Add job to queue
const emailQueue = new Queue('email', { connection });
await emailQueue.add('send-welcome', { userId: user.id, email: user.email }, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 1000 },
});

// Consumer - Process jobs (make handlers idempotent: jobs can be retried)
new Worker('email', async (job) => {
  if (job.name === 'send-welcome') await sendWelcomeEmail(job.data.email);
}, { connection });
```

**Use Cases:**
- Email sending
- Image/video processing
- Report generation
- Data export
- Webhook delivery

## CDN (Content Delivery Network)

### Configuration

```typescript
// Cache-Control headers
res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // Static assets
res.setHeader('Cache-Control', 'public, max-age=3600'); // API responses
res.setHeader('Cache-Control', 'private, no-cache'); // User-specific data
```

**CDN Providers:**
- Cloudflare (generous free tier, global coverage)
- AWS CloudFront (AWS integration)
- Fastly (real-time purging)

## Scaling (Horizontal/Vertical, Read Replicas, Sharding)

Owned by [backend-architecture.md](backend-architecture.md) → "Scalability Patterns".

## Performance Monitoring

### Key Metrics

**Application:**
- Response time (p50, p95, p99)
- Throughput (requests/second)
- Error rate
- CPU/memory usage

**Database:**
- Query execution time
- Connection pool saturation
- Cache hit rate
- Slow query log

**Tools:**
- Prometheus + Grafana (metrics)
- New Relic / Datadog (APM)
- Sentry (error tracking)
- OpenTelemetry (distributed tracing)

## Performance Optimization Checklist

### Database
- [ ] Indexes on frequently queried columns
- [ ] Connection pooling configured
- [ ] N+1 queries eliminated
- [ ] Slow query log monitored
- [ ] Query execution plans analyzed

### Caching
- [ ] Redis cache for hot data
- [ ] Cache TTL configured appropriately
- [ ] Cache invalidation on writes
- [ ] CDN for static assets
- [ ] >80% cache hit rate achieved

### Application
- [ ] Async processing for long tasks
- [ ] Response compression enabled (gzip)
- [ ] Load balancing configured
- [ ] Health checks implemented
- [ ] Resource limits set (CPU, memory)

### Monitoring
- [ ] APM tool configured (New Relic/Datadog)
- [ ] Error tracking (Sentry)
- [ ] Performance dashboards (Grafana)
- [ ] Alerting on key metrics
- [ ] Distributed tracing for microservices

## Common Performance Pitfalls

1. **No caching** - Repeatedly querying same data
2. **Missing indexes** - Full table scans
3. **N+1 queries** - Fetching related data in loops
4. **Synchronous processing** - Blocking on long tasks
5. **No connection pooling** - Creating new connections per request
6. **Unbounded queries** - No LIMIT on large tables
7. **No CDN** - Serving static assets from origin

## Resources

- **PostgreSQL Performance:** https://www.postgresql.org/docs/current/performance-tips.html
- **Redis Best Practices:** https://redis.io/docs/management/optimization/
- **Web Performance:** https://web.dev/performance/
- **Database Indexing:** https://use-the-index-luke.com/
