import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { contextBridge } = require('electron');
let mittLib, Papa, XLSX, Chart;
try { mittLib = require('mitt'); } catch {}
try { Papa = require('papaparse'); } catch {}
try { XLSX = require('xlsx'); } catch {}
try { Chart = require('chart.js/auto'); } catch {}
let version = 'dev';
try { version = require('../dist/version.json').version; } catch (e) { console.error('[pl-err] failed to load version', e); }
const bus = mittLib ? mittLib() : { on(){}, off(){}, emit(){} };
contextBridge.exposeInMainWorld('api', {
  bus,
  libs: { Papa: Papa || null, XLSX: XLSX || null, Chart: Chart || null },
  version: () => version
});
