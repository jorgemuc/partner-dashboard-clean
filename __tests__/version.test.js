const test = require('node:test');
const assert = require('node:assert/strict');
const { app, ipcMain } = require('electron');
require('../main');

test('ipc get-version returns app version', async () => {
  const handler = ipcMain._invokeHandlers.get('get-version');
  const ver = await handler();
  assert.equal(ver, app.getVersion());
});
