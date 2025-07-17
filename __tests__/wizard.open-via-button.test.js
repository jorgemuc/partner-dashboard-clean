const fs = require('fs');
const path = require('path');
const {JSDOM} = require('jsdom');
const mitt = require('mitt');

let renderer;

beforeAll(async () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const dom = new JSDOM(html, { url: 'http://localhost', runScripts: 'dangerously' });
  global.window = dom.window;
  global.document = dom.window.document;
  global.localStorage = dom.window.localStorage;
  global.Chart = function(){};
  window.HTMLCanvasElement.prototype.getContext = () => ({});
  window.api = { libs:{}, bus: mitt(), version:'0' };
  renderer = await import('../src/renderer/renderer.js');
});

test('open and close wizard via buttons', () => {
  const modal = document.getElementById('wizardModal');
  expect(modal.classList.contains('hidden')).toBe(true);
  document.getElementById('btnNewOrder').click();
  expect(modal.classList.contains('hidden')).toBe(false);
  document.getElementById('wizardClose').click();
  expect(modal.classList.contains('hidden')).toBe(true);
});
