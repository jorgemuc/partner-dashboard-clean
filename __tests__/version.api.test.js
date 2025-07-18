jest.mock('electron', () => ({
  contextBridge: { exposeInMainWorld: jest.fn() },
  ipcRenderer: { on: jest.fn(), invoke: jest.fn() }
}));
const { contextBridge } = require('electron');
require('../src/preload.js');

test('version exposed as string and fn', () => {
  const apiCall = contextBridge.exposeInMainWorld.mock.calls.find(c => c[0] === 'api');
  const api = apiCall ? apiCall[1] : {};
  global.window = {};
  window.api = api;
  expect(typeof window.api.version).toBe('string');
  expect(window.api.version).toMatch(/^\d+\.\d+\.\d+$/);
  expect(window.api.versionFn()).toBe(window.api.version);
});
