---
name: test-automation
description: All testing layers — Vitest unit, Playwright E2E deep-dive (configs, page objects, debugging, traces), Cucumber BDD, mobile (Appium/Detox), API (Supertest/Newman), k6 load, CI/CD integration, credential management. Use when writing or fixing tests, setting up test infrastructure, chasing a flaky test, or establishing performance baselines. One skill for every layer — there is no second testing toolkit to consult.
category: Testing & Debug
status: active
license: MIT
version: 2.0.0
---

# Test Automation (QA Engineering)

The single testing reference for this kit — every layer, whether you are the app
developer validating your own change or the QA engineer building reusable
infrastructure. Unit (Vitest) · E2E (Playwright, canonical) · BDD (Cucumber) ·
mobile (Appium/Detox) · API (Supertest/Newman) · load (k6).

Pick the layer by what you are trying to learn, not by your job title: a
function's logic → unit; a user's path through the app → E2E; a contract between
services → API; behaviour under concurrency → load.

## When to Use

- Writing or fixing unit tests for functions, components, utilities
- Setting up E2E test automation from scratch (web/mobile/API)
- Writing Playwright tests with page objects + advanced configs
- Implementing Cucumber/BDD scenarios with Gherkin
- Integrating tests with CI/CD pipelines (GitHub Actions, GitLab CI)
- Creating maintainable, flaky-resistant test suites
- Managing test credentials across local / CI / cloud
- Debugging test failures with traces, snapshots, codegen
- Establishing performance baselines and catching regressions under load

**Do NOT use when**: driving a browser for a long autonomous session (use `[[agent-browser]]`) · profiling a live page's runtime, network or Core Web Vitals (use `[[chrome-devtools]]`) · deriving *which* cases to test (use `[[scenario]]`) · practising red-green discipline on a bug fix (use `[[tdd]]`) · testing third-party SaaS behaviour you do not control.

## Supported Frameworks

### E2E Testing
- **Playwright** - Primary E2E framework (recommended)
- **Cypress** - Alternative E2E framework
- **Puppeteer** - Low-level browser automation

### BDD/Behavior Testing
- **Cucumber** - Gherkin-based BDD
- **SpecFlow** - Cucumber for .NET

### Mobile Testing
- **Appium** - Cross-platform mobile automation
- **Detox** - React Native E2E testing

### API Testing
- **Supertest** - HTTP assertions
- **Rest Assured** - Java API testing
- **Newman** - Postman CLI

### Unit Testing
- **Vitest** - Primary unit runner (Jest-compatible API, TypeScript-native, smart watch)
- **Jest** - Alternative; still the default in older repos
- **xUnit** - .NET services (see the [`csharp-developer`](../csharp-developer/SKILL.md) skill)

### Load Testing
- **k6** - Scriptable load tests with thresholds as pass/fail gates

## Unit Testing (Vitest)

The cheapest layer — reach for it first. Anything an E2E test could prove about a
pure function, a unit test proves faster and points straight at the cause.

1. **Configure** — `vitest.config.ts` sets the environment (`jsdom` for browser
   APIs), coverage thresholds, reporters.
2. **Write** — `.test.ts` / `.spec.ts` colocated with the source file.
3. **Run** — `npm run test`; `npm run test:watch` re-runs only the tests affected
   by the files you touched.
4. **Coverage** — `npm run test:coverage` writes an HTML report to
   `coverage/index.html`.

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts'],
    },
  },
});
```

## Playwright Quick Start

### Installation
```bash
npm init playwright@latest
# OR
npm install -D @playwright/test playwright
npx playwright install --with-deps
```

### Basic Test Structure
```typescript
import { test, expect } from '@playwright/test';

test.describe('Login Feature', () => {
  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'user@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-name"]')).toBeVisible();
  });
  
  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'invalid@example.com');
    await page.fill('[data-testid="password"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');
    
    await expect(page.locator('[data-testid="error-message"]'))
      .toContainText('Invalid credentials');
  });
});
```

### Playwright Configuration
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Cucumber/BDD Quick Start

### Installation
```bash
npm install -D @cucumber/cucumber @playwright/test
```

### Feature File
```gherkin
Feature: Login functionality

  Scenario: Successful login with valid credentials
    Given the user is on the login page
    When the user enters "user@example.com" in the email field
    And the user enters "password123" in the password field
    And the user clicks the login button
    Then the user should be redirected to the dashboard
    And the user should see their username

  Scenario: Failed login with invalid credentials
    Given the user is on the login page
    When the user enters "invalid@example.com" in the email field
    And the user enters "wrongpassword" in the password field
    And the user clicks the login button
    Then the user should see an error message
```

### Step Definitions
```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect, Page } from '@playwright/test';

let page: Page;

Given('the user is on the login page', async function() {
  await page.goto('/login');
});

When('the user enters {string} in the email field', async function(email: string) {
  await page.fill('[data-testid="email"]', email);
});

