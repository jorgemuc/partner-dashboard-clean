const test = require('node:test');
const assert = require('node:assert/strict');
const { parseCsv, validateCsv } = require('../parser');

test('parseCsv adds Umsatz and Pipeline fields when missing', () => {
  const csv = 'Partnername\nFoo';
  const res = parseCsv(csv);
  assert.equal(res.data[0].Umsatz, '');
  assert.equal(res.data[0].Pipeline, '');
});

test('validateCsv detects row length mismatch', () => {
  const csv = 'A,B\n1,2,3';
  const result = validateCsv(csv);
  assert.equal(result.valid, false);
});
