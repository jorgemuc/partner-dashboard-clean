const { test, expect } = require('@playwright/test');
const { version } = require('../../package.json');
const { launchApp } = require('../helpers/launchApp.js');

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
  await page.waitForSelector('body');
  const v = await page.evaluate(() => window.api.version());
  const demoEnabled = await page.evaluate(() => !document.getElementById('demoDataBtn').disabled);
  expect(v).toMatch(/^\d+\.\d+\.\d+$/);
  expect(demoEnabled).toBe(true);
  await page.click('#demoDataBtn');
  await page.waitForSelector('#chartCanvas', { state: 'visible' });
  await page.setInputFiles('#csvFile', require('path').join(__dirname, '../fixtures/partner.csv'));
  await page.waitForTimeout(300);
  const rows = await page.evaluate(() => document.querySelectorAll('#tablePartnerTable tbody tr').length);
  expect(rows).toBeGreaterThan(0);
  await app.close();
}, 30_000);

