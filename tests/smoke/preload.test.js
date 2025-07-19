const { test, expect } = require('@playwright/test');
const { version } = require('../../package.json');
const { launchApp, captureConsole } = require('../helpers/smokeSetup.js');

test('App exposes version and renders charts', async () => {
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
  await page.waitForFunction(() => !!window.api, { timeout: 5000 });
  const preloadErr = await page.evaluate(() => window.api.readiness?.has('preload-error'));
  expect(preloadErr).toBeFalsy();
  const res = await page.evaluate(() => ({
    version: typeof window.api.version === 'function'
             ? window.api.version()
             : window.api.version,
    demoEnabled: !document.getElementById('demoDataBtn').disabled
  }));
  expect(res.version).toMatch(/^\d+\.\d+\.\d+$/);
  expect(res.demoEnabled).toBe(true);
  await page.waitForFunction(() => window.api.readiness?.has('base-ui'), { timeout: 8000 });
  await page.click('#demoDataBtn');
  await page.waitForFunction(() => window.api.readiness?.has('charts'), { timeout: 10000 });
  await page.setInputFiles('#csvFile', require('path').join(__dirname, '../fixtures/partner.csv'));
  await page.waitForTimeout(300);
  const rows = await page.evaluate(() => document.querySelectorAll('#tablePartnerTable tbody tr').length);
  expect(rows).toBeGreaterThan(0);
  const errLog = logs.find(l => l.includes('[preload-err]') || l.includes('[preload-error-event]'));
  if (errLog) test.fail(true, errLog);
  await app.close();
}, 30_000);

