const bus = window.api.bus;
let partnerData = [];
module.exports.getData = () => partnerData;
module.exports.setData = function(arr){
  partnerData = Array.isArray(arr) ? arr : [];
  bus.emit('dataUpdated');
};
