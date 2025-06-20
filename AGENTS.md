# AGENT INSTRUCTIONS

## Scope
This file applies to the entire repository.

## Programmatic Checks
No automated tests are currently defined. Before committing, ensure that `BACKLOG.csv` is kept in CSV format.

## Contribution Guidelines
- Record progress for each coding session in `BACKLOG.csv` by adding a new column per session or by updating status fields. Keep the original epics and tasks intact.
- Write commits in English.

## Development Guidelines
- Follow a simple TDD workflow. For every new feature first add failing test cases and only mark them as passing once the feature is implemented.
- Provide unit tests for all newly created functionality.
- Keep the Electron wrapper minimal: a bare `main.js` without a preload script that simply loads `index.html`; `package.json` should only contain the necessary fields and scripts.
