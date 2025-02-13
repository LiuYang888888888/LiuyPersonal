/**
 * 全站权限配置
 *
 */
import router from './router/router'
import store from './store'
import {validatenull} from '@/util/validate'
import {getToken} from '@/util/auth'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

import { isNull, findNodeByVal } from "@/util/qsgCommon.js";

NProgress.configure({showSpinner: false});
const lockPage = store.getters.website.lockPage; //锁屏页
router.beforeEach((to, from, next) => {
  const meta = to.meta || {};
  const isMenu = meta.menu === undefined ? to.query.menu : meta.menu;
  store.commit('SET_IS_MENU', isMenu === undefined);
  if (getToken()) {
    if (store.getters.isLock && to.path !== lockPage) { //如果系统激活锁屏，全部跳转到锁屏页
      next({path: lockPage})
    } else if (to.path === '/login') { //如果登录成功访问登录页跳转到主页
      
      // console.log('已登录状态还往/login跳转', to);
      
      let currentRouter = to;
      // console.log('当前路由的参数',currentRouter.query);
      let redirectUrl = null;
      let redirectPath = null;
      let hasInMenu =  false;
      if( currentRouter.query && currentRouter.query.redirect && !isNull(currentRouter.query.redirect) ){

        redirectPath = currentRouter.query.redirect.split('?')[0];
        redirectUrl = currentRouter.query.redirect;
        // console.log('当前路由的参数redirect 回跳地址', redirectUrl , redirectPath);
        let menuAll = store.getters.menuAll;
        // console.log('当前菜单', menuAll);
        hasInMenu =  isNull(findNodeByVal(menuAll,'linkUrl', redirectPath ,'menuList'))?false:true;
        
      }
      if(hasInMenu){
        // console.log('回跳地址在权限菜单', redirectUrl);
        next({path: redirectUrl})
      }else{
        // console.log('回跳地址不在权限菜单', redirectUrl);
        next({path: '/'})
      }


      // next({path: '/'})

    } else if(to.path === '/403'){
      next();
    }else {
      //如果用户信息为空则获取用户信息，获取用户信息失败，跳转到登录页
      if (store.getters.token.length === 0) {
        store.dispatch('FedLogOut').then(() => {
          next({path: '/login'})
        })
      } else {
        const value = to.query.src || to.fullPath;
        const label = to.query.name || to.name;
        const meta = to.meta || router.$avueRouter.meta || {};
        const i18n = to.query.i18n;
        if (to.query.target) {
          window.open(value)
        } else if (meta.isTab !== false && !validatenull(value) && !validatenull(label)) {
          store.commit('ADD_TAG', {
            label: label,
            value: value,
            params: to.params,
            query: to.query,
            meta: (() => {
              if (!i18n) {
                return meta
              }
              return {
                i18n: i18n
              }
            })(),
            group: router.$avueRouter.group || []
          });
        }
        next()
      }
    }
  } else {
    //判断是否需要认证，没有登录访问去登录页
    // 未登录情况下404页面，跳转到登录页面
    if (meta.isAuth === false && to.fullPath !== '/404') {
      next()
    } else {
      // next('/login')
      // console.log('无token跳转加上redirect参数，做登录之后的回跳', to);
      if(['/login', '/lock', '/404', '/403', '/500', '/desktop'].includes(to.path) ){
        next('/login')
      }else{
        next('/login?redirect=' + encodeURIComponent(to.fullPath) )
      }
    }
  }
})

router.afterEach((to) => {
  NProgress.done();
  let title = store.getters.tag.label;
  let i18n = store.getters.tag.meta.i18n;
  title = router.$avueRouter.generateTitle(title, i18n);


  // //判断登录页的情况
  // if (router.history.current.fullPath === "/login") {
  //   // title = "登录";
  //   title = router.$avueRouter.generateTitle('', 'login');
  // }
  // // 判断桌面页
  // if (router.history.current.fullPath === "/desktop") {
  //   title = router.$avueRouter.generateTitle('', 'desktopPage');
  // }
  // 主要解决非tab页时，页面title显示不正确的问题
  if(to.meta.isTab === false) {
    title = router.$avueRouter.generateTitle('', to.name);
  }
  //根据当前的标签也获取label的值动态设置浏览器标题
  router.$avueRouter.setTitle(title);
});
