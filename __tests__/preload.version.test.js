jest.mock('electron', () => ({
  contextBridge: { exposeInMainWorld: jest.fn() },
  ipcRenderer: { on: jest.fn(), invoke: jest.fn() }
}));
const api = require('../src/preload.js');

test('version exposiert String und Funktion', () => {
  expect(typeof api.version).toBe('string');
  expect(api.version).toMatch(/^\d+\.\d+\.\d+$/);
  expect(api.getVersion()).toBe(api.version);
});
