const { test, expect } = require('@playwright/test');
const { version } = require('../../package.json');

function launchElectron(args = ['.', '--no-sandbox']) {
  const { _electron: electron } = require('playwright');
  const exe = require('electron');
  return electron.launch({
    executablePath: exe,
    args,
    env: { ...process.env, ELECTRON_DISABLE_SANDBOX: '1' }
  });
}

test('App exposes version and renders charts', async () => {
  process.env.DISPLAY ??= ':99';
  let app;
  try {
    app = await launchElectron();
  } catch (e) {
    if (process.env.SMOKE_HARD_FAIL) throw e;
    test.fail(true, 'Electron launch');
    return;
  }

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

