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

test('undo and redo reflect in store data', () => {
  const { applyChange, undo, redo } = require('../undoRedo');
  const log = [];
  let idx = 0;
  store.setData([{name:'A'},{name:'B'}]);
  idx = applyChange(store.getData(), {index:1, field:'name', old:'B', new:'C'}, log, idx);
  expect(store.getData()[1].name).toBe('C');
  idx = undo(store.getData(), log, idx);
  expect(store.getData()[1].name).toBe('B');
  idx = redo(store.getData(), log, idx);
  expect(store.getData()[1].name).toBe('C');
});
