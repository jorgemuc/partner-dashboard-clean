const { contextBridge } = require('electron');

// --- EventBus --------------------------------------------------------
let bus;
try {
  // preload runs in Node context → require allowed
  const mitt = require('mitt');
  bus = mitt();
} catch (e) {
  console.error('[pl-err] mitt missing', e);
  bus = { on() {}, off() {}, emit() {} }; // stub so renderer won't crash
}

// --- Runtime Libraries (PapaParse, XLSX, Chart.js) -------------------
function safeRequire(mod){
  try { return require(mod); }
  catch { console.warn('[pl-warn] optional lib missing', mod); return {}; }
}

const libs = {
  Papa: safeRequire('papaparse'),
  XLSX: safeRequire('xlsx'),
  Chart: safeRequire('chart.js')
};

const api = { version: 'dev', bus, libs };
contextBridge.exposeInMainWorld('api', api);

// --- runtime version injection ---------------------------------------
try {
  const { ipcRenderer } = require('electron');
  ipcRenderer.invoke('get-version')
    .then(v => { api.version = v; })
    .catch(() => {/* keep 'dev' */});
} catch { /* unit-tests/jsdom: electron not available */ }

