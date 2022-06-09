
// initial state
const state = () => ({
    info:{
        name:''
    },
})

// getters
const getters = {

}

// actions
const actions = {

}

// mutations
const mutations = {
    SET_COMPANY(state,company){
        state.info = company;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
