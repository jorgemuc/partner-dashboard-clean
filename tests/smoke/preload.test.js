const { test, expect } = require('@playwright/test');
const { _electron: electron } = require('playwright');
const path = require('path');

test('App starts ohne Preload-Fehler', async () => {
  const app = await electron.launch({ args: ['.'] });
  const page = await app.firstWindow();

  const logs = [];
  page.on('console', msg => logs.push(msg.text()));

  await page.waitForLoadState('domcontentloaded');
  await app.close();

  const bad = /MODULE_NOT_FOUND|Unable to load preload|bus.+undefined/i;
  expect(logs.some(l => bad.test(l))).toBeFalsy();
}, 30_000);

