const fs = require('fs');
const path = require('path');

const LOG_LEVEL = process.env.LOG_LEVEL || '';
const DEBUG = /debug/.test(LOG_LEVEL);

function debug(...a) { if (DEBUG) console.log('[verify:debug]', ...a); }
function info(msg) { console.log('[verify]', msg); }
function warn(msg) { console.warn('[verify:warn]', msg); }
function fail(reason, details = {}) {
  console.log(JSON.stringify({ status: 'fail', reason, ...details }));
  process.exit(1);
}

function checkFile(file, minSize) {
  if (!fs.existsSync(file)) fail('missing-artifact', { file });
  const { size } = fs.statSync(file);
  if (size < minSize) fail('artifact-too-small', { file, size });
  return size;
}

const rendererPath = path.join('build', 'unpacked', 'renderer.bundle.js');
const preloadPath = path.join('dist', 'preload.js');
const versionPath = path.join('dist', 'version.json');
const SUCCESS_MARKER = '[bundle:success] renderer.bundle.js written';

let rendererSize;
let preloadSize;
let version;

try {
  rendererSize = checkFile(rendererPath, 50 * 1024);
  preloadSize = checkFile(preloadPath, 1 * 1024);
} catch (e) {
  // fail() already handled exit
  process.exit(1);
}

try {
  const data = fs.readFileSync(versionPath, 'utf8');
  const json = JSON.parse(data);
  version = json.version;
  if (!/^\d+\.\d+\.\d+$/.test(version)) fail('invalid-version', { version });
} catch (e) {
  fail('version-parse-fail');
}

function getLogPath() {
  if (process.env.BUNDLE_LOG_PATH && fs.existsSync(process.env.BUNDLE_LOG_PATH)) {
    return process.env.BUNDLE_LOG_PATH;
  }
  const alt = path.join('scripts', 'bundle.log');
  if (fs.existsSync(alt)) return alt;
  return null;
}

function checkSuccessMarker() {
  const logPath = getLogPath();
  if (!logPath) { warn('no bundle log, skipping success marker'); return; }
  debug('checking', logPath);
  const logContent = fs.readFileSync(logPath, 'utf8');
  if (!logContent.includes(SUCCESS_MARKER)) {
    fail('missing-success-marker', { log: logPath });
  }
}

checkSuccessMarker();

info(`ok renderer:${rendererSize}B preload:${preloadSize}B version:${version}`);

