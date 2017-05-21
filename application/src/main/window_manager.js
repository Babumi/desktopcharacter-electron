'use strict'

const Electron = require('electron')
const IPCKeys = require('../common/constants')

module.exports = WindowManager;

function WindowManager(context) {
    this.Context = context
    this.WindowMap = new Map()

    context.ipc.on(IPCKeys.RequestCreateNewWindow, this.onRequestCreateNewWindow.bind(this))
    context.ipc.on(IPCKeys.RequestSendMessage, this.onRequestSendMessage.bind(this))
    context.ipc.on(IPCKeys.RequestGetWindowIDs, this.onRequestGetWindowIDs.bind(this))
}

WindowManager.prototype.reload = function() {
    const w = Electron.BrowserWindow.getFocusedWindow()
    if (w) 
    {
        w.reload()
    }
}

WindowManager.prototype.toggleDeveTools = function() {
    const w = Electron.BrowserWindow.getFocusedWindow()
    if (w) 
    {
        w.toggleDevTools()
    }
}

WindowManager.prototype.createWindow = function(desc) {
    const w = new Electron.BrowserWindow({
        width: desc.width,
        height: desc.height,
        transparent: desc.transparent,
        frame: desc.frame,
        resizable: desc.resizable,
        skipTaskbar: desc.skipTaskbar,
        hasShadow: desc.hasShadow,
        alwaysOnTop: desc.alwaysOnTop,
        webSecurity: desc.webSecurity,
    })

    const id = w.id

    w.on('closed', () => {
        // Unregister
        this.WindowMap.delete(id)
        this.notifyUpdateWindowIDs(id)
    })
    
    w.loadURL(this.createURL(id))
    this.WindowMap.set(id, w)

    return w
}

WindowManager.prototype.createURL = function(id) {
    return `http://localhost:4200` + '#' + id;
}

WindowManager.prototype.notifyUpdateWindowIDs = function(excludeID) {
    const windowIDs = []
        for (let key of this.WindowMap.keys()) {
        windowIDs.push(key)
    }

    this.WindowMap.forEach((w) => {
        if (w.id === excludeID) {
            return
        }
        w.webContents.send(IPCKeys.UpdateWindowIDs, windowIDs)
    })
}

WindowManager.prototype.onRequestCreateNewWindow = function(ev, desc) {
    const createdWindow = this.createWindow(desc)
    ev.sender.send(IPCKeys.FinishCreateNewWindow)

    this.notifyUpdateWindowIDs(createdWindow.id)
}

WindowManager.prototype.onRequestSendMessage = function(ev, id, message) {
    const w = this.WindowMap.get(id)
    if (w) {
        w.webContents.send(IPCKeys.UpdateMessage, message)
    }
    ev.sender.send(IPCKeys.FinishSendMessage)
}
    
WindowManager.prototype.onRequestGetWindowIDs = function(ev)  {
    const windowIDs = Array.from(this.WindowMap.keys())
    ev.sender.send(IPCKeys.FinishGetWindowIDs, windowIDs)
}



