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

const api = { version: 'dev', bus };
contextBridge.exposeInMainWorld('api', api);

// --- runtime version injection ---------------------------------------
try {
  const { ipcRenderer } = require('electron');
  ipcRenderer.invoke('get-version')
    .then(v => { api.version = v; })
    .catch(() => {/* keep 'dev' */});
} catch { /* unit-tests/jsdom: electron not available */ }


