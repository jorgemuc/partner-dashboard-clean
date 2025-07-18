const mitt = require('mitt');

test('eventBus module exports mitt instance', async () => {
  global.window = { __eventBus: mitt() };
  const { default: bus } = await import('../src/renderer/eventBus.js');
  expect(typeof bus.emit).toBe('function');
});
