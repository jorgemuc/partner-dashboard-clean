import { contextBridge } from 'electron';
import mitt from 'mitt';

/** lightweight global event bus – safe via contextBridge */
contextBridge.exposeInMainWorld('api', { bus: mitt() });
