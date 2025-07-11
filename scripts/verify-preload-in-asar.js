#!/usr/bin/env node
const { listPackage } = require('@electron/asar');
const path = require('path');
const { PRELOAD_PATH_DIST } = require('../src/constants/paths.js');

const asarPath = process.argv[2];
if (!asarPath) {
  console.error('asar path required');
  process.exit(1);
}

try {
  const files = listPackage(asarPath);
  const found = files.some((f) => f.replace(/^\//, '') === PRELOAD_PATH_DIST);
  if (found) process.exit(0);
} catch (err) {
  console.error(err.message);
}
process.exit(1);

