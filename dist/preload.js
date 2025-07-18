var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/mitt/dist/mitt.js
var require_mitt = __commonJS({
  "node_modules/mitt/dist/mitt.js"(exports2, module2) {
    module2.exports = function(n) {
      return { all: n = n || /* @__PURE__ */ new Map(), on: function(e, t) {
        var i = n.get(e);
        i && i.push(t) || n.set(e, [t]);
      }, off: function(e, t) {
        var i = n.get(e);
        i && i.splice(i.indexOf(t) >>> 0, 1);
      }, emit: function(e, t) {
        (n.get(e) || []).slice().map(function(n2) {
          n2(t);
        }), (n.get("*") || []).slice().map(function(n2) {
          n2(e, t);
        });
      } };
    };
  }
});

// package.json
var require_package = __commonJS({
  "package.json"(exports2, module2) {
    module2.exports = {
      name: "partner-dashboard-clean",
      version: "0.7.85",
      main: "main.js",
      scripts: {
        start: "electron .",
        lint: "eslint main.js src/preload.js",
        bundle: "cross-env NODE_ENV=production node scripts/bundle.js",
        "bundle:preload": "node scripts/bundle-preload.js",
        "prepare-icon": "node scripts/prepare-icon.js",
        "build:dir": "electron-builder --dir",
        "build:win32": "cross-env NODE_ENV=production electron-builder",
        postinstall: "node scripts/decode-icons.js && npm run prepare-icon",
        test: "cross-env NODE_OPTIONS=--experimental-vm-modules jest",
        "pre-smoke": "npm run bundle && npm run bundle:preload",
        smoke: "cross-env DEBUG=smoke playwright test -c playwright.smoke.config.ts",
        ci: "npm run lint && npm run bundle && npm test && npm run build:win32",
        postversion: "npm run bundle",
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

// dist/version.json
var require_version = __commonJS({
  "dist/version.json"(exports2, module2) {
    module2.exports = {
      version: "0.7.85"
    };
  }
});

// node_modules/electron-log/src/core/scope.js
var require_scope = __commonJS({
  "node_modules/electron-log/src/core/scope.js"(exports2, module2) {
    "use strict";
    module2.exports = scopeFactory;
    function scopeFactory(logger) {
      return Object.defineProperties(scope, {
        defaultLabel: { value: "", writable: true },
        labelPadding: { value: true, writable: true },
        maxLabelLength: { value: 0, writable: true },
        labelLength: {
          get() {
            switch (typeof scope.labelPadding) {
              case "boolean":
                return scope.labelPadding ? scope.maxLabelLength : 0;
              case "number":
                return scope.labelPadding;
              default:
                return 0;
            }
          }
        }
      });
      function scope(label) {
        scope.maxLabelLength = Math.max(scope.maxLabelLength, label.length);
        const newScope = {};
        for (const level of logger.levels) {
          newScope[level] = (...d) => logger.logData(d, { level, scope: label });
        }
        newScope.log = newScope.info;
        return newScope;
      }
    }
  }
});

// node_modules/electron-log/src/core/Buffering.js
var require_Buffering = __commonJS({
  "node_modules/electron-log/src/core/Buffering.js"(exports2, module2) {
    "use strict";
    var Buffering = class {
      constructor({ processMessage }) {
        this.processMessage = processMessage;
        this.buffer = [];
        this.enabled = false;
        this.begin = this.begin.bind(this);
        this.commit = this.commit.bind(this);
        this.reject = this.reject.bind(this);
      }
      addMessage(message) {
        this.buffer.push(message);
      }
      begin() {
        this.enabled = [];
      }
      commit() {
        this.enabled = false;
        this.buffer.forEach((item) => this.processMessage(item));
        this.buffer = [];
      }
      reject() {
        this.enabled = false;
        this.buffer = [];
      }
    };
    module2.exports = Buffering;
  }
});

// node_modules/electron-log/src/core/Logger.js
var require_Logger = __commonJS({
  "node_modules/electron-log/src/core/Logger.js"(exports2, module2) {
    "use strict";
    var scopeFactory = require_scope();
    var Buffering = require_Buffering();
    var Logger = class _Logger {
      static instances = {};
      dependencies = {};
      errorHandler = null;
      eventLogger = null;
      functions = {};
      hooks = [];
      isDev = false;
      levels = null;
      logId = null;
      scope = null;
      transports = {};
      variables = {};
      constructor({
        allowUnknownLevel = false,
        dependencies = {},
        errorHandler,
        eventLogger,
        initializeFn,
        isDev = false,
        levels = ["error", "warn", "info", "verbose", "debug", "silly"],
        logId,
        transportFactories = {},
        variables
      } = {}) {
        this.addLevel = this.addLevel.bind(this);
        this.create = this.create.bind(this);
        this.initialize = this.initialize.bind(this);
        this.logData = this.logData.bind(this);
        this.processMessage = this.processMessage.bind(this);
        this.allowUnknownLevel = allowUnknownLevel;
        this.buffering = new Buffering(this);
        this.dependencies = dependencies;
        this.initializeFn = initializeFn;
        this.isDev = isDev;
        this.levels = levels;
        this.logId = logId;
        this.scope = scopeFactory(this);
        this.transportFactories = transportFactories;
        this.variables = variables || {};
        for (const name of this.levels) {
          this.addLevel(name, false);
        }
        this.log = this.info;
        this.functions.log = this.log;
        this.errorHandler = errorHandler;
        errorHandler?.setOptions({ ...dependencies, logFn: this.error });
        this.eventLogger = eventLogger;
        eventLogger?.setOptions({ ...dependencies, logger: this });
        for (const [name, factory] of Object.entries(transportFactories)) {
          this.transports[name] = factory(this, dependencies);
        }
        _Logger.instances[logId] = this;
      }
      static getInstance({ logId }) {
        return this.instances[logId] || this.instances.default;
      }
      addLevel(level, index = this.levels.length) {
        if (index !== false) {
          this.levels.splice(index, 0, level);
        }
        this[level] = (...args) => this.logData(args, { level });
        this.functions[level] = this[level];
      }
      catchErrors(options) {
        this.processMessage(
          {
            data: ["log.catchErrors is deprecated. Use log.errorHandler instead"],
            level: "warn"
          },
          { transports: ["console"] }
        );
        return this.errorHandler.startCatching(options);
      }
      create(options) {
        if (typeof options === "string") {
          options = { logId: options };
        }
        return new _Logger({
          dependencies: this.dependencies,
          errorHandler: this.errorHandler,
          initializeFn: this.initializeFn,
          isDev: this.isDev,
          transportFactories: this.transportFactories,
          variables: { ...this.variables },
          ...options
        });
      }
      compareLevels(passLevel, checkLevel, levels = this.levels) {
        const pass = levels.indexOf(passLevel);
        const check = levels.indexOf(checkLevel);
        if (check === -1 || pass === -1) {
          return true;
        }
        return check <= pass;
      }
      initialize(options = {}) {
        this.initializeFn({ logger: this, ...this.dependencies, ...options });
      }
      logData(data, options = {}) {
        if (this.buffering.enabled) {
          this.buffering.addMessage({ data, date: /* @__PURE__ */ new Date(), ...options });
        } else {
          this.processMessage({ data, ...options });
        }
      }
      processMessage(message, { transports = this.transports } = {}) {
        if (message.cmd === "errorHandler") {
          this.errorHandler.handle(message.error, {
            errorName: message.errorName,
            processType: "renderer",
            showDialog: Boolean(message.showDialog)
          });
          return;
        }
        let level = message.level;
        if (!this.allowUnknownLevel) {
          level = this.levels.includes(message.level) ? message.level : "info";
        }
        const normalizedMessage = {
          date: /* @__PURE__ */ new Date(),
          logId: this.logId,
          ...message,
          level,
          variables: {
            ...this.variables,
            ...message.variables
          }
        };
        for (const [transName, transFn] of this.transportEntries(transports)) {
          if (typeof transFn !== "function" || transFn.level === false) {
            continue;
          }
          if (!this.compareLevels(transFn.level, message.level)) {
            continue;
          }
          try {
            const transformedMsg = this.hooks.reduce((msg, hook) => {
              return msg ? hook(msg, transFn, transName) : msg;
            }, normalizedMessage);
            if (transformedMsg) {
              transFn({ ...transformedMsg, data: [...transformedMsg.data] });
            }
          } catch (e) {
            this.processInternalErrorFn(e);
          }
        }
      }
      processInternalErrorFn(_e) {
      }
      transportEntries(transports = this.transports) {
        const transportArray = Array.isArray(transports) ? transports : Object.entries(transports);
        return transportArray.map((item) => {
          switch (typeof item) {
            case "string":
              return this.transports[item] ? [item, this.transports[item]] : null;
            case "function":
              return [item.name, item];
            default:
              return Array.isArray(item) ? item : null;
          }
        }).filter(Boolean);
      }
    };
    module2.exports = Logger;
  }
});

// node_modules/electron-log/src/renderer/lib/RendererErrorHandler.js
var require_RendererErrorHandler = __commonJS({
  "node_modules/electron-log/src/renderer/lib/RendererErrorHandler.js"(exports2, module2) {
    "use strict";
    var consoleError = console.error;
    var RendererErrorHandler = class {
      logFn = null;
      onError = null;
      showDialog = false;
      preventDefault = true;
      constructor({ logFn = null } = {}) {
        this.handleError = this.handleError.bind(this);
        this.handleRejection = this.handleRejection.bind(this);
        this.startCatching = this.startCatching.bind(this);
        this.logFn = logFn;
      }
      handle(error, {
        logFn = this.logFn,
        errorName = "",
        onError = this.onError,
        showDialog = this.showDialog
      } = {}) {
        try {
          if (onError?.({ error, errorName, processType: "renderer" }) !== false) {
            logFn({ error, errorName, showDialog });
          }
        } catch {
          consoleError(error);
        }
      }
      setOptions({ logFn, onError, preventDefault, showDialog }) {
        if (typeof logFn === "function") {
          this.logFn = logFn;
        }
        if (typeof onError === "function") {
          this.onError = onError;
        }
        if (typeof preventDefault === "boolean") {
          this.preventDefault = preventDefault;
        }
        if (typeof showDialog === "boolean") {
          this.showDialog = showDialog;
        }
      }
      startCatching({ onError, showDialog } = {}) {
        if (this.isActive) {
          return;
        }
        this.isActive = true;
        this.setOptions({ onError, showDialog });
        window.addEventListener("error", (event) => {
          this.preventDefault && event.preventDefault?.();
          this.handleError(event.error || event);
        });
        window.addEventListener("unhandledrejection", (event) => {
          this.preventDefault && event.preventDefault?.();
          this.handleRejection(event.reason || event);
        });
      }
      handleError(error) {
        this.handle(error, { errorName: "Unhandled" });
      }
      handleRejection(reason) {
        const error = reason instanceof Error ? reason : new Error(JSON.stringify(reason));
        this.handle(error, { errorName: "Unhandled rejection" });
      }
    };
    module2.exports = RendererErrorHandler;
  }
});

// node_modules/electron-log/src/core/transforms/transform.js
var require_transform = __commonJS({
  "node_modules/electron-log/src/core/transforms/transform.js"(exports2, module2) {
    "use strict";
    module2.exports = { transform };
    function transform({
      logger,
      message,
      transport,
      initialData = message?.data || [],
      transforms = transport?.transforms
    }) {
      return transforms.reduce((data, trans) => {
        if (typeof trans === "function") {
          return trans({ data, logger, message, transport });
        }
        return data;
      }, initialData);
    }
  }
});

// node_modules/electron-log/src/renderer/lib/transports/console.js
var require_console = __commonJS({
  "node_modules/electron-log/src/renderer/lib/transports/console.js"(exports2, module2) {
    "use strict";
    var { transform } = require_transform();
    module2.exports = consoleTransportRendererFactory;
    var consoleMethods = {
      error: console.error,
      warn: console.warn,
      info: console.info,
      verbose: console.info,
      debug: console.debug,
      silly: console.debug,
      log: console.log
    };
    function consoleTransportRendererFactory(logger) {
      return Object.assign(transport, {
        format: "{h}:{i}:{s}.{ms}{scope} \u203A {text}",
        transforms: [formatDataFn],
        writeFn({ message: { level, data } }) {
          const consoleLogFn = consoleMethods[level] || consoleMethods.info;
          setTimeout(() => consoleLogFn(...data));
        }
      });
      function transport(message) {
        transport.writeFn({
          message: { ...message, data: transform({ logger, message, transport }) }
        });
      }
    }
    function formatDataFn({
      data = [],
      logger = {},
      message = {},
      transport = {}
    }) {
      if (typeof transport.format === "function") {
        return transport.format({
          data,
          level: message?.level || "info",
          logger,
          message,
          transport
        });
      }
      if (typeof transport.format !== "string") {
        return data;
      }
      data.unshift(transport.format);
      if (typeof data[1] === "string" && data[1].match(/%[1cdfiOos]/)) {
        data = [`${data[0]}${data[1]}`, ...data.slice(2)];
      }
      const date = message.date || /* @__PURE__ */ new Date();
      data[0] = data[0].replace(/\{(\w+)}/g, (substring, name) => {
        switch (name) {
          case "level":
            return message.level;
          case "logId":
            return message.logId;
          case "scope": {
            const scope = message.scope || logger.scope?.defaultLabel;
            return scope ? ` (${scope})` : "";
          }
          case "text":
            return "";
          case "y":
            return date.getFullYear().toString(10);
          case "m":
            return (date.getMonth() + 1).toString(10).padStart(2, "0");
          case "d":
            return date.getDate().toString(10).padStart(2, "0");
          case "h":
            return date.getHours().toString(10).padStart(2, "0");
          case "i":
            return date.getMinutes().toString(10).padStart(2, "0");
          case "s":
            return date.getSeconds().toString(10).padStart(2, "0");
          case "ms":
            return date.getMilliseconds().toString(10).padStart(3, "0");
          case "iso":
            return date.toISOString();
          default:
            return message.variables?.[name] || substring;
        }
      }).trim();
      return data;
    }
  }
});

// node_modules/electron-log/src/renderer/lib/transports/ipc.js
var require_ipc = __commonJS({
  "node_modules/electron-log/src/renderer/lib/transports/ipc.js"(exports2, module2) {
    "use strict";
    var { transform } = require_transform();
    module2.exports = ipcTransportRendererFactory;
    var RESTRICTED_TYPES = /* @__PURE__ */ new Set([Promise, WeakMap, WeakSet]);
    function ipcTransportRendererFactory(logger) {
      return Object.assign(transport, {
        depth: 5,
        transforms: [serializeFn]
      });
      function transport(message) {
        if (!window.__electronLog) {
          logger.processMessage(
            {
              data: ["electron-log: logger isn't initialized in the main process"],
              level: "error"
            },
            { transports: ["console"] }
          );
          return;
        }
        try {
          const serialized = transform({
            initialData: message,
            logger,
            message,
            transport
          });
          __electronLog.sendToMain(serialized);
        } catch (e) {
          logger.transports.console({
            data: ["electronLog.transports.ipc", e, "data:", message.data],
            level: "error"
          });
        }
      }
    }
    function isPrimitive(value) {
      return Object(value) !== value;
    }
    function serializeFn({
      data,
      depth,
      seen = /* @__PURE__ */ new WeakSet(),
      transport = {}
    } = {}) {
      const actualDepth = depth || transport.depth || 5;
      if (seen.has(data)) {
        return "[Circular]";
      }
      if (actualDepth < 1) {
        if (isPrimitive(data)) {
          return data;
        }
        if (Array.isArray(data)) {
          return "[Array]";
        }
        return `[${typeof data}]`;
      }
      if (["function", "symbol"].includes(typeof data)) {
        return data.toString();
      }
      if (isPrimitive(data)) {
        return data;
      }
      if (RESTRICTED_TYPES.has(data.constructor)) {
        return `[${data.constructor.name}]`;
      }
      if (Array.isArray(data)) {
        return data.map((item) => serializeFn({
          data: item,
          depth: actualDepth - 1,
          seen
        }));
      }
      if (data instanceof Date) {
        return data.toISOString();
      }
      if (data instanceof Error) {
        return data.stack;
      }
      if (data instanceof Map) {
        return new Map(
          Array.from(data).map(([key, value]) => [
            serializeFn({ data: key, depth: actualDepth - 1, seen }),
            serializeFn({ data: value, depth: actualDepth - 1, seen })
          ])
        );
      }
      if (data instanceof Set) {
        return new Set(
          Array.from(data).map(
            (val) => serializeFn({ data: val, depth: actualDepth - 1, seen })
          )
        );
      }
      seen.add(data);
      return Object.fromEntries(
        Object.entries(data).map(
          ([key, value]) => [
            key,
            serializeFn({ data: value, depth: actualDepth - 1, seen })
          ]
        )
      );
    }
  }
});

// node_modules/electron-log/src/renderer/index.js
var require_renderer = __commonJS({
  "node_modules/electron-log/src/renderer/index.js"(exports2, module2) {
    "use strict";
    var Logger = require_Logger();
    var RendererErrorHandler = require_RendererErrorHandler();
    var transportConsole = require_console();
    var transportIpc = require_ipc();
    if (typeof process === "object" && process.type === "browser") {
      console.warn(
        "electron-log/renderer is loaded in the main process. It could cause unexpected behaviour."
      );
    }
    module2.exports = createLogger();
    module2.exports.Logger = Logger;
    module2.exports.default = module2.exports;
    function createLogger() {
      const logger = new Logger({
        allowUnknownLevel: true,
        errorHandler: new RendererErrorHandler(),
        initializeFn: () => {
        },
        logId: "default",
        transportFactories: {
          console: transportConsole,
          ipc: transportIpc
        },
        variables: {
          processType: "renderer"
        }
      });
      logger.errorHandler.setOptions({
        logFn({ error, errorName, showDialog }) {
          logger.transports.console({
            data: [errorName, error].filter(Boolean),
            level: "error"
          });
          logger.transports.ipc({
            cmd: "errorHandler",
            error: {
              cause: error?.cause,
              code: error?.code,
              name: error?.name,
              message: error?.message,
              stack: error?.stack
            },
            errorName,
            logId: logger.logId,
            showDialog
          });
        }
      });
      if (typeof window === "object") {
        window.addEventListener("message", (event) => {
          const { cmd, logId, ...message } = event.data || {};
          const instance = Logger.getInstance({ logId });
          if (cmd === "message") {
            instance.processMessage(message, { transports: ["console"] });
          }
        });
      }
      return new Proxy(logger, {
        get(target, prop) {
          if (typeof target[prop] !== "undefined") {
            return target[prop];
          }
          return (...data) => logger.logData(data, { level: prop });
        }
      });
    }
  }
});

// src/preload.js
var contextBridge = { exposeInMainWorld: () => {
} };
var ipcRenderer = { on: () => {
}, invoke: () => {
} };
try {
  const electron = require("electron");
  if (electron.ipcRenderer) ({ contextBridge, ipcRenderer } = electron);
} catch {
}
var mitt = require_mitt();
var { version: pkgVersion } = require_package();
var ver = pkgVersion;
try {
  const dist = require_version();
  if (dist && dist.version) ver = dist.version;
} catch (e) {
}
if (process.env.DEBUG === "smoke") {
  console.log(`[smoke] version ${ver}`);
}
var bus = mitt();
ipcRenderer.on("menu-open-csv", () => bus.emit("menu-open-csv"));
var api = Object.freeze({
  bus,
  version: () => ver
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
  require_renderer().info("[preload] api.version=", window.api.version);
} catch {
}
