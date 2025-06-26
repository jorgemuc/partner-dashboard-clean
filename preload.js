const { contextBridge } = require('electron');

const api = { version: 'dev', bus: {} };
contextBridge.exposeInMainWorld('api', api);

import('mitt')
  .then(m => { api.bus = m.default(); })
  .catch(e => console.error('[pl-err] mitt missing', e));

// --- runtime version injection ---------------------------------------
try {
  const { ipcRenderer } = require('electron');
  ipcRenderer.invoke('get-version')
    .then(v => { api.version = v; })
    .catch(() => {/* keep 'dev' */});
} catch { /* unit-tests/jsdom: electron not available */ }
