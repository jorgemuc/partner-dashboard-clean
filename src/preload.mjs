import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { contextBridge, ipcRenderer } = require('electron');

let bus;
try {
  const { default: mitt } = await import('mitt');
  bus = mitt();
  bus.once = (t, h) => {
    const wrap = (...args) => {
      bus.off(t, wrap);
      h(...args);
    };
    bus.on(t, wrap);
  };
} catch (err) {
  console.error('preload failed to load mitt:', err);
  bus = {
    on: () => {},
    emit: () => {},
    off: () => {},
    once: () => {}
  };
}

contextBridge.exposeInMainWorld('api', {
  bus,
  getVersion: () => ipcRenderer.invoke('get-version'),
  onOpenCsvDialog: fn => ipcRenderer.on('open-csv-dialog', fn)
});
