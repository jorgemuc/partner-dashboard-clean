const { test, expect } = require('@playwright/test');
const { _electron: electron } = require('playwright');
const path = require('path');

test('App starts ohne Preload-Fehler', async () => {
  const app = await electron.launch({ args: ['.', '--no-sandbox'], env:{ ELECTRON_DISABLE_SANDBOX:'1' } });
  const page = await app.firstWindow();

  const logs = [];
  page.on('console', msg => logs.push(msg.text()));

  await page.waitForSelector('body');
  await page.evaluate(() => !!window.bus && typeof window.bus.emit === 'function');
  await app.close();

  const bad = /MODULE_NOT_FOUND|Unable to load preload|bus.*undefined/i;
  expect(logs.some(l => bad.test(l))).toBeFalsy();
  const hasBus = await page.evaluate(() => !!window.bus && typeof window.bus.emit === 'function');
  expect(hasBus).toBe(true);
}, 30_000);

