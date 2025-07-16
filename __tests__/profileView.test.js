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

test('profile header fills with csv first row', () => {
  renderer.handleCsvLoaded([{Partnername:'Foo',Partnertyp:'T',Land:'DE',Ansprechpartner_Name:'N',
    'Ansprechpartner_E-Mail':'a@b',Telefon:'1',Rolle:'R',Score:'5'}]);
  expect(document.getElementById('pfName').textContent).toBe('Foo');
  expect(document.getElementById('pfMeta').textContent).toContain('T');
  expect(document.getElementById('pfContacts').textContent).toContain('N');
});

test('profile tab toggles section visibility', () => {
  const btn = document.querySelector('[data-tab="profileView"]');
  btn.click();
  expect(document.getElementById('profileView').style.display).toBe('block');
});
