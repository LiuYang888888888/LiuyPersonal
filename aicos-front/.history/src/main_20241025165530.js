import Vue from 'vue';
import axios from './router/axios';
import VueAxios from 'vue-axios';
import App from './App';
import router, {resetRouter} from './router/router';
import './permission'; // 权限
import './error'; // 日志
import './cache';//页面缓存
import store from './store';
import {loadStyle} from './util/util'
import * as urls from '@/config/env';
import Element from 'element-ui';
import './component'
import { iconfontUrl, iconfontVersion} from '@/config/env';
import i18n from './lang'; // Internationalization
import './styles/common.scss';
// import {setRouter} from "@/router/router-util";
import { setRuntime} from "@/util/runtime";
import Print from 'vue-print-nb'


/**
 * 缓存request、router、store，为二次开发环境提供环境，而且提供需要二次修改的代码的一致性
 * 1、二次开发可以通过getRuntime来得到这些数据
 */
setRuntime({
  request: axios,
  router,
  store
})

// import website from '@/config/website';
// import crudCommon from '@/mixins/crud';
// import HuilanDialog from './components/Dialog';
// import serviceList from "./config/serviceList";

import '@/plugins'
// import Cookies from "js-cookie";
import { getToken } from '@/util/auth'
// import {baseURL} from '@/api/common'
// socket
import socket from './util/socket'

import Vant from 'vant';
import 'vant/lib/index.css';

// 为socket全局赋值
Vue.prototype.$socket = socket;
// 注册全局crud驱动
// window.$crudCommon = crudCommon;
// 加载Vue拓展
Vue.use(Print)
Vue.use(router);
Vue.use(Vant);
Vue.use(VueAxios, axios);
Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
});
Vue.use(AVUE, {
  size: 'small',
  tableSize: 'small',
  calcHeight: 65,
  i18n: (key, value) => i18n.t(key, value)
});

// 加载相关url地址
Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key];
});
// 加载website,这个地方去掉是因为当其它系统集成aicos的远程模块时候，会加载系统的website，因为在store的getter中也有一个重名的website
// Vue.prototype.website = website;
// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
  loadStyle(iconfontUrl.replace('$key', ele));
});

Vue.config.productionTip = false;

// 可以通过getRouter获取到router实例
// setRouter(router)

const createApp = () =>{
  new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
  }).$mount('#app');
}
// 判断是否sso模式
const search = window.location.search
if(search.includes('mode=sso')) {
  store.commit('SET_MODE', 'sso')
}
const token = getToken()
if(token) {
  // store.commit('SET_TOKEN', satoken)
  store.dispatch('handleSSO', token).then(()=> {
    // 先清理的调原来已经注册的路由
    resetRouter()
    // 注册动态路由
    router.$avueRouter.formatRoutes(store.state.user.menuAll, true);
    // store.commit('SET_TAG_WEL', {
    //   value: ''
    // });
    createApp()
  }).catch(()=> {
    // 如果因为token失效的情况需要跳转到登录页面
    createApp()
  })
}else {
  createApp()
}

