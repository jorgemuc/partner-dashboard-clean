const { contextBridge, ipcRenderer } = require('electron');
const mitt = require('mitt');
let Papa, XLSX, Chart;
try { Papa = require('papaparse'); } catch {}
try { XLSX = require('xlsx'); } catch {}
try { Chart = require('chart.js'); } catch {}

const bus = mitt();
contextBridge.exposeInMainWorld('api', {
  bus,
  libs: { Papa, XLSX, Chart },
  version: () => ipcRenderer.invoke('get-version')
});
