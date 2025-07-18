import { _electron as electron } from '@playwright/test';
import path from 'node:path';

export async function launchApp(opts = {}) {
  return electron.launch({
    args: [path.join(__dirname, '../../main.js'), '--no-sandbox'],
    env: { ELECTRON_DISABLE_SANDBOX: '1', DISPLAY: process.env.DISPLAY || ':99', ...opts.env }
  });
}
