const { spawn } = require('child_process');
jest.mock('child_process');

const events = {};
const kill = jest.fn();
spawn.mockReturnValue({
  on: (ev, cb) => { events[ev] = cb; },
  stdout: { on: jest.fn() },
  kill
});

const exit = jest.spyOn(process, 'exit').mockImplementation(() => {});

const run = require('../scripts/cli-start');

test('exits when app-loaded message received', () => {
  run();
  events['message'] && events['message']('app-loaded');
  expect(kill).toHaveBeenCalled();
  expect(exit).toHaveBeenCalledWith(0);
});
