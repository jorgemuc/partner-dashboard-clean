const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
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
  XLSX: safeRequire('xlsx'),
  Chart: safeRequire('chart.js/auto')
};

let version = 'dev';
try {
  version = require('../dist/version.json').version;
} catch (e) {
  try { version = require('../package.json').version; } catch {} }

const bus = mitt();

async function loadCsv(file) {
  try {
    return fs.readFileSync(path.resolve(file.path), 'utf8');
  } catch (err) {
    console.error('[pl-err] loadCsv', err);
    throw err;
  }
}

const api = { bus, libs, version, loadCsv, onAppLoaded: cb => ipcRenderer.on('app-loaded', cb) };
contextBridge.exposeInMainWorld('api', api);
module.exports = api;
