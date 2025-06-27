const { test, expect } = require('@playwright/test');
const { _electron: electron } = require('playwright');
const { version } = require('../../package.json');

test('App exposes version and demo button', async () => {
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
  await app.close();
}, 30_000);

