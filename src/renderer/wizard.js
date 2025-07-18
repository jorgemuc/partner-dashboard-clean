import mitt from 'mitt';

const bus = mitt();
const modal = document.getElementById('wizardModal');
const openBtn = document.getElementById('wizardOpenBtn');
function show(){
  modal.classList.remove('hidden');
  bus.emit('wizard:open');
}
function hide(){
  modal.classList.add('hidden');
  localStorage.setItem('wizard.dismissed', 'true');
  bus.emit('wizard:close');
}

openBtn.addEventListener('click', show);
modal.addEventListener('click', e => {
  if (e.target.closest('[data-close]')) hide();
});

window.__wizardApi = { show, hide, bus };



