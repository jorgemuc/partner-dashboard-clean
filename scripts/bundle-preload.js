#!/usr/bin/env node
const esbuild = require('esbuild');
const fs = require('fs');
fs.mkdirSync('dist', { recursive: true });
esbuild.build({
  entryPoints: ['src/preload/index.cjs'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: ['node18'],
  outfile: 'dist/preload.js',
  minify: false,
  logLevel: 'info'
}).catch(() => process.exit(1));
