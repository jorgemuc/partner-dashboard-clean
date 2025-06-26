const { test, expect } = require('@playwright/test');
const { _electron: electron } = require('playwright');
const path = require('path');

test('App starts und sendet ready-IPC', async () => {
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env:{ ELECTRON_DISABLE_SANDBOX:'1' } });

  // Warte auf das IPC-Signal aus dem Preload
  await app.waitForEvent('ipc', (_evt, msg) => msg === 'e2e-ready');

  const page = await app.firstWindow();

  const hasBus = await page.evaluate(() =>
    !!window.api?.bus && typeof window.api.bus.emit === 'function');
  expect(hasBus).toBe(true);
  await app.close();
}, 30_000);

