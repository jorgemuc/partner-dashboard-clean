const { execFileSync } = require('node:child_process');
const { existsSync, rmSync } = require('node:fs');
const { PRELOAD_PATH_DIST, BUILD_DIR } = require('../src/constants/paths.js');

test('preload bundle loads', () => {
  rmSync(BUILD_DIR, { recursive: true, force: true });
  execFileSync('node', ['scripts/bundle-preload.js']);
  expect(existsSync(PRELOAD_PATH_DIST)).toBe(true);
  expect(() =>
    execFileSync('node', ['-e', `require("./${PRELOAD_PATH_DIST}")`])
  ).not.toThrow();
});

