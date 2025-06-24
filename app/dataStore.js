import {publish} from './eventBus.js';
let partnerData = [];
export const getData = () => partnerData;
export function setData(arr){
  partnerData = Array.isArray(arr) ? arr : [];
  publish('dataUpdated');
}
