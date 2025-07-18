require('@testing-library/jest-dom');
// polyfill: Chart.js needs a 2d context in JSDOM/Node
if (typeof HTMLCanvasElement === 'undefined') {
  global.HTMLCanvasElement = function () {};
}
if (!HTMLCanvasElement.prototype.getContext) {
  HTMLCanvasElement.prototype.getContext = () => ({
    fillRect: ()=>{}, clearRect: ()=>{}, getContext: ()=>{},
    putImageData: ()=>{}, createImageData: ()=>[], setTransform: ()=>{},
    drawImage: ()=>{}, save: ()=>{}, fillText: ()=>{}, restore: ()=>{},
    beginPath: ()=>{}, moveTo: ()=>{}, lineTo: ()=>{}, closePath: ()=>{},
    stroke: ()=>{}, translate: ()=>{}, scale: ()=>{}, rotate: ()=>{},
    arc: ()=>{}, fill: ()=>{}, measureText: ()=>({ width: 0 }),
    transform: ()=>{}, rect: ()=>{}, clip: ()=>{}
  });
}
afterAll(() => { if(global.window?.close) global.window.close(); });
