export default function initDropHandler() {
  const dz = document.getElementById('dropZone');
  if (!dz) return;
  ['dragover','dragleave','drop'].forEach(ev =>
    dz.addEventListener(ev, e => {
      e.preventDefault();
      ev === 'dragover'
        ? dz.classList.add('dragover')
        : dz.classList.remove('dragover');
    })
  );
  dz.addEventListener('drop', async e => {
    const f = e.dataTransfer.files[0];
    if (!f || !f.name.endsWith('.csv')) return;
    window.api.bus.emit('csv:loaded', await f.text());
  });
}
