const { test, expect } = require('@playwright/test');
const { launchApp, captureConsole } = require('../helpers/smokeSetup.js');

test('wizard persists dismissed state', async () => {
  process.env.DISPLAY ??= ':99';
  const app1 = await launchApp();
  await app1.waitForEvent('ipc', (_e, msg) => msg === 'app-loaded');
  const page1 = await app1.firstWindow();
  const logs1 = captureConsole(page1);
  page1.on('console', msg => {
    const t = msg.text();
    if (/\[preload-err\]|\[preload-error-event\]/.test(t)) {
      throw new Error('Preload failure detected: ' + t);
    }
  });
  await page1.waitForFunction(() => !!window.api?.version, { timeout: 5000 });
  const preloadErr1 = await page1.evaluate(() => window.api.readiness?.has('preload-error'));
  expect(preloadErr1).toBeFalsy();
  await page1.waitForFunction(() => window.api.readiness?.has('base-ui'), { timeout: 5000 });
  await expect(page1.locator('#wizardModal')).not.toHaveClass(/hidden/);
  await page1.click('[data-close="x"]');
  await expect(page1.locator('#wizardModal')).toHaveClass(/hidden/);
  await page1.evaluate(() => localStorage.setItem('wizard.dismissed','1'));
  const err1 = logs1.find(l => l.includes('[preload-err]') || l.includes('[preload-error-event]'));
  if (err1) test.fail(true, err1);
  await app1.close();

  const app2 = await launchApp();
  await app2.waitForEvent('ipc', (_e, msg) => msg === 'app-loaded');
  const page2 = await app2.firstWindow();
  const logs2 = captureConsole(page2);
  page2.on('console', msg => {
    const t = msg.text();
    if (/\[preload-err\]|\[preload-error-event\]/.test(t)) {
      throw new Error('Preload failure detected: ' + t);
    }
  });
  await page2.waitForFunction(() => !!window.api?.version, { timeout: 5000 });
  const preloadErr2 = await page2.evaluate(() => window.api.readiness?.has('preload-error'));
  expect(preloadErr2).toBeFalsy();
  await page2.waitForFunction(() => window.api.readiness?.has('base-ui'), { timeout: 5000 });
  await expect(page2.locator('#wizardModal')).toHaveClass(/hidden/);
  const err2 = logs2.find(l => l.includes('[preload-err]') || l.includes('[preload-error-event]'));
  if (err2) test.fail(true, err2);
  await app2.close();
});
