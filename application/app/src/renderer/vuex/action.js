import * as type from './types'

export default {

    NextSequence: ({ commit }, moveTo ) => {
        commit( type.NEXT_SEQUENCE, moveTo )
    },

    AddMenu: ( context , menuData ) => {
        console.log(context._mutations)
        context.commit( type.ADD_MENU, menuData )
    },

    WindowCreate: ({ commit }) => {
        commit( type.WINDOW_CREATE )
    },

}