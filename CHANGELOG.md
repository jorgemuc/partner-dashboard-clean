# Changelog
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
