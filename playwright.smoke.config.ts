import { defineConfig } from '@playwright/test';
import './tests/_canvasStub.js';

export default defineConfig({
  testDir: 'tests/smoke',
  timeout: 60_000,
  use: { headless: true },
  projects: [{ name: 'electron', use: { browserName: 'chromium' } }],
});
