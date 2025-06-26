const { test, expect } = require('@playwright/test');
const { _electron: electron } = require('playwright');
const path = require('path');

test('App starts und sendet ready-IPC', async () => {
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env:{ ELECTRON_DISABLE_SANDBOX:'1' } });
  const page = await app.firstWindow();

  // Auf das IPC-Bus-Signal aus dem Renderer warten
  await app.waitForEvent('ipc', msg => msg === 'e2e-ready');

  const hasBus = await page.evaluate(() =>
    !!window.api?.bus && typeof window.api.bus.emit === 'function');
  expect(hasBus).toBe(true);
  await app.close();
}, 30_000);

