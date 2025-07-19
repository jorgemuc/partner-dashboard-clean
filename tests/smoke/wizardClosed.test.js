const { test, expect } = require('@playwright/test');
const { launchApp, captureConsole } = require('../helpers/smokeSetup.js');

// Wizard visible on first launch and reopen via button
test('wizard shows then persists closed', async () => {
  process.env.DISPLAY ??= ':99';
  let app;
  try {
    app = await launchApp();
  } catch (e) {
    if (process.env.SMOKE_HARD_FAIL) throw e;
    test.fail(true, 'Electron launch');
    return;
  }
  const page = await app.firstWindow();
  const logs = captureConsole(page);
  await app.waitForEvent('ipc', (_e, msg) => msg === 'app-loaded');
  await page.waitForFunction(() => !!window.api, { timeout: 5000 });
  const preloadErr = await page.evaluate(() => window.api.readiness?.has('preload-error'));
  expect(preloadErr).toBeFalsy();
  await expect(page.locator('#wizardModal')).not.toHaveClass(/hidden/);
  await page.click('[data-close="x"]');
  await expect(page.locator('#wizardModal')).toHaveClass(/hidden/);
  await page.evaluate(() => localStorage.setItem('wizard.dismissed','1'));
  await page.click('#wizardOpenBtn');
  await expect(page.locator('#wizardModal')).not.toHaveClass(/hidden/);
  const errLog = logs.find(l => l.includes('[preload-err]') || l.includes('[preload-error-event]'));
  if (errLog) test.fail(true, errLog);
  await app.close();
}, 30_000);
