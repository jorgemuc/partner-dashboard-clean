function applyChange(data, change, log=[], index=log.length, limit=5) {
  data[change.index][change.field] = change.new;
  log.splice(index);
  log.push(change);
  if(log.length > limit) log.shift();
  return log.length;
}

function undo(data, changelog, index) {
  if (index <= 0) return index;
  const change = changelog[index - 1];
  data[change.index][change.field] = change.old;
  return index - 1;
}

function redo(data, changelog, index) {
  if (index >= changelog.length) return index;
  const change = changelog[index];
  data[change.index][change.field] = change.new;
  return index + 1;
}

module.exports = { applyChange, undo, redo };
