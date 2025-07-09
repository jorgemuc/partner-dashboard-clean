#!/usr/bin/env node
const { listPackage } = require('@electron/asar');
const asarPath = process.argv[2];
if (!asarPath) {
  console.error('asar path required');
  process.exit(1);
}
try {
  const entries = listPackage(asarPath);
  if (entries.includes('dist/preload.js')) process.exit(0);
} catch (err) {
  console.error(err.message);
}
process.exit(1);

