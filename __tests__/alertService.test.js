const { JSDOM } = require('jsdom');
let showAlert;
beforeAll(async () => {
  ({ showAlert } = await import('../src/renderer/alertService.js'));
});

test('showAlert writes message and clears', () => {
  jest.useFakeTimers();
  const dom = new JSDOM('<div id="msg"></div><div id="liveRegion"></div>');
  global.document = dom.window.document;
  showAlert('hello');
  expect(dom.window.document.getElementById('msg').textContent).toContain('hello');
  jest.runAllTimers();
  expect(dom.window.document.getElementById('msg').textContent).toBe('');
  jest.useRealTimers();
});
