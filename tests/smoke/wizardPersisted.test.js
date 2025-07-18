const { test, expect } = require('@playwright/test');
const { launchApp, captureConsole } = require('../helpers/smokeSetup.js');

test('wizard persists dismissed state', async () => {
  process.env.DISPLAY ??= ':99';
  const app1 = await launchApp();
  const page1 = await app1.firstWindow();
  captureConsole(page1);
  await app1.waitForEvent('ipc', (_e, msg) => msg === 'app-loaded');
  await expect(page1.locator('#wizardModal')).not.toHaveClass(/hidden/);
  await page1.click('[data-close="x"]');
  await expect(page1.locator('#wizardModal')).toHaveClass(/hidden/);
  await app1.close();

  const app2 = await launchApp();
  const page2 = await app2.firstWindow();
  captureConsole(page2);
  await app2.waitForEvent('ipc', (_e, msg) => msg === 'app-loaded');
  await expect(page2.locator('#wizardModal')).toHaveClass(/hidden/);
  await app2.close();
});
