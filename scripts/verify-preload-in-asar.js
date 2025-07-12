#!/usr/bin/env node
const { listPackage } = require('@electron/asar');
const asar = process.argv[2];
if (!asar) { console.error('asar path required'); process.exit(1); }
try {
  const entries = listPackage(asar);
  if (entries.includes('dist/preload.js')) process.exit(0);
} catch (e) { console.error(e.message); }
process.exit(1);

