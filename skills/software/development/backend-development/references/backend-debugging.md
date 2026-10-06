# Backend Debugging Strategies

Backend debugging tooling: structured logging, debuggers per language, MongoDB/Redis, HTTP, profiling, and common failure scenarios.

## Method

Debugging method (reproduce → root cause → hypothesis → fix → verify; no fix without a root cause) is owned by the
`debugging` skill — read [.claude/skills/software/debugging/SKILL.md](../../../debugging/SKILL.md) and
[systematic-debugging.md](../../../debugging/references/systematic-debugging.md). This file covers backend tooling only.

## Logging Best Practices

### Structured Logging

**Node.js (Pino - Fastest)**
```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

// Structured logging with context
logger.info({ userId: '123', action: 'login' }, 'User logged in');

// Error logging with stack trace
try {
  await riskyOperation();
} catch (error) {
  logger.error({ err: error, userId: '123' }, 'Operation failed');
}
```

**Python (Structlog)**
```python
import structlog

logger = structlog.get_logger()

# Structured context
logger.info("user_login", user_id="123", ip="192.168.1.1")

# Error with exception
try:
    risky_operation()
except Exception as e:
    logger.error("operation_failed", user_id="123", exc_info=True)
```

**Go (Zap - High Performance)**
```go
import "go.uber.org/zap"

logger, _ := zap.NewProduction()
defer logger.Sync()

// Structured fields
logger.Info("user logged in",
    zap.String("user_id", "123"),
    zap.String("ip", "192.168.1.1"),
)

// Error logging
if err := riskyOperation(); err != nil {
    logger.Error("operation failed",
        zap.Error(err),
        zap.String("user_id", "123"),
    )
}
```

### Log Levels

| Level | Purpose | Example |
|-------|---------|---------|
| **TRACE** | Very detailed, dev only | Request/response bodies |
| **DEBUG** | Detailed info for debugging | SQL queries, cache hits |
| **INFO** | General informational | User login, API calls |
| **WARN** | Potential issues | Deprecated API usage |
| **ERROR** | Error conditions | Failed API calls, exceptions |
| **FATAL** | Critical failures | Database connection lost |

### What to Log

**✅ DO LOG:**
- Request/response metadata (not bodies in prod)
- Error messages with context
- Performance metrics (duration, size)
- Security events (login, permission changes)
- Business events (orders, payments)

**❌ DON'T LOG:**
- Passwords or secrets
- Credit card numbers
- Personal identifiable information (PII)
- Session tokens
- Full request bodies in production

## Debugging Tools by Language

### Node.js / TypeScript

**1. Chrome DevTools (Built-in)**
```bash
# Run with inspect flag
node --inspect-brk app.js

# Open chrome://inspect in Chrome
# Set breakpoints, step through code
```

**2. VS Code Debugger**
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/src/index.ts",
      "preLaunchTask": "npm: build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    }
  ]
}
```

**3. Debug Module**
```typescript
import debug from 'debug';

const log = debug('app:server');
const error = debug('app:error');

log('Starting server on port %d', 3000);
error('Failed to connect to database');

// Run with: DEBUG=app:* node app.js
```

### Python

**1. PDB (Built-in Debugger)**
```python
import pdb

def problematic_function(data):
    # Set breakpoint
    pdb.set_trace()

    # Debugger commands:
    # l - list code
    # n - next line
    # s - step into
    # c - continue
    # p variable - print variable
    # q - quit
    result = process(data)
    return result
```

**2. IPython Debugger (Better)**
```python
from IPython import embed

def problematic_function(data):
    # Drop into IPython shell
    embed()

    result = process(data)
    return result
```

**3. VS Code Debugger**
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: FastAPI",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": ["main:app", "--reload"],
      "jinja": true
    }
  ]
}
```

### Go

**1. Delve (Standard Debugger)**
```bash
# Install
go install github.com/go-delve/delve/cmd/dlv@latest

# Debug
dlv debug main.go

# Commands:
# b main.main - set breakpoint
# c - continue
# n - next line
# s - step into
# p variable - print variable
# q - quit
```

**2. VS Code Debugger**
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Package",
      "type": "go",
      "request": "launch",
      "mode": "debug",
      "program": "${workspaceFolder}"
    }
  ]
}
```

### Rust

**1. LLDB/GDB (Native Debuggers)**
```bash
# Build with debug info
cargo build

# Debug with LLDB
rust-lldb ./target/debug/myapp

# Debug with GDB
rust-gdb ./target/debug/myapp
```

**2. VS Code Debugger (CodeLLDB)**
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "lldb",
      "request": "launch",
      "name": "Debug",
      "program": "${workspaceFolder}/target/debug/myapp",
      "args": [],
      "cwd": "${workspaceFolder}"
    }
  ]
}
```

## Database Debugging

### SQL Query Debugging (PostgreSQL)

