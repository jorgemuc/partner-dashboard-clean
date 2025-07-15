const { execFileSync } = require('child_process');
const path = require('path');

const script = path.join('scripts', 'parse7zListing.js');

test('cli outputs path when found', () => {
  const listing = '2024-01-01 ..... resources\\app.asar';
  const out = execFileSync('node', [script], { input: listing }).toString().trim();
  expect(out).toBe('resources\\app.asar');
});

test('cli prints nothing when missing', () => {
  const out = execFileSync('node', [script], { input: 'no asar' }).toString();
  expect(out).toBe('');
});
