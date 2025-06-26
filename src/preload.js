const { contextBridge, ipcRenderer } = require('electron');
const mitt   = require('mitt');          // runtime-dep
const bus    = mitt();

contextBridge.exposeInMainWorld('api', {
  bus,
  onOpenFile: cb => ipcRenderer.on('menu-open-file', cb)
  // … weitere Bridged-APIs
});

