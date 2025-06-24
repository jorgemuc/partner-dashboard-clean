const fs = require('fs');
const path = require('path');
const {JSDOM} = require('jsdom');

test('eventBus exposed on window', async () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const dom = new JSDOM(html, {
    resources: 'usable',
    runScripts: 'dangerously',
    url: 'file://' + path.resolve('index.html')
  });
  global.window = dom.window;
  await import('../src/renderer/eventBus.js');
  expect(typeof dom.window.eventBus?.emit).toBe('function');
});
