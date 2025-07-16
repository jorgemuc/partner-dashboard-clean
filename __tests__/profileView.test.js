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
    {Partnername:'Foo',Partnertyp:'T',Land:'DE',Ansprechpartner_Name:'N','Ansprechpartner_Email':'a@b'},
    {Partnername:'Bar',Partnertyp:'X',Land:'US',Ansprechpartner_Name:'Z','Ansprechpartner_Email':'c@d'}
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
  const btn = document.querySelector('[data-tab="Steckbrief"]');
  btn.click();
  expect(document.getElementById('profileView').classList.contains('active')).toBe(true);
  expect(document.getElementById('overviewView').classList.contains('active')).toBe(false);
});

test('profile cards show contract and finance data', () => {
  renderer.handleCsvLoaded([
    {Partnername:'Foo',Partnertyp:'T',Land:'DE',Status:'aktiv',Health_Score:'90',Ansprechpartner_Name:'N',Ansprechpartner_Email:'a',Vertragsbeginn:'2024-01-01',Vertragsende:'2025-12-31',Umsatz_12M:'1000',Offene_Rechnungen:'1',SLA_Verletzungen_30d:'0',Dokument_Vertrag:'http://x',Dokument_Marketing:'http://m',Projekt_Tag:'Tag'}
  ]);
  expect(document.getElementById('contract_start').textContent).toBe('2024-01-01');
  expect(document.getElementById('open_invoices').textContent).toBe('1');
  expect(document.getElementById('doc_contract').getAttribute('href')).toBe('http://x');
});

test('edit modal updates score and status in header', () => {
  document.getElementById('profileEditBtn').click();
  document.getElementById('editScore').value = '77';
  document.getElementById('editStatus').value = 'gekündigt';
  document.getElementById('saveEdit').click();
  expect(document.getElementById('pfHealth').textContent).toBe('77');
  expect(document.getElementById('pfMeta').textContent).toContain('gekündigt');
});
