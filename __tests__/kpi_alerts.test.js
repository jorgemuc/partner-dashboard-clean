const { JSDOM } = require('jsdom');

let validateOperator, thresholdStore, getThresholds;

beforeAll(async () => {
  const dom = new JSDOM('', { url: 'http://localhost' });
  global.window = dom.window;
  global.document = dom.window.document;
  global.localStorage = dom.window.localStorage;
  ({ validateOperator, thresholdStore, getThresholds } = await import('../src/renderer/kpi.js'));
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
