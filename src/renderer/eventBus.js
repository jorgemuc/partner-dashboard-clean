import mitt from 'mitt';
const bus = typeof window !== 'undefined' && window.__eventBus
  ? window.__eventBus
  : mitt();
if (typeof window !== 'undefined' && !window.__eventBus) window.__eventBus = bus;
export default bus;
