# Playwright — Config, Fixtures, Page Objects, Maintenance

Deep-dive for the E2E layer. The basic login test lives in [../SKILL.md](../SKILL.md)
(§ E2E Testing); this file builds on it instead of repeating it.

## Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Root .env — see credential-management.md. Never overrides variables already set (CI secrets win).
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined, // undefined = half the CPU cores locally
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } }, // mobile *viewport*, not a native app
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Parallelism and workers

Tests run in parallel by default; `fullyParallel: true` also parallelises tests
inside one file. `workers: 1` on CI is the stable starting point (shared CI
runners are small and tests often share a backend). Raise it — or split the run
with `--shard=1/4` across jobs — only once tests are isolated (no shared accounts,
no order dependence). Locally, leave it `undefined`.

## Page Objects + Fixtures

A page object holds the locators; a fixture (`test.extend`) builds it and hands
tests their data, so a test never constructs either itself.

```typescript
// tests/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly error: Locator;

  constructor(readonly page: Page) {
    this.email = page.getByTestId('email');
    this.password = page.getByTestId('password');
    this.submit = page.getByTestId('login-button');
    this.error = page.getByTestId('error-message');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }
}
```

```typescript
// tests/fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

type Account = { email: string; password: string };

export const test = base.extend<{ loginPage: LoginPage; testUser: Account }>({
  testUser: async ({}, use) => {
    await use({ email: process.env.TEST_USER ?? '', password: process.env.TEST_PASS ?? '' });
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
});
export { expect } from '@playwright/test';
```

```typescript
// tests/settings.spec.ts
import { test, expect } from './fixtures';

test('user can open settings', async ({ loginPage, testUser, page }) => {
  await loginPage.login(testUser.email, testUser.password);
  await page.getByRole('link', { name: 'Settings' }).click();
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
});
```

## Authenticate Once (storage state)

Log in in a `setup` project, save the session to `playwright/.auth/`, and let
every other project start already logged in. `playwright/.auth/` holds live
session cookies — it must be in `.gitignore`.

```typescript
// tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.TEST_USER!, process.env.TEST_PASS!);
  await expect(page).toHaveURL('/dashboard');
  await page.context().storageState({ path: authFile });
});
```

```typescript
// playwright.config.ts — projects
projects: [
  { name: 'setup', testMatch: /.*\.setup\.ts/ },
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
    dependencies: ['setup'],
  },
],
```

The setup project re-runs on every invocation. If you skip it (`--no-deps`, or a
freshness check in the setup), a stale session fails every test at once — delete
`playwright/.auth/` and run again.

## Locators, Waits, Dynamic Content

```typescript
// ✅ Stable: test ids and roles — and always act or assert on them
await page.getByTestId('submit-button').click();
await page.getByRole('button', { name: 'Submit' }).click();

// ❌ Brittle: position and partial text
page.locator('button').nth(0);
page.locator('button:has-text("Sub")');

// ✅ Wait with web-first assertions — they retry until the timeout
await expect(page.getByTestId('loaded-content')).toBeVisible();
await expect(page.getByTestId('spinner')).toBeHidden();
await expect(page.getByTestId('row')).toHaveCount(3, { timeout: 10_000 });

// Navigation: act, then assert the URL (no waitForNavigation / networkidle)
await page.getByTestId('submit').click();
await expect(page).toHaveURL('/success');

// Dialogs: register the handler before the action that opens one
page.once('dialog', (dialog) => dialog.accept());
await page.getByTestId('delete').click();
```

Avoid `page.waitForTimeout(ms)`, `waitForLoadState('networkidle')` and
`waitForSelector` — they either guess a duration or wait for the wrong signal.
Assert on what the user would see.

## Selecting and Maintaining Tests

Day-to-day run/debug commands (`--headed`, `--debug`, `--ui`, `--trace on`) are in
the SKILL.md cheat-sheet. The rest:

```bash
# Select
npx playwright test --grep @smoke             # tag in the title: test('checkout @smoke', ...)
npx playwright test --grep-invert @slow
npx playwright test tests/login/              # by directory or file
npx playwright test --project=chromium
npx playwright test --last-failed

# Maintain
npx playwright test --update-snapshots        # after an intended UI change
npx playwright codegen http://localhost:3000  # record selectors for a new flow

# Reports
npx playwright show-report                    # last HTML report
npx playwright test --reporter=json > results.json
npx playwright show-trace test-results/<test>/trace.zip
```
