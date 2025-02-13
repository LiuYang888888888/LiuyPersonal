import {
  setStore,
  getStore,
  removeStore
} from '@/util/store'
import website from '@/config/website'
import { getAllParamItem, getAllFrontParamItem } from '@/api/system/param'

const baseUrl = process.env.BASE_URL;


const common = {

  state: {
    language: getStore({name: 'language'}) || 'zh',
    isCollapse: false,
    isFullScren: false,
    isMenu: true,
    isShade: false,
    screen: -1,
    isLock: getStore({name: 'isLock'}) || false,
    showTag: true,
    showDebug: true,
    showCollapse: true,
    showSearch: true,
    showLock: true,
    showFullScren: true,
    showTheme: true,
    showMenu: true,
    showColor: true,
    colorName: getStore({name: 'colorName'}) || '#0045C8',
    themeName: getStore({name: 'themeName'}) || 'theme-default',
    lockPasswd: getStore({name: 'lockPasswd'}) || '',
    website: website,
    systemParam: getStore({name: 'systemParam'}) || {},
    frontParam: {},
    // 桌面设置
    desktopBgSetting: getStore({name: 'desktopBgSetting'}) || {url: `${baseUrl}img/bg/default.png`, stretch: '1'},
    // 目前支持的值：sso
    mode: '',
    checkAicosLicense: false,
    // 系统登录来源
    loginFrom: getStore({name: 'loginFrom'})|| ''
  },
  mutations: {
    SET_LANGUAGE: (state, language) => {
      state.language = language
      setStore({
        name: 'language',
        content: state.language
      })
    },
    SET_SHADE: (state, active) => {
      state.isShade = active;
    },
    SET_COLLAPSE: (state) => {
      state.isCollapse = !state.isCollapse;
    },
    SET_FULLSCREN: (state) => {
      state.isFullScren = !state.isFullScren;
    },
    SET_IS_MENU: (state, menu) => {
      state.isMenu = menu;
    },
    SET_LOCK: (state) => {
      state.isLock = true;
      setStore({
        name: 'isLock',
        content: state.isLock,
        type: 'session'
      })
    },
    SET_SCREEN: (state, screen) => {
      state.screen = screen;
    },
    SET_COLOR_NAME: (state, colorName) => {
      state.colorName = colorName;
      setStore({
        name: 'colorName',
        content: state.colorName,
      })
    },
    SET_THEME_NAME: (state, themeName) => {
      state.themeName = themeName;
      setStore({
        name: 'themeName',
        content: state.themeName,
      })
    },
    SET_LOCK_PASSWD: (state, lockPasswd) => {
      state.lockPasswd = lockPasswd;
      setStore({
        name: 'lockPasswd',
        content: state.lockPasswd,
        type: 'session'
      })
    },
    CLEAR_LOCK: (state) => {
      state.isLock = false;
      state.lockPasswd = '';
      removeStore({
        name: 'lockPasswd',
        type: 'session'
      });
      removeStore({
        name: 'isLock',
        type: 'session'
      });
    },
    SET_SYSTEM_PARAM: (state, payload) => {
      state.systemParam = payload
      setStore({
        name: 'systemParam',
        content: payload,
      })
    },
    SET_Front_PARAM: (state, payload) => {
      state.frontParam = payload
      setStore({
        name: 'frontParam',
        content: payload,
      })
    },
    SET_DESKTOPBG_SETTING: (state, payload) => {
      state.desktopBgSetting = payload
      setStore({
        name: 'desktopBgSetting',
        content: payload,
      })
    },
    SET_MODE:(state, payload)=> {
      state.mode = payload
    },
    SET_CHECK_AICOS_LICENSE: (state, checkRes) => {
      state.checkAicosLicense = checkRes;
    },
    SET_LOGIN_FROM: (state, payload) =>{
      state.loginFrom = payload;
      setStore({
        name: 'loginFrom',
        content: payload,
      })
    }
  },
  actions: {
    getSystemParam({commit}) {
      return getAllParamItem().then((res) => {
        const data = res.data.data;
        let param = {}
        data.forEach(item => {
          param[item.code] = item.value
        })
        commit('SET_SYSTEM_PARAM', param);
        commit('SET_TAG_WEL', {
          value: param.firstpage
        });
      })
    },
    async getFrontparam({commit}){
      const {data:{data}} = await getAllFrontParamItem()
      // console.log(data)
      let param = {}
      data.forEach(item => {
        param[item.code] = item.value
      })
      commit('SET_Front_PARAM', param);
    },

  }
}
export default common
