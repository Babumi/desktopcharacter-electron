'use strict'

const Electron = require('electron')
const WindowManager = require('./window_manager')

class Main
{
    constructor()
    {
        this.IPC = require('electron').ipcMain      
        this.Shell = require('electron').shell
        this.WindowManager = new WindowManager(this)
        this.Window = null
    }

    onReady()
    {
        var desc = require('../common/window_desc')
        desc.transparent = false
        this.Window = this.WindowManager.createWindow(desc)

        this.IPC.on('window_drag', function (event, arg) 
        {
            
            if (this.Window){
                var bounds = this.Window.getBounds();
                this.Window.setBounds({
                    x : bounds.x + arg.x,
                    y : bounds.y + arg.y,
                    width : bounds.width,
                    height : bounds.height
                });
            }
            event.returnValue = '';
        }.bind(this));
    }

    onWindowAllClosed()
    {
        Electron.app.quit()
    }

    get ipc() {
        return this.IPC
    }

    get shell() {
        return this.Shell
    }

    get windowManager(){
        return this.WindowManager
    }
}

const main = new Main()

Electron.app.on('ready', () => {
    main.onReady()
})

Electron.app.on('quit', () => {

})

Electron.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        main.onWindowAllClosed()
    }
})