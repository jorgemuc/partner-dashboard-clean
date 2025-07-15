const { contextBridge, ipcRenderer } = require('electron');
const mitt = require('mitt');

function safeRequire(name) {
  try {
    return require(name);
  } catch {
    return null;
  }
}

const libs = {
  mitt,
  Papa: safeRequire('papaparse'),
  XLSX: safeRequire('xlsx'),
};

let version = 'dev';
try {
  version = require('../dist/version.json').version;
} catch {
  try { version = require('../package.json').version; } catch { /* ignore */ }
}

const bus = mitt();

const api = {
  bus,
  libs,
  version,
  onAppLoaded: (cb) => ipcRenderer.on('app-loaded', cb),
  sendMail: (opts) => ipcRenderer.invoke('send-mail', opts),
};

contextBridge.exposeInMainWorld('api', api);
// safe-export: nur in Node-Kontext
if (typeof module !== 'undefined') {
  module.exports = api;
  module.exports.default = api;
}
