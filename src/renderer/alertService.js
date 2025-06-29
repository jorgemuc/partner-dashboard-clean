let msgDiv;

export function showAlert(text, type = 'success') {
  if (!msgDiv) msgDiv = document.getElementById('msg');
  if (!msgDiv) return;
  msgDiv.innerHTML = `<span class="${type}-msg">${text}</span>`;
  const live = document.getElementById('liveRegion');
  if (live) live.textContent = text;
  setTimeout(() => { if (msgDiv) msgDiv.innerHTML = ''; }, 4000);
}
