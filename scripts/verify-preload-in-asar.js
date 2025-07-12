#!/usr/bin/env node
const { listPackage } = require('@electron/asar');

const asar = process.argv[2];
if (!asar) { console.error('asar path required'); process.exit(1); }

try {
  // ▸ Einträge normalisieren: Backslash → Slash, führenden Slash kappen
  const normalised = listPackage(asar).map(e =>
    e.replace(/^[\\/]/, '').replace(/\\/g, '/')
  );

  if (normalised.includes('dist/preload.js')) process.exit(0);
  console.error('dist/preload.js not found in ASAR');
} catch (e) {
  console.error(e.message);
}
process.exit(1);

