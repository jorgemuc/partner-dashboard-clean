# AGENT INSTRUCTIONS

## Scope
This file applies to the entire repository.

## Programmatic Checks
Run `npm test` and `npm run smoke` before committing. Verify that `BACKLOG.csv` keeps its CSV structure (7 columns).

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

### Logging Discipline
Preload produces no console output on success. All fatal errors must start with `[pl-err]` so Smoke-Test can whitelist benign logs.

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
- ⚠️ **Windows-only builds:** We target only `windows-latest` for packaging; Ubuntu builds run lint/tests only (no packaging).

## Pull-Request Checklist
- `npm test` and `npm run smoke` are green.
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
  bus: MittEmitter,
  libs: { Papa?: any, XLSX?: any, Chart?: any },
  version: () => string
}
```
