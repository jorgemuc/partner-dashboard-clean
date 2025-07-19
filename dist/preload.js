try {
  let contextBridge = { exposeInMainWorld: () => {} };
  let ipcRenderer = { on: () => {}, send: () => {}, invoke: () => {} };
  try {
    const electron = require('electron');
    if (electron.contextBridge) contextBridge = electron.contextBridge;
    if (electron.ipcRenderer) ipcRenderer = electron.ipcRenderer;
  } catch {}

  let loadedVersion;
  try {
    // eslint-disable-next-line node/no-missing-require, node/no-unpublished-require
    const v = require('../../dist/version.json');
    if (v && v.version) loadedVersion = v.version;
  } catch {}
  const fallback = require('../../package.json').version;

  const events = {};
  const signal = {
    on: (e, fn) => { (events[e] || (events[e] = [])).push(fn); },
    off: (e, fn) => { events[e] = (events[e] || []).filter(f => f !== fn); },
    emit: (e, d) => { (events[e] || []).forEach(fn => fn(d)); }
  };
  const states = {};
  const readiness = {
    set: k => { states[k] = true; signal.emit(k); },
    add: k => { states[k] = true; signal.emit(k); },
    has: k => !!states[k],
    waitFor: k => new Promise(res => {
      if (states[k]) return res();
      const cb = () => { if (states[k]) { signal.off(k, cb); res(); } };
      signal.on(k, cb);
    })
  };
  const wizard = {
    isDismissed: () => {
      try { return window.localStorage.getItem('wizard.dismissed') === '1'; } catch { return false; }
    },
    dismiss: () => {
      try { window.localStorage.setItem('wizard.dismissed','1'); }
      catch { ipcRenderer.send('wizard:dismiss'); }
    }
  };
  const api = {
    version: loadedVersion || fallback,
    getVersion: () => loadedVersion || fallback,
    signal,
    readiness,
    wizard
  };
  contextBridge.exposeInMainWorld('api', api);
  window.api = api;
  window.api.readiness.add('base-ui');
  if (process.env.DEBUG) console.info('[preload] init-ok');
  module.exports = api;
  module.exports.default = api;
} catch (e) {
  console.error('[preload-err]', e && e.stack || e);
  const fallback = (() => {
    try { return require('../../package.json').version; } catch { return '0.0.0'; }
  })();
  const api = {
    version: fallback,
    getVersion: () => fallback,
    signal: { on: () => {}, off: () => {}, emit: () => {} },
    readiness: {
      set: () => {}, add: () => {}, has: () => false, waitFor: () => Promise.resolve()
    },
    wizard: { isDismissed: () => false, dismiss: () => {} }
  };
  if (typeof window !== 'undefined' && !window.api) { window.api = api; }
  module.exports = typeof window !== 'undefined' ? window.api : api;
  module.exports.default = module.exports;
}
