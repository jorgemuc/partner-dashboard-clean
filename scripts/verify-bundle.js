// --- Config ---------------------------------------------------------------
const fs = require('fs');

const THRESHOLDS = {
  'build/unpacked/renderer.bundle.js': 50 * 1024,
  'dist/preload.js': 1 * 1024,
  'dist/version.json': 10
};

const SUCCESS_MARKER = '[bundle:success]';
const DEBUG = /^(debug|trace)$/i.test(process.env.LOG_LEVEL || '');

// --- Helpers --------------------------------------------------------------
function debug(...a) { if (DEBUG) console.log('[verify:debug]', ...a); }
function info(...a) { console.log('[verify]', ...a.join(' ')); }
function warn(code, msg, extra) {
  const suffix = extra ? ` ${JSON.stringify(extra)}` : '';
  console.log(`[verify:${code}] ${msg}${suffix}`);
}
function fail(reason, details = {}) {
  const payload = { status: 'fail', reason };
  if (details.file) payload.file = details.file;
  if (Object.keys(details).length) payload.details = details;
  console.error(JSON.stringify(payload));
  process.exit(1);
}

// --- Checks ---------------------------------------------------------------
function checkFile(file, minBytes) {
  if (!fs.existsSync(file)) fail('missing-artifact', { file });
  const size = fs.statSync(file).size;
  if (size < minBytes) fail('artifact-too-small', { file, size });
  return { size };
}

function readVersion() {
  const file = 'dist/version.json';
  if (!fs.existsSync(file)) fail('version-missing', { path: file });
  let raw = '';
  try { raw = fs.readFileSync(file, 'utf8'); } catch (e) {
    fail('version-parse-fail');
  }
  let json;
  try { json = JSON.parse(raw); } catch (_e) {
    fail('version-parse-fail');
  }
  if (json.version === undefined) fail('version-field-missing');
  if (!/^\d+\.\d+\.\d+$/.test(json.version)) fail('invalid-version', { version: json.version });
  return { version: json.version };
}

function checkSuccessMarker() {
  const logPath = process.env.BUNDLE_LOG_PATH;
  if (!logPath || !fs.existsSync(logPath)) {
    debug('no bundle log provided; skipping marker enforcement');
    return;
  }
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split(/\r?\n/);
  const found = lines.some(l => l.startsWith(SUCCESS_MARKER));
  if (!found) fail('missing-success-marker', { log: logPath });
  debug('found success marker in', logPath);
}

// --- Execution ------------------------------------------------------------
try {
  const renderer = checkFile('build/unpacked/renderer.bundle.js', THRESHOLDS['build/unpacked/renderer.bundle.js']);
  const preload = checkFile('dist/preload.js', THRESHOLDS['dist/preload.js']);
  const { version } = readVersion();
  checkSuccessMarker();
  info(`ok renderer:${renderer.size} preload:${preload.size} version:${version}`);
} catch (e) {
  fail('exception', { name: e.name, message: e.message });
}

