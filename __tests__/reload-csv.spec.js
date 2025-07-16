process.env.NODE_ENV = 'test';
const { _reset, loadCsv, getTableRows } = require('../main');
const test = require('node:test');
const assert = require('node:assert/strict');

test('reloads same CSV after demo data', async () => {
  await loadCsv('assets/demo/partner-demo.csv');
  const firstRows = getTableRows();
  _reset();
  await loadCsv('assets/demo/partner-demo.csv');
  const secondRows = getTableRows();
  assert.deepEqual(secondRows, firstRows);
});

