/**
 * 全站http配置
 *
 * axios参数说明
 * isSerialize是否开启form表单提交
 * isToken是否需要token
 */

import axios from 'axios';
import store from '@/store/';
// import router from '@/router/router';
import { serialize } from '@/util/util';
import { getToken } from '@/util/auth';
import { Message } from 'element-ui';
import website from '@/config/website';
import { Base64 } from 'js-base64';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
// import serviceList from '@/config/serviceList';
import { baseURL } from '@/api/common';

import { getStore } from '@/util/store';

import { checkAjaxHead } from '@/util/qsgCommon.js';
import i18n from '@/lang';

// import {getRouter} from '@/router/router-util';
import { getRuntime} from "@/util/runtime";


// 动态引入router，直接引入会有数据未加载过来就调用，会报错
// import router from "@/router/router";
// const getRouter = () => import('@/router/router').then(m => m.default);
// const baseUrl = process.env.BASE_URL;

// const services = Object.values(serviceList);

// 使用实例，不能直接使用axios，防止通过loadScript时设置叠加
// const instance = axios.create({
//   baseURL: baseUrl,
//   timeout: 20000,
//   validateStatus (status) {
//     return status >= 200 && status <= 500;
//   },
//   withCredentials: true
// });
function isCurSystemUrl (url) {
  // return services.some(item=> {
  //   return url.includes(`/${item}/`)
  // })
  return url.startsWith(baseURL)
}

