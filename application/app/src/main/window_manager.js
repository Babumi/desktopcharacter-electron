import Electron from 'electron'
import { IPCKeys } from '../common/constants.js'

export default class WindowManager
{
    constructor(context)
    {
        /**
         * Application Context
         * @type {Main}
         */
        this.Context = context

        /**
         * Window Map
         * @type {Map.<string, BrowserWindow>}
         */
        this.WindowMap = new Map()
        
        context.ipc.on(IPCKeys.RequestCreateNewWindow, this.onRequestCreateNewWindow.bind(this))
        context.ipc.on(IPCKeys.RequestSendMessage, this.onRequestSendMessage.bind(this))
        context.ipc.on(IPCKeys.RequestGetWindowIDs, this.onRequestGetWindowIDs.bind(this))
    }

    reload()
    {
        const w = Electron.BrowserWindow.getFocusedWindow()
        if (w) 
        {
            w.reload()
        }
    }

    toggleDeveTools()
    {
        const w = Electron.BrowserWindow.getFocusedWindow()
        if (w) 
        {
            w.toggleDevTools()
        }
    }
      
    createWindow () {
        const w = new Electron.BrowserWindow({
            width: 512,
            height: 512,
            //transparent: true,
            //frame: false,
            resizable: false,
            skipTaskbar: true,
            hasShadow: false,
            alwaysOnTop: true,
            webSecurity: false
        })

        const id = w.id

        w.on('closed', () => {
            // Unregister
            this.WindowMap.delete(id)
            this.notifyUpdateWindowIDs(id)
        })

        const url = process.env.NODE_ENV === 'development'
            ? this.createURL(this.WindowMap.size)
            : this.createURL(id)
        
        w.loadURL(url)
        this.WindowMap.set(id, w)

        return w
    }

    createURL(id)
    {
        const url = process.env.NODE_ENV === 'development'
            ? `http://localhost:${require('../../../config').port + id}`
            : `file://${__dirname}/index.html` + '#' + id
        return url;
    }

    /**
     * Notify that the window ID list has been updated.
     *
     * @param {Number} excludeID Exclude ID.
     */
    notifyUpdateWindowIDs (excludeID) {
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
    /**
     * Occurs when a show new window requested.
     *
     * @param {IPCEvent} ev Event data.
     */
    onRequestCreateNewWindow (ev) 
    {
        const createdWindow = this.createNewWindow()
        ev.sender.send(IPCKeys.FinishCreateNewWindow)

        this.notifyUpdateWindowIDs(createdWindow.id)
    }

    /**
     * Occurs when a send message requested.
     *
     * @param {IPCEvent} ev      Event data.
     * @param {Number}   id      Target window's identifier.
     * @param {String}   message Message.
     */
    onRequestSendMessage (ev, id, message) 
    {
        const w = this.WindowMap.get(id)
        if (w) {
            w.webContents.send(IPCKeys.UpdateMessage, message)
        }
        ev.sender.send(IPCKeys.FinishSendMessage)
    }
    
    /**
     * Occurs when a get window identifiers requested.
     *
     * @param {IPCEvent} ev Event data.
     */
    onRequestGetWindowIDs (ev) 
    {
        const windowIDs = Array.from(this.WindowMap.keys())
        ev.sender.send(IPCKeys.FinishGetWindowIDs, windowIDs)
    }
}