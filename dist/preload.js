(() => {
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });

  // src/preload/index.js
  var req = typeof __require === "function" ? __require : null;
  var { contextBridge } = req ? req("electron") : {};
  (() => {
    if (typeof window === "undefined") return;
    const proc = typeof process !== "undefined" ? process : { env: {} };
    const safeLog = (...a) => {
      if (proc.env?.DEBUG?.includes("smoke")) console.log("[preload]", ...a);
    };
    const appVersion = true ? "0.7.91" : proc.env.APP_VERSION || "0.0.0-dev";
    const readiness = /* @__PURE__ */ new Set();
    const libs = {};
    const bus = {
      _l: {},
      on(e, f) {
        (this._l[e] || (this._l[e] = [])).push(f);
      },
      emit(e, p) {
        (this._l[e] || []).forEach((fn) => {
          try {
            fn(p);
          } catch {
          }
        });
      }
    };
    function install() {
      if (window.api && typeof window.api.version === "function") {
        safeLog("already-installed");
        return;
      }
      const api = Object.freeze({
        bus,
        libs,
        readiness,
        version: () => appVersion,
        getVersion: () => appVersion
      });
      if (contextBridge?.exposeInMainWorld) {
        contextBridge.exposeInMainWorld("api", api);
      }
      try {
        Object.defineProperty(window, "api", { value: api, configurable: false, enumerable: false, writable: false });
      } catch {
      }
      readiness.add("preload-init");
      safeLog("init-ok");
    }
    try {
      install();
    } catch (err) {
      console.error("[preload-err]", err);
      try {
        const failApi = { version: () => appVersion, getVersion: () => appVersion, readiness: /* @__PURE__ */ new Set(["preload-error"]) };
        if (contextBridge?.exposeInMainWorld) contextBridge.exposeInMainWorld("api", failApi);
        window.api = failApi;
      } catch {
      }
    }
  })();
})();
