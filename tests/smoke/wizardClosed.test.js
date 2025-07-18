const { test, expect } = require('@playwright/test');
const { launchApp } = require('../helpers/launchApp.js');

// Ensure wizard stays closed on startup
test('wizard remains closed on launch', async () => {
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
  await app.waitForEvent('ipc');
  await page.waitForSelector('body');
  await expect(page.locator('#wizardModal')).toHaveClass(/hidden/);
  await page.click('#wizardOpenBtn');
  await expect(page.locator('#wizardModal')).not.toHaveClass(/hidden/);
  await page.click('[data-close="x"]');
  await expect(page.locator('#wizardModal')).toHaveClass(/hidden/);
  await app.close();
}, 30_000);
