import * as type from '../types'
import Electron from 'electron'
import { IPCKeys } from '../../../common/constants.js'


let ipc = Electron.ipcRenderer;

const state = {
    windowIDs: []
}

const mutations = {
  [type.WINDOW_CREATE] (state, desc) {
    ipc.send(IPCKeys.RequestCreateNewWindow, desc)
  },
}

ipc.on(IPCKeys.FinishCreateNewWindow, () => {
    console.log("FinishCreateNewWindow")
})

ipc.on(IPCKeys.FinishGetWindowIDs, (ev, windowIDs) =>{
    //state update
})

ipc.on(IPCKeys.UpdateWindowIDs, (ev, windowIDs) => {
    //state update
})

export default {
    state,
    mutations
}