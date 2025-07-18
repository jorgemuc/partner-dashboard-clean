const { contextBridge, ipcRenderer } = require('electron');
const mitt = require('mitt');
const { version: pkgVersion } = require('../package.json');
let ver = pkgVersion;
try {
  // override with bundled version if available
  // eslint-disable-next-line node/no-missing-require, node/no-unpublished-require
  const dist = require('../dist/version.json');
  if (dist && dist.version) ver = dist.version;
} catch (e) {
  // ignore - use package.json version
}
if (process.env.DEBUG === 'smoke') {
  console.log(`[smoke] version ${ver}`);
}

function safeRequire(name) {
  try {
    return require(name);
  } catch (_err) {
    return null;
  }
}

const libs = {
  Papa: safeRequire('papaparse'),
  XLSX: safeRequire('xlsx'),
  Chart: safeRequire('chart.js/auto'),
};

const bus = mitt();
ipcRenderer.on('menu-open-csv', () => bus.emit('menu-open-csv'));

const api = Object.freeze({
  bus,
  libs,
  version: ver,
  getVersion: () => ver,
  onAppLoaded: (cb) => ipcRenderer.on('app-loaded', cb),
  sendMail: (opts) => ipcRenderer.invoke('send-mail', opts),
});

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
