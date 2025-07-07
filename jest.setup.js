// Global test setup
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = HTMLCanvasElement.prototype.getContext || (() => ({}));
}
if (typeof window !== 'undefined' && !window.Chart) {
  window.Chart = function () {
    return { destroy() {} };
  };
}
