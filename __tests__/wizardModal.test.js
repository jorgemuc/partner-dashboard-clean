const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const mitt = require('mitt');

let renderer;

beforeAll(async () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const dom = new JSDOM(html, { url: 'http://localhost', runScripts: 'dangerously' });
  global.window = dom.window;
  global.document = dom.window.document;
  global.localStorage = dom.window.localStorage;
  global.Chart = function(){};
  window.HTMLCanvasElement.prototype.getContext = () => ({ });
  window.api = { libs: {}, bus: mitt(), version: () => '0' };
  renderer = await import('../src/renderer/renderer.js');
});

test('5-step wizard validates required fields', () => {
  const modal = document.getElementById('wizardModal');
  expect(modal.classList.contains('hidden')).toBe(true);
  renderer.openWizardForTest();
  expect(modal.classList.contains('hidden')).toBe(false);
  const next = document.getElementById('wizardNext');
  expect(next.disabled).toBe(true);
  modal.querySelector('input[name="process"]').click();
  expect(next.disabled).toBe(false);
  next.click();
  // step 2 validation
  expect(next.disabled).toBe(true);
  modal.querySelector('#custName').value = 'A';
  modal.querySelector('#custName').dispatchEvent(new window.Event('input'));
  modal.querySelector('#partnerName').value = 'B';
  modal.querySelector('#partnerName').dispatchEvent(new window.Event('input'));
  expect(next.disabled).toBe(false);
  next.click();
  expect(modal.querySelector('#selectFormat').options.length).toBeGreaterThan(0);
  next.click();
  modal.querySelector('input[name="scope"]').click();
  next.click();
  expect(modal.querySelector('h4').textContent).toContain('Zusammenfassung');
  const submit = document.getElementById('btnSubmit');
  expect(submit.disabled).toBe(true);
  document.getElementById('chkAGB').click();
  expect(submit.disabled).toBe(false);
  submit.click();
  expect(modal.classList.contains('hidden')).toBe(true);
});

test('wizard closes via X and abort buttons', () => {
  const modal = document.getElementById('wizardModal');
  renderer.openWizardForTest();
  document.getElementById('wizardClose').click();
  expect(modal.classList.contains('hidden')).toBe(true);
  renderer.openWizardForTest();
  document.getElementById('wizardAbort').click();
  expect(modal.classList.contains('hidden')).toBe(true);
});
