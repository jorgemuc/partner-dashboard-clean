const mitt = require('mitt');

const bus = mitt();

bus.once = function(type, handler) {
  const wrapper = (...args) => {
    bus.off(type, wrapper);
    handler(...args);
  };
  bus.on(type, wrapper);
};

module.exports = bus;
