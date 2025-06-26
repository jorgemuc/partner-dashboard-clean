const { test } = require('@jest/globals');
const assert = require('node:assert/strict');

test('getStatusBuckets counts statuses', () => {
  const { getStatusBuckets } = require('../utils.js');
  const data = [
    {Schnittstellenstatus:'aktiv'},
    {Schnittstellenstatus:'teilaktiv'},
    {Schnittstellenstatus:'geplant'},
    {Schnittstellenstatus:''}
  ];
  assert.deepStrictEqual(getStatusBuckets(data), {aktiv:1, teilaktiv:1, geplant:1, unbekannt:1});
});
