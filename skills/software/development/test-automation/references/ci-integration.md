# CI/CD Integration

Tests run on every push and pull request. Credentials come from the platform's
secret store, never from a committed file — `dotenv` finds no `.env` on CI and
leaves the injected variables alone ([credential-management.md](credential-management.md)).

## GitHub Actions — Playwright E2E

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run tests
        run: npx playwright test
        env:
          TEST_USER: ${{ secrets.TEST_USER }}
          TEST_PASS: ${{ secrets.TEST_PASS }}
          ADMIN_ID: ${{ secrets.ADMIN_ID }}

      - name: Upload report
        if: ${{ !cancelled() }}
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 14
```

Secrets go in the step's `env:` — scoped to the one step that needs them, and
masked in logs. Add them under *Settings → Secrets and variables → Actions*.

## GitHub Actions — Unit + Integration Pipeline

Unit first (fast, no services), then integration against a throwaway database.
Load tests do not belong in the per-PR pipeline — run them on a schedule against
staging ([load-k6.md](load-k6.md)).

```yaml
jobs:
  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run test:coverage

  integration:
    needs: unit
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
        ports: ['5432:5432']
        options: >-
          --health-cmd pg_isready --health-interval 5s --health-timeout 5s --health-retries 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run test:integration
        env:
          DATABASE_URL: postgres://postgres:test@localhost:5432/postgres
```

If the integration suite uses TestContainers instead
([api-integration-testing.md](api-integration-testing.md)), drop the `services:`
block — `ubuntu-latest` runners have Docker.

## GitLab CI

Project CI/CD variables (*Settings → CI/CD → Variables*, marked **Masked** and
**Protected**) are exported to every job automatically — no `variables:` mapping
needed.

```yaml
e2e:
  image: mcr.microsoft.com/playwright:v<your @playwright/test version>-noble
  script:
    - npm ci
    - npx playwright test
  artifacts:
    when: always
    paths: [playwright-report/]
```

Pin the image tag to the exact `@playwright/test` version in `package.json`, or
the browsers and the library drift apart.
