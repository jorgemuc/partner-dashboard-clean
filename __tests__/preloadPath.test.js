const { existsSync } = require('node:fs');
const { PRELOAD_PATH_DIST } = require('../src/constants/paths.js');

test('bundled preload file is generated', () => {
  expect(existsSync(PRELOAD_PATH_DIST)).toBe(true);
});
