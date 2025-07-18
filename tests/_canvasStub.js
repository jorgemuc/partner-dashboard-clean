// polyfill: Chart.js needs a 2d context in JSDOM
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
