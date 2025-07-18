const fs = require('fs');
const path = require('path');
const {JSDOM} = require('jsdom');
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

test('edit modal shows and remains when wizard opens', () => {
  renderer.handleCsvLoaded([{Partnername:'Foo',Partnertyp:'T',Land:'DE'}]);
  document.getElementById('profileEditBtn').click();
  expect(document.getElementById('editModal')).not.toBeNull();
  document.getElementById('wizardOpenBtn').click();
  expect(document.getElementById('editModal')).not.toBeNull();
});
