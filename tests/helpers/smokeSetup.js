const { _electron: electron } = require('@playwright/test');

module.exports.launchApp = async function launchApp(opts = {}) {
  return electron.launch({
    args: ['.', '--no-sandbox', '--enable-logging', '--v=1'],
    env: { ...process.env, ELECTRON_ENABLE_LOGGING: '1', LOG_LEVEL: 'debug', ...opts.env }
  });
};

module.exports.captureConsole = function captureConsole(page) {
  const logs = [];
  page.on('console', m => {
    const txt = m.text();
    logs.push(txt);
    console.log('[ui]', txt);
  });
  return logs;
};
