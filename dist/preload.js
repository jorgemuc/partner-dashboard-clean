var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/electron/index.js
var require_electron = __commonJS({
  "node_modules/electron/index.js"(exports2, module2) {
    var fs = require("fs");
    var path = require("path");
    var pathFile = path.join(__dirname, "path.txt");
    function getElectronPath() {
      let executablePath;
      if (fs.existsSync(pathFile)) {
        executablePath = fs.readFileSync(pathFile, "utf-8");
      }
      if (process.env.ELECTRON_OVERRIDE_DIST_PATH) {
        return path.join(process.env.ELECTRON_OVERRIDE_DIST_PATH, executablePath || "electron");
      }
      if (executablePath) {
        return path.join(__dirname, "dist", executablePath);
      } else {
        throw new Error("Electron failed to install correctly, please delete node_modules/electron and try installing again");
      }
    }
    module2.exports = getElectronPath();
  }
});

// dist/version.json
var require_version = __commonJS({
  "dist/version.json"(exports2, module2) {
    module2.exports = {
      version: "0.7.89"
    };
  }
});

// package.json
var require_package = __commonJS({
  "package.json"(exports2, module2) {
    module2.exports = {
      name: "partner-dashboard-clean",
      version: "0.7.89",
      main: "main.js",
      scripts: {
        start: "electron .",
        lint: "eslint main.js src/preload/index.cjs",
        bundle: "cross-env NODE_ENV=production node scripts/bundle.js",
        "bundle:preload": "node scripts/bundle-preload.js",
        "bundle:all": "npm run bundle && npm run bundle:preload",
        "prepare-icon": "node scripts/prepare-icon.js",
        "build:dir": "electron-builder --dir",
        "build:win32": "cross-env NODE_ENV=production electron-builder",
        postinstall: "node scripts/decode-icons.js && npm run prepare-icon",
        test: "cross-env NODE_OPTIONS=--experimental-vm-modules jest",
        "pre-smoke": "npm run bundle:all",
        smoke: "cross-env DEBUG=smoke playwright test -c playwright.smoke.config.ts",
        ci: "npm run lint && npm run bundle:all && npm test && npm run build:win32",
        postversion: "npm run bundle:all",
        e2e: "playwright test tests/e2e",
        "dev:verify": "bash scripts/dev-verify.sh"
      },
      devDependencies: {
        "@electron/asar": "^3.2.14",
        "@playwright/test": "^1.41.2",
        "@testing-library/dom": "^10.4.0",
        "@testing-library/jest-dom": "^6.6.3",
        "cross-env": "^7.0.3",
        electron: "^26.2.0",
        "electron-builder": "^26.0.12",
        esbuild: "^0.21.0",
        "esbuild-plugin-import-glob": "^0.1.1",
        eslint: "^8.57.0",
        "eslint-config-airbnb-base": "^15.0.0",
        "eslint-plugin-import": "^2.32.0",
        "eslint-plugin-node": "^11.1.0",
        jest: "^29.7.0",
        "jest-canvas-mock": "^2.5.2",
        "jest-environment-jsdom": "^30.0.4",
        jsdom: "^26.1.0",
        playwright: "^1.41.2",
        "png-to-ico": "^2.1.8",
        sharp: "^0.34.2"
      },
      dependencies: {
        "chart.js": "^4.5.0",
        "electron-log": "5.4.1",
        mitt: "2.1.0",
        nodemailer: "^6.10.1",
        papaparse: "^5.5.3",
        xlsx: "^0.18.5"
      },
      build: {
        productName: "Partner Cockpit Dashboard",
        appId: "com.jorgemuc.partnerdashboard",
        asar: true,
        files: [
          "dist/**/*",
          "!dist/**/*.map",
          "main.js",
          "parser.js",
          "src/**/*.js",
          "index.html",
          "styles.css",
          "modal.css",
          "preload.js",
          "build/unpacked/**/*",
          "about.html",
          "help.html",
          "demo/**/*",
          "assets/**"
        ],
        win: {
          target: "portable",
          icon: "assets/icon.ico",
          forceCodeSigning: false
        },
        icon: "assets/icons/partner_dashboard_icon_1024.png",
        afterPack: "./builder.afterPack.js"
      }
    };
  }
});

// src/preload/index.cjs
if (typeof window !== "undefined" && !window.api) {
  window.api = { readiness: /* @__PURE__ */ new Set() };
}
try {
  let contextBridge = { exposeInMainWorld: () => {
  } };
  let ipcRenderer = { on: () => {
  }, send: () => {
  }, invoke: () => {
  } };
  try {
    const electron = require_electron();
    if (electron.contextBridge) contextBridge = electron.contextBridge;
    if (electron.ipcRenderer) ipcRenderer = electron.ipcRenderer;
  } catch {
  }
  let versionValue;
  try {
    versionValue = require_version().version;
  } catch {
    try {
      versionValue = require_package().version;
    } catch {
      versionValue = "0.0.0-preload-error";
    }
  }
  const events = {};
  const signal = {
    on: (e, fn) => {
      (events[e] || (events[e] = [])).push(fn);
    },
    off: (e, fn) => {
      events[e] = (events[e] || []).filter((f) => f !== fn);
    },
    emit: (e, d) => {
      (events[e] || []).forEach((fn) => fn(d));
    }
  };
  const states = /* @__PURE__ */ new Set();
  const readiness = {
    set: (k) => {
      states.add(k);
      signal.emit(k);
    },
    add: (k) => {
      states.add(k);
      signal.emit(k);
    },
    has: (k) => states.has(k),
    waitFor: (k) => new Promise((res) => {
      if (states.has(k)) return res();
      const cb = () => {
        if (states.has(k)) {
          signal.off(k, cb);
          res();
        }
      };
      signal.on(k, cb);
    })
  };
  const wizard = {
    isDismissed: () => {
      try {
        return window.localStorage.getItem("wizard.dismissed") === "1";
      } catch {
        return false;
      }
    },
    dismiss: () => {
      try {
        window.localStorage.setItem("wizard.dismissed", "1");
      } catch {
        ipcRenderer.send("wizard:dismiss");
      }
    }
  };
  const api = {
    version: () => versionValue,
    getVersion: () => versionValue,
    signal,
    readiness,
    wizard
  };
  contextBridge.exposeInMainWorld("api", api);
  if (typeof window !== "undefined") {
    window.api = api;
    window.api.readiness.add("base-ui");
  }
  if (process.env.DEBUG) console.info("[preload] init-ok");
  module.exports = api;
  module.exports.default = api;
} catch (e) {
  console.error("[preload-err]", e && e.stack || e);
  if (typeof window !== "undefined") {
    if (!window.api) {
      window.api = { readiness: /* @__PURE__ */ new Set(["preload-error"]) };
    } else if (window.api.readiness && window.api.readiness.add) {
      window.api.readiness.add("preload-error");
    }
  }
  module.exports = typeof window !== "undefined" ? window.api : {};
  module.exports.default = module.exports;
}
