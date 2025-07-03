const { JSDOM } = require('jsdom');

beforeEach(() => {
  const dom = new JSDOM('<table id="partnerTable"></table><div class="kpi" data-kpi="Foo"></div>', { url:'http://localhost' });
  global.window = dom.window;
  global.document = dom.window.document;
});

test('tableRenderer exposes initInlineEdit', async () => {
  const mod = await import('../src/renderer/tableRenderer.js');
  expect(typeof window.initInlineEdit).toBe('function');
  expect(mod.initInlineEdit).toBe(window.initInlineEdit);
});

test('kpi exposes initKpiAlerts', async () => {
  const mod = await import('../src/renderer/kpi.js');
  expect(typeof window.initKpiAlerts).toBe('function');
  expect(mod.initKpiAlerts).toBe(window.initKpiAlerts);
});
