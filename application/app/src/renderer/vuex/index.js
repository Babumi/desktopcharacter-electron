import Vue from 'vue'
import Vuex from 'vuex'

import actions from './action'
import getters from './getter'
import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
    actions,
    getters,
    modules
});


