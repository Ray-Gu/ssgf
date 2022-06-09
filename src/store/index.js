import Vue from 'vue';
import Vuex from 'vuex';
import user from "@/store/modules/user";
import company from '@/store/modules/company';
import app from '@/store/modules/app';
import routes from "@/store/modules/routes";

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        user,
        company,
        app,
        routes,
    },
    //strict:true,   //确保所有状态改变都是Mutation作出,发布时关闭，有性能损失
});


export default store;
