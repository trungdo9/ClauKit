# API and Integration Testing

The layer between unit and E2E: real HTTP through the app, a real database, real
contracts between services — no browser. Examples use Vitest; Jest is the same
API (`vi.fn` → `jest.fn`). Credentials for these suites follow
[credential-management.md](credential-management.md); CI wiring is in
[ci-integration.md](ci-integration.md); load and latency targets in
[load-k6.md](load-k6.md).

## HTTP Integration (Supertest)

Drive the app object in-process — no server port, no network flake — against a
test database that each test resets.

```typescript
import request from 'supertest';
import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest';
import { app } from '../src/app';
import { db } from '../src/db'; // your data-access layer, pointed at the TEST database

describe('POST /api/users', () => {
  beforeAll(async () => { await db.connect(); });
  afterAll(async () => { await db.disconnect(); });
  beforeEach(async () => { await db.users.deleteMany({}); }); // clean state per test

  it('creates a user and returns 201', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ email: 'test@example.com', name: 'Test User' })
      .expect(201);

    expect(res.body).toMatchObject({ email: 'test@example.com', name: 'Test User' });

    // The response is not proof of persistence — read it back
    const user = await db.users.findOne({ email: 'test@example.com' });
    expect(user).not.toBeNull();
  });

  it('returns 400 for an invalid email', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ email: 'invalid-email', name: 'Test' })
      .expect(400);

    expect(res.body.error).toBe('Invalid email format');
  });
});
```

Authenticated endpoints: `.set('Authorization', \`Bearer ${process.env.API_KEY}\`)`.

## Real Database (Testcontainers)

Mocks of the database hide exactly the bugs integration tests exist to catch
(constraints, transactions, SQL dialect). Testcontainers starts a throwaway
database in Docker per suite.

```typescript
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Client } from 'pg';
import { beforeAll, afterAll } from 'vitest';

let container: StartedPostgreSqlContainer;
let db: Client;

beforeAll(async () => {
  container = await new PostgreSqlContainer('postgres:16-alpine').start();
  db = new Client({ connectionString: container.getConnectionUri() });
  await db.connect();
}, 60_000); // first run pulls the image

afterAll(async () => {
  await db.end();
  await container.stop();
});
```

- Install: `npm install -D testcontainers @testcontainers/postgresql pg`. Modules
  exist for MySQL, MongoDB, Redis, Kafka, …; anything else uses
  `new GenericContainer('<image>').withExposedPorts(<port>).start()`.
- One container per suite file is the usual trade-off; for many files, start it
  once in Vitest `globalSetup` and pass the URI via `provide` / env.
- Requires Docker — available on GitHub-hosted Linux runners.

## Database Migration Tests

A migration that only ever ran forward on an empty schema is untested. Run each
migration against a fresh container (above) with representative data, then
check both directions.

```typescript
// runMigration / rollbackMigration / resetToVersion: your tool's API (Knex
// migrate.up/down, node-pg-migrate, Prisma migrate, …) on the container's database.
describe('migration v2-add-created-at', () => {
  beforeEach(async () => { await resetToVersion('v1'); }); // every test starts at v1

  it('migrates forward without data loss', async () => {
    await db.query(`INSERT INTO users (id, email, name) VALUES (1, 'test@example.com', 'Test User')`);

    await runMigration('v2-add-created-at');

    const { rows } = await db.query('SELECT * FROM users WHERE id = 1');
    expect(rows[0]).toMatchObject({
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      created_at: expect.any(Date),
    });
  });

  it('rolls back cleanly', async () => {
    await runMigration('v2-add-created-at');
    await rollbackMigration('v2-add-created-at');

    const { rows } = await db.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'users'`,
    );
    expect(rows.map((r) => r.column_name)).not.toContain('created_at');
  });
});
```

## Contract Tests (Pact)

For services owned by different teams: the consumer records what it needs, the
provider proves it still delivers it — without running both together. Pact JS
v10+ API (`PactV3` + `executeTest`); the old `setup` / `verify` / `finalize`
lifecycle is gone.

### Consumer side

```typescript
import path from 'path';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import { describe, it, expect } from 'vitest';
import { AuthClient } from '../src/auth-client';

const provider = new PactV3({
  consumer: 'UserService',
  provider: 'AuthService',
  dir: path.resolve(process.cwd(), 'pacts'), // the contract file is written here
});

describe('AuthService contract', () => {
  it('validates a user token', () => {
    provider
      .given('user token exists')
      .uponReceiving('a request to validate a token')
      .withRequest({
        method: 'POST',
        path: '/auth/validate',
        headers: { 'Content-Type': 'application/json' },
        body: { token: 'valid-token-123' },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: { valid: true, userId: MatchersV3.string('123') },
      });

    // Pact starts a mock provider; point the real client at it
    return provider.executeTest(async (mockServer) => {
      const client = new AuthClient(mockServer.url);
      const res = await client.validateToken('valid-token-123');
      expect(res.valid).toBe(true);
    });
  });
});
```

### Provider side

```typescript
import path from 'path';
import { Verifier } from '@pact-foundation/pact';

it('honours the UserService contract', () =>
  new Verifier({
    provider: 'AuthService',
    providerBaseUrl: 'http://localhost:4000', // the provider, running
    pactUrls: [path.resolve(process.cwd(), 'pacts/UserService-AuthService.json')],
    stateHandlers: {
      'user token exists': async () => { /* seed the token the consumer expects */ },
    },
  }).verifyProvider(), 60_000);
```

Across repositories, publish pacts to a Pact Broker (or PactFlow) instead of
sharing files, and gate deploys with `pact-broker can-i-deploy`.

## Resources

- Supertest: https://www.npmjs.com/package/supertest
- Testcontainers for Node: https://node.testcontainers.org/
- Pact JS: https://docs.pact.io/implementation_guides/javascript
