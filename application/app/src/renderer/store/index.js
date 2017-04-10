import Vue from 'vue'
import Vuex from 'vuex'
const electron = require('electron')
const remote = electron.remote
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

Vue.use(Vuex)

const state = {
    Scene: {
        'Main': false,
        'Menu': false,
    },
    ContextMenu : new Menu(),
    AssetPath : process.cwd() + '/assets/',
};

const mutations = {
    NextSequence( state, moveTo ) {
        var from = moveTo.from;
        var to = moveTo.to;
        state.Scene[from] = false;
        state.Scene[to] = true;
    },
    AddMenu( state, menuData ) {
        state.ContextMenu.append(new MenuItem({
            label: menuData.label,
            click: function() {
                menuData.callback()
            } 
        }));
    }
}

const actions = {
    NextSequence: ({ commit }, moveTo ) => {
        commit( 'NextSequence', moveTo )
    },
    AddMenu: ({ commit }, menuData ) => {
        commit( 'AddMenu', menuData )
    },
}

const getters = {
    Scene: state => {
        return state.Scene
    },
    ContextMenu: state => {
        return state.ContextMenu
    },
    AssetPath: state => {
        return state.AssetPath
    }
}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});


window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    state.ContextMenu.popup(remote.getCurrentWindow());
}, false);
