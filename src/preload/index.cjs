let contextBridge = { exposeInMainWorld: () => {} };
let ipcRenderer = { on: () => {}, send: () => {}, invoke: () => {} };
try {
  const electron = require('electron');
  if (electron.contextBridge) contextBridge = electron.contextBridge;
  if (electron.ipcRenderer) ipcRenderer = electron.ipcRenderer;
} catch {}
let version = '0.0.0';
try {
  // eslint-disable-next-line node/no-missing-require, node/no-unpublished-require
  const v = require('../../dist/version.json');
  if(v && v.version) version = v.version;
} catch {
  try { version = require('../../package.json').version; } catch {}
}
const events = {};
const signal = {
  on: (e, fn) => { (events[e] || (events[e]=[])).push(fn); },
  off: (e, fn) => { events[e] = (events[e]||[]).filter(f => f!==fn); },
  emit: (e, d) => { (events[e]||[]).forEach(fn => fn(d)); }
};
const states = {};
const readiness = {
  set: k => { states[k]=true; signal.emit(k); },
  has: k => !!states[k],
  waitFor: k => new Promise(res => {
    if(states[k]) return res();
    const cb = () => { if(states[k]){ signal.off(k, cb); res(); } };
    signal.on(k, cb);
  })
};
const wizard = {
  isDismissed: () => {
    try { return window.localStorage.getItem('wizardDismissed') === '1'; } catch { return false; }
  },
  dismiss: () => {
    try { window.localStorage.setItem('wizardDismissed','1'); }
    catch { ipcRenderer.send('wizard:dismiss'); }
  }
};
const api = { version, getVersion: () => version, signal, readiness, wizard };
contextBridge.exposeInMainWorld('api', api);
if(process.env.DEBUG) console.info('[preload] init-ok');
module.exports = api;
module.exports.default = api;
