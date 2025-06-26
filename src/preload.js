const { contextBridge, ipcRenderer } = require('electron');

const mitt = require('mitt');
const bus = mitt();

contextBridge.exposeInMainWorld('bus', bus);
contextBridge.exposeInMainWorld('api', {
  getVersion: () => ipcRenderer.invoke('get-version'),
  onOpenCsvDialog: fn => ipcRenderer.on('open-csv-dialog', fn)
});

