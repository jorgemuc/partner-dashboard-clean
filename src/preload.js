const { contextBridge, ipcRenderer } = require('electron');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const mitt = require('mitt');

function safeRequire(name) {
  try {
    return require(name);
  } catch {
    return null;
  }
}

const libs = {
  Papa: safeRequire('papaparse'),
  XLSX: safeRequire('xlsx'),
  Chart: safeRequire('chart.js/auto'),
};

let versionString = 'dev';
try {
  versionString = JSON.parse(
    readFileSync(join(__dirname, 'version.json'), 'utf8')
  ).version;
} catch {
  try {
    versionString = JSON.parse(
      readFileSync(join(__dirname, '../package.json'), 'utf8')
    ).version;
  } catch {
    // ignore
  }
}

const bus = mitt();
ipcRenderer.on('menu-open-csv', () => bus.emit('menu-open-csv'));

const api = {
  bus,
  libs,
  version: versionString,
  versionFn: () => versionString,
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
