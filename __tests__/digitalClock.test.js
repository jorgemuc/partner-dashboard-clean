const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const mitt = require('mitt');
jest.mock('chart.js/auto', () => function(){});

beforeAll(async () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const dom = new JSDOM(html, {
    url: 'http://localhost',
    runScripts: 'dangerously',
    beforeParse(window) {
      window.api = { bus: mitt(), version: () => '0' };
      window.Chart = function(){};
    }
  });
  global.window = dom.window;
  global.document = dom.window.document;
  global.localStorage = dom.window.localStorage;
  window.HTMLCanvasElement.prototype.getContext = () => ({ });
});

test('digital clock is rendered', () => {
  const clock = document.getElementById('clock');
  expect(clock).not.toBeNull();
  expect(clock.textContent).toMatch(/\d{2}:\d{2}/);
});
