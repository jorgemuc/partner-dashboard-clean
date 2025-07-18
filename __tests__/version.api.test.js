jest.mock('electron', () => ({
  contextBridge: { exposeInMainWorld: jest.fn() },
  ipcRenderer: { on: jest.fn(), invoke: jest.fn() }
}));
const { contextBridge } = require('electron');
require('../src/preload.js');

test('version exposed as function', () => {
  const apiCall = contextBridge.exposeInMainWorld.mock.calls.find(c => c[0] === 'api');
  const api = apiCall ? apiCall[1] : {};
  global.window = {};
  window.api = api;
  expect(typeof window.api.version).toBe('function');
  expect(window.api.version()).toMatch(/^\d+\.\d+\.\d+$/);
});
