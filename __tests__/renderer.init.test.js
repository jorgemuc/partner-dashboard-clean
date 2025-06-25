let bus;
jest.mock('../chartWorker.js', () => ({
  default: jest.fn()
}));

test('renderer bootstraps without errors', async () => {
  global.window = { electronAPI: { getVersion: jest.fn(() => Promise.resolve('1.0.0')) } };
  bus = (await import('../src/renderer/eventBus.js')).default;
  expect(bus).toBeDefined();
});
