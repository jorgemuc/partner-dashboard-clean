const test = require('node:test');
const assert = require('node:assert/strict');

// dynamic import to support ES module buildChart export
let buildChart;

test('buildChart counts field values', async () => {
  ({ buildChart } = await import('../chartWorker.js'));
  const data = [ {A:'x'}, {A:'y'}, {A:'x'} ];
  const { labels, values } = buildChart('A', data);
  assert.deepEqual(labels.sort(), ['x','y']);
  assert.deepEqual(values.reduce((s,v)=>s+v,0), 3);
});
