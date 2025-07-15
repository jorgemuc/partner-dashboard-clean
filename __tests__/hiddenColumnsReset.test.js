const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const mitt = require('mitt');

jest.mock('xlsx', () => ({ utils:{} }));
jest.mock('chart.js/auto', () => function(){ return { destroy(){} }; });

let mod;

beforeAll(async () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const dom = new JSDOM(html, { url: 'http://localhost', runScripts: 'dangerously' });
  global.window = dom.window;
  global.document = dom.window.document;
  global.localStorage = dom.window.localStorage;
  window.HTMLCanvasElement.prototype.getContext = () => ({ });
  global.Chart = function(){ return { destroy(){} }; };
  window.api = { libs:{}, bus: mitt(), version:'0' };
  await import('../src/renderer/dataStore.js');
  mod = await import('../src/renderer/renderer.js');
});

test('hiddenColumns reset when CSV loaded', () => {
  localStorage.setItem('hiddenColumns', JSON.stringify(['A']));
  mod.handleCsvLoaded([{A:'1'}]);
  expect(localStorage.getItem('hiddenColumns')).toBe(null);
});
