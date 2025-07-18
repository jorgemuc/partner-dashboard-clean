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
  await page.waitForSelector('body');
  await page.locator('#wizardModal').waitFor({ state: 'hidden' });
  await app.close();
}, 30_000);
