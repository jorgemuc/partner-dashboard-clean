const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', {
  version: () => ipcRenderer.invoke('get-version')
});
