module.exports = async () => {
  // provide a dummy canvas element for chart.js
  class DummyCanvas {}
  // Node globals
  global.HTMLCanvasElement = DummyCanvas;
  // provide a minimal window object if missing
  if (!global.window) global.window = {};
  global.window.HTMLCanvasElement = DummyCanvas;
  // no return value needed
};
