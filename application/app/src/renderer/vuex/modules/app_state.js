import * as type from '../types'

const electron = require('electron')
const remote = electron.remote
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

const state = {
    Scene: {
        'Main': false,
        'Menu': false,
    },
    ContextMenu : new Menu(),
    AssetPath : process.cwd() + '/assets/',
};

const mutations = {
    [type.NEXT_SEQUENCE] ( state, moveTo ) {
        var from = moveTo.from;
        var to = moveTo.to;
        state.Scene[from] = false;
        state.Scene[to] = true;
    },
    [type.ADD_MENU] ( state, menuData ) {
        state.ContextMenu.append(new MenuItem({
            label: menuData.label,
            click: function() {
                menuData.callback()
            } 
        }));
    }
}

window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    state.ContextMenu.popup(remote.getCurrentWindow());
}, false);

export default {
    state,
    mutations
}