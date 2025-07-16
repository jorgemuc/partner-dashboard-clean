const { test, expect } = require('@playwright/test');
const { _electron: electron } = require('playwright');
const { version } = require('../../package.json');

test('App exposes version and renders charts', async () => {
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env:{ ELECTRON_DISABLE_SANDBOX:'1' } });

  // wait for the main process "app-loaded" signal
  await app.waitForEvent('ipc', (_e, msg) => msg === 'app-loaded');

  const page = await app.firstWindow();
  const res = await page.evaluate(() => ({
    version: window.api?.version,
    demoEnabled: !document.getElementById('demoDataBtn').disabled
  }));
  expect(res.version).toBe(version);
  expect(res.demoEnabled).toBe(true);
  await page.click('#demoDataBtn');
  await page.waitForSelector('canvas.chartjs-render-monitor');
  const count = await page.evaluate(() => document.querySelectorAll('canvas.chartjs-render-monitor').length);
  expect(count).toBeGreaterThan(0);
  await page.setInputFiles('#csvFile', require('path').join(__dirname, '../fixtures/partner.csv'));
  await page.waitForTimeout(300);
  const rows = await page.evaluate(() => document.querySelectorAll('#tablePartnerTable tbody tr').length);
  expect(rows).toBeGreaterThan(0);
  await app.close();
}, 30_000);

