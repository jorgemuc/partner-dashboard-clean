import mitt from '../../node_modules/mitt/dist/mitt.mjs';

let bus = (typeof window !== 'undefined' && window.eventBus) ? window.eventBus : mitt();
if (typeof window !== 'undefined' && !window.eventBus) {
  window.eventBus = bus;
}
if (!bus.once) {
  bus.once = (type, handler) => {
    const wrap = (...args) => {
      bus.off(type, wrap);
      handler(...args);
    };
    bus.on(type, wrap);
  };
}

export default bus;
