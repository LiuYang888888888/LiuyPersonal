export default[
  {
    path: '/mobile/agency',
    name: '服务机构',
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
    name: '民口供应信息',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/servicesJunyong',
    component: () =>
      import('@/views/mobile/outSystem/servicesJunyong'),
    name: '军口供应信息',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
 
  {
    path: '/mobile/armyEnterprise',
    name: '军保企业',
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
    name: '企业信息',
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
      import('@/views/mobile/outSystem/poductJunyong'),
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
    name: '民口需求信息',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/demandJunyong',
    component: () =>
      import('@/views/mobile/outSystem/demandJunyong'),
    name: '军口需求信息',
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
    name: '民口供应信息详情',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/serviceJunyongview',
    component: () =>
      import('@/views/mobile/outSystem/serviceJunyongview'),
    name: '军口供应信息详情',
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
    name: '民参军技术产品详情',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/productJunyongView',
    component: () =>
      import('@/views/mobile/outSystem/productJunyongView'),
    name: '军转民技术产品详情',
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
    name: '民口需求信息详情',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/demandJunyongview',
    component: () =>
      import('@/views/mobile/outSystem/demandJunyongview'),
    name: '军口需求信息详情',
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
    name: '民口供应信息审核',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/serviceJunyongshenhe',
    component: () =>
      import('@/views/mobile/outSystem/serviceJunyongshenhe'),
    name: '军口供应信息审核',
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
    name: '民参军技术产品审核',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/productJunyongsh',
    component: () =>
      import('@/views/mobile/outSystem/productJunyongsh'),
    name: '军转民技术产品审核',
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
    name: '民口需求信息审核',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/demandJunyongsh',
    component: () =>
      import('@/views/mobile/outSystem/demandJunyongsh'),
    name: '军口需求信息审核',
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
  //咨询留言
  {
    path: '/mobile/message',
    component: () =>
      import('@/views/mobile/outSystem/message/index'),
    name: '咨询留言',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/message/view',
    component: () =>
      import('@/views/mobile/outSystem/message/view'),
    name: '咨询留言详情',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/message/huifu',
    component: () =>
      import('@/views/mobile/outSystem/message/messagehuifu'),
    name: '咨询留言回复',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  //科研成果共享
  {
    path: '/mobile/share',
    component: () =>
      import('@/views/mobile/outSystem/share/index'),
    name: '科研成果共享',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/share/view',
    component: () =>
      import('@/views/mobile/outSystem/share/view'),
    name: '科研成果共享详情',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/share/shenhe',
    component: () =>
      import('@/views/mobile/outSystem/share/shenhe'),
    name: '科研成果共享审核',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  //融合智库
  {
    path: '/mobile/zhiku',
    component: () =>
      import('@/views/mobile/outSystem/zhiku/index'),
    name: '融合智库',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/zhiku/view',
    component: () =>
      import('@/views/mobile/outSystem/zhiku/index'),
    name: '融合智库',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  //专家智库
  {
    path: '/mobile/expert',
    name: '专家智库',
    component: () =>
      import('@/views/mobile/outSystem/zhiku/expert'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/expertview',
    component: () =>
      import('@/views/mobile/outSystem/zhiku/expertdetails'),
    name: '专家详情',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/expertshenhe',
    component: () =>
      import('@/views/mobile/outSystem/zhiku/expertshenhe'),
    name: '专家审核',
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