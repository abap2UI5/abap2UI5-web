// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  /* Both specs in tests/web.spec.js set 240s themselves, because booting a
     whole transpiled ABAP backend inside the browser and then loading UI5
     from the CDN is nothing like a normal page load. Declared here as well so
     the NEXT spec inherits a workable budget instead of silently getting
     Playwright's 30s default and failing for a reason that is not its own. */
  timeout: 240000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /web\.spec\.js/,
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: /web\.spec\.js/,
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: /web\.spec\.js/,
    },

    /* Webpack browser build (the GitHub Pages demo): the transpiled backend
       runs inside the browser; ./build is served by srv/serve_build.mjs.
       Requires `npm run webpack:build` beforehand. */
    {
      name: 'chromium-web',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:8081' },
      testMatch: /web\.spec\.js/,
    },
  ],

  /* Run your local dev server before starting the tests */
   webServer: [
     {
       command: 'npm run express',
       url: 'http://localhost:3000',
       reuseExistingServer: !process.env.CI,
     },
     {
       command: 'npm run serve:build',
       url: 'http://localhost:8081',
       reuseExistingServer: !process.env.CI,
     },
   ],
});

