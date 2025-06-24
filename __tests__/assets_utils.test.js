const test = require('node:test');
const assert = require('node:assert/strict');

test('ESM getStatusBuckets counts statuses', async () => {
  const { getStatusBuckets } = await import('../assets/utils.js');
  const data = [
    {Schnittstellenstatus:'aktiv'},
    {Schnittstellenstatus:'teilaktiv'},
    {Schnittstellenstatus:'geplant'},
    {Schnittstellenstatus:''}
  ];
  assert.deepStrictEqual(getStatusBuckets(data), {aktiv:1, teilaktiv:1, geplant:1, unbekannt:1});
});
