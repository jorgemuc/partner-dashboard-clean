import { test, expect } from '@playwright/test';
import { launchApp } from '../helpers/launchApp.js';


test('wizard hidden on fresh launch', async () => {
  const app = await launchApp();

  // 2. Erstes Renderer-Fenster holen
  const page = await app.firstWindow();

  // Wizard modal should stay hidden
  await expect(page.locator('#wizardModal')).toBeHidden();

  await app.close();
});
