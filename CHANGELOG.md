## [0.7.80] – 2025-07-18
### Added
* contract sprint: preload version API and app-loaded IPC

## [0.7.79] – 2025-07-18
### Fixed
* stable app-loaded IPC on window ready
* preload falls back to package.json version

## [0.7.77] – 2025-07-18
### Added
* digital clock in dashboard header

## [0.7.76] – 2025-07-18
### Fixed
* preload exposes version string
* wizard opens only via button
* main emits `app-loaded`

## [0.7.75] – 2025-07-18
### Fixed
* global canvas stub for smoke tests

## [0.7.74] – 2025-07-18
### Fixed
* fix: version exposed as string for smoke tests; keep versionFn()

## [0.7.73] – 2025-07-24
### Fixed
* fix: restore preload contract – `window.api.version()` again
* fix: wizard modal opens only via button; smoke green
* fix: chartCanvas rendered deterministically; canvas stub for tests

## [0.7.71] – 2025-07-18
### Fixed
* preload exports version() again
* wizard stays closed until button click

## [0.7.70] – 2025-07-18
### Fixed
* Wizard opens only via button; Playwright uses single launch helper; CI green on Ubuntu

## [0.7.69] – 2025-07-16
### Fixed
* dist/version.json now packaged → window.api.version available in preload.
* Smoke-suite waits for wizard modal to hide; no race condition.
* Version assertion accepts semantic versions.

## [0.7.68] - 2025-07-16
### Fixed
* dist/version.json restored – `api.version` no longer undefined.
* Smoke-suite sets NODE_ENV=production → wizard stays closed.

## [0.7.67] - 2025-07-16
### Fixed
* Smoke-tests aligned with new preload/UI flow (no IPC needed).

## [0.7.66] – 2025-07-24
### Fixed
* Preload script built without UMD wrapper; root preload path always used

## [0.7.65] – 2025-07-24
### Changed
* Dev-Verify pipeline and CI refactor

## [0.7.64] – 2025-07-24
### Fixed
* Playwright e2e uses launcher path; workflow starts Xvfb

## [0.7.63] – 2025-07-24
### Fixed
* added Xvfb install steps for smoke tests

# Changelog
## [0.7.62] – 2025-07-24
### Fixed
* e2e test launches with Playwright-provided Electron path; CI builds bundle once
## [0.7.61] – 2025-07-24
### Fixed
* CI runs E2E tests under Xvfb
## [0.7.60] – 2025-07-24
### Fixed
* correct Electron main script path for e2e test; pass sandbox flags
## [0.7.59] – 2025-07-24
### Fixed
* e2e wizard test builds bundle and launches explicit main script

## [0.7.58] – 2025-07-23
### Fixed
* stable wizard start smoke test in CI

## [0.7.57] – 2025-07-22
### Added
* Playwright e2e test ensures wizard hidden on launch

## [0.7.56] – 2025-07-17
### Added
* Playwright smoke test ensures wizard stays closed on launch

## [0.7.55] – 2025-07-21
### Fixed
* wizard hidden on startup; open only via button

## [0.7.53] – 2025-07-20
### Fixed
* wizard only opens via "Neue Beauftragung" button
* modal closes via X, Abbrechen and Kostenpflichtig buttons

## [0.7.52] – 2025-07-19
### Added
* documentation updated (README, help, backlog)
## [0.7.51] – 2025-07-18
### Fixed
* wizard no longer autostarts; submit closes wizard
* edit modal closes when wizard opens
* aligned radio rows
## [0.7.50] – 2025-07-18
### Fixed
* wizard only opens via buttons; profile edit modal uses helper
* profile tiles wrap in flex row
## [0.7.49] – 2025-07-18
### Fixed
* wizard opens only via button; test helper for opening during tests
## [0.7.48] – 2025-07-18
### Fixed
* wizard modal no longer auto-opens and layout polished
## [0.7.47] – 2025-07-18
### Fixed
* finalize wizard: closeWizard handler and aligned radio layout
## [0.7.46] – 2025-07-18
### Fixed
* Wizard UX polish: proper close, minimal required fields, summary page
## [0.7.45] – 2025-07-18
### Added
* add full 5-step wizard click-dummy incl. UI validation
## [0.7.44] – 2025-07-18
### Added
* add click-dummy wizard modal; does not affect existing views
## [0.7.43] – 2025-07-18
### Added
* add mock contract/finance/tickets to Steckbrief + editable fields (non-persist)
## [0.7.41] – 2025-07-17
### Fixed
* fix empty views after ID rename.
## [0.7.40] – 2025-07-17
### Fixed
* fix: align DOM IDs after tab rename (table renders).
## [0.8.1] – 2025-07-17
### Fixed
* Tab switching keeps other views visible and profile dropdown selects partners.

