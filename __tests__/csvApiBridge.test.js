jest.mock('electron', () => ({
  contextBridge: { exposeInMainWorld: jest.fn() },
  ipcRenderer: { invoke: jest.fn(), on: jest.fn() }
}));
const { contextBridge } = require('electron');

 test('csvApi is exposed', async () => {
  await import('../src/preload.js');
  await new Promise(r => setImmediate(r));
  const call = contextBridge.exposeInMainWorld.mock.calls.find(c => c[0] === 'csvApi');
  expect(call).toBeTruthy();
  expect(typeof call[1].openDialog).toBe('function');
  expect(typeof call[1].onCsvPath).toBe('function');
});
