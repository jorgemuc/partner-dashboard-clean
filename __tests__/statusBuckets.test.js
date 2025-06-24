const test = require('node:test');
const assert = require('node:assert/strict');
const { getStatusBuckets } = require('../utils');

test('getStatusBuckets groups all rows', () => {
  const data = [
    {Partnername:'A',Schnittstellenstatus:'aktiv'},
    {Partnername:'A',Schnittstellenstatus:'geplant'},
    {Partnername:'B',Schnittstellenstatus:'teilaktiv'},
    {Partnername:'C',Schnittstellenstatus:''}
  ];
  assert.deepStrictEqual(getStatusBuckets(data), {aktiv:1, teilaktiv:1, geplant:1, unbekannt:1});
});
