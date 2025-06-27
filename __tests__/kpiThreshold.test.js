const {JSDOM} = require('jsdom');
const mitt = require('mitt');

let checkThresholds;

beforeAll(async () => {
  const dom = new JSDOM('<div class="kpi" data-kpi="Partner"><div></div><div>Partner</div></div>', { url:'http://localhost' });
  global.window = dom.window;
  global.document = dom.window.document;
  global.localStorage = dom.window.localStorage;
  window.showMsg = jest.fn();
  window.api = { sendMail: jest.fn(() => Promise.resolve()), bus: mitt() };
  ({ checkThresholds } = await import('../src/renderer/kpi.js'));
});

test('threshold triggers mail only once within debounce', async () => {
  localStorage.setItem('kpiThresholds', JSON.stringify({ 'Partner': { op:'<', value:5, email:true } }));
  await checkThresholds([{label:'Partner', value:3}]);
  expect(window.api.sendMail).toHaveBeenCalledTimes(1);
  await checkThresholds([{label:'Partner', value:3}]);
  expect(window.api.sendMail).toHaveBeenCalledTimes(1);
});
