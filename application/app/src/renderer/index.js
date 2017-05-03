import Vue from 'vue'
import Electron from 'vue-electron'


import App from './App'
import store from './vuex/index'
import ExtEvent from './extesntion_event'

window.onload = () => {
    console.log("onload")
    Vue.use(Electron)
    Vue.config.debug = true
    new Vue({
        created () {
            let extEvent = new ExtEvent();
            extEvent.activate();
        },
        el: '#app',
        store,
        render: h => h(App)
    })
}

