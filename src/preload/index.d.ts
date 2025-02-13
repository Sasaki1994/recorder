import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Config {
    mainWindow: {
      width: number
      height: number
    }
    sideWidth: number
  }

  interface MenuProps {
    delayTime: number
  }

  interface Window {
    electron: ElectronAPI
    api: {
      openTimeshift: (init?: string) => Promise<void>
      switchTimeshift: () => Promise<void>
      sendMenuProps: (props: MenuProps) => Promise<void>
      receiveMenuProps: (
        listener: (event: Electron.IpcRendererEvent, props: MenuProps) => void
      ) => Electron.IpcRenderer
      recieveConfig: (
        listener: (event: Electron.IpcRendererEvent, config: Config) => void
      ) => Electron.IpcRenderer
      recieveTimeshiftState: (
        listener: (event: Electron.IpcRendererEvent, state: string) => void
      ) => Electron.IpcRenderer
    }
  }
}
