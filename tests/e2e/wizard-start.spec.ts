import { _electron as electron, test, expect } from '@playwright/test';
import path from 'node:path';

// 1) derive correct binary path once
const electronPath = await electron.launcher.executablePath();


test('wizard hidden on fresh launch', async () => {
  // 2) launch app with real main entry (no bundle needed)
  const app = await electron.launch({
    executablePath: electronPath,
    args: [path.join(__dirname, '../../src/main.js')],
    env: {
      DISPLAY: process.env.DISPLAY || ':99',
      ELECTRON_ENABLE_LOGGING: '1',
      ELECTRON_DISABLE_SANDBOX: '1'
    }
  });

  // 2. Erstes Renderer-Fenster holen
  const page = await app.firstWindow();

  // Wizard modal should stay hidden
  await expect(page.locator('#wizardModal')).toBeHidden();

  await app.close();
});
