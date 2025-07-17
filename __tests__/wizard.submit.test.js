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
  window.api = { libs:{}, bus: mitt(), version:'0' };
  renderer = await import('../src/renderer/renderer.js');
});

test('submit closes wizard', () => {
  renderer.openWizardForTest();
  const next = document.getElementById('wizardNext');
  document.querySelector('input[name="process"]').click();
  next.click();
  document.getElementById('custName').value = 'A';
  document.getElementById('custName').dispatchEvent(new window.Event('input'));
  document.getElementById('partnerName').value = 'B';
  document.getElementById('partnerName').dispatchEvent(new window.Event('input'));
  next.click();
  next.click();
  document.querySelector('input[name="scope"]').click();
  next.click();
  document.getElementById('chkAGB').click();
  document.getElementById('btnSubmit').click();
  expect(document.getElementById('wizardModal').classList.contains('hidden')).toBe(true);
});
