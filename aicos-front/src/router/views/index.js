import Layout from '@/page/index/'

export default [
  //   {
  //   path: '/wel',
  //   component: Layout,
  //   redirect: '/wel/dashboard',
  //   children: [{
  //     //   path: 'index',
  //     //   name: '首页',
  //     //   meta: {
  //     //     i18n: 'dashboard'
  //     //   },
  //     //   component: () =>
  //     //     import( /* webpackChunkName: "views" */ '@/views/wel/index')
  //     // }, {
  //     path: 'dashboard',
  //     name: '首页',
  //     meta: {
  //       i18n: 'dashboard',
  //       menu: false,
  //     },
  //     component: () =>
  //       import( /* webpackChunkName: "views" */ '@/views/wel/dashboard')
  //   }]
  // }, {
  //   path: '/test',
  //   component: Layout,
  //   redirect: '/test/index',
  //   children: [{
  //     path: 'index',
  //     name: '测试页',
  //     meta: {
  //       i18n: 'test'
  //     },
  //     component: () =>
  //       import( /* webpackChunkName: "views" */ '@/views/util/test')
  //   }]
  // }, {
  //   path: '/dict-horizontal',
  //   component: Layout,
  //   redirect: '/dict-horizontal/index',
  //   children: [{
  //     path: 'index',
  //     name: '字典管理',
  //     meta: {
  //       i18n: 'dict'
  //     },
  //     component: () =>
  //       import( /* webpackChunkName: "views" */ '@/views/util/demo/dict-horizontal')
  //   }]
  // }, {
  //   path: '/dict-vertical',
  //   component: Layout,
  //   redirect: '/dict-vertical/index',
  //   children: [{
  //     path: 'index',
  //     name: '字典管理',
  //     meta: {
  //       i18n: 'dict'
  //     },
  //     component: () =>
  //       import( /* webpackChunkName: "views" */ '@/views/util/demo/dict-vertical')
  //   }]
  // },
  {
    path: '/info',
    component: Layout,
    redirect: '/info/index',
    children: [{
      path: 'index',
      name: '个人信息',
      meta: {
        i18n: 'info'
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/system/userinfo')
    }]
  },
  {
    path: '/comFormDataAdd',
    component: () => import('@/views/system/commonForm/comFormDataAdd'),
    meta: {
      isAuth: false
    }
  },
  {
    path: '/comFormDataPast',
    component: () => import('@/views/system/commonForm/comFormDataPast'),
    meta: {
      isAuth: false
    }
  },

  {
    path: '/questionnaire/qusnDataAdd',
    component: () => import('@/views/questionnaire/qusnDataAdd'),
    meta: {
      isAuth: false
    }
  },
  {
    path: '/exam/examDataAdd',
    component: () => import('@/views/exam/examDataAdd'),
    meta: {
      isAuth: false
    }
  },
  {
    path: '/exam/correctExam',
    component: () => import('@/views/exam/correctExam'),
    meta: {
      isAuth: false
    }
  }
  // {
  //   path:'/editor',
  //   component: () => import('@/views/test/editor'),
  //   meta: {
  //     isAuth: false
  //   }
  // },

  //   {
  //   path: '/work/process/leave',
  //   component: Layout,
  //   redirect: '/work/process/leave/form',
  //   children: [{
  //     path: 'form/:processDefinitionId',
  //     name: '请假流程',
  //     meta: {
  //       i18n: 'work'
  //     },
  //     component: () =>
  //       import( /* webpackChunkName: "views" */ '@/views/work/process/leave/form')
  //   }, {
  //     path: 'handle/:taskId/:processInstanceId/:businessId',
  //     name: '处理请假流程',
  //     meta: {
  //       i18n: 'work'
  //     },
  //     component: () =>
  //       import( /* webpackChunkName: "views" */ '@/views/work/process/leave/handle')
  //   }, {
  //     path: 'detail/:processInstanceId/:businessId',
  //     name: '请假流程详情',
  //     meta: {
  //       i18n: 'work'
  //     },
  //     component: () =>
  //       import( /* webpackChunkName: "views" */ '@/views/work/process/leave/detail')
  //   },
  //
  //   ]
  // },
  // {
  //   path: '/configure',
  //   name: 'AI配置',
  //   component: Layout,
  //   redirect: '/configure/application',
  //   children: [
  //     {
  //       path: 'application',
  //       name: '应用管理',
  //       meta: {
  //         i18n: 'configure'
  //       },
  //       component: () =>
  //         import( /* webpackChunkName: "views" */ '@/views/configure/application')
  //     },
  //     {
  //       path: 'service',
  //       name: '服务管理',
  //       meta: {
  //         i18n: 'configure'
  //       },
  //       component: () =>
  //         import( /* webpackChunkName: "views" */ '@/views/configure/service')
  //     },
  //     {
  //       path: 'ability',
  //       name: '能力维护',
  //       meta: {
  //         i18n: 'configure'
  //       },
  //       component: () =>
  //         import( /* webpackChunkName: "views" */ '@/views/configure/ability')
  //     },
  //     {
  //       path: 'examine',
  //       name: '服务审核',
  //       meta: {
  //         i18n: 'configure'
  //       },
  //       component: () =>
  //         import( /* webpackChunkName: "views" */ '@/views/configure/examine')
  //     },
  //   ]
  // },
  // {
  //   path: '/system',
  //   component: Layout,
  //   redirect: '/system/user',
  //   children: [
  //     {
  //       path: 'dept',
  //       name: '部门管理',
  //       meta: {
  //         i18n: 'work'
  //       },
  //       component: () =>
  //         import( /* webpackChunkName: "views" */ '@/views/system/dept')
  //     },
  //     {
  //       path: 'user',
  //       name: '用户管理',
  //       meta: {
  //         i18n: 'work'
  //       },
  //       component: () =>
  //         import( /* webpackChunkName: "views" */ '@/views/system/user')
  //     },
  //     {
  //       path: 'tenant',
  //       name: '租户管理',
  //       meta: {
  //         i18n: 'work'
  //       },
  //       component: () =>
  //         import( /* webpackChunkName: "views" */ '@/views/system/tenant')
  //     },
  //     {
  //       path: 'menu',
  //       name: '菜单管理',
  //       meta: {
  //         i18n: 'work'
  //       },
  //       component: () =>
  //         import( /* webpackChunkName: "views" */ '@/views/system/menu')
  //     },
  //     {
  //       path: 'resource',
  //       name: '功能项管理',
  //       meta: {
  //         i18n: 'work'
  //       },
  //       component: () =>
  //         import( /* webpackChunkName: "views" */ '@/views/system/resource')
  //     }
  //   ]
  // },
  // {
  //   path: '/authority',
  //   component: Layout,
  //   redirect: '/authority/role',
  //   children: [
  //     {
  //       path: 'role',
  //       name: '角色管理',
  //       meta: {
  //         i18n: 'work'
  //       },
  //       component: () =>
  //         import( /* webpackChunkName: "views" */ '@/views/authority/role')
  //     },
  //     // {
  //     //   path: 'user',
  //     //   name: '用户管理',
  //     //   meta: {
  //     //     i18n: 'work'
  //     //   },
  //     //   component: () =>
  //     //     import( /* webpackChunkName: "views" */ '@/views/system/user')
  //     // },
  //     // {
  //     //   path: 'tenant',
  //     //   name: '租户管理',
  //     //   meta: {
  //     //     i18n: 'work'
  //     //   },
  //     //   component: () =>
  //     //     import( /* webpackChunkName: "views" */ '@/views/system/tenant')
  //     // }
  //   ]
  // }
]
