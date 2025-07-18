const {JSDOM} = require('jsdom');
const mitt = require('mitt');

test('drop handler emits csv:loaded', async () => {
  const dom = new JSDOM('<div id="dropZone"></div>', { url: 'http://localhost' });
  const { window } = dom;
  global.window = window;
  global.document = window.document;
  window.api = { libs: { mitt }, version: () => '0', bus: mitt() };
  const initDropHandler = (await import('../src/renderer/dropHandler.js')).default;
  initDropHandler();
  const zone = window.document.getElementById('dropZone');
  const file = new window.File(['a'], 'test.csv', { type: 'text/csv' });
  file.text = () => Promise.resolve('a');
  const ev = new window.Event('drop', { bubbles: true });
  Object.defineProperty(ev, 'dataTransfer', { value: { files: [file] } });
  return new Promise(resolve => {
    window.api.bus.on('csv:loaded', txt => {
      expect(txt).toBe('a');
      resolve();
    });
    zone.dispatchEvent(ev);
  });
});
