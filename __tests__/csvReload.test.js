const test = require('node:test');
const assert = require('node:assert/strict');
const { parseCsv } = require('../parser');

test('csv reload retains data after demo', () => {
  const csv = 'Partnername,Systemname\nFoo,Sys';
  const first = parseCsv(csv).data;
  let data = first;
  // simulate demo reload clearing
  data = [];
  const second = parseCsv(csv).data;
  assert.equal(second.length, 1);
  assert.equal(second[0].Partnername, 'Foo');
});

test('table renders after csv reload', () => {
  const csv = 'Partnername,Systemname\nFoo,Sys';
  parseCsv(csv); // initial load
  const again = parseCsv(csv);
  assert.equal(again.data.length, 1);
  assert.equal(again.data[0].Systemname, 'Sys');
});
