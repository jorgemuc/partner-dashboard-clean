import mitt from '../../node_modules/mitt/dist/mitt.mjs';

let bus = (typeof window !== 'undefined' && window.api?.bus)
  ? window.api.bus
  : mitt();
if (typeof window !== 'undefined' && window.api && !window.api.bus) {
  window.api.bus = bus;
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
