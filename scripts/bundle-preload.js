#!/usr/bin/env node
const fs = require('fs');
fs.mkdirSync('dist', { recursive: true });
fs.copyFileSync('src/preload/index.cjs', 'dist/preload.js');
