const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const mitt = require('mitt');

jest.mock('xlsx', () => ({ utils:{} }));
jest.mock('chart.js/auto', () => function(){});

let renderer;

beforeAll(async () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const dom = new JSDOM(html, { url:'http://localhost', runScripts:'dangerously' });
  global.window = dom.window;
  global.document = dom.window.document;
  global.localStorage = dom.window.localStorage;
  window.HTMLCanvasElement.prototype.getContext = () => ({});
  global.Chart = function(){};
  window.api = { libs:{}, bus: mitt(), version:'0' };
  await import('../src/renderer/dataStore.js');
  renderer = await import('../src/renderer/renderer.js');
});

test('profile header fills with csv first row and dropdown', () => {
  renderer.handleCsvLoaded([
    {Partnername:'Foo',Partnertyp:'T',Land:'DE',Ansprechpartner_Name:'N','Ansprechpartner_E-Mail':'a@b'},
    {Partnername:'Bar',Partnertyp:'X',Land:'US',Ansprechpartner_Name:'Z','Ansprechpartner_E-Mail':'c@d'}
  ]);
  expect(document.getElementById('pfName').textContent).toBe('Foo');
  expect(document.getElementById('pfMeta').textContent).toContain('T');
  const options = document.querySelectorAll('#partnerSelect option');
  expect(options.length).toBe(2);
});

test('profile dropdown switches partner', () => {
  const select = document.getElementById('partnerSelect');
  select.value = '1';
  select.dispatchEvent(new window.Event('change'));
  expect(document.getElementById('pfName').textContent).toBe('Bar');
});

test('profile tab toggles section visibility', () => {
  const btn = document.querySelector('[data-tab="profileView"]');
  btn.click();
  expect(document.getElementById('profileView').classList.contains('hidden')).toBe(false);
  expect(document.getElementById('overview').classList.contains('hidden')).toBe(true);
});
