export function createModal(title){
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  const box = document.createElement('div');
  box.className = 'modal';
  const close = document.createElement('span');
  close.className = 'modal-close';
  close.setAttribute('aria-label','Close');
  close.textContent = '\u00d7';
  box.appendChild(close);
  const h3 = document.createElement('h3');
  h3.textContent = title;
  box.appendChild(h3);
  const body = document.createElement('div');
  box.appendChild(body);
  const actions = document.createElement('div');
  actions.className = 'modal-actions';
  box.appendChild(actions);
  bg.appendChild(box);
  document.body.appendChild(bg);
  bg.style.display='block';
  function closeModal(){ bg.remove(); }
  close.onclick = closeModal;
  return { body, actions, close: closeModal };
}
