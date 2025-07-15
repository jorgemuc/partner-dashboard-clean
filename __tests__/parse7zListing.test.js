const { findAppAsarPath } = require('../scripts/parse7zListing.js');

test('detects direct app.asar path', () => {
  const out = `2024-01-01 00:00:00 .....      0      0  resources\\app.asar`;
  expect(findAppAsarPath(out)).toBe('resources\\app.asar');
});

test('detects nested archive path', () => {
  const out = `2024-01-01 00:00:00 .....      0      0  app-64.7z\\resources\\app.asar`;
  expect(findAppAsarPath(out)).toBe('app-64.7z\\resources\\app.asar');
});

test('returns null for missing entry', () => {
  expect(findAppAsarPath('no asar here')).toBeNull();
});