// 使用default，avue中的dicurl使用的axiso.reques、axios.get
const axiosConfig = {
  // baseURL: baseUrl,
  timeout: 60000,
  validateStatus (status) {
    return status >= 200 && status <= 500;
  },
  withCredentials: true
}
//默认超时时间
// axios.defaults.timeout = 20000;
// //返回其他状态码
// axios.defaults.validateStatus = function (status) {
//   return status >= 200 && status <= 500;
// };
// //跨域请求，允许保存cookie
// axios.defaults.withCredentials = true;
// baseUrl
// axios.defaults.baseURL = baseUrl;
// NProgress 配置
NProgress.configure({
  showSpinner: false
});
//http request拦截,先添加后运行
axios.interceptors.request.use(config => {
  if (!isCurSystemUrl(config.url)) {
    return config
  }
  // 添加标识，防止两套相同的系统时，同一个请求被处理两次
  if (!config.huilanIsHandledRequest) {
    config.huilanIsHandledRequest = true
  } else {
    return config
  }
  //开启 progress bar
  if(config.showProgress !== false) {
    NProgress.start();
  }
  const timout = config.timeout
  // 处理统一配置
  Object.assign(config, axiosConfig)
  // 解决在参数中自己配置了timeout，被覆盖的问题，timeout默认值为0
  if (timout !== 0) {
    config.timeout = timout;
  }
  // 判断是avue的上传控件，将超时设为0 ，不超时
  if (config.headers.HuilanAvueUploadFlag) {
    config.timeout = 0;
  }

  const meta = (config.meta || {});
  const isToken = meta.isToken === false;
  config.headers['Authorization'] = `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`;
  //让每个请求携带token
  if (getToken() && !isToken) {
    config.headers[website.tokenHeader] = getToken()
  }


  let AiCOSLanguage = getStore({
    name: 'language'
  });
  if (AiCOSLanguage == "zh") {
    config.headers['context-language'] = 'zh_CN';
  } else if (AiCOSLanguage == "en") {
    config.headers['context-language'] = 'en_US';
  } else {
    config.headers['context-language'] = 'zh_CN';
  }


  //headers中配置text请求
  if (config.text === true) {
    config.headers["Content-Type"] = "text/plain";
  }
  //headers中配置serialize为true开启序列化
  if (config.method === 'post' && meta.isSerialize === true) {
    config.data = serialize(config.data);
  }

  /*校检所有ajax参数，加密后添加至header供后台拦截*/
  const checkAjaxHeadRes = checkAjaxHead(config);
  config.headers["Timestamp"] = checkAjaxHeadRes.Timestamp;
  config.headers["Sign"] = checkAjaxHeadRes.Sign;
  config.headers["EncryptType"] = checkAjaxHeadRes.encryptType;

  return config
}, error => {
  return Promise.reject(error)
});
// 记录上一次的错误信息内容
let lastErrorMessage = '';
let lastErrorTime = 0;
// 显示错误信息,相同内容的错误信息，300毫秒内只显示一次
function showErrorMessage (message) {
  const nowTime = Date.now();
  if (message !== lastErrorMessage || nowTime - lastErrorTime > 300) {
    lastErrorMessage = message;
    lastErrorTime = nowTime;
    //console.log(message)
    Message({
      message: message,
      type: 'error'
    })
  }
}
//http response 拦截，先添加先运行
axios.interceptors.response.use( res => {
  const config = res.config;
  if (!isCurSystemUrl(config.url)) {
    return res
  }
  //关闭 progress bar
  if(config.showProgress !== false) {
    NProgress.done();
  }

  // 添加标识，防止两套相同的系统时，同一个请求被处理两次
  if (!config.huilanIsHandledResponse) {
    config.huilanIsHandledResponse = true
  } else {
    return res
  }
  const router = getRuntime('router');
  // parentProjectRouter 在使用远程加载模块时会有值
  const curRouter = router.parentProjectRouter || router

  //获取状态码
  const status = res.data.code || res.status;
  const statusWhiteList = website.statusWhiteList || [];
  let message = res.data.msg || res.data.error_description || '未知错误';
  //如果在白名单里则自行catch逻辑处理
  if (statusWhiteList.includes(status)) return Promise.reject(res);
  //如果是401则跳转到登录页面
  // if (status === 401) store.dispatch('FedLogOut').then(() => curRouter.push({path: '/login'}));
  // debugger
  // 处理 400 且返回内容为 token无效的情况
  // if(status === 400 && ['token无效','未提供token'].includes(message.toLowerCase())) {
  //   // message = res.data.data;
  //   store.dispatch('FedLogOut').then(() => curRouter.push({path: '/login'}))
  // }
  // -1:未提供token;-2:token无效;-3:token已过期;-4:token已被顶下线;-5:token已被赐下线;else当前会话未登录
  if (status === 403) {
    switch (message) {
      case '-1':
        message = i18n.t(`message.notLoggedTips`);
        break;
      case '-2':
      case '-3':
        message = i18n.t(`message.againLoginTips`);
        break;
      case '-4':
        message = i18n.t(`message.elsewhereTips`);
        break;
      case '-5':
        message = i18n.t(`message.offlineTips`);
        break;
      default:
        message = i18n.t(`message.notLoggedTips`);
    }
    store.dispatch('FedLogOut').then(() => curRouter.push({ path: '/login' }))

    // 预留功能 ===  页面打开之后，token失效， 再次请求接口，后端返回403，前端跳转到登录页及附带其redirect功能
    // store.dispatch('FedLogOut').then(() =>{
    //   if(curRouter.currentRoute.path === '/login') {
    //     return
    //   }
    //   curRouter.push({
    //     path: "/login",
    //     query: {
    //       "redirect": curRouter.currentRoute.fullPath || '',
    //     },
    //   })

    // })

    // 防止app未创建的情况
    // setTimeout(()=> {
    //   curRouter.push({path: '/403'})
    // }, 100)
  }

  //bug26403
  // if(['token无效','未提供token'].includes(message.toLowerCase())){
  //   message = "登录信息失效，请重新登录！";
  // }
  // if(['token已被顶下线'].includes(message.toLowerCase())){
  //   message = "您的账号已在别处登录，请返回登录页重新登录！";
  // }

  if (message.includes('503 SERVICE_UNAVAILABLE')) {
    let sTextArr = message.split('Unable to find instance for ');
    let sText = '"';
    if (sTextArr.length > 0) {
      sText = '"' + sTextArr[1];
    }
    message = sText + i18n.t(`message.serviceTips`);
  }

  if (message.includes('FILE_TRANS_TASK_EXPIRED')) {
    message = i18n.t(`message.exceptionTips`);
  }

  if (message.includes('无此权限')) {
    message = i18n.t(`message.refuseTips`) + "（NoPermissions" + message.replace(i18n.t(`message.permissionTips`), '') + "）";
  }

  if (message.includes('FlowableException')) {
    message = i18n.t(`message.processExceptionTips`);
  }

  // 如果请求为非200否者默认统一处理
  if (status !== 200) {
    showErrorMessage(message);

    return Promise.reject(new Error(message))
  }
  return res;
}, error => {
  const config = error.config;
  if(config.showProgress !== false) {
    NProgress.done();
  }
  return Promise.reject(new Error(error));
});

export default axios;
