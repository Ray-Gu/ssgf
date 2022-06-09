

// initial state
const state = () => ({
    routes:[],
})


const  mutations={
    initRoutes(state,data){
        state.routes = data;
    }
}

export default {
    namespaced: true,
    state,
    mutations,
}
