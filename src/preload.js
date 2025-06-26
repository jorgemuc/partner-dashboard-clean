const { contextBridge, ipcRenderer } = require('electron');

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
  onOpenFile: cb => ipcRenderer.on('menu-open-file', cb)
  // … weitere Bridged-APIs
});

