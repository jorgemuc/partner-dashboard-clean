const fs = require('fs');
const path = require('path');
const {JSDOM} = require('jsdom');
const mitt = require('mitt');
const {getAllByRole} = require('@testing-library/dom');

let renderer;

beforeAll(async () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const dom = new JSDOM(html, { url:'http://localhost', runScripts:'dangerously' });
  global.window = dom.window;
  global.document = dom.window.document;
  global.localStorage = dom.window.localStorage;
  global.Chart = function(){};
  window.HTMLCanvasElement.prototype.getContext = () => ({});
  window.api = { libs:{}, bus: mitt(), version: () => '0' };
  renderer = await import('../src/renderer/renderer.js');
});

test('radios are aligned in step1', () => {
  renderer.openWizardForTest();
  const radios = getAllByRole(document.body, 'radio');
  const top = radios[0].offsetTop;
  radios.forEach(r => expect(r.offsetTop).toBe(top));
});
