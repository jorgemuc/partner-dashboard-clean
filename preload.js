const { contextBridge, ipcRenderer } = require('electron');
const mitt = require('mitt');

// expose: bus + helper to get version
contextBridge.exposeInMainWorld('api', {
  bus: mitt(),
  getVersion: () => ipcRenderer.invoke('get-version')
});

// also put it on window early for simple inline scripts
ipcRenderer.invoke('get-version').then(v => {
  if (typeof window !== 'undefined') window.APP_VERSION = v;
});
