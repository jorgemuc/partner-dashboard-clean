// preload guarantees the bus – but tests may load renderer before preload.
let bus = { on() {}, off() {}, emit() {} };
if (window.api && window.api.bus) {
  bus = window.api.bus;
} else {
  const poll = setInterval(() => {
    if (window.api && window.api.bus) {
      bus = window.api.bus;
      clearInterval(poll);
    }
  }, 10);
}
let partnerData = [];
export const getData = () => partnerData;
export function setData(arr){
  partnerData = Array.isArray(arr) ? arr : [];
  bus.emit('data:updated', partnerData);
}

