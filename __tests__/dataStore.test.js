const test = require('node:test');
const assert = require('node:assert/strict');
const { getData, setData } = require('../app/dataStore.js');
const { subscribe } = require('../app/eventBus.js');

test('setData stores array and emits update', t => {
  return new Promise(resolve => {
    subscribe('dataUpdated', () => {
      assert.deepStrictEqual(getData(), [1,2]);
      resolve();
    });
    setData([1,2]);
  });
});
