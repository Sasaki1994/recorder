import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  openTimeshift: (init?: string): Promise<void> => ipcRenderer.invoke('open-timeshift', init),
  switchTimeshift: (): Promise<void> => ipcRenderer.invoke('switch-timeshift'),
  recieveConfig: (listener): Electron.IpcRenderer => ipcRenderer.on('config', listener),
  recieveTimeshiftState: (listener): Electron.IpcRenderer =>
    ipcRenderer.on('timeshift-state', listener)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
