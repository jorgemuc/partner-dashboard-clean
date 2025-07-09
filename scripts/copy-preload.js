import fs from 'fs';
import path from 'path';
fs.copyFileSync(
  'build/unpacked/preload.js',
  'resources/preload.js'
);
