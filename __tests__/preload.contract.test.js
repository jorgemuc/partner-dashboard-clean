jest.mock('electron', () => ({
  contextBridge: { exposeInMainWorld: jest.fn() },
  ipcRenderer: { on: jest.fn(), send: jest.fn(), invoke: jest.fn() }
}));
const api = require('../src/preload/index.cjs');

test('preload exports contract keys', () => {
  expect(typeof api.version).toBe('function');
  expect(api.getVersion()).toBe(api.version());
  expect(api.signal).toBeDefined();
  expect(api.readiness).toBeDefined();
  expect(api.wizard).toBeDefined();
});

test('readiness waitFor resolves after set', async () => {
  const p = api.readiness.waitFor('charts');
  api.readiness.set('charts');
  await expect(p).resolves.toBeUndefined();
});
