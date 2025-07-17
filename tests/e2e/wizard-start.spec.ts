import path from 'node:path';
import { test, expect, _electron as electron } from '@playwright/test';


test('wizard hidden on fresh launch', async () => {
  const app = await electron.launch({
    executablePath: require('electron'),
    args: [path.join(__dirname, '../../main.js'), '--no-sandbox'],
    env: { ELECTRON_ENABLE_LOGGING: '1', ELECTRON_DISABLE_SANDBOX: '1' },
  });

  // 2. Erstes Renderer-Fenster holen
  const page = await app.firstWindow();

  // Wizard modal should stay hidden
  await expect(page.locator('#wizardModal')).toBeHidden();

  await app.close();
});
