const { contextBridge, ipcRenderer } = require("electron");
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
const api = Object.freeze({
  ipc: ipcRenderer,
  version: ver,
  getVersion: () => ver,
});
contextBridge.exposeInMainWorld("api", api);
contextBridge.exposeInMainWorld("csvApi", {
  openDialog: () => ipcRenderer.invoke("dialog:openCsv"),
  onCsvPath: (cb) => ipcRenderer.on("csv:path", (_, p) => cb(p))
});
if (typeof module !== "undefined") {
  module.exports = api;
  module.exports.default = api;
}
try {
  require("electron-log").info("[preload] api.version=", window.api.version);
} catch {
}
