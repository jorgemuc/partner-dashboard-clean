const fs = require('fs');
const path = require('path');
const {JSDOM} = require('jsdom');

test('eventBus module exports mitt instance', async () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const dom = new JSDOM(html, {
    resources: 'usable',
    runScripts: 'dangerously',
    url: 'file://' + path.resolve('index.html')
  });
  global.window = dom.window;
  jest.mock('electron', () => ({__esModule: true,
    contextBridge: { exposeInMainWorld: jest.fn() },
    ipcRenderer: { invoke: jest.fn(() => Promise.resolve('0.0.0')), on: jest.fn() }
  }));
  const { contextBridge } = require('electron');
  await import('../src/preload.mjs');
  await new Promise(r => setImmediate(r));
  const call = contextBridge.exposeInMainWorld.mock.calls.find(c => c[0] === 'api');
  const bus = call ? call[1].bus : undefined;
  expect(typeof bus.emit).toBe('function');
});
