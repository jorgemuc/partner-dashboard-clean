const { contextBridge, ipcRenderer } = require('electron');
const mitt = require('mitt');
const eventBus = mitt();
eventBus.once = (type, handler) => {
  const wrap = (...args) => {
    eventBus.off(type, wrap);
    handler(...args);
  };
  eventBus.on(type, wrap);
};

contextBridge.exposeInMainWorld('eventBus', eventBus);

contextBridge.exposeInMainWorld('api', {
  version: () => ipcRenderer.invoke('get-version'),
  onOpenCsvDialog: (fn) => ipcRenderer.on('open-csv-dialog', fn)
});
