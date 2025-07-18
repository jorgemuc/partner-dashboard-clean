const { execFileSync } = require('node:child_process');
const { existsSync, readFileSync, rmSync } = require('node:fs');
const { PRELOAD_PATH_DIST, BUILD_DIR } = require('../src/constants/paths.js');
const { version } = require('../package.json');

test('bundle writes version file and renderer bundle', () => {
  rmSync(BUILD_DIR, { recursive: true, force: true });
  execFileSync('npm', ['run', 'bundle:all']);
  expect(existsSync(`${BUILD_DIR}/version.json`)).toBe(true);
  expect(existsSync(PRELOAD_PATH_DIST)).toBe(true);
  expect(existsSync(`${BUILD_DIR}/renderer.bundle.js`)).toBe(true);
  expect(existsSync(`${BUILD_DIR}/renderer.bundle.js.map`)).toBe(true);
  const data = JSON.parse(readFileSync(`${BUILD_DIR}/version.json`, 'utf8'));
  expect(data.version).toBe(version);
});
