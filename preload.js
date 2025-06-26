const { contextBridge } = require('electron');

// --- runtime libs ----------------------------------------------------
let mittPkg;
try {
  mittPkg = require('mitt');
} catch (e) {
  console.warn('[pl-warn] mitt missing', e.message);
  mittPkg = () => ({ on() {}, emit() {} });
}
const libs = {};
try { libs.Papa = require('papaparse'); } catch { console.warn('[pl-warn] optional lib missing', 'papaparse'); }
try { libs.XLSX = require('xlsx'); } catch { console.warn('[pl-warn] optional lib missing', 'xlsx'); }
try { libs.chartjs = require('chart.js'); } catch { console.warn('[pl-warn] optional lib missing', 'chart.js'); }

const bus = mittPkg();
const api = { version: 'dev', bus, libs };
contextBridge.exposeInMainWorld('api', api);

// --- runtime version injection ---------------------------------------
try {
  const { ipcRenderer } = require('electron');
  ipcRenderer.invoke('get-version')
    .then(v => { api.version = v; })
    .catch(() => {/* keep 'dev' */});
} catch { /* unit-tests/jsdom: electron not available */ }

