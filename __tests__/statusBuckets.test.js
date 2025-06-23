const test = require('node:test');
const assert = require('node:assert/strict');
const { getStatusBuckets } = require('../utils');

test('getStatusBuckets groups all rows', () => {
  const data = [
    {Partnername:'A',Vertragsstatus:'laufend'},
    {Partnername:'A',Vertragsstatus:'geplant'},
    {Partnername:'B',Vertragsstatus:'teilaktiv'},
    {Partnername:'C',Vertragsstatus:''}
  ];
  assert.deepStrictEqual(getStatusBuckets(data), {aktiv:1, teilaktiv:1, geplant:1, unbekannt:1});
});
