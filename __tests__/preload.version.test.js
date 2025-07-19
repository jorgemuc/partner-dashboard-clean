jest.mock('electron', () => ({
  contextBridge: { exposeInMainWorld: jest.fn() },
  ipcRenderer: { on: jest.fn(), invoke: jest.fn() }
}));
const api = require('../src/preload/index.cjs');

test('version api returns semver', () => {
  expect(typeof api.getVersion).toBe('function');
  expect(api.version).toMatch(/^\d+\.\d+\.\d+$/);
  expect(api.getVersion()).toMatch(/^\d+\.\d+\.\d+$/);
});
