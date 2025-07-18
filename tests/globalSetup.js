const { execFileSync } = require('node:child_process');

module.exports = async () => {
  require('./_canvasStub.js');
  execFileSync('npm', ['run', 'bundle:all'], { stdio: 'inherit' });
};
