const path = require('node:path');
const log = require('electron-log');

const level = process.env.LOG_LEVEL || (process.env.DEBUG ? 'debug' : 'info');
log.transports.file.level = level;
log.transports.console.level = level;
log.transports.file.resolvePathFn = () => path.join(__dirname, '..', 'logs/main.log');

module.exports = {
  level,
  error: (...args) => log.error(...args),
  warn: (...args) => log.warn(...args),
  info: (...args) => log.info(...args),
  debug: (...args) => log.debug(...args)
};
