jest.mock('electron', () => ({
  contextBridge: { exposeInMainWorld: jest.fn() },
  ipcRenderer: { invoke: jest.fn(), on: jest.fn() }
}));
const { contextBridge } = require('electron');

test('api exposed without crash', async () => {
  await expect(import('../src/preload/index.cjs')).resolves.toBeDefined();
  const call = contextBridge.exposeInMainWorld.mock.calls.find(c => c[0] === 'api');
  expect(call).toBeTruthy();
});
