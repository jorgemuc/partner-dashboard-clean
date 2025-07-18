#!/usr/bin/env node
const { spawn } = require('child_process');
const electron = process.env.ELECTRON || require('electron');

function run(){
  const child = spawn(electron, ['.'], {
    stdio: ['ignore','inherit','inherit','ipc'],
    env: { ...process.env, ELECTRON_ENABLE_LOGGING:'1' }
  });
  const timer = setTimeout(() => {
    child.kill('SIGTERM');
    process.exit(1);
  }, 10_000);
  child.on('message', msg => {
    if(msg === 'app-loaded'){
      clearTimeout(timer);
      child.kill('SIGTERM');
      process.exit(0);
    }
  });
  child.stdout.on('data', d => {
    if(d.toString().includes('app-loaded')){
      clearTimeout(timer);
      child.kill('SIGTERM');
      process.exit(0);
    }
  });
}

if(require.main === module) run();
module.exports = run;
