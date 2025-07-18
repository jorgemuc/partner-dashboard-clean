let contextBridge = { exposeInMainWorld: () => {} };
let ipcRenderer = { on: () => {}, invoke: () => {} };
try {
  const electron = require('electron');
  if (electron.ipcRenderer) ({ contextBridge, ipcRenderer } = electron);
} catch {}
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

const bus = mitt();
ipcRenderer.on('menu-open-csv', () => bus.emit('menu-open-csv'));

const api = Object.freeze({
  bus,
  version: () => ver,
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
try { require('electron-log').info('[preload] api.version=', window.api.version); }
catch {}
