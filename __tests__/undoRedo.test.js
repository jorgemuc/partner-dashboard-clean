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

  test('limits changelog to five entries', () => {
    const data = [{v:0}];
    const log = [];
    let idx = 0;
    for(let i=0;i<7;i++){
      idx = applyChange(data,{index:0,field:'v',old:i,new:i+1},log,idx,5);
    }
    expect(log.length).toBe(5);
    expect(idx).toBe(5);
  });
});
