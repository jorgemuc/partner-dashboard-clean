const { contextBridge } = require('electron');
const { readFileSync } = require('fs');
const { join } = require('path');
const mitt = require('mitt');

let version = 'dev';
try {
  const data = readFileSync(join(__dirname, '../dist/version.json'), 'utf8');
  version = JSON.parse(data).version;
} catch (e) {
  console.error('[pl-err] failed to load version', e);
}

const bus = mitt();
const libs = {};

contextBridge.exposeInMainWorld('api', {
  bus,
  libs,
  version: () => version
});
