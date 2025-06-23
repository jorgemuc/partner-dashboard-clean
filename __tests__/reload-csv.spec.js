process.env.NODE_ENV = 'test';
const { _reset, loadCsv, getTableRows } = require('../main');
const test = require('node:test');
const assert = require('node:assert/strict');

test('reloads same CSV after demo data', async () => {
  await loadCsv('demo/PARTNER.csv');
  const firstRows = getTableRows();
  _reset();
  await loadCsv('demo/PARTNER.csv');
  const secondRows = getTableRows();
  assert.deepEqual(secondRows, firstRows);
});

