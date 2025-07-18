const { JSDOM } = require('jsdom');

beforeEach(() => {
  const dom = new JSDOM('<table id="tablePartnerTable"></table><div class="kpi" data-kpi="Foo"></div>', { url:'http://localhost' });
  global.window = dom.window;
  global.document = dom.window.document;
});

test('tableRenderer exposes initInlineEdit', async () => {
  const mod = await import('../src/renderer/tableRenderer.js');
  expect(typeof mod.initInlineEdit).toBe('function');
});

test('kpi exposes initKpiAlerts', async () => {
  const mod = await import('../src/renderer/kpi.js');
  expect(typeof window.initKpiAlerts).toBe('function');
  expect(mod.initKpiAlerts).toBe(window.initKpiAlerts);
});
