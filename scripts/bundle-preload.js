#!/usr/bin/env node
const esbuild = require('esbuild');
const fs = require('fs');
const { version } = require('../package.json');

fs.mkdirSync('dist', { recursive: true });
const entry = fs.existsSync('src/preload/index.cjs') ? 'src/preload/index.cjs' : 'src/preload/index.js';

(async () => {
  await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    platform: 'browser',
    format: 'iife',
    target: 'es2020',
    define: {
      'process.env.APP_VERSION': JSON.stringify(version),
      APP_VERSION: JSON.stringify(version)
    },
    outfile: 'dist/preload.js',
    minify: true,
    logLevel: 'info'
  });
})();
