// @ts-check
const { test, expect } = require('@playwright/test');

// Smoke test for the webpack browser build (the GitHub Pages demo): the
// bundle boots the transpiled ABAP backend in the browser, fetches the
// frontend HTML from it and document.writes it. Runs against the static
// build server (srv/serve_build.mjs) via the chromium-web project.
//
// Deliberately no assertion on rendered view content: a known upstream
// @abaplint/transpiler issue makes check_on_init() always false in the
// transpiled backend, so it may not return view XML even though the
// roundtrip itself succeeds.
test('webpack build boots the backend-served frontend', async ({ page }) => {
  test.setTimeout(240000);
  await page.goto('/');
  await expect(page).toHaveTitle(/abap2UI5/);

  // Backend initialized in the browser and the GET HTML was written
  // (works without the UI5 CDN - pure in-browser backend + document.write).
  await page.waitForFunction(() => !!document.getElementById('sap-ui-bootstrap'), null, { timeout: 90000 });

  // UI5 loaded from the CDN and onInitComponent ran
  // (it sets window.z2ui5 = { checkLocal: true }).
  await page.waitForFunction(() => window["z2ui5"]?.checkLocal === true, null, { timeout: 90000 });

  // The first POST roundtrip through the in-browser backend completed
  // (Server.responseSuccess stores the parsed response on the z2ui5 global).
  await page.waitForFunction(() => !!window["z2ui5"]?.oResponse, null, { timeout: 90000 });
});
