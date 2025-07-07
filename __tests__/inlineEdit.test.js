const { JSDOM } = require('jsdom');

test('inline edit module exposes init function', async () => {
  const dom = new JSDOM('<table id="partnerTable"></table>');
  global.window = dom.window;
  global.document = dom.window.document;
  const mod = await import('../src/renderer/inlineEdit.js');
  expect(window.initInlineEdit).toBeDefined();
  expect(mod.initInlineEdit).toBe(window.initInlineEdit);
});
