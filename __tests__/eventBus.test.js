const test = require('node:test');
const assert = require('node:assert/strict');
const { publish, subscribe } = require('../app/eventBus.js');

test('publish triggers subscriber', t => {
  return new Promise(resolve => {
    subscribe('ping', e => {
      assert.equal(e.detail.msg, 'hi');
      resolve();
    });
    publish('ping', {msg:'hi'});
  });
});
