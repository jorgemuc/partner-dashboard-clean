/**
 * Preload – single source of truth for all Node APIs.
 * Runs in isolated context, so we expose a safe API via contextBridge.
 */
const { contextBridge } = require('electron');
const mitt = require('mitt');

// --- 3rd-party libs ---------------------------------------------------
// Require path works even inside packed app.asar.
const Papa = require('papaparse');
const XLSX = require('xlsx');
const { Chart } = require('chart.js/auto');

// --- Event-Bus --------------------------------------------------------
const bus = mitt();

// --- Expose -----------------------------------------------------------
contextBridge.exposeInMainWorld('api', {
  bus,
  libs: { Papa, XLSX, Chart },
});
