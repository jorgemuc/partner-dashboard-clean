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
ipcRenderer.on('menu-open-csv', () => bus.emit('menu-open-csv'));

const api = {
  bus,
  libs,
  version,
  onAppLoaded: (cb) => ipcRenderer.on('app-loaded', cb),
  sendMail: (opts) => ipcRenderer.invoke('send-mail', opts),
};

contextBridge.exposeInMainWorld('api', api);
contextBridge.exposeInMainWorld('csvApi', {
  openDialog: () => ipcRenderer.invoke('dialog:openCsv'),
  onCsvPath: cb => ipcRenderer.on('csv:path', (_, p) => cb(p))
});
// safe-export: nur in Node-Kontext
if (typeof module !== 'undefined') {
  module.exports = api;
  module.exports.default = api;
}
