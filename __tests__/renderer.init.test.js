jest.mock('electron', () => ({__esModule: true, contextBridge: { exposeInMainWorld: jest.fn() }, default: {} }));
const { contextBridge } = require('electron');
jest.mock('papaparse', () => ({}));
jest.mock('xlsx', () => ({ utils: {} }));
jest.mock('chart.js', () => function(){});
jest.mock('../chartWorker.mjs', () => ({
  default: jest.fn()
}));

test('renderer bootstraps without errors', async () => {
  await import('../src/preload.js');
  await new Promise(r => setImmediate(r));
  const apiCall = contextBridge.exposeInMainWorld.mock.calls.find(c => c[0] === 'api');
  global.window = { api: apiCall ? apiCall[1] : {} };
  expect(global.window.api.bus).toBeDefined();
  expect(typeof global.window.api.version).toBe('function');
  expect(typeof global.window.api.libs).toBe('object');
});
