export function attachCsvDrop(dropZone, statusEl, onText) {
  if (!dropZone) return;
  dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    if (statusEl) statusEl.textContent = 'Parsing...';
    reader.onload = ev => {
      if (statusEl) statusEl.textContent = '';
      onText(ev.target.result);
    };
    reader.onerror = () => { if (statusEl) statusEl.textContent = ''; };
    reader.readAsText(file);
  });
}
