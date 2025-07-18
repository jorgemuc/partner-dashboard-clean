const { contextBridge, ipcRenderer } = require("electron");
const mitt = require("mitt");
let { version } = { version: "dev" };
try {
  ({ version } = require("../dist/version.json"));
} catch {
  try {
    ({ version } = require("../package.json"));
  } catch {
  }
}
function safeRequire(name) {
  try {
    return require(name);
  } catch {
    return null;
  }
}
const libs = {
  Papa: safeRequire("papaparse"),
  XLSX: safeRequire("xlsx"),
  Chart: safeRequire("chart.js/auto")
};
const bus = mitt();
ipcRenderer.on("menu-open-csv", () => bus.emit("menu-open-csv"));
const api = {
  bus,
  libs,
  version: () => version,
  onAppLoaded: (cb) => ipcRenderer.on("app-loaded", cb),
  sendMail: (opts) => ipcRenderer.invoke("send-mail", opts)
};
contextBridge.exposeInMainWorld("api", api);
contextBridge.exposeInMainWorld("csvApi", {
  openDialog: () => ipcRenderer.invoke("dialog:openCsv"),
  onCsvPath: (cb) => ipcRenderer.on("csv:path", (_, p) => cb(p))
});
if (typeof module !== "undefined") {
  module.exports = api;
  module.exports.default = api;
}
