import {getToken, removeToken, setToken} from "@/tool/cookie";

// initial state
const state = () => ({
    token:getToken(),    //token存储地,cookie中也有一份
    user:{  //当前用户信息
        name:''
    },
})

// getters
const getters = {

}

// actions
const actions = {
    logout({commit}){
        commit('LOGOUT');
    }
}

// mutations
const mutations = {
    SET_TOKEN(state,token){
        state.token = token;
        setToken(token);
    },
    LOGOUT(state){
        state.token='';
        removeToken();
        state.user={name:''};
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
