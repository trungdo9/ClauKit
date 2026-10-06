# Test Credentials Management

Canonical guide for test credentials across local, CI/CD, and cloud. One
convention everywhere: **a single `.env` at the project root**, loaded by
`playwright.config.ts`; CI injects the same keys as environment variables.

## Storage Locations

| Environment | Location | Notes |
|-------------|----------|-------|
| **Local** | `.env` (project root) | Gitignored. The only credentials file. |
| **Template** | `.env.example` (project root) | Keys, no values — committed |
| **CI/CD** | GitHub Secrets, GitLab CI/CD variables | Injected as env vars at runtime — see [ci-integration.md](ci-integration.md) |
| **Cloud / shared accounts** | AWS Secrets Manager, GCP Secret Manager | Fetched into env vars by the pipeline |
| **Session state** | `playwright/.auth/` | Live cookies from the setup project — gitignored, disposable |

```text
project/
├── .env                 # credentials — NEVER commit
├── .env.example         # template — commit
├── .gitignore           # covers .env and playwright/.auth/
├── playwright.config.ts # loads .env
└── playwright/.auth/    # saved login sessions — NEVER commit
```

## Setup

### 1. `.env` (local, never committed)
```bash
TEST_USER=admin@example.com
TEST_PASS=SecurePassword123
API_KEY=sk_test_xxx
ADMIN_ID=12345
```

### 2. `.env.example` (template, committed)
```bash
# Copy to .env and fill in. Keys only — no values.
BASE_URL=
TEST_USER=
TEST_PASS=
API_KEY=
ADMIN_ID=
```

### 3. `.gitignore`
```text
.env
.env.local
.env.*.local
playwright/.auth/
```

Confirm before writing any secret: `git check-ignore -q .env && echo ignored`.

## Loading

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  use: { baseURL: process.env.BASE_URL ?? 'http://localhost:3000' },
});
```

`dotenv` never overrides a variable that is already set and is a no-op when the
file is missing. So CI secrets win over `.env`, and another environment
(staging) needs no second file or `STAGING_*` key set — set the same keys in the
shell or pipeline for that run:

```bash
BASE_URL=https://staging.example.com TEST_USER=staging@example.com TEST_PASS='…' npx playwright test
```

Unit and API tests under Vitest read the same file: Node 20.6+ supports
`node --env-file=.env`, or call `dotenv.config()` in a Vitest `setupFiles` entry.

## Using Credentials in Tests

The login test in [../SKILL.md](../SKILL.md) § E2E Testing reads `TEST_USER` /
`TEST_PASS`; the `testUser` fixture in [playwright.md](playwright.md) wraps them.
Non-login values work the same way:

```typescript
test('admin can open a user record', async ({ page }) => {
  await page.goto(`/admin/users/${process.env.ADMIN_ID}`);
  await expect(page.getByRole('heading', { name: 'User' })).toBeVisible();
});
```

Fail fast when a key is missing, instead of typing `undefined` into a form:

```typescript
for (const key of ['TEST_USER', 'TEST_PASS']) {
  if (!process.env[key]) throw new Error(`${key} missing — add it to .env (see .env.example)`);
}
```

## When the Agent Needs Credentials

1. **Check what is already stored** — never ask for a value `.env` already has:
   ```bash
   test -f .env && grep -oE '^(TEST_USER|TEST_PASS|ADMIN_ID)=.' .env | cut -d= -f1
   ```
   Prints the keys that are present with a non-empty value.
2. **Ask the user in chat** for the missing keys only, naming each one. Never
   invent a value, and never repeat a password back in a summary.
3. **Write without clobbering** — make sure `.env` is ignored, then append only
   keys that are absent. Never `echo … > .env`: it erases every other key.
   ```bash
   touch .env
   git check-ignore -q .env || echo '.env' >> .gitignore
   add_key() { grep -q "^$1=" .env || printf '%s=%s\n' "$1" "$2" >> .env; }
   add_key TEST_USER 'value-from-user'
   add_key TEST_PASS 'value-from-user'
   ```
   To **change** an existing key (rotation, expiry), edit that one line in
   place; leave the rest of the file untouched.
4. **Verify** — run the login spec before the full suite:
   ```bash
   npx playwright test tests/auth/login.spec.ts
   ```
5. **Session expired** — saved login state is stale, not the credentials:
   ```bash
   rm -rf playwright/.auth/
   npx playwright test        # the setup project logs in and saves a fresh session
   ```

## Security Rules

1. **Never commit** `.env` or `playwright/.auth/` — check `.gitignore` before writing.
2. **Separate accounts** — dedicated test accounts, never production users.
3. **Rotate** periodically, and immediately if a value leaks into a log or commit.
4. **Minimal permissions** — test accounts reach test data only.
5. **Secrets manager** for shared or enterprise accounts (AWS / GCP).
6. **Encrypt at rest** if credentials must persist on a shared machine (e.g. `sops`, OS keychain).
