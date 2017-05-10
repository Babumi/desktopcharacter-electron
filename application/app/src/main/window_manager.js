import Electron from 'electron'
import { IPCKeys } from '../common/constants'
import WindowDesc from '../common/window_desc'

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
      
    /**
     * 
     * @param {WindowDesc} desc 
     */  
    createWindow (desc) {
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

    createURL(id)
    {
        return `file://${__dirname}/index.html` + '#' + id;
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
    onRequestCreateNewWindow (ev, desc) 
    {
        const createdWindow = this.createWindow(desc)
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