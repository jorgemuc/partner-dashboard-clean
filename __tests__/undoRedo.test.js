const { applyChange, undo, redo } = require('../undoRedo');

describe('undo/redo stack', () => {
  test('applies changes and undoes them', () => {
    const data = [{name:'A'}, {name:'B'}];
    const change = {index:1, field:'name', old:'B', new:'C'};
    const changelog = [change];
    let idx = 1;
    idx = undo(data, changelog, idx);
    expect(data[1].name).toBe('B');
    idx = redo(data, changelog, idx);
    expect(data[1].name).toBe('C');
  });
});
