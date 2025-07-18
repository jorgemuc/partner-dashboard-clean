const fs = require('fs');
const path = require('path');
const {JSDOM} = require('jsdom');
const mitt = require('mitt');

jest.mock('papaparse', () => ({
  parse: jest.fn(() => ({ data:[{A:'1'}] }))
}));
jest.mock('xlsx', () => ({ utils:{} }));
jest.mock('chart.js/auto', () => function(){});

let store;

beforeAll(async () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const dom = new JSDOM(html, { url:'http://localhost', runScripts:'dangerously' });
  global.window = dom.window;
  global.document = dom.window.document;
  global.localStorage = dom.window.localStorage;
  window.HTMLCanvasElement.prototype.getContext = () => ({});
  global.Chart = function(){};
  window.api = { bus: mitt(), version: () => '0' };
  window.FileReader = class { constructor(){ this.onload=null; } readAsText(){ this.onload({target:{result:'A\n1'}}); } };
  global.FileReader = window.FileReader;
  store = await import('../src/renderer/dataStore.js');
  await import('../src/renderer/renderer.js');
});

test('drop handler parses CSV and renders table', () => {
  const zone = document.getElementById('dropZone');
  const file = new window.File(['A\n1'], 't.csv', { type:'text/csv' });
  const ev = new window.Event('drop', { bubbles:true });
  Object.defineProperty(ev, 'dataTransfer', { value:{ files:[file] } });
  zone.dispatchEvent(ev);
  expect(store.getData()[0].A).toBe('1');
});
