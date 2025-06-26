const { test, expect } = require('@playwright/test');
const { _electron: electron } = require('playwright');
const path = require('path');

test('App starts und sendet ready-IPC', async () => {
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env:{ ELECTRON_DISABLE_SANDBOX:'1' } });
  const [msg] = await app.waitForEvent('ipc', m => m === 'e2e-ready');
  expect(msg).toBe('e2e-ready');
  await app.close();
}, 30_000);

