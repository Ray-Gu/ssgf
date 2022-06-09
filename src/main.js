import Vue from 'vue'
/*安装这个全局css文件用于让所有浏览器显示基本一致
* */
import 'normalize.css/normalize.css';
/*npm install sass-loader@8.0.2
 npm i sass
需要安装sass的预处理器,webpack兼容的loader版本不一样
* */
import '@/styles/index.scss';


import App from './App.vue'
import router from "@/router";
import store from "@/store";

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI, { size: 'small', zIndex: 3000 });

Vue.config.productionTip = false

/*
* 注册三级联动组建为全局组件
* */
import CategorySelect from "@/components/CategorySelect";
Vue.component(CategorySelect.name,CategorySelect);
import HintButton from "@/components/HintButton";
Vue.component(HintButton.name,HintButton);

import {postRequest,putRequest,deleteRequest,getRequest} from "@/tool/request";
import {downloadRequest} from "@/tool/download";
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.downloadRequest = downloadRequest;

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
