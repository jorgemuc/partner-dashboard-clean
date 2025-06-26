const bus = window.api.bus;
let partnerData = [];
export const getData = () => partnerData;
export function setData(arr){
  partnerData = Array.isArray(arr) ? arr : [];
  bus.emit('data:updated', partnerData);
}
