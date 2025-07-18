jest.mock('electron', () => ({
  contextBridge: { exposeInMainWorld: jest.fn() },
  ipcRenderer: { on: jest.fn(), invoke: jest.fn() }
}));
const api = require('../src/preload.js');

test('version exposiert Funktion', () => {
  expect(typeof api.version).toBe('function');
  expect(api.version()).toMatch(/^\d+\.\d+\.\d+$/);
});
