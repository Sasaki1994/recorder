import { app, shell, BrowserWindow, session, ipcMain, desktopCapturer } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

const config = {
  mainWindow: {
    width: 1280,
    height: 720
  },
  sideWidth: 80
}

function createWindow(): void {
  const mainWindow = createMainWindow()
  setupTimeshiftWindow(mainWindow)
}

function createMainWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: config.mainWindow.width,
    height: config.mainWindow.height,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('config', config)
  })

  mainWindow.on('close', () => {
    // メインウィンドウが閉じられたときに関連するウィンドウも閉じる
    app.quit()
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  session.defaultSession.setDisplayMediaRequestHandler((_request, callback) => {
    desktopCapturer.getSources({ types: ['window'] }).then((sources) => {
      sources.forEach((source) => {
        if (source.name === mainWindow.getTitle()) {
          callback({ video: source, audio: 'loopback' })
        }
      })
    })
  })

  return mainWindow
}

let timeshiftWindowId: number | null = null

function setupTimeshiftWindow(mainWindow: BrowserWindow): void {
  ipcMain.handle('open-timeshift', (_event, init) => {
    if (timeshiftWindowId) return
    const subWindow = createTimeshiftWindow(mainWindow, init)
    timeshiftWindowId = subWindow.id
    subWindow.on('closed', () => {
      timeshiftWindowId = null
      mainWindow.webContents.send('timeshift-state', 'hidden')
    })
    if (init === 'visible') {
      mainWindow.webContents.send('timeshift-state', 'visible')
    } else {
      mainWindow.webContents.send('timeshift-state', 'hidden')
    }
  })

  ipcMain.handle('switch-timeshift', () => {
    if (!timeshiftWindowId) return
    const subWindow = BrowserWindow.fromId(timeshiftWindowId)
    if (subWindow) {
      if (subWindow.isVisible()) {
        subWindow.hide()
        mainWindow.webContents.send('timeshift-state', 'hidden')
      } else {
        subWindow.show()
        mainWindow.webContents.send('timeshift-state', 'visible')
      }
    }
  })
}

function createTimeshiftWindow(mainWindow: BrowserWindow, init: string): BrowserWindow {
  const subWindow = new BrowserWindow({
    title: 'Timeshift Window',
    alwaysOnTop: true,
    titleBarStyle: 'hiddenInset',
    frame: false,
    thickFrame: false,
    hasShadow: false,
    resizable: false,
    minimizable: false,
    maximizable: false,
    focusable: false,
    show: init === 'visible' ? true : false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      backgroundThrottling: false
    },
    width: mainWindow.getSize()[0] - config.sideWidth,
    height: mainWindow.getSize()[1],
    x: mainWindow.getPosition()[0] + config.sideWidth,
    y: mainWindow.getPosition()[1]
  })

  subWindow.webContents.on('did-finish-load', () => {
    subWindow.webContents.send('config', config)
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    subWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/timeshift.html`)
  } else {
    subWindow.loadFile(join(__dirname, '../renderer/timeshift.html'))
  }

  return subWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
