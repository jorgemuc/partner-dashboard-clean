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
  const { window } = new (require('jsdom').JSDOM)('<div id="dropZone"></div>');
  global.window = window;
  global.document = window.document;
  require('../dist/preload.js');
  await new Promise(r => setImmediate(r));
  const apiCall = contextBridge.exposeInMainWorld.mock.calls.find(c => c[0] === 'api');
  window.api = apiCall ? apiCall[1] : {};
  expect(typeof global.window.api.version).toBe('function');
  expect(global.window.api.version()).toMatch(/^\d+\.\d+\.\d+$/);
  expect(global.window.api.readiness).toBeInstanceOf(Set);
});
