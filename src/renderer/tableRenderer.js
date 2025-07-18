import { getData } from './dataStore.js';
import { validationRules, validateCell } from '../shared/schema.mjs';
import { showAlert } from './alertService.js';
import bus from './eventBus.js';

let changelog;
let pushChange;

export function initInlineEdit(opts) {
  ({ changelog, pushChange } = opts);
  const table = document.getElementById('tablePartnerTable');
  table.addEventListener('dblclick', onDblClick);
}

function onDblClick(e) {
  const td = e.target.closest('td');
  if (!td || !td.dataset.col) return;
  const col = td.dataset.col;
  const rowIndex = parseInt(td.dataset.row, 10);
  const rule = validationRules[col] || {};
  if (rule.readOnly) return;
  spawnEditor(td, rowIndex, col, rule);
}

function spawnEditor(td, rowIndex, col, rule) {
  const rect = td.getBoundingClientRect();
  const input = document.createElement('input');
  input.type = 'text';
  input.value = td.textContent;
  Object.assign(input.style, {
    position: 'fixed',
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width - 2}px`,
    height: `${rect.height - 2}px`,
    zIndex: 50
  });
  document.body.appendChild(input);
  input.focus();
  input.onkeydown = ev => {
    if (ev.key === 'Enter') commit();
    if (ev.key === 'Escape') cleanup();
  };
  input.onblur = commit;

  function commit() {
    const val = input.value;
    const res = validateCell(val, rule);
    if (!res.valid) {
      td.classList.add('error');
      td.title = res.message;
      cleanup();
      showAlert(res.message, 'error');
      return;
    }
    const data = getData();
    const oldVal = data[rowIndex][col] || '';
    if (oldVal !== val) {
      pushChange({ index: rowIndex, field: col, old: oldVal, new: val, type:'edit', ts: Date.now() });
      bus.emit('data:updated', data);
      bus.emit('data:cellEdited');
    }
    td.textContent = val;
    cleanup();
  }

  function cleanup() {
    document.body.removeChild(input);
  }
}
