const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const mitt = require('mitt');

let renderer;

beforeAll(async () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const dom = new JSDOM(html, { url:'http://localhost', runScripts:'dangerously' });
  global.window = dom.window;
  global.document = dom.window.document;
  global.localStorage = dom.window.localStorage;
  global.Chart = function(){};
  window.HTMLCanvasElement.prototype.getContext = () => ({});
  window.api = { bus: mitt(), version: () => '0', wizard:{ isDismissed: () => true, dismiss: () => {} } };
  renderer = await import('../src/renderer/renderer.js');
});

test('wizard API toggles visibility', () => {
  const { show, hide } = window.__wizardApi;
  const modal = document.getElementById('wizardModal');
  expect(modal.classList).toContain('hidden');
  show();
  expect(modal.classList).not.toContain('hidden');
  hide();
  expect(modal.classList).toContain('hidden');
});