When('the user enters {string} in the password field', async function(password: string) {
  await page.fill('[data-testid="password"]', password);
});

When('the user clicks the login button', async function() {
  await page.click('[data-testid="login-button"]');
});

Then('the user should be redirected to the dashboard', async function() {
  await expect(page).toHaveURL('/dashboard');
});

Then('the user should see an error message', async function() {
  await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
});
```

## Best Practices

### 1. Test Data Management
```typescript
// Use fixtures for test data
test.use({
  testData: {
    user: { email: 'test@example.com', password: 'password123' },
    admin: { email: 'admin@example.com', password: 'admin123' },
  },
});

// In tests
test('admin can access settings', async ({ page }) => {
  const admin = test.config.testData.admin;
  await page.login(admin.email, admin.password);
});
```

### 2. Page Object Model
```typescript
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[data-testid="email"]');
    this.passwordInput = page.locator('[data-testid="password"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

// Usage in test
import { LoginPage } from '../pages/LoginPage';

test('login flow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
});
```

### 3. Handle Dynamic Content
```typescript
// Wait for elements properly
await page.waitForSelector('[data-testid="loaded-content"]');
await expect(page.locator('[data-testid="spinner"]')).toBeHidden();

// Handle navigation
await page.click('[data-testid="submit"]');
await page.waitForURL('/success');

// Handle dialogs
page.on('dialog', async dialog => {
  await dialog.accept();
});
```

### 4. Reduce Flakiness
```typescript
// Use locators that don't change
// ✅ Good: data-testid, role, text
await page.click('[data-testid="submit-button"]');
await page.getByRole('button', { name: 'Submit' });

// ❌ Avoid: indices, partial text
await page.locator('button').nth(0);
await page.locator('button:has-text("Sub")');

// Use proper waits instead of sleep
await page.waitForLoadState('networkidle');
await expect(locator).toBeVisible({ timeout: 10000 });
```

### 5. Parallel Execution
```typescript
// Playwright runs tests in parallel by default
// Configure in playwright.config.ts
export default defineConfig({
  fullyParallel: true,
  workers: process.env.CI ? 1 : 4, // Limit on CI
});
```

## CI/CD Integration

### GitHub Actions
```yaml
# .github/workflows/test.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
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
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

### Run Specific Tests
```bash
# Run by tag
npx playwright test --grep @smoke
npx playwright test --grep @regression

# Run by file pattern
npx playwright test "tests/login/**"
npx playwright test "tests/login/login.spec.ts"

# Run specific suite
npx playwright test --project=chromium
```

## Test Maintenance

### Debug Failed Tests
```bash
# Interactive mode
npx playwright test --debug

# UI mode
npx playwright test --ui

# With trace
npx playwright test --trace on
# View trace: npx playwright show-trace trace.zip
```

### Update Tests After UI Changes
```bash
# Update snapshots
npx playwright test --update-snapshots

# Codegen new selectors
npx playwright codegen
```

### Test Reports
```bash
# HTML report
npx playwright show-report

# JSON report for CI
npx playwright test --reporter=json
```

## Load Testing (k6)

1. **Write the script** — virtual users, request pattern, and thresholds. Put the
   thresholds in the script: they are the pass/fail gate, not a number someone
   eyeballs in the output.
2. **Run locally** — `k6 run script.js` prints throughput, p95 latency, error rate.
3. **Scale** — raise `vus` and ramp duration gradually. A cold jump to peak load
   measures the ramp, not the system.
4. **Compare against a baseline** — a load run with nothing to compare to cannot
   detect a regression. Record the numbers.

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.1'],
  },
};

