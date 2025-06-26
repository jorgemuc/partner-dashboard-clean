jest.mock('electron', () => ({
  contextBridge: { exposeInMainWorld: jest.fn() },
  ipcRenderer: { invoke: jest.fn(), on: jest.fn() }
}));
const { contextBridge } = require('electron');
let bus;
beforeAll(async () => {
  await import('../src/preload.js');
  const call = contextBridge.exposeInMainWorld.mock.calls.find(c => c[0] === 'bus');
  bus = call ? call[1] : undefined;
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

  test('falls back to dummy bus when mitt missing', async () => {
    jest.resetModules();
    jest.doMock('mitt', () => {
      throw new Error('missing');
    });
    await import('../src/preload.js');
    const reversed = [...contextBridge.exposeInMainWorld.mock.calls].reverse();
    const fallbackCall = reversed.find(c => c[0] === 'bus');
    const fallback = fallbackCall ? fallbackCall[1] : undefined;
    expect(() => fallback.emit('x')).not.toThrow();
    jest.dontMock('mitt');
  });
});
