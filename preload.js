const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
  getVersion: () => ipcRenderer.invoke('get-version'),
  onOpenCsvDialog: (fn) => ipcRenderer.on('open-csv-dialog', fn)
});
