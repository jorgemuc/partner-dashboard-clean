const { contextBridge, ipcRenderer } = require('electron');
const mitt = require('mitt');

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
  XLSX: safeRequire('xlsx')
};

let version = 'dev';
try {
  version = require('../dist/version.json').version;
} catch (e) {
  try { version = require('../package.json').version; } catch {} }

const bus = mitt();

const api = { bus, libs, version, onAppLoaded: cb => ipcRenderer.on('app-loaded', cb) };
contextBridge.exposeInMainWorld('api', api);
module.exports = api;