`EXPLAIN ANALYZE`, slow-query log, `pg_stat_statements`: [postgresql-performance.md](../../../database/databases/references/postgresql-performance.md).
Active/blocked queries, `pg_stat_activity`, terminating backends: [postgresql-administration.md](../../../database/databases/references/postgresql-administration.md) → "Activity".

### MongoDB Debugging

**1. Explain Query Performance**
```javascript
db.users.find({ email: 'test@example.com' }).explain('executionStats')

// Look for:
// - totalDocsExamined vs nReturned (should be close)
// - COLLSCAN (collection scan - needs index)
// - executionTimeMillis (should be low)
```

**2. Profile Slow Queries**
```javascript
// Enable profiling for queries >100ms
db.setProfilingLevel(1, { slowms: 100 })

// View slow queries
db.system.profile.find().limit(5).sort({ ts: -1 }).pretty()

// Disable profiling
db.setProfilingLevel(0)
```

### Redis Debugging

**1. Monitor Commands**
```bash
# See all commands in real-time
redis-cli MONITOR

# Check slow log
redis-cli SLOWLOG GET 10

# Set slow log threshold (microseconds)
redis-cli CONFIG SET slowlog-log-slower-than 10000
```

**2. Memory Analysis**
```bash
# Memory usage by key pattern
redis-cli --bigkeys

# Memory usage details
redis-cli INFO memory

# Analyze specific key
redis-cli MEMORY USAGE mykey
```

## API Debugging

### HTTP Request Debugging

**1. cURL Testing**
```bash
# Verbose output with headers
curl -v https://api.example.com/users

# Include response headers
curl -i https://api.example.com/users

# POST with JSON
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}' \
  -v

# Save response to file
curl https://api.example.com/users -o response.json
```

**2. HTTPie (User-Friendly)**
```bash
# Install
pip install httpie

# Simple GET
http GET https://api.example.com/users

# POST with JSON
http POST https://api.example.com/users name=John email=john@example.com

# Custom headers
http GET https://api.example.com/users Authorization:"Bearer token123"
```

**3. Request Logging Middleware**

**Express/Node.js:**
```typescript
import morgan from 'morgan';

// Development
app.use(morgan('dev'));

// Production (JSON format)
app.use(morgan('combined'));

// Custom format
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
```

**FastAPI/Python:**
```python
from fastapi import Request
import time

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time

    logger.info(
        "request_processed",
        method=request.method,
        path=request.url.path,
        status_code=response.status_code,
        duration_ms=duration * 1000
    )
    return response
```

## Performance Debugging

### CPU Profiling

**Node.js (0x)**
```bash
# Install
npm install -g 0x

# Profile application
0x node app.js

# Open flamegraph in browser
# Identify hot spots (red areas)
```

**Node.js (Clinic.js)**
```bash
# Install
npm install -g clinic

# CPU profiling
clinic doctor -- node app.js

# Heap profiling
clinic heapprofiler -- node app.js

# Event loop analysis
clinic bubbleprof -- node app.js
```

**Python (cProfile)**
```python
import cProfile
import pstats

# Profile function
profiler = cProfile.Profile()
profiler.enable()

# Your code
result = expensive_operation()

profiler.disable()
stats = pstats.Stats(profiler)
stats.sort_stats('cumulative')
stats.print_stats(10)  # Top 10 functions
```

**Go (pprof)**
```go
import (
    "net/http"
    _ "net/http/pprof"
)

func main() {
    // Enable profiling endpoint
    go func() {
        http.ListenAndServe("localhost:6060", nil)
    }()

    // Your application
    startServer()
}

// Profile CPU
// go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30

// Profile heap
// go tool pprof http://localhost:6060/debug/pprof/heap
```

### Memory Debugging

**Node.js (Heap Snapshots)**
```typescript
// Take heap snapshot programmatically
import { writeHeapSnapshot } from 'v8';

app.get('/debug/heap', (req, res) => {
    const filename = writeHeapSnapshot();
    res.send(`Heap snapshot written to ${filename}`);
});

// Analyze in Chrome DevTools
// 1. Load heap snapshot
// 2. Compare snapshots to find memory leaks
// 3. Look for detached DOM nodes, large arrays
```

**Python (Memory Profiler)**
```python
from memory_profiler import profile

@profile
def memory_intensive_function():
    large_list = [i for i in range(1000000)]
    return sum(large_list)

# Run with: python -m memory_profiler script.py
# Shows line-by-line memory usage
```

## Production Debugging

Metrics, logs, distributed tracing (OpenTelemetry → OTLP), error tracking and APM setup:
[backend-devops.md](backend-devops.md) → "Monitoring & Observability". In an incident: check error-rate and
latency dashboards, find a failing trace, pivot to its logs by trace id, then compare against the last deploy.

## Common Debugging Scenarios

### 1. High CPU Usage

**Steps:**
1. Profile CPU (flamegraph)
2. Identify hot functions
3. Check for:
   - Infinite loops
   - Heavy regex operations
   - Inefficient algorithms (O(n²))
   - Blocking operations in event loop (Node.js)

