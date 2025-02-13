import Layout from '@/page/index/'
import store from '@/store'

export default [{
  path: '/login',
  name: 'login',
  component: () =>
    import( /* webpackChunkName: "loginPage" */ '@/page/login/aioslogin/index'),
  meta: {
    keepAlive: true,
    isTab: false,
    isAuth: false
  }
},
{
  path: '/lock',
  name: 'lock',
  component: () =>
      import( /* webpackChunkName: "page" */ '@/page/lock/index'),
  meta: {
    keepAlive: true,
    isTab: false,
    isAuth: false
  }
},
{
  path: '/404',
  component: () =>
      import( /* webpackChunkName: "page" */ '@/components/error-page/404'),
  name: '404',
  meta: {
    keepAlive: true,
    isTab: false,
    isAuth: false
  }

},
{
  path: '/403',
  component: () =>
      import( /* webpackChunkName: "page" */ '@/components/error-page/403'),
  name: '403',
  meta: {
    keepAlive: true,
    isTab: false,
    isAuth: false
  }
},
{
  path: '/500',
  component: () =>
      import( /* webpackChunkName: "page" */ '@/components/error-page/500'),
  name: '500',
  meta: {
    keepAlive: true,
    isTab: false,
    isAuth: false
  }
},
{
  path: '/',
  name: '主页',
  // component: Layout,
  redirect: function() {
    let toUrl = store.state.tags.tagWel.value;
    const isSSO = store.state.common.mode === 'sso';
    const ssoStatus = store.state.user.ssoStatus
    if(isSSO && !ssoStatus) {
      // 不能确定失败时权限问题还是token无效
      toUrl = ''
    }
    return toUrl
  }
},
{
  path: '/myiframe',
  component: Layout,
  redirect: '/myiframe',
  children: [{
    path: ":routerPath",
    name: 'iframe',
    component: () =>
        import( /* webpackChunkName: "page" */ '@/components/iframe/main'),
    props: true
  }]

},
{ path: '/reg', 
  name: 'reg', 
  component: () => import('@/page/reg/reg.vue'), 
  meta: { KeepAliv: true, isTab: false, isAuth: false } },
{
  path: '/desktop',
  component: () =>
      import( /* webpackChunkName: "page" */ '@/page/desktop/index'),
  name: 'desktopPage',
  meta: {
    keepAlive: true,
    isTab: false,
    isAuth: true
  }
},
{
  path: '*',
  redirect: '/404'
}
]
