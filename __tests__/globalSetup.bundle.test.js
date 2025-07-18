const { execFileSync } = require('node:child_process');
jest.mock('node:child_process', () => ({ execFileSync: jest.fn() }));

const setup = require('../tests/globalSetup.js');

test('globalSetup bundles before smoke and stubs canvas', async () => {
  await setup();
  expect(execFileSync).toHaveBeenCalledWith(
    'npm',
    ['run', 'bundle:all'],
    expect.any(Object)
  );
  expect(global.HTMLCanvasElement).toBeDefined();
});
