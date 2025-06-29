const { JSDOM } = require('jsdom');

let validateOperator, thresholdStore, getThresholds, checkThresholds;

beforeAll(async () => {
  const dom = new JSDOM('', { url: 'http://localhost' });
  global.window = dom.window;
  global.document = dom.window.document;
  global.localStorage = dom.window.localStorage;
  ({ validateOperator, thresholdStore, getThresholds, checkThresholds } = await import('../src/renderer/kpi.js'));
});

test('validateOperator accepts only <, >, =', () => {
  expect(validateOperator('<')).toBe(true);
  expect(validateOperator('>')).toBe(true);
  expect(validateOperator('=')).toBe(true);
  expect(validateOperator('!')).toBe(false);
});

test('thresholdStore persists values', () => {
  const cfg = { Foo: { op: '>', value: 5, email: false } };
  thresholdStore(cfg);
  expect(getThresholds()).toEqual(cfg);
  expect(JSON.parse(localStorage.getItem('kpiThresholds'))).toEqual(cfg);
});

test('checkThresholds adds class for critical KPI', () => {
  document.body.innerHTML = '<div class="kpi" data-kpi="Partner"><div></div><div>Partner</div></div>';
  localStorage.setItem('kpiThresholds', JSON.stringify({ Partner:{ op:'<', value:1, email:false }}));
  checkThresholds([{label:'Partner', value:0}]);
  expect(document.querySelector('[data-kpi="Partner"]').classList.contains('alert-crit')).toBe(true);
});
