const { contextBridge, ipcRenderer } = require('electron');
const Papa = require('papaparse');
const XLSX = require('xlsx');
const { Chart } = require('chart.js/auto');

let bus;
try {
  const mitt = require('mitt');
  bus = mitt();
} catch (err) {
  // silent on success, explicit prefix on error
  console.error('[pl-err]', err);
  bus = { on: () => {}, off: () => {}, emit: () => {} };
}

contextBridge.exposeInMainWorld('api', {
  bus,
  libs: { Papa, XLSX, Chart },
  onOpenFile: cb => ipcRenderer.on('menu-open-file', cb)
  // … weitere Bridged-APIs
});

ipcRenderer.on('is-ready', () => {
  ipcRenderer.send('ready');
});

