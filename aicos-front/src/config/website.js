/**
 * 全局配置文件
 */
export default {
  title: "AiCOS",
  logo: "AiCOS",
  key: 'HuilanAicos',//配置主键,目前用于存储
  indexTitle: 'AiCOS',
  clientId: 'HuilanAicos', // 客户端id
  clientSecret: 'huilan_secret', // 客户端密钥
  tenantMode: true, // 是否开启租户模式
  tenantId: "000000", // 管理组租户编号
  captchaMode: true, // 是否开启验证码模式
  lockPage: '/lock',
  tokenTime: 3000,
  tokenHeader: 'satoken',
  //http的status默认放行列表
  statusWhiteList: [],
  //配置首页不可关闭
  isFirstPage: false,
  // fistPage: {
  //   label: "首页",
  //   value: "/wel/dashboard",
  //   params: {},
  //   query: {},
  //   meta: {
  //     i18n: 'dashboard'
  //   },
  //   group: [],
  //   close: false
  // },
  //配置菜单的属性
  menu: {
    iconDefault: 'iconfont icon-caidan',
    props: {
      label: 'menuName',
      path: 'linkUrl',
      icon: 'imageUrl',
      children: 'menuList',
      isOpen: 'desktopType'
    }
  },
  // 第三方系统授权地址
  authUrl: '',
  // 流程设计器地址
  flowDesignUrl: '',
  // 报表设计器地址(cloud端口为8108,boot端口为80)
  reportUrl: '',
}
