const { contextBridge, ipcRenderer } = require('electron');

let mittLib;
try {
  mittLib = require('mitt');
} catch {
  console.error('[preload] mitt failed');
}
const bus = mittLib ? mittLib() : { on: () => {}, off: () => {}, emit: () => {} };

contextBridge.exposeInMainWorld('bus', bus);
contextBridge.exposeInMainWorld('api', {
  getVersion: () => ipcRenderer.invoke('get-version'),
  onOpenCsvDialog: fn => ipcRenderer.on('open-csv-dialog', fn)
});

