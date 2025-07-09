#!/usr/bin/env node
const { listPackage } = require('@electron/asar');
const asarPath = process.argv[2];
if (!asarPath) {
  console.error('Usage: node verify-preload-in-asar.js <app.asar>');
  process.exit(1);
}
(async () => {
  try {
    const files = await listPackage(asarPath);
    if (files.includes('dist/preload.js')) {
      process.exit(0);
    }
    console.error('dist/preload.js missing');
    process.exit(1);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
