import {createStore} from 'vuex'
import { Commit } from "vuex"
import { State } from '../types/store'
 
export default createStore({
    state:{
         typeId: 'user001',
         showName: true,
         count: 0,
         user:{
            name: 'joy',
            pwd: '123456'
         }
    },
    getters:{
        getId: (state:State) => state.typeId,
        getUser: (state:State) => state.user
    },
    mutations:{
        showUserName(state: State){
            state.showName = false
        },
        updateCount(state: State){
            state.count++
        }
    },
    actions: {
        getUserList(context: { commit: Commit }){
            context.commit('updateCount')
        }
    },
    modules: {

    }
})
