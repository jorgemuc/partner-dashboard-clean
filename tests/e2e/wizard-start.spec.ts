import { test, expect, _electron as electron } from '@playwright/test';

test('wizard hidden on fresh launch', async () => {
  // 1. Electron-App starten (Main-Entry = ".")
  const app = await electron.launch({ args: ['.'] });

  // 2. Erstes Renderer-Fenster holen
  const page = await app.firstWindow();

  // 3. Warten bis die App ihr data-Attribut setzt
  await page.waitForSelector('body[data-testid="app-ready"]');

  // 4. Assertion: Wizard-Modal bleibt verborgen
  await expect(page.locator('#wizardModal')).toBeHidden();

  await app.close();
});
