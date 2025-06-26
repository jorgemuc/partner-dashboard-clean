jest.mock('electron', () => ({
  contextBridge: { exposeInMainWorld: jest.fn() },
  ipcRenderer: { invoke: jest.fn(() => Promise.resolve('0.0.0')), on: jest.fn() }
}));
const { contextBridge } = require('electron');
jest.mock('../chartWorker.mjs', () => ({
  default: jest.fn()
}));

test('renderer bootstraps without errors', async () => {
  await import('../preload.js');
  await new Promise(r => setImmediate(r));
  const apiCall = contextBridge.exposeInMainWorld.mock.calls.find(c => c[0] === 'api');
  global.window = { api: apiCall ? apiCall[1] : {}, electronAPI: { getVersion: jest.fn(() => Promise.resolve('1.0.0')) } };
  expect(global.window.api.bus).toBeDefined();
});
