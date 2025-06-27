const { contextBridge, ipcRenderer } = require('electron');
const mitt = require('mitt');
const { version } = require('../package.json');

function safeRequire(name) {
  try {
    return require(name);
  } catch (e) {
    return null;
  }
}

const libs = {
  mitt,
  Papa: safeRequire('papaparse'),
  XLSX: safeRequire('xlsx'),
  Chart: safeRequire('chart.js/auto')
};

const bus = mitt();

const api = {
  bus,
  libs,
  version,
  onAppLoaded: (cb) => ipcRenderer.on('app-loaded', () => cb())
};

contextBridge.exposeInMainWorld('api', api);

module.exports = api;
