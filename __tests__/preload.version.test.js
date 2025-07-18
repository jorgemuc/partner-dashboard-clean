jest.mock('electron', () => ({
  contextBridge: { exposeInMainWorld: jest.fn() },
  ipcRenderer: { on: jest.fn(), invoke: jest.fn() }
}));
const api = require('../src/preload.js');

test('version exposed via function', () => {
  expect(typeof api.version).toBe('function');
  const v = api.version();
  expect(v).toMatch(/^\d+\.\d+\.\d+$/);
});
