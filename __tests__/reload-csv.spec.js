const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { _reset, loadCsv, getTableRows } = require('../main');

const fixture = path.join(__dirname,'fixtures','partner.csv');

test('reloads same CSV after demo data', async () => {
  await loadCsv(fixture);
  const firstRows = getTableRows();
  _reset();
  await loadCsv(fixture);
  const secondRows = getTableRows();
  assert.deepEqual(secondRows, firstRows);
});
