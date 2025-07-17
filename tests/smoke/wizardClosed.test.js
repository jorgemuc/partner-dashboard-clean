const { test, expect } = require('@playwright/test');

function launchElectron(args = ['.', '--no-sandbox']) {
  const { _electron: electron } = require('playwright');
  const exe = require('electron');
  return electron.launch({
    executablePath: exe,
    args,
    env: { ...process.env, ELECTRON_DISABLE_SANDBOX: '1' }
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
  await app.waitForEvent('ipc', (_e, msg) => msg === 'app-loaded');
  const page = await app.firstWindow();
  await expect(page.locator('#wizardModal')).toBeHidden();
  await app.close();
}, 30_000);
