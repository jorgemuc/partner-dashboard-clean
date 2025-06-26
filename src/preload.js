const { contextBridge, ipcRenderer } = require('electron');
let bus;

try {
  const mitt = require('mitt');
  bus = mitt();
  bus.once = (t, h) => {
    const wrap = (...args) => {
      bus.off(t, wrap);
      h(...args);
    };
    bus.on(t, wrap);
  };
} catch (err) {
  console.error('[preload] mitt failed:', err);
  bus = {
    on: () => {},
    off: () => {},
    emit: () => {},
    once: () => {}
  };
}

contextBridge.exposeInMainWorld('api', {
  bus,
  getVersion: () => ipcRenderer.invoke('get-version'),
  onOpenCsvDialog: fn => ipcRenderer.on('open-csv-dialog', fn)
});
