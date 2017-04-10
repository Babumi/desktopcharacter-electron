import Vue from 'vue'
import Electron from 'vue-electron'

Vue.use(Electron)
Vue.config.debug = true

import App from './App'
import store from './store/index'

new Vue({
    el: '#app',
    store,
    render: h => h(App)
})