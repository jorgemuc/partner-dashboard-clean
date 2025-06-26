#!/usr/bin/env node
// noop bundle – Iteration 1
const { version } = require('../package.json');
console.log(`[bundle] skip (v${version}) – real bundling comes in Iteration 2`);

// --- single-source version record -----------------------------------
const { mkdirSync, writeFileSync } = require('node:fs');
mkdirSync('dist', { recursive: true });
writeFileSync('dist/version.json',
  JSON.stringify({ version }, null, 2) + '\n');
console.log('[bundle] wrote dist/version.json');

process.exit(0);
