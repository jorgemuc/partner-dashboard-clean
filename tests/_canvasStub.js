// Global canvas stub for Playwright smoke tests
class DummyCanvas {}
if (!global.window) global.window = {};
global.HTMLCanvasElement = DummyCanvas;
global.window.HTMLCanvasElement = DummyCanvas;