export default function () {
  const res = http.get('https://api.example.com/data');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```

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
npx playwright test --trace on    # then: npx playwright show-trace trace.zip

# Load: 50 users, 5-minute ramp
k6 run -e USERS=50 -e RAMP_UP=5m load-test.js
```

## Common Pitfalls

- **Over-testing in E2E** — E2E covers user workflows, not every button. If a
  unit test can prove it, the E2E test is slower and flakier for no gain.
- **Brittle selectors** — CSS/XPath break on layout changes. Use `data-testid`.
- **Non-deterministic waits** — never `waitForTimeout(ms)`. Use
  `waitForSelector` / `expect(...).toBeVisible()`.
- **Failures without context** — "test failed" alone is useless. Capture traces,
  screenshots, console logs (`--trace on`).
- **Load-test spikes** — too short a ramp measures the ramp, not steady state.
- **No baseline metrics** — without recorded numbers, no regression is detectable.

## Resources

- Playwright Docs: https://playwright.dev/docs/intro
- Vitest Docs: https://vitest.dev/
- Grafana k6 Docs: https://grafana.com/docs/k6/latest/
- Cucumber Docs: https://cucumber.io/docs/
- Playwright Best Practices: https://playwright.dev/docs/best-practices
- MS Playwright Testing: https://learn.microsoft.com/en-us/playwright/

## Credential Management

See: [references/credential-management.md](references/credential-management.md) for detailed guide on storing and managing test credentials across local, CI/CD, and cloud environments.

```text
project/
├── .env                    # Root credentials - NEVER commit
├── .env.example            # Template - safe to commit
├── .gitignore             # Must include .env
└── tests/
    ├── .env              # Test-specific credentials
    └── fixtures/
        └── accounts.json # Encrypted or gitignored
```

### Environment Variables Setup

**1. Create `.env` file:**
```bash
# .env - Local development (DO NOT COMMIT)
TEST_USER=admin@example.com
TEST_PASS=SecurePassword123
API_KEY=sk_test_xxx
ADMIN_ID=12345

# Staging environment
STAGING_URL=https://staging.example.com
STAGING_USER=staging@example.com
STAGING_PASS=staging_pass
```

**2. Create `.env.example` (template - commit):**
```bash
# .env.example - Copy this and fill in your values
TEST_USER=
TEST_PASS=
API_KEY=
ADMIN_ID=
```

**3. Add to `.gitignore`:**
```text
.env
.env.local
.env.*.local
tests/.env
tests/fixtures/credentials.json
playwright/.auth/
```

### Playwright Config with Credentials

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.test' });

export default defineConfig({
  use: {
    // Use environment variables in tests
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
  },
  // Pass credentials to tests via environment
});
```

### Using Credentials in Tests

```typescript
import { test, expect } from '@playwright/test';

test('login with stored credentials', async ({ page }) => {
  // Credentials from environment variables
  const user = process.env.TEST_USER;
  const pass = process.env.TEST_PASS;
  
  await page.goto('/login');
  await page.fill('[data-testid="email"]', user);
  await page.fill('[data-testid="password"]', pass);
  await page.click('[data-testid="login-button"]');
});

test('admin operations with stored ID', async ({ page }) => {
  const adminId = process.env.ADMIN_ID;
  
  // Navigate to admin with stored ID
  await page.goto(`/admin/users/${adminId}`);
});
```

### CI/CD Integration

**GitHub Actions:**
```yaml
# .github/workflows/test.yml
jobs:
  e2e:
    steps:
      - name: Inject credentials
        run: |
          echo "TEST_USER=${{ secrets.TEST_USER }}" >> $GITHUB_ENV
          echo "TEST_PASS=${{ secrets.TEST_PASS }}" >> $GITHUB_ENV
          echo "ADMIN_ID=${{ secrets.ADMIN_ID }}" >> $GITHUB_ENV
      
      - name: Run tests
        run: npx playwright test
```

**GitLab CI:**
```yaml
test:
  variables:
    TEST_USER: $TEST_USER
    TEST_PASS: $TEST_PASS
  script:
    - npx playwright test
```

### User-Provided Credentials Workflow

When running tests that require user credentials:

**Step 1: Check for stored credentials**
```bash
# Check if credentials exist
if [ -f .env ]; then
  echo "Using stored credentials"
else
  echo "No stored credentials found"
fi
```

**Step 2: Prompt user (if not found)**
```bash
echo "Enter test credentials (will be saved for next run):"
read -p "Test User: " USER
read -s -p "Test Password: " PASS
read -p "Admin ID: " ADMIN_ID

# Save to .env for next run
echo "TEST_USER=$USER" > .env
echo "TEST_PASS=$PASS" >> .env
echo "ADMIN_ID=$ADMIN_ID" >> .env

echo "✅ Credentials saved to .env for future runs"
```

**Step 3: Use in test automation**
```typescript
// Auto-load from .env if exists
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '../../.env');
if (require('fs').existsSync(envPath)) {
  dotenv.config({ path: envPath });
}
```

### Security Best Practices

1. **NEVER commit credentials** - Add to `.gitignore`
2. **Use different accounts** - Separate test accounts from production
3. **Rotate credentials** - Update periodically
4. **Limit permissions** - Test accounts should have minimal access
5. **Use secrets manager** - For enterprise, use AWS Secrets Manager, etc.
6. **Encrypt at rest** - If storing locally, consider encrypting

### Regenerate/Update Credentials

```bash
# When credentials expire or change
# 1. Ask user for new credentials
# 2. Update .env file
# 3. Run login test to verify
npx playwright test tests/auth/login.spec.ts

# 4. Re-authenticate if session expired
# Delete old auth state
rm -rf playwright/.auth/
# Run tests to create new session
npx playwright test
```

---

## Integration with Tester Agent

When the `tester` agent runs tests:
1. This skill covers every layer — unit, E2E, BDD, API, load. There is no second
   testing skill to consult.
2. Start at the cheapest layer that can prove the claim; escalate only as needed.
3. Prioritize Playwright over Cypress (better cross-browser)
4. Use BDD for acceptance criteria tests
5. Always include `data-testid` attributes in development code
6. On a failure, root-cause it with the `debugging` skill before changing the test —
   a test edited until it passes proves nothing.
6. Check for stored credentials in `.env` before prompting user