## [0.8.0] – 2025-07-16
### Added
* New "Steckbrief" tab showing a basic 360° partner view.

## [0.7.38] – 2025-07-15
### Fixed
* File-input resets so the same CSV can be selected multiple times.
* Menu “CSV laden …” opens native dialog again and loads file.
## [0.7.39] – 2025-07-16
### Added
* Enriched demo CSV with partner fields for Steckbrief mock.
## [0.7.37] – 2025-07-15
### Added
* Full help.html with user guide & changelog integration.
### Fixed
* Table view no longer hides all columns when hiddenColumns persisted from earlier runs.
## [0.7.36] – 2025-07-15
### Fixed
* Packaged about/help HTML and demo CSV; windows now render, demo-button fills table.
## [0.7.35] - 2025-07-15
### Fixed
* Guarded module-export in preload (no sandbox crash).
* Added index.html + renderer bundle to package; UI now renders.
## [0.7.34] - 2025-07-15
### Fixed
* Included src/**/* and parser.js in Electron package; app no longer crashes on launch.
## [0.7.33] - 2025-07-15
### Fixed
* afterPack hook now accepts any archive path that ends with preload.js.
## [0.7.32] - 2025-07-15
### Fixed
* Switched to @electron/asar; CI install no longer fails on missing asar@3.2.5.
## [0.7.31] - 2025-07-22
### Changed
* Preload-integrity check now runs as afterPack hook; no more 7-Zip in CI.
## v0.7.30 - fix: CLI outputs newline for parse7zListing
## v0.7.29 - fix: parse portable listing with node helper
## v0.7.28 - chore: remove build.ci.json and update portable checks
## v0.7.27 - fix: parse 7z listing for app.asar
## v0.7.26 - fix: robust preload check for portable build
## v0.7.25 - fix: stable preload verification in portable build
## v0.7.24 - fix: verify preload with two-step portable extraction
## v0.7.23 - fix: correct PowerShell asar verify command
## v0.7.22 - fix: portable build verifies single ASAR path
## v0.7.21 - fix: correct build config JSON
## v0.7.20 - fix: run build step before asar verification
## v0.7.19 - fix: reliable portable ASAR extraction
## v0.7.18 - fix: ensure dist dir for icon build
## v0.7.17 - fix: portable extraction for asar verification
## v0.7.16 - fix: portable preload verification
## v0.7.15 - fix: verify preload inside asar
## v0.7.14 - chore: auto merge workflow
## v0.7.13 - fix: align bundle paths
## v0.7.12 - unify preload path & safer CI
## v0.7.11 - fix: unify preload path for packaging
## v0.7.10 - fix: verify asar before portable build
## v0.7.9 - fix: robust preload check using bash
## v0.7.8 - fix: preload verification in win-package job
## v0.7.7 - fix: test stability and packaging paths
## v0.7.6 – fix: package root parser module
## v0.7.5 – fix: package parser module
## v0.7.4 – fix: workflow preload check
## v0.7.3 – fix: icon generation via sharp
## v0.7.2 – fix: packaging main.js, preload path, demo-data, multi-csv, inline-edit save
## v0.7.1 – alerts & inline edit fixed
## v0.6.0 - KPI Alert UI makeover
* threshold config for KPIs with optional mail sending
* new modal interface and overview
## v0.5.18 - KPI Alerts UI done
* gear icon and modal configuration
## v0.5.17 - build config cleanup
* remove deprecated signing fields

## v0.5.16 - test stability fix
* dataStore tests use await import
## v0.5.15 - disable Windows signing
* electron-builder skips code signing
## v0.5.14 - drag & drop renders table
* drop handler parses CSV and renders UI
* Windows build config includes signing fields
## v0.5.13 - chart worker bundled
* Chart.js bundled into renderer and exposed globally
* worker code loaded via Blob URL
## v0.5.12 - CSV import bugfix
* file input and drag-drop parse CSV in renderer
## v0.5.11 - preload mitt bundled
* mitt included in preload bundle

## v0.5.10 - preload externals fix
* preload bundle marks node built-ins and mitt as external
* renderer imports libs directly
## v0.5.9 - preload bundle fix
* preload bundled with external libs
* renderer emits csv:loaded on drop
## v0.5.8 - drag&drop bugfix
* preload uses no fs module
* drag&drop handler unified