**Node.js Example:**
```typescript
// ❌ Bad: Blocking event loop
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2); // Exponential time
}

// ✅ Good: Memoized or iterative
const memo = new Map();
function fibonacciMemo(n) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);
  const result = fibonacciMemo(n - 1) + fibonacciMemo(n - 2);
  memo.set(n, result);
  return result;
}
```

### 2. Memory Leaks

**Symptoms:**
- Memory usage grows over time
- Eventually crashes (OOM)
- Performance degradation

**Common Causes:**
```typescript
// ❌ Memory leak: Event listeners not removed
class DataService {
  constructor(eventBus) {
    eventBus.on('data', (data) => this.processData(data));
    // Listener never removed, holds reference to DataService
  }
}

// ✅ Fix: Remove listeners
class DataService {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.handler = (data) => this.processData(data);
    eventBus.on('data', this.handler);
  }

  destroy() {
    this.eventBus.off('data', this.handler);
  }
}

// ❌ Memory leak: Global cache without limits
const cache = new Map();
function getCachedData(key) {
  if (!cache.has(key)) {
    cache.set(key, expensiveOperation(key)); // Grows forever
  }
  return cache.get(key);
}

// ✅ Fix: LRU cache with size limit
import LRU from 'lru-cache';
const cache = new LRU({ max: 1000, ttl: 1000 * 60 * 60 });
```

**Detection:**
```bash
# Node.js: Check heap size over time
node --expose-gc --max-old-space-size=4096 app.js

# Take periodic heap snapshots
# Compare snapshots in Chrome DevTools
```

### 3. Slow Database Queries

Slow-query log → `EXPLAIN (ANALYZE, BUFFERS)` → index or rewrite. PostgreSQL walkthrough:
[postgresql-performance.md](../../../database/databases/references/postgresql-performance.md) → "Monitoring Queries", "Index Usage Analysis".

### 4. Connection Pool Exhaustion

**Symptoms:**
- "Connection pool exhausted" errors
- Requests hang indefinitely
- Database connections at max

**Causes & Fixes:**
```typescript
// ❌ Bad: Connection leak
async function getUser(id) {
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
  // Connection never released!
}

// ✅ Good: Always release
async function getUser(id) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  } finally {
    client.release(); // Always release
  }
}

// ✅ Better: Use pool directly
async function getUser(id) {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
  // Automatically releases
}
```

### 5. Race Conditions

**Example:**
```typescript
// ❌ Bad: Race condition
let counter = 0;

async function incrementCounter() {
  const current = counter; // Thread 1 reads 0
  await doSomethingAsync(); // Thread 2 reads 0
  counter = current + 1; // Thread 1 writes 1, Thread 2 writes 1
  // Expected: 2, Actual: 1
}

// ✅ Fix: Atomic operations (Redis)
async function incrementCounter() {
  return await redis.incr('counter');
  // Atomic, thread-safe
}

// ✅ Fix: Database transactions
async function incrementCounter(userId) {
  await db.transaction(async (trx) => {
    const user = await trx('users')
      .where({ id: userId })
      .forUpdate() // Row-level lock
      .first();

    await trx('users')
      .where({ id: userId })
      .update({ counter: user.counter + 1 });
  });
}
```

## Debugging Checklist

**Before Diving Into Code:**
- [ ] Read error message completely
- [ ] Check logs for context
- [ ] Reproduce the issue reliably
- [ ] Isolate the problem (binary search)
- [ ] Verify assumptions

**Investigation:**
- [ ] Enable debug logging
- [ ] Add strategic log points
- [ ] Use debugger breakpoints
- [ ] Profile performance if slow
- [ ] Check database queries
- [ ] Monitor system resources

**Production Issues:**
- [ ] Check APM dashboards
- [ ] Review distributed traces
- [ ] Analyze error rates
- [ ] Compare with previous baseline
- [ ] Check for recent deployments
- [ ] Review infrastructure changes

**After Fix:**
- [ ] Verify fix in development
- [ ] Add regression test
- [ ] Document the issue
- [ ] Deploy with monitoring
- [ ] Confirm fix in production

## Debugging Resources

**Tools:**
- Node.js: https://nodejs.org/en/docs/guides/debugging-getting-started/
- Chrome DevTools: https://developer.chrome.com/docs/devtools/
- Clinic.js: https://clinicjs.org/
- Sentry: https://docs.sentry.io/
- DataDog: https://docs.datadoghq.com/
- New Relic: https://docs.newrelic.com/

**Best Practices:**
- 12 Factor App Logs: https://12factor.net/logs
- Google SRE Book: https://sre.google/sre-book/table-of-contents/
- OpenTelemetry: https://opentelemetry.io/docs/

**Database:**
- PostgreSQL EXPLAIN: https://www.postgresql.org/docs/current/using-explain.html
- MongoDB Performance: https://www.mongodb.com/docs/manual/administration/analyzing-mongodb-performance/
