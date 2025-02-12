import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Config {
    mainWindow: {
      width: number
      height: number
    }
    sideWidth: number
  }

  interface Window {
    electron: ElectronAPI
    api: {
      openTimeshift: (init?: string) => Promise<void>
      switchTimeshift: () => Promise<void>
      recieveConfig: (
        listener: (event: Electron.IpcRendererEvent, config: Config) => void
      ) => Electron.IpcRenderer
      recieveTimeshiftState: (
        listener: (event: Electron.IpcRendererEvent, state: string) => void
      ) => Electron.IpcRenderer
    }
  }
}
