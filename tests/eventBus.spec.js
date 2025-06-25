const fs = require('fs');
const path = require('path');
const {JSDOM} = require('jsdom');

test('eventBus module exports mitt instance', async () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const dom = new JSDOM(html, {
    resources: 'usable',
    runScripts: 'dangerously',
    url: 'file://' + path.resolve('index.html')
  });
  global.window = dom.window;
  const bus = (await import('../src/renderer/eventBus.js')).default;
  expect(typeof bus.emit).toBe('function');
});
