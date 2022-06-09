 import Cookies from "js-cookie";   //引入cookie操作函数
// initial state
const state = () => ({
    naviMenu : {
        opened : Cookies.get('naviMenuOpened') === '1',
    },
    headerFixed:true,  //以后要做一个布局设置的，可以让头固定
    device:'desktop',
})

// getters
const getters = {
}

// actions
const actions = {

}

// mutations
const mutations = {
    TOGGLE_DEVICE(state,device){
      state.device = device;
    },
    CLOSE_SIDEBAR(state){
        state.naviMenu.opened = false;
    },
    TOGGLE_SIDEBAR(state){
        state.naviMenu.opened = !state.naviMenu.opened
        Cookies.set('naviMenuOpened',state.naviMenu.opened?'1':'0');
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
