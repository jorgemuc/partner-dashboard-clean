// lightweight event bus – no external deps
const bus = new EventTarget();
export const publish  = (type, detail={}) => bus.dispatchEvent(new CustomEvent(type,{detail}));
export const subscribe = (type, fn)         => bus.addEventListener(type, fn);
