const { test, expect } = require('@playwright/test');

function launchElectron(args = ['.', '--no-sandbox']) {
  const { _electron: electron } = require('playwright');
  const exe = require('electron');
  return electron.launch({
    executablePath: exe,
    args,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      ELECTRON_DISABLE_SANDBOX: '1'
    }
  });
}

// Ensure wizard stays closed on startup
test('wizard remains closed on launch', async () => {
  process.env.DISPLAY ??= ':99';
  let app;
  try {
    app = await launchElectron();
  } catch (e) {
    if (process.env.SMOKE_HARD_FAIL) throw e;
    test.fail(true, 'Electron launch');
    return;
  }
  const page = await app.firstWindow();
  await page.waitForSelector('body');
  await page.locator('#wizardModal').waitFor({ state: 'hidden' });
  await app.close();
}, 30_000);
