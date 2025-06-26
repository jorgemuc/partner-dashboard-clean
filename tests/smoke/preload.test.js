const { test, expect } = require('@playwright/test');
const { _electron: electron } = require('playwright');
const path = require('path');

test('App starts ohne Preload-Fehler', async () => {
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env:{ ELECTRON_DISABLE_SANDBOX:'1' } });
  const page = await app.firstWindow();

  const logs = [];
  page.on('console', msg => logs.push(msg.text()));

  await page.waitForSelector('body');
  const hasBus = await page.evaluate(() => !!window.api?.bus && typeof window.api.bus.emit === 'function');
  const hard = /MODULE_NOT_FOUND|\[pl-err\]/;
  await page.waitForSelector('header');
  expect(logs.some(l => hard.test(l) || /preload/i.test(l))).toBeFalsy();
  expect(hasBus).toBe(true);
  await app.close();
}, 30_000);

