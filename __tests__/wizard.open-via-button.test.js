const fs = require('fs');
const path = require('path');
const {JSDOM} = require('jsdom');
const mitt = require('mitt');
const { getByTestId, getByText, getByLabelText, getByRole, fireEvent } = require('@testing-library/dom');

let renderer;

beforeAll(async () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const dom = new JSDOM(html, { url: 'http://localhost', runScripts: 'dangerously' });
  global.window = dom.window;
  global.document = dom.window.document;
  global.localStorage = dom.window.localStorage;
  global.Chart = function(){};
  window.HTMLCanvasElement.prototype.getContext = () => ({});
  window.api = { bus: mitt(), version: () => '0', wizard:{ isDismissed: () => true, dismiss: () => {} } };
  renderer = await import('../src/renderer/renderer.js');
});

test('open and close wizard via buttons', () => {
  const modal = getByTestId(document.body, 'wizard-modal');
  expect(modal).toHaveClass('hidden');
  fireEvent.click(getByText(document.body, 'Neue Beauftragung', { selector: 'button' }));
  expect(modal).not.toHaveClass('hidden');
  fireEvent.click(getByLabelText(document.body, 'Wizard schließen'));
  expect(modal).toHaveClass('hidden');
});
