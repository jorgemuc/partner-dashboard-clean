jest.mock('electron', () => ({
  contextBridge: { exposeInMainWorld: jest.fn() },
  ipcRenderer: { invoke: jest.fn(), on: jest.fn() }
}));
const { contextBridge } = require('electron');

test('api exposed without crash', async () => {
  global.window = {};
  expect(() => require('../dist/preload.js')).not.toThrow();
  const call = contextBridge.exposeInMainWorld.mock.calls.find(c => c[0] === 'api');
  expect(call).toBeTruthy();
});
