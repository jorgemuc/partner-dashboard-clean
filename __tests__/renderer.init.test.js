jest.mock('electron', () => ({__esModule: true,
  contextBridge: { exposeInMainWorld: jest.fn() },
  ipcRenderer: { on: jest.fn(), invoke: jest.fn() },
  default: {}
}));
const { contextBridge } = require('electron');
jest.mock('papaparse', () => ({}));
jest.mock('xlsx', () => ({ utils: {} }));
jest.mock('chart.js/auto', () => function(){});
jest.mock('../chartWorker.mjs', () => ({
  default: jest.fn()
}));

test('renderer bootstraps without errors', async () => {
  await import('../src/preload/index.cjs');
  await new Promise(r => setImmediate(r));
  const apiCall = contextBridge.exposeInMainWorld.mock.calls.find(c => c[0] === 'api');
  const { window } = new (require('jsdom').JSDOM)('<div id="dropZone"></div>');
  global.window = window;
  global.document = window.document;
  window.api = apiCall ? apiCall[1] : {};
  expect(global.window.api.version).toMatch(/^\d+\.\d+\.\d+$/);
  expect(global.window.api.getVersion()).toMatch(/^\d+\.\d+\.\d+$/);
  expect(typeof global.window.api.readiness.set).toBe('function');
});