## v0.5.7 - preload fix
* bundling disabled; file copied
* backlog updated

## v0.5.6 - drag & drop stable
* Preload copied instead of bundled
* Drag & drop handler registered in renderer
* Workflow job renamed to build-win

## v0.5.5 - CSV drag&drop handler
* Drag & drop reads file via FileReader
* Progress text shown while parsing

## v0.5.4 - Windows packaging only
* CI job renamed to build-win
* Packaging runs on windows-latest only

## v0.5.3 - preload build cleanup
* preload bundled via esbuild
* CI verifies dist/preload.js
* dist ignored except version.json

## v0.5.2 - preload copy + drag drop
* libs exposed reliably
* renderer waits for api
* CSV drag & drop with progress

## v0.5.1 – Preload stabilisiert; Renderer-Bridge repariert; UI reagiert wieder

## v0.5.0 - 2025-06-28
* refactor preload boundary; libs move to renderer
* esbuild outputs renderer.bundle.js.map
* tests and docs updated
* bump version to 0.5.0
## v0.4.1 - 2025-06-27
* fix duplicate esbuild entry in package.json
* bump version to 0.4.1
* preload script switched back to CommonJS

## v0.4.0 - 2025-07-15
* preload converted to ESM and loads optional libs dynamically
* renderer bundle minified, chart.js tree-shaken
* UI hides CSV features and charts when libs missing

## v0.3.4 - 2025-07-15
* runtime libs initialized in preload and exposed before renderer
* mitt added to production deps
* dist/ included in release build

## v0.3.3 - 2025-07-15
* renderer bundled via esbuild → `dist/renderer.bundle.js`
* index.html and tests load the bundle
* CI builds bundle before tests
## v0.3.2 - 2025-07-15
* preload exposes runtime libs via `window.api.libs`

## v0.3.1 - 2025-07-15
* preload requires mitt synchronously and renderer uses provided bus

## v0.3.0 - 2025-07-15
* preload injects version via IPC and UI reads from `window.api.version`
## v0.2.2 - 2025-07-14
* bundle script now writes dist/version.json on postversion
## v0.2.1 - 2025-07-14
* added bundle placeholder script and CI step
## v0.1.22 - 2025-07-13
* dynamic mitt import in preload
## v0.1.21 - 2025-07-12
* packaging path cleanup for preload bundling
## v0.1.20 - 2025-07-11
* preload exposes get-version helper and injects version into docs at runtime
## v0.1.19 - 2025-07-10
* moved preload to project root and adjusted build config
## v0.1.18 - 2025-07-10
* fixed preload libs path and event bus

## v0.1.17 - 2025-06-26
* disabled smoke test in CI pipeline

## v0.1.16 - 2025-06-26
* main process emits `app-loaded` IPC for smoke tests

## v0.1.15 - 2025-07-09
* preload sends `e2e-ready` IPC for deterministic smoke test

## v0.1.14 - 2025-07-08
* deterministic smoke via e2e-ready handshake
* libs moved to preload (no bare imports)

## v0.2.0 - 2025-06-26
* dependency modularisation via NPM
* smoke test uses IPC handshake
* removed bundled libs
## v0.1.13 - 2025-07-07
* Silenced preload logs, smoke test now waits for DOM ready marker

## v0.1.12 - 2025-07-06
* Silenced preload logs, stabilised smoke test

## v0.1.11 - 2025-07-06
* Fixed Smoke-Test & CI-duplication, unified BACKLOG, updated rules


## v0.1.10 – 2025-07-05
* Fixed: preload mitt resolution; CSV column alignment

## v0.1.9 – 2025-07-04
* Fix: eventBus relative import (mitt)
* Fix: Chart render guard for empty data
* Refactor: Context-Isolation + ESM Renderer
* Docs: BACKLOG schema simplified, Top-20 Roadmap added

## v0.1.7
- offline chart rendering fallback
- working CSV/XLSX export
- menu cleanup
- KPI layout wrap fix

## v0.1.6
- KPI flex layout fix
- status chart buckets fix
- card view refresh after import
- info dialog shows app version


## v0.1.5
- revert renderer to CommonJS and enable nodeIntegration
- fixed demo data initialization and CSV reload

## v0.1.4
- fix CSV reload bug and reset headers

## v0.1.3
- horizontal stacked bar chart
- KPI tiles stay in one row
- CSV reload clears demo data correctly
- external links open in default browser
