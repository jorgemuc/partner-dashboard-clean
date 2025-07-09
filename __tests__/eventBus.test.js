jest.mock('electron', () => ({__esModule: true,
  contextBridge: { exposeInMainWorld: jest.fn() },
  ipcRenderer: { invoke: jest.fn(() => Promise.resolve('0.0.0')), on: jest.fn() },
  default: {}
}));
const { contextBridge } = require('electron');
let bus;
beforeAll(async () => {
  await import('../src/preload/index.js');
  await new Promise(r => setImmediate(r));
  const call = contextBridge.exposeInMainWorld.mock.calls.find(c => c[0] === 'api');
  bus = call ? call[1].bus : undefined;
});

describe('event bus', () => {
  test('emit calls handler registered via on', () => {
    const handler = jest.fn();
    bus.on('ping', handler);
    bus.emit('ping', 'hi');
    expect(handler).toHaveBeenCalledWith('hi');
    bus.off('ping', handler);
  });

  test('off removes handler', () => {
    const handler = jest.fn();
    bus.on('beep', handler);
    bus.off('beep', handler);
    bus.emit('beep');
    expect(handler).not.toHaveBeenCalled();
  });
});
