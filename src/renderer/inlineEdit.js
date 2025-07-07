export function initInlineEdit() {
  const table = document.getElementById('partnerTable');
  table.addEventListener('dblclick', e => {
    const td = e.target.closest('td[data-edit]');
    if (!td) return;
    const old = td.textContent;
    const input = document.createElement('input');
    input.value = old;
    td.textContent = '';
    td.appendChild(input);
    input.focus();
    input.onkeydown = ev => {
      if (ev.key === 'Enter') { td.textContent = input.value; saveRow(td); }
      if (ev.key === 'Escape') { td.textContent = old; }
    };
  });
}
window.initInlineEdit = initInlineEdit;
