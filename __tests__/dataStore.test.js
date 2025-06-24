let store, bus;
beforeAll(async () => {
  store = await import('../src/renderer/dataStore.js');
  bus = (await import('../src/renderer/eventBus.js')).default;
});

test('setData stores array and emits update', () => {
  return new Promise(resolve => {
    const handler = rows => {
      expect(store.getData()).toEqual([1,2]);
      expect(rows).toEqual([1,2]);
      bus.off('data:updated', handler);
      resolve();
    };
    bus.on('data:updated', handler);
    store.setData([1,2]);
  });
});
