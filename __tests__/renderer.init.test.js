jest.mock('electron', () => ({
  contextBridge: { exposeInMainWorld: jest.fn() },
  ipcRenderer: { invoke: jest.fn(), on: jest.fn() }
}));
const { contextBridge } = require('electron');
jest.mock('../chartWorker.js', () => ({
  default: jest.fn()
}));

test('renderer bootstraps without errors', async () => {
  await import('../src/preload.js');
  global.window = { api: contextBridge.exposeInMainWorld.mock.calls[0][1], electronAPI: { getVersion: jest.fn(() => Promise.resolve('1.0.0')) } };
  const bus = global.window.api.bus;
  expect(bus).toBeDefined();
});
