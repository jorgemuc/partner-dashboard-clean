if (typeof window !== 'undefined' && !window.api) {
  window.api = { readiness: new Set() };
}

try {
  let contextBridge = { exposeInMainWorld: () => {} };
  let ipcRenderer = { on: () => {}, send: () => {}, invoke: () => {} };
  try {
    const electron = require('electron');
    if (electron.contextBridge) contextBridge = electron.contextBridge;
    if (electron.ipcRenderer) ipcRenderer = electron.ipcRenderer;
  } catch {}

  let versionValue;
  try {
    // eslint-disable-next-line node/no-missing-require, node/no-unpublished-require
    versionValue = require('../../dist/version.json').version;
  } catch {
    try {
      versionValue = require('../../package.json').version;
    } catch {
      versionValue = '0.0.0-preload-error';
    }
  }

  const events = {};
  const signal = {
    on: (e, fn) => { (events[e] || (events[e] = [])).push(fn); },
    off: (e, fn) => { events[e] = (events[e] || []).filter(f => f !== fn); },
    emit: (e, d) => { (events[e] || []).forEach(fn => fn(d)); }
  };
  const states = new Set();
  const readiness = {
    set: k => { states.add(k); signal.emit(k); },
    add: k => { states.add(k); signal.emit(k); },
    has: k => states.has(k),
    waitFor: k => new Promise(res => {
      if (states.has(k)) return res();
      const cb = () => { if (states.has(k)) { signal.off(k, cb); res(); } };
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
    version: () => versionValue,
    getVersion: () => versionValue,
    signal,
    readiness,
    wizard
  };
  contextBridge.exposeInMainWorld('api', api);
  if (typeof window !== 'undefined') {
    window.api = api;
    window.api.readiness.add('base-ui');
  }
  if (process.env.DEBUG) console.info('[preload] init-ok');
  module.exports = api;
  module.exports.default = api;
} catch (e) {
  console.error('[preload-err]', e && e.stack || e);
  if (typeof window !== 'undefined') {
    if (!window.api) {
      window.api = { readiness: new Set(['preload-error']) };
    } else if (window.api.readiness && window.api.readiness.add) {
      window.api.readiness.add('preload-error');
    }
  }
  module.exports = typeof window !== 'undefined' ? window.api : {};
  module.exports.default = module.exports;
}
