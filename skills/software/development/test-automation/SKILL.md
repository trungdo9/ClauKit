---
name: test-automation
description: All testing layers — Vitest unit, Playwright E2E (configs, fixtures, page objects, traces, debugging), Cucumber BDD, API/integration (Supertest, TestContainers, Pact contracts, migration tests), k6 load, CI/CD integration, test credentials. Use when writing or fixing tests, setting up test infrastructure, chasing a flaky test, or establishing performance baselines. One skill for every layer — there is no second testing toolkit to consult.
category: Testing & Debug
status: active
license: MIT
version: 2.1.0
---

# Test Automation (QA Engineering)

The single testing reference for this kit — every layer, whether you are the app
developer validating your own change or the QA engineer building reusable
infrastructure. Unit (Vitest) · E2E (Playwright, canonical) · BDD (Cucumber) ·
API/integration (Supertest, TestContainers, Pact) · load (k6).

Pick the layer by what you are trying to learn, not by your job title: a
function's logic → unit; a user's path through the app → E2E; a contract between
services → API; behaviour under concurrency → load.

## When to Use

- Writing or fixing unit tests for functions, components, utilities
- Setting up E2E or API test automation from scratch
- Writing Playwright tests with fixtures, page objects, advanced configs
- Implementing Cucumber/BDD scenarios with Gherkin
- Integrating tests with CI/CD pipelines (GitHub Actions, GitLab CI)
- Creating maintainable, flaky-resistant test suites
- Managing test credentials across local / CI / cloud
- Debugging test failures with traces, snapshots, codegen
- Establishing performance baselines and catching regressions under load

**Do NOT use when**: driving a browser for a long autonomous session (use a browser MCP server) · profiling a live page's runtime, network or Core Web Vitals (use `[[chrome-devtools]]`) · deriving *which* cases to test (use `[[scenario]]`) · practising red-green discipline on a bug fix (use `[[tdd]]`) · testing third-party SaaS behaviour you do not control.

## Frameworks and Where Each Is Covered

| Layer | Primary | Alternatives | Detail |
|---|---|---|---|
| Unit | Vitest | Jest · pytest (Python) · Go `testing` + testify · xUnit (.NET, see [`csharp-developer`](../csharp-developer/SKILL.md)) | [Unit Testing](#unit-testing-vitest) below |
| E2E (web) | Playwright | Cypress · Puppeteer | [references/playwright.md](references/playwright.md) |
| BDD | Cucumber + Playwright | playwright-bdd · Reqnroll (.NET, SpecFlow's successor) | [references/bdd-cucumber.md](references/bdd-cucumber.md) |
| API / integration | Supertest + Vitest | TestContainers (real DB) · Pact (contracts) · Newman · Rest Assured | [references/api-integration-testing.md](references/api-integration-testing.md) |
| Load | k6 | — | [references/load-k6.md](references/load-k6.md) |
| CI/CD | GitHub Actions | GitLab CI | [references/ci-integration.md](references/ci-integration.md) |
| Credentials | `.env` + platform secrets | cloud secrets manager | [references/credential-management.md](references/credential-management.md) |

Mobile (Appium, Detox for React Native) is out of scope — no guide here.

## Unit Testing (Vitest)

The cheapest layer — reach for it first. Anything an E2E test could prove about a
pure function, a unit test proves faster and points straight at the cause.

1. **Configure** — `vitest.config.ts`: environment (`jsdom` for browser APIs), coverage thresholds.
2. **Write** — `.test.ts` / `.spec.ts` colocated with the source file.
3. **Run** — `npm run test`; `npm run test:watch` re-runs only tests affected by what you touched.
4. **Coverage** — `npm run test:coverage` writes `coverage/index.html`. Targets: 80% overall,
   90% on new code, 100% on critical paths (auth, payments, data integrity).

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts'],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
  },
});
```

## E2E Testing (Playwright)

```bash
npm init playwright@latest        # scaffolds config + example; or:
npm install -D @playwright/test && npx playwright install --with-deps
```

The canonical example — the other references build on it rather than repeat it.
Credentials come from the environment, never from the source
([credential-management](references/credential-management.md)).

```typescript
import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('valid credentials reach the dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('email').fill(process.env.TEST_USER!);
    await page.getByTestId('password').fill(process.env.TEST_PASS!);
    await page.getByTestId('login-button').click();

    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByTestId('user-name')).toBeVisible();
  });

  test('invalid credentials show an error', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('email').fill('invalid@example.com');
    await page.getByTestId('password').fill('wrongpassword');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('error-message')).toContainText('Invalid credentials');
  });
});
```

Config, fixtures + page objects, auth storage state, locator/wait rules, test
selection and maintenance commands: [references/playwright.md](references/playwright.md).

## Load Testing (k6)

1. **Write the script** — virtual users, request pattern, and thresholds. Put the
   thresholds in the script: they are the pass/fail gate, not a number someone
   eyeballs in the output.
2. **Run locally** — `k6 run script.js` prints throughput, p95 latency, error rate.
3. **Scale** — raise `vus` and ramp duration gradually. A cold jump to peak load
   measures the ramp, not the system.
4. **Compare against a baseline** — a load run with nothing to compare to cannot
   detect a regression. Record the numbers.

Script, ramp stages, threshold targets: [references/load-k6.md](references/load-k6.md).

## Command Cheat-Sheet

```bash
# Unit: run all, watch only what changed
npm run test
npm run test:watch
npm run test:coverage            # HTML report at coverage/index.html

