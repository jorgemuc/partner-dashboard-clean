const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', {
  version: () => ipcRenderer.invoke('get-version'),
  onOpenCsvDialog: (fn) => ipcRenderer.on('open-csv-dialog', fn)
});
