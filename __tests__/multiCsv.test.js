const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const mitt = require('mitt');

jest.mock('xlsx', () => ({ utils:{} }));
jest.mock('chart.js/auto', () => function(){ return { destroy(){} }; });

let store, mod;

beforeAll(async () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const dom = new JSDOM(html, { url:'http://localhost', runScripts:'dangerously' });
  global.window = dom.window;
  global.document = dom.window.document;
  global.localStorage = dom.window.localStorage;
  window.HTMLCanvasElement.prototype.getContext = () => ({ });
  global.Chart = function(){ return { destroy(){} }; };
  window.api = { libs:{}, bus: mitt(), version:'0' };
  store = await import('../src/renderer/dataStore.js');
  mod = await import('../src/renderer/renderer.js');
});

test('loads multiple csv files sequentially', () => {
  mod.handleCsvLoaded([{A:'1'}]);
  const first = store.getData().length;
  mod.handleCsvLoaded([{A:'1'},{A:'2'}]);
  expect(store.getData().length).not.toBe(first);
  const rows = document.querySelectorAll('#partnerTable tbody tr').length;
  expect(rows).toBeGreaterThan(1);
});
