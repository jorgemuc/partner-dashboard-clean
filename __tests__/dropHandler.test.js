const {JSDOM} = require('jsdom');
const mitt = require('mitt');

test('drop handler emits csv:loaded', async () => {
  const dom = new JSDOM('<div id="dropZone"></div>', { url: 'http://localhost' });
  const { window } = dom;
  global.window = window;
  global.document = window.document;
  window.__eventBus = mitt();
  window.api = { version: '0', getVersion: () => '0', ipc: {} };
  const initDropHandler = (await import('../src/renderer/dropHandler.js')).default;
  initDropHandler();
  const zone = window.document.getElementById('dropZone');
  const file = new window.File(['a'], 'test.csv', { type: 'text/csv' });
  file.text = () => Promise.resolve('a');
  const ev = new window.Event('drop', { bubbles: true });
  Object.defineProperty(ev, 'dataTransfer', { value: { files: [file] } });
  const { default: bus } = await import('../src/renderer/eventBus.js');
  return new Promise(resolve => {
    bus.on('csv:loaded', txt => {
      expect(txt).toBe('a');
      resolve();
    });
    zone.dispatchEvent(ev);
  });
});
