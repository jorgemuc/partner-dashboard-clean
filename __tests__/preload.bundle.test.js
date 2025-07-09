const { execFileSync } = require('node:child_process');
const { existsSync, rmSync } = require('node:fs');
const { PRELOAD_PATH_DIST, BUILD_DIR } = require('../src/constants/paths.js');

test('preload bundle exists', () => {
  rmSync(BUILD_DIR, { recursive: true, force: true });
  execFileSync('node', ['scripts/bundle.js']);
  expect(existsSync(PRELOAD_PATH_DIST)).toBe(true);
});

