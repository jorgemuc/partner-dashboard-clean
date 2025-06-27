const { test } = require('@jest/globals');
const pkg = require('../package.json');

test('windows build config has no signing fields', () => {
  expect(pkg.build.win).not.toHaveProperty('sign');
  expect(pkg.build.win).not.toHaveProperty('certificateSubjectName');
});
