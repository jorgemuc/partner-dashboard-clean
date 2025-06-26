const { test } = require('@jest/globals');
const assert = require('node:assert/strict');

jest.mock('electron', () => {
  const handlers = new Map();
  return {
    app: { getVersion: () => '0.0.0' },
    ipcMain: { handle: (name, fn) => handlers.set(name, fn), _invokeHandlers: handlers }
  };
});

const { app, ipcMain } = require('electron');
require('../main');

test('ipc get-version returns app version', async () => {
  const handler = ipcMain._invokeHandlers.get('get-version');
  const ver = await handler();
  assert.equal(ver, app.getVersion());
});
