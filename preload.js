const { contextBridge, ipcRenderer } = require("electron");
const logger = require("./src/logger.js");
logger.info("[trace] preload-start");
const { version: pkgVersion } = require("./package.json");
let ver = pkgVersion;
try {
  const dist = require("./dist/version.json");
  if (dist && dist.version) ver = dist.version;
} catch (e) {
}
if (process.env.DEBUG === "smoke") {
  console.log(`[smoke] version ${ver}`);
}
let wizardDismissed = false;
try {
  wizardDismissed = localStorage.getItem('wizard.dismissed') === 'true';
} catch {}
logger.info(`[trace] wizard-state { dismissed: ${wizardDismissed} }`);
let chartReady = false;
const api = Object.freeze({
  ipc: ipcRenderer,
  version: ver,
  getVersion: () => ver,
  getWizardState: () => ({ dismissed: wizardDismissed }),
  getChartStatus: () => ({ ready: chartReady }),
});
contextBridge.exposeInMainWorld("api", api);
contextBridge.exposeInMainWorld("__setChartReady", () => { chartReady = true; });
contextBridge.exposeInMainWorld("csvApi", {
  openDialog: () => ipcRenderer.invoke("dialog:openCsv"),
  onCsvPath: (cb) => ipcRenderer.on("csv:path", (_, p) => cb(p))
});
contextBridge.exposeInMainWorld("log", {
  error: (...d) => ipcRenderer.send("log", "error", ...d),
  warn: (...d) => ipcRenderer.send("log", "warn", ...d),
  info: (...d) => ipcRenderer.send("log", "info", ...d),
  debug: (...d) => ipcRenderer.send("log", "debug", ...d)
});
if (typeof module !== "undefined") {
  module.exports = api;
  module.exports.default = api;
}
try {
  require("electron-log").info("[preload] api.version=", window.api.version);
} catch {
}
