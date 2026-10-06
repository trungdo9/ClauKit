# BDD with Cucumber + Playwright

Use BDD when acceptance criteria are written (or reviewed) by non-developers:
the `.feature` file *is* the spec. For developer-only tests, plain Playwright
([playwright.md](playwright.md)) is less machinery for the same coverage.

Two ways to run Gherkin against a browser:

- **`@cucumber/cucumber` + Playwright library** (below) — Cucumber owns the run;
  you manage the browser in hooks. Works with any Cucumber tooling.
- **`playwright-bdd`** — compiles `.feature` files into Playwright tests, so you
  keep Playwright's runner, fixtures, traces and parallelism. Prefer it when the
  suite is Playwright-first.

## Install

```bash
npm install -D @cucumber/cucumber @playwright/test ts-node
npx playwright install --with-deps chromium
```

```javascript
// cucumber.cjs
module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['features/support/**/*.ts', 'features/steps/**/*.ts'],
    format: ['progress', 'html:reports/cucumber.html'],
  },
};
```

Run with `npx cucumber-js`.

## Feature File

```gherkin
# features/login.feature
Feature: Login

  Scenario: Successful login with valid credentials
    Given the user is on the login page
    When the user logs in as the test user
    Then the user should be redirected to the dashboard

  Scenario: Failed login with invalid credentials
    Given the user is on the login page
    When the user enters "invalid@example.com" and "wrongpassword"
    Then the user should see an error message
```

Keep secrets out of `.feature` files — "the test user" resolves to `TEST_USER` /
`TEST_PASS` from the environment ([credential-management.md](credential-management.md)).

## World + Hooks (browser lifecycle)

Each scenario gets its own browser context via the World, so `this.page` is
always initialised and scenarios never share state.

```typescript
// features/support/world.ts
import { setWorldConstructor, World, Before, After } from '@cucumber/cucumber';
import { chromium, Browser, Page } from '@playwright/test';

export class PlaywrightWorld extends World {
  browser!: Browser;
  page!: Page;
}
setWorldConstructor(PlaywrightWorld);

Before(async function (this: PlaywrightWorld) {
  this.browser = await chromium.launch();
  this.page = await this.browser.newPage({
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
  });
});

After(async function (this: PlaywrightWorld) {
  await this.browser.close();
});
```

## Step Definitions

Use `function`, not arrow functions — Cucumber binds the World to `this`.

```typescript
// features/steps/login.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { PlaywrightWorld } from '../support/world';

Given('the user is on the login page', async function (this: PlaywrightWorld) {
  await this.page.goto('/login');
});

When('the user logs in as the test user', async function (this: PlaywrightWorld) {
  await this.page.getByTestId('email').fill(process.env.TEST_USER!);
  await this.page.getByTestId('password').fill(process.env.TEST_PASS!);
  await this.page.getByTestId('login-button').click();
});

When('the user enters {string} and {string}', async function (this: PlaywrightWorld, email: string, password: string) {
  await this.page.getByTestId('email').fill(email);
  await this.page.getByTestId('password').fill(password);
  await this.page.getByTestId('login-button').click();
});

Then('the user should be redirected to the dashboard', async function (this: PlaywrightWorld) {
  await expect(this.page).toHaveURL(/\/dashboard$/);
});

Then('the user should see an error message', async function (this: PlaywrightWorld) {
  await expect(this.page.getByTestId('error-message')).toBeVisible();
});
```

For larger suites, wrap the locators in the page object from
[playwright.md](playwright.md) and call it from the steps.
