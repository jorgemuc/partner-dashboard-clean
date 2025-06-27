const {JSDOM} = require('jsdom');

test('drop zone emits file text', async () => {
  const { attachCsvDrop } = await import('../src/shared/csvDrop.mjs');
  const dom = new JSDOM('<div id="dropZone"></div><span id="dropStatus"></span>', { url: 'http://localhost' });
  const { window } = dom;
  window.FileReader = class { constructor(){ this.onload=null; } readAsText(){ this.onload({target:{result:'foo'}}); } };
  global.FileReader = window.FileReader;
  const zone = window.document.getElementById('dropZone');
  const status = window.document.getElementById('dropStatus');
  return new Promise(resolve => {
    attachCsvDrop(zone, status, txt => {
      expect(txt).toBe('foo');
      expect(status.textContent).toBe('');
      resolve();
    });
    const file = new window.File(['foo'], 'p.csv', { type: 'text/csv' });
    const ev = new window.Event('drop', { bubbles: true });
    Object.defineProperty(ev, 'dataTransfer', { value: { files: [file] } });
    zone.dispatchEvent(ev);
  });
});
