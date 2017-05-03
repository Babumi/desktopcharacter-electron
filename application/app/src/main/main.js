'use strict'

import Electron from 'electron'
import WindowManager from './window_manager'

class Main
{
    constructor()
    {
        console.log("Main - constructor")

        this.IPC = require('electron').ipcMain
        
        this.Shell = require('electron').shell

        this.WindowManager = new WindowManager(this)

        this.Window = null
    }

    onReady()
    {
        this.Window = this.WindowManager.createWindow()
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

