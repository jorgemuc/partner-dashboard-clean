const { execFileSync } = require('node:child_process');

module.exports = async () => {
  require('./_canvasStub.js');
  execFileSync('npm', ['run', 'bundle'], { stdio: 'inherit' });
  execFileSync('npm', ['run', 'bundle:preload'], { stdio: 'inherit' });
};
