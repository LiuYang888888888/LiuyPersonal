export default[
  //服务机构
  {
    path: '/mobile/agency',
    name: '服务机构',
    component: () =>
      import('@/views/mobile/outSystem/agency/agency'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/view',
    component: () =>
      import('@/views/mobile/outSystem/agency/details'),
    name: '服务机构详情',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/shenhe',
    component: () =>
      import('@/views/mobile/outSystem/agency/shenhe'),
    name: '服务机构审核',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  //民口供应信息
  {
    path: '/mobile/services',
    component: () =>
      import('@/views/mobile/outSystem/services/index'),
    name: '民口供应信息',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/serviceview',
    component: () =>
      import('@/views/mobile/outSystem/services/view'),
    name: '民口供应信息详情',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/serviceshenhe',
    component: () =>
      import('@/views/mobile/outSystem/services/shenhe'),
    name: '民口供应信息审核',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  //军口供应信息
  {
    path: '/mobile/servicesJunyong',
    component: () =>
      import('@/views/mobile/outSystem/services/servicesJunyong'),
    name: '军口供应信息',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/serviceJunyongview',
    component: () =>
      import('@/views/mobile/outSystem/services/serviceJunyongview'),
    name: '军口供应信息详情',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/serviceJunyongshenhe',
    component: () =>
      import('@/views/mobile/outSystem/services/serviceJunyongshenhe'),
    name: '军口供应信息审核',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  //军保企业
  {
    path: '/mobile/armyEnterprise',
    name: '军保企业',
    component: () =>
      import('@/views/mobile/outSystem/armyEnterprise/index'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/armyEnterpriseview',
    component: () =>
      import('@/views/mobile/outSystem/armyEnterprise/view'),
    name: '军保详情',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/armyEnterprisesh',
    component: () =>
      import('@/views/mobile/outSystem/armyEnterprise/shenhe'),
    name: '军保审核',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  //企业信息
  {
    path: '/mobile/company',
    name: '企业信息',
    component: () =>
      import('@/views/mobile/outSystem/company/index'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/companyview',
    component: () =>
      import('@/views/mobile/outSystem/company/view'),
    name: '企业信息详情',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/companysh',
    component: () =>
      import('@/views/mobile/outSystem/company/shenhe'),
    name: '企业信息审核',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  //民参军技术产品
  {
    path: '/mobile/product',
    component: () =>
      import('@/views/mobile/outSystem/product/index'),
    name: '民参军技术产品',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/productview',
    component: () =>
      import('@/views/mobile/outSystem/product/view'),
    name: '民参军技术产品详情',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/productsh',
    component: () =>
      import('@/views/mobile/outSystem/product/shenhe'),
    name: '民参军技术产品审核',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  //军转民技术产品
  {
    path: '/mobile/productJunyong',
    component: () =>
      import('@/views/mobile/outSystem/product/junyong'),
    name: '军转民技术产品',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/productJunyongView',
    component: () =>
      import('@/views/mobile/outSystem/product/junyongview'),
    name: '军转民技术产品详情',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/productJunyongsh',
    component: () =>
      import('@/views/mobile/outSystem/product/junyongsh'),
    name: '军转民技术产品审核',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  //民口需求信息
  {
    path: '/mobile/demand',
    component: () =>
      import('@/views/mobile/outSystem/demand/index'),
    name: '民口需求信息',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/demandview',
    component: () =>
      import('@/views/mobile/outSystem/demand/view'),
    name: '民口需求信息详情',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/demandsh',
    component: () =>
      import('@/views/mobile/outSystem/demand/shenhe'),
    name: '民口需求信息审核',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  //军口需求信息
  {
    path: '/mobile/demandJunyong',
    component: () =>
      import('@/views/mobile/outSystem/demand/junyong'),
    name: '军口需求信息',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/demandJunyongview',
    component: () =>
      import('@/views/mobile/outSystem/demand/junyongview'),
    name: '军口需求信息详情',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/demandJunyongsh',
    component: () =>
      import('@/views/mobile/outSystem/demand/junyongsh'),
    name: '军口需求信息审核',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  //设备资源共享
  {
    path: '/mobile/equipment',
    component: () =>
      import('@/views/mobile/outSystem/equipment/index'),
    name: '设备资源',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/equipmentview',
    component: () =>
      import('@/views/mobile/outSystem/equipment/view'),
    name: '设备资源详情',
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
      import('@/views/mobile/outSystem/zhiku/view'),
    name: '融合智库详情',
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
  //民爆监管体系
  {
    path: '/mobile/superVision',
    component: () =>
      import('@/views/mobile/outSystem/superVision'),
    name: '民爆监管体系',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/superVisionview',
    component: () =>
      import('@/views/mobile/outSystem/superVisionview'),
    name: '民爆监管体系详情',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/superVisionsh',
    component: () =>
      import('@/views/mobile/outSystem/superVisionsh'),
    name: '民爆监管体系审核',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  //民爆销售许可年检
  {
    path: '/mobile/sallCheck',
    component: () =>
      import('@/views/mobile/outSystem/sallCheck/index'),
    name: '民爆销售许可年检',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/sallCheckView',
    component: () =>
      import('@/views/mobile/outSystem/sallCheck/view'),
    name: '民爆销售许可年检详情',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/sallChecksh',
    component: () =>
      import('@/views/mobile/outSystem/sallCheck/shenhe'),
    name: '民爆销售许可年检审核',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  //安全生产许可年检
  {
    path: '/mobile/safeShengchan',
    component: () =>
      import('@/views/mobile/outSystem/safeShengchan/index'),
    name: '民爆销售许可年检',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/safeShengchanView',
    component: () =>
      import('@/views/mobile/outSystem/safeShengchan/view'),
    name: '民爆销售许可年检详情',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/safeShengchansh',
    component: () =>
      import('@/views/mobile/outSystem/safeShengchan/shenhe'),
    name: '民爆销售许可年检审核',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  //安全管理先进申报
  {
    path: '/mobile/safeManage',
    component: () =>
      import('@/views/mobile/outSystem/safeManage/index'),
    name: '安全管理先进申报',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/safeManageView',
    component: () =>
      import('@/views/mobile/outSystem/safeManage/view'),
    name: '安全管理先进申报',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/mobile/safeManagesh',
    component: () =>
      import('@/views/mobile/outSystem/safeManage/shenhe'),
    name: '安全管理先进申报',
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