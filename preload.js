const { contextBridge } = require('electron');
const mitt = require('mitt');
contextBridge.exposeInMainWorld('api', { bus: mitt() });
