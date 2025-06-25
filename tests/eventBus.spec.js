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
  jest.mock('electron', () => ({
    contextBridge: { exposeInMainWorld: jest.fn() },
    ipcRenderer: { invoke: jest.fn(), on: jest.fn() }
  }));
  const { contextBridge } = require('electron');
  await import('../src/preload.mjs');
  const bus = contextBridge.exposeInMainWorld.mock.calls[0][1].bus;
  expect(typeof bus.emit).toBe('function');
});
