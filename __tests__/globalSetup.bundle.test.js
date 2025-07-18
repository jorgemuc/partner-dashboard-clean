const { execFileSync } = require('node:child_process');
jest.mock('node:child_process', () => ({ execFileSync: jest.fn() }));

const setup = require('../tests/globalSetup.js');

test('globalSetup bundles before smoke and stubs canvas', async () => {
  await setup();
  expect(execFileSync).toHaveBeenNthCalledWith(
    1,
    'npm',
    ['run', 'bundle'],
    expect.any(Object)
  );
  expect(execFileSync).toHaveBeenNthCalledWith(
    2,
    'npm',
    ['run', 'bundle:preload'],
    expect.any(Object)
  );
  expect(global.HTMLCanvasElement).toBeDefined();
});
