'use strict'

const electron = require('electron')
const path = require('path')
const remote = electron.remote
const app = electron.app
const BrowserWindow = electron.BrowserWindow
var ipcMain = electron.ipcMain;
var icpRenderer = electron.ipcRenderer

let mainWindow
let config = {}

if (process.env.NODE_ENV === 'development') {
  config = require('../../../config')
  config.url = `http://localhost:${config.port}`
} else {
  config.devtron = false
  config.url = `file://${__dirname}/dist/index.html`
}

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
      width: 512,
      height: 512,
      transparent: true,
      frame: false,
      resizable: false,
      skipTaskbar: true,
      hasShadow: false,
      alwaysOnTop: true,
      webSecurity: false
  });
  mainWindow.loadURL(config.url)
 // mainWindow.setIgnoreMouseEvents(true);

  if (process.env.NODE_ENV === 'development') {
    // BrowserWindow.addDevToolsExtension(path.join(__dirname, '../node_modules/devtron'))

    // let installExtension = require('electron-devtools-installer')
    
    // installExtension.default(installExtension.VUEJS_DEVTOOLS)
    //   .then((name) => mainWindow.webContents.openDevTools())
    //   .catch((err) => console.log('An error occurred: ', err))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('window_drag', function (event, arg) {
    if (mainWindow){
         var bounds = mainWindow.getBounds();
         mainWindow.setBounds({
            x : bounds.x + arg.x,
            y : bounds.y + arg.y,
            width : bounds.width,
            height : bounds.height
         });
    }
    event.returnValue = '';
});

