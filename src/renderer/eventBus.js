import mitt from 'mitt';
const bus = mitt();
bus.once = (type, handler) => {
  const wrap = (...args) => {
    bus.off(type, wrap);
    handler(...args);
  };
  bus.on(type, wrap);
};
export default bus;
