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

## CI Rules
The workflow uses concurrency to prevent duplicate runs and only triggers on pushes or pull requests targeting `main`.

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
