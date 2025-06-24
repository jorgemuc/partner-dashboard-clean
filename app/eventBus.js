// lightweight event bus – no external deps
const bus = new EventTarget();
module.exports.publish = (type, detail = {}) => bus.dispatchEvent(new CustomEvent(type, { detail }));
module.exports.subscribe = (type, fn) => bus.addEventListener(type, fn);
