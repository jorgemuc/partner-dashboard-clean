const mitt = require('mitt');
let bus;
beforeEach(() => {
  global.window = { __eventBus: mitt() };
  bus = global.window.__eventBus;
});

test('setData stores array and emits update', async () => {
  const store = await import('../src/renderer/dataStore.js');
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

test('undo and redo reflect in store data', async () => {
  const store = await import('../src/renderer/dataStore.js');
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
