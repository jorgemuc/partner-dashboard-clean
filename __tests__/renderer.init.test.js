jest.mock('electron', () => ({__esModule: true, contextBridge: { exposeInMainWorld: jest.fn() }, ipcRenderer: { invoke: jest.fn(() => Promise.resolve('1.2.3')), on: jest.fn() }  , default: {} } ));
const { contextBridge } = require('electron');
jest.mock('papaparse', () => ({}));
jest.mock('xlsx', () => ({ utils: {} }));
jest.mock('chart.js', () => function(){});
jest.mock('../chartWorker.mjs', () => ({
  default: jest.fn()
}));

test('renderer bootstraps without errors', async () => {
  await import('../src/preload.mjs');
  await new Promise(r => setImmediate(r));
  const apiCall = contextBridge.exposeInMainWorld.mock.calls.find(c => c[0] === 'api');
  global.window = { api: apiCall ? apiCall[1] : {} };
  expect(global.window.api.bus).toBeDefined();
  expect(global.window.api.version).toBe('1.2.3');
  expect(global.window.api.libs.Papa).toBeDefined();
  expect(global.window.api.libs.XLSX).toBeDefined();
  expect(global.window.api.libs.Chart).toBeDefined();
});
