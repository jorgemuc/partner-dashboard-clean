import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/smoke',
  timeout: 60_000,
  use: { headless: true },
  projects: [{ name: 'electron', use: { browserName: 'chromium' } }],
  globalSetup: require.resolve('./tests/globalSetup.js')
});
