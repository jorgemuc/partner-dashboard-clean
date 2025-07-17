import { execSync } from 'node:child_process';
import path from 'node:path';
import { test, expect, _electron as electron } from '@playwright/test';

test('wizard hidden on fresh launch', async () => {
  // Build renderer bundle before launching Electron
  execSync('npm run bundle', { stdio: 'inherit' });

  // 1. Electron-App starten (Main-Entry = "main.js")
  const app = await electron.launch({
    executablePath: require('electron'),
    args: [path.join(__dirname, '../../main.js'), '--no-sandbox'],
    env: { ELECTRON_DISABLE_SANDBOX: '1' },
  });

  // 2. Erstes Renderer-Fenster holen
  const page = await app.firstWindow();

  // 3. Warten bis die App ihr data-Attribut setzt
  await page.waitForSelector('body[data-testid="app-ready"]');

  // 4. Assertion: Wizard-Modal bleibt verborgen
  await expect(page.locator('#wizardModal')).toBeHidden();

  await app.close();
});
