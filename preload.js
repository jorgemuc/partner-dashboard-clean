const { contextBridge, ipcRenderer } = require('electron');
// mitt ist ESM-only – per dynamic import nachladen
let bus;
import('mitt').then(m => {
  bus = m.default();
  // expose: bus + helper to get version
  contextBridge.exposeInMainWorld('api', {
    bus,
    getVersion: () => ipcRenderer.invoke('get-version')
  });
});

// also put it on window early for simple inline scripts
ipcRenderer.invoke('get-version').then(v => {
  if (typeof window !== 'undefined') window.APP_VERSION = v;
});
