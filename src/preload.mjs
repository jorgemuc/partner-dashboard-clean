import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { contextBridge, ipcRenderer } = require('electron');
import mitt from 'mitt';

const libs = {};
async function tryLoad(name, key){
  try {
    const mod = await import(name);
    libs[key] = mod.default ?? mod;
  } catch {
    console.warn('[pl-warn] lib missing', name);
  }
}
await Promise.all([
  tryLoad('papaparse', 'Papa'),
  tryLoad('xlsx', 'XLSX'),
  tryLoad('chart.js/auto', 'Chart')
]);

contextBridge.exposeInMainWorld('api', {
  version: await ipcRenderer.invoke('get-version'),
  bus: mitt(),
  libs
});
