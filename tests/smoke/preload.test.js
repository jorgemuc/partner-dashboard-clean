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
  captureConsole(page);
  await page.waitForSelector('body');
  const hasApi = await page.evaluate(() => typeof window.api !== 'undefined');
  expect(hasApi).toBe(true);
  const res = await page.evaluate(() => ({
    version: typeof window.api.version === 'function'
             ? window.api.version()
             : window.api.version,
    demoEnabled: !document.getElementById('demoDataBtn').disabled
  }));
  expect(res.version).toMatch(/^\d+\.\d+\.\d+$/);
  expect(res.demoEnabled).toBe(true);
  await page.click('#demoDataBtn');
  await page.waitForFunction(() => window.api.getChartStatus().ready);
  await page.setInputFiles('#csvFile', require('path').join(__dirname, '../fixtures/partner.csv'));
  await page.waitForTimeout(300);
  const rows = await page.evaluate(() => document.querySelectorAll('#tablePartnerTable tbody tr').length);
  expect(rows).toBeGreaterThan(0);
  await app.close();
}, 30_000);

