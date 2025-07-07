const { spawn } = require('node:child_process');
const { readdirSync } = require('node:fs');
const path = require('node:path');

test('portable exe launches', done => {
  if (process.platform !== 'win32') return done();
  const exe = readdirSync('dist').find(f => f.endsWith('.exe'));
  if (!exe) return done();
  const child = spawn(path.join('dist', exe), { stdio:['ignore','ignore','ignore','ipc'] });
  child.on('message', msg => {
    if (msg === 'app-loaded') {
      child.kill();
      done();
    }
  });
  child.on('error', err => { child.kill(); done(err); });
  setTimeout(() => { child.kill(); done(new Error('timeout')); }, 10000);
});
