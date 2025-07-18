const { execFileSync } = require('node:child_process');

module.exports = async () => {
  execFileSync('npm', ['run', 'bundle'], { stdio: 'inherit' });
};
