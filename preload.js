const { contextBridge, ipcRenderer } = require('electron');
const mitt = require('mitt');

const bus = mitt();
bus.once = (t, h) => {
  const wrap = (...args) => { bus.off(t, wrap); h(...args); };
  bus.on(t, wrap);
};

contextBridge.exposeInMainWorld('api', {
  bus,
  getVersion: () => ipcRenderer.invoke('get-version'),
  onOpenCsvDialog: fn => ipcRenderer.on('open-csv-dialog', fn)
});
