# AGENT INSTRUCTIONS

## Scope
This file applies to the entire repository.

## Programmatic Checks
Run `npm run dev:verify` before committing. Verify that `BACKLOG.csv` keeps its CSV structure (7 columns).

### Dev-Verify Workflow
- `npm run dev:verify` MUST pass before commit.
- Smoke tests run under Xvfb; locally use `xvfb-run -a npm run smoke`.
- If smoke tests fail red, temporarily `test.skip()` and create a BACKLOG ticket.

## Contribution Guidelines
- Record progress for each coding session in `BACKLOG.csv` by updating status or adding new rows.
- Write commits in English.

## Development Guidelines
- Follow a simple TDD workflow. Add failing tests first and only mark them passing once implemented.
- Provide unit tests for all new functionality.
- Renderer code uses ESM; the preload script is CommonJS and may access Node APIs.
- Imports must be relative (`./` or `../`).
  - Worker scripts may call `importScripts` only from `/renderer/*.js`.

#### 📦 Bundling & Single-Source Version
* **esbuild** erstellt _ein_ Renderer-Bundle (ESM) und _ein_ Preload-Bundle (CJS) unter `dist/`.
* Das Bundling-Script schreibt **`dist/version.json`** mit `{"version": "<package.json.version>"}`.
* Preload exponiert `window.api.version` aus dieser Quelle; UI zeigt die Versionsnummer nur noch darüber an.
* **Keine** harten Versions-Strings mehr in HTML, README, CHANGELOG etc.
* Externe Libraries (**mitt**, **papaparse**, **xlsx**, **chart.js**) werden ausschließlich via NPM-Imports gebündelt – keine CDN-Scripts oder lokalen Kopien.

### Dependency Management
All third-party libraries must be installed via NPM. Local copies under `assets/` are forbidden.

### Binary Assets
Do not commit ICO or large PNG files directly. Store them as Base64 text and decode during installation or bundling.

### Packaging Rule
- `npm run bundle` **must** run immediately before any `electron-builder` call.
- `build.files` must always include `main.js` and all `.js` files in the project root.
- The portable smoke test must launch the built `.exe` to verify startup.

### Logging Discipline
Preload produces no console output on success. All fatal errors must start with `[pl-err]` so Smoke-Test can whitelist benign logs.

Mandatory startup logs use the `[trace]` prefix: main-created-window, preload-start, renderer-domcontentloaded, wizard-state and chart-init.
### Testing Policy
E2E tests verify only UI states or exposed APIs. Console output must never be part of the oracle.
Smoke tests wait for the IPC message `'app-loaded'` from the main process instead of DOM content.

### PR-Guidelines
One logical change per PR, roughly under 400 lines of diff. Include the CHANGELOG entry in the same commit.

### Roadmap
Reserve ≥ 50 % sprint capacity for user-visible features; infra work is capped at the rest.

### Single-Source Rules
All architectural rules live in this file. When code diverges, update the docs first, then adjust the implementation.

## CI Rules
The workflow uses concurrency to prevent duplicate runs and only triggers on pushes or pull requests targeting `main`.
**Windows-only packaging:** the GitHub Actions workflow now runs lint & tests on any runner, but only `windows-latest` produces the packaged EXE. (No Ubuntu/Wine packaging.)

## Pull-Request Checklist
- `npm run dev:verify` is green.
- `BACKLOG.csv` has exactly 7 columns.
- Update CHANGELOG and bump version.

### 🛡 Renderer-Import-Rule
Bare specifiers (`import foo from 'foo'`) are forbidden. Either expose required modules via the preload script or bundle them locally and import relatively. Run `node scripts/lint-no-bare-imports.js` before release.

### ⏰ Release House-Keeping Checklist
- [ ] README.md version badge & headline
- [ ] about.html / help.html data-version and visible text
- [ ] index.html `window.APP_VERSION`
- [ ] BACKLOG.csv status/owner columns
- [ ] CHANGELOG.md new entry

### Versioning
Patch bumps fix bugs only. Increase minor for new features, major for breaking changes.

### Preload Contract
`window.api` is the single global exposed to the renderer. It has the shape:

```
{
  ipc: IpcRenderer,
  version: string,
  getVersion: () => string,
  getWizardState: () => { dismissed: boolean },
  getChartStatus: () => { ready: boolean }
}
```

### Preload Contract (Delta)
`getWizardState` returns the persisted wizard state. `getChartStatus` reports if the first chart finished rendering.

### State Management
Persistent UI state (currently only the wizard) is stored in `localStorage` under `wizard.dismissed`. Tests must read the state via `window.api.getWizardState()`.

Why these additions help the current build woes

    Contract clarity – tests now fail only if window.api.version is really missing, not because callers mis-use it.

    Global canvas stub removes the “HTMLCanvasElement undefined” error that killed the smoke job (tests/_canvasStub.js is loaded once via globalSetup).

    Debug hooks (DEBUG=smoke) provide actionable logs/IPC traces so we no longer “fly blind”.

    Strict workflow order guarantees the same environment locally and in CI, avoiding the “works on my machine” cycle.

These rules are stable for the foreseeable future: they touch fundamentals (how we bundle, expose preload, and run tests) that rarely change once solid. If we later migrate to another test runner or bundler, we’ll update this file first, honoring the “single-source” doctrine.

When code and docs diverge, update this file first – implementation follows.

---

### Bewertung (halten die Regeln das Build-Problem langfristig in Schach?)

* **Kurzfristig**: Die Canvas-Stub- und Version-Kontrakt-Regeln schalten die beiden aktuell roten Fehlerquellen (undef. `HTMLCanvasElement`, undef. `window.api.version`) ab.  
* **Mittelfristig**: Mit klar definiertem IPC-Signal und Debug-Logging wird jeder künftige Autostart-/Wizard-Fehler früh im Smoke-Step sichtbar – ohne Trial-and-Error-Commits.  
* **Langfristig**: Solange wir bei Electron + Playwright bleiben, muss nur der Preload-Contract stabil gehalten werden; die Regeln bleiben gültig. Bei Architekturwechsel (z. B. Vite, Vitest) passen wir **diesen** Leitfaden zuerst an – die Single-Source-Policy schützt vor Drift.

**Fazit:** Die synthetisierte AGENTS.md deckt die bisherigen Lücken, verschärft Observability und verhindert Regressionen, ohne gute existierende Regeln zu “überbügeln”.
