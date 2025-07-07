export function showMsg(text, type = 'success') {
  const msgDiv = document.getElementById('msg');
  if (!msgDiv) return;
  msgDiv.innerHTML = `<span class="${type}-msg">${text}</span>`;
  const live = document.getElementById('liveRegion');
  if (live) live.textContent = text;
  setTimeout(() => { msgDiv.innerHTML = ''; }, 4000);
}
