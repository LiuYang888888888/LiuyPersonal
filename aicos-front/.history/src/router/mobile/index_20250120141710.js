export default[
  {
    path: '/mobile/agency',
    name: 'agency',
    component: () =>
      import('@/views/mobile/outSystem/agency'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/services',
    component: () =>
      import('@/views/mobile/outSystem/services'),
    name: 'services',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/expert',
    name: 'expert',
    component: () =>
      import('@/views/mobile/outSystem/expert'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/armyEnterprise',
    name: 'armyEnterprise',
    component: () =>
      import('@/views/mobile/outSystem/armyEnterprise'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/company',
    name: 'company',
    component: () =>
      import('@/views/mobile/outSystem/company'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/product',
    component: () =>
      import('@/views/mobile/outSystem/product'),
    name: '民参军技术产品',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/productJunyong',
    component: () =>
      import('@/views/mobile/outSystem/productJunyong'),
    name: '军转民技术产品',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/demand',
    component: () =>
      import('@/views/mobile/outSystem/demand'),
    name: '需求信息',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/equipment',
    component: () =>
      import('@/views/mobile/outSystem/equipment'),
    name: '设备资源',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/view',
    component: () =>
      import('@/views/mobile/outSystem/details'),
    name: '服务机构详情',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/serviceview',
    component: () =>
      import('@/views/mobile/outSystem/servicedetails'),
    name: '供应信息详情',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/expertview',
    component: () =>
      import('@/views/mobile/outSystem/expertdetails'),
    name: '专家详情',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/armyEnterpriseview',
    component: () =>
      import('@/views/mobile/outSystem/armyEnterpriseview'),
    name: '军保详情',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/companyview',
    component: () =>
      import('@/views/mobile/outSystem/companyview'),
    name: '企业信息详情',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/productview',
    component: () =>
      import('@/views/mobile/outSystem/productview'),
    name: '技术产品详情',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/demandview',
    component: () =>
      import('@/views/mobile/outSystem/demandview'),
    name: '需求信息详情',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/equipmentview',
    component: () =>
      import('@/views/mobile/outSystem/equipmentview'),
    name: '设备资源详情',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/shenhe',
    component: () =>
      import('@/views/mobile/outSystem/shenhe'),
    name: '服务机构审核',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/serviceshenhe',
    component: () =>
      import('@/views/mobile/outSystem/serviceshenhe'),
    name: '供应信息审核',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/expertshenhe',
    component: () =>
      import('@/views/mobile/outSystem/expertshenhe'),
    name: '专家审核',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/armyEnterprisesh',
    component: () =>
      import('@/views/mobile/outSystem/armyEnterprisesh'),
    name: '军保审核',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/companysh',
    component: () =>
      import('@/views/mobile/outSystem/companysh'),
    name: '企业信息审核',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/productsh',
    component: () =>
      import('@/views/mobile/outSystem/productsh'),
    name: '技术产品审核',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/demandsh',
    component: () =>
      import('@/views/mobile/outSystem/demandsh'),
    name: '需求信息审核',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/equipmentsh',
    component: () =>
      import('@/views/mobile/outSystem/equipmentsh'),
    name: '设备资源审核',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '*',
    redirect: '/404'
  }
]