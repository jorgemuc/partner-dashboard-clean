const test = require('node:test');
const assert = require('node:assert/strict');
const { getStatusBuckets } = require('../filterUtils');

test('getStatusBuckets groups by partner', () => {
  const data = [
    {Partnername:'A',Vertragsstatus:'laufend'},
    {Partnername:'A',Vertragsstatus:'geplant'},
    {Partnername:'B',Vertragsstatus:'teilaktiv'},
    {Partnername:'C',Vertragsstatus:''}
  ];
  assert.deepStrictEqual(getStatusBuckets(data), {aktiv:1, teilaktiv:1, geplant:0, unbekannt:1});
});