# E2E: one spec, headed / Inspector / UI mode
npx playwright test tests/e2e/login.spec.ts --headed
npx playwright test tests/e2e/checkout.spec.ts --debug
npx playwright test --ui
npx playwright test --trace on    # then: npx playwright show-trace <path/to/trace.zip>

# Load: 50 users, 5-minute ramp (script reads __ENV.USERS / __ENV.RAMP_UP)
k6 run -e USERS=50 -e RAMP_UP=5m load-test.js
```

## Common Pitfalls

- **Over-testing in E2E** — E2E covers user workflows, not every button. If a
  unit test can prove it, the E2E test is slower and flakier for no gain.
- **Brittle selectors** — CSS/XPath break on layout changes. Use `getByTestId` / `getByRole`.
- **Non-deterministic waits** — never `waitForTimeout(ms)` or `networkidle`. Use
  web-first assertions (`await expect(locator).toBeVisible()`), which retry.
- **Failures without context** — "test failed" alone is useless. Capture traces,
  screenshots, console logs (`--trace on`).
- **Load-test spikes** — too short a ramp measures the ramp, not steady state.
- **No baseline metrics** — without recorded numbers, no regression is detectable.

Locator and wait patterns with code: [references/playwright.md](references/playwright.md).

## Test Credentials

Full guide: [references/credential-management.md](references/credential-management.md).

- Never commit `.env`; commit `.env.example` (keys only). Confirm `git check-ignore -q .env` before writing one.
- Check `.env` for the keys a test needs **before** asking the user; ask in chat only for the missing ones, then append them — never rewrite the file.
- CI reads the same keys from platform secrets (GitHub Secrets, GitLab CI/CD variables), not from a file — [references/ci-integration.md](references/ci-integration.md).
- Session expired / stale login state → `rm -rf playwright/.auth/`, then re-run so the setup project logs in again.

## Resources

- Playwright: https://playwright.dev/docs/intro · best practices: https://playwright.dev/docs/best-practices
- Vitest: https://vitest.dev/
- Grafana k6: https://grafana.com/docs/k6/latest/
- Cucumber: https://cucumber.io/docs/
- Pact: https://docs.pact.io/ · Testcontainers: https://testcontainers.com/

## Integration with Tester Agent

When the `tester` agent runs tests:
1. This skill covers every layer — unit, E2E, BDD, API, load. There is no second
   testing skill to consult.
2. Start at the cheapest layer that can prove the claim; escalate only as needed.
3. Prioritize Playwright over Cypress (better cross-browser).
4. Use BDD for acceptance criteria tests.
5. Always include `data-testid` attributes in development code.
6. On a failure, root-cause it with the `debugging` skill before changing the test —
   a test edited until it passes proves nothing.
7. Check for stored credentials in `.env` before prompting the user.
