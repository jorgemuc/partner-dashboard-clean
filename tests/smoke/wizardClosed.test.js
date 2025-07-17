const { test, expect } = require('@playwright/test');
const { _electron: electron } = require('playwright');

// Ensure wizard stays closed on startup
test('wizard remains closed on launch', async () => {
  const app = await electron.launch({ executablePath: require('electron'), args: ['.', '--no-sandbox'], env:{ ELECTRON_DISABLE_SANDBOX:'1' } });
  await app.waitForEvent('ipc', (_e, msg) => msg === 'app-loaded');
  const page = await app.firstWindow();
  await expect(page.locator('#wizardModal')).toBeHidden();
  await app.close();
}, 30_000);
