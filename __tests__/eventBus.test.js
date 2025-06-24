let bus;
beforeAll(async () => {
  bus = (await import('../src/renderer/eventBus.js')).default;
});

describe('event bus', () => {
  test('emit calls handler registered via on', () => {
    const handler = jest.fn();
    bus.on('ping', handler);
    bus.emit('ping', 'hi');
    expect(handler).toHaveBeenCalledWith('hi');
    bus.off('ping', handler);
  });

  test('once handler fires only once', () => {
    const handler = jest.fn();
    bus.once('pong', handler);
    bus.emit('pong', 1);
    bus.emit('pong', 2);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('off removes handler', () => {
    const handler = jest.fn();
    bus.on('beep', handler);
    bus.off('beep', handler);
    bus.emit('beep');
    expect(handler).not.toHaveBeenCalled();
  });
});
