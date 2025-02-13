import {
  setToken,
  setRefreshToken,
  removeToken,
  removeRefreshToken
} from '@/util/auth'
import {
  Message
} from 'element-ui'
import {
  setStore,
  getStore
} from '@/util/store'
import {
  isURL,
  validatenull
} from '@/util/validate'
import {
  deepClone
} from '@/util/util'
import website from '@/config/website'
import {
  loginByUsername,
  /*loginBySocial,*/
  getUserInfo,
  logout,
  getButtons,
  switchTenant,
  getUserTenant,
  getOsTime
} from '@/api/user'
import {
  getRoutes,
  legalizeSSOToken
} from '@/api/system/menu'
import  crypto from "@/util/crypto";
import { encryptSM2 } from "@/util/cryptosm";
// import md5 from 'js-md5'
import { Base64 } from 'js-base64';
import i18n from '@/lang' // Internationalization 国际化 多语言
// import Cookies from "js-cookie";
const baseUrl = process.env.BASE_URL;


// import { JSEncrypt } from 'jsencrypt';

/*RSA加密*/
// function RSAEncrypted(data) {
//   const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCYeEL/rpGmbQNmG/+QDpsr231PPYS7ZqUTtIax/tNKI7DhSG9OFbU7tPamXDooNC58uJ3jQbusV/9kSkuKoas9U9sN6UXc71uaC8T+PRzhMGkU0m9UWi+nsOQoKZjrFIla9wDeJPFW0Lq8OAPUHNMBVqjuOZ2fi3kNpMx5LxwfJQIDAQAB';

//   let encryptor = new JSEncrypt();

//   encryptor.setPublicKey(publicKey);

//   return encryptor.encrypt(data);
// }

const firstOpenTime = getStore({name: 'firstOpenTime'});

let loginFrom
// 如果firstOpenTime不存在说名为第一次登录
if(!firstOpenTime) {
  setStore({
    name: 'firstOpenTime',
    content: Date.now(),
    type: 'session'
  });
  const opener = window.opener;
  if(opener) {
    try{
      const pathname = opener.location.pathname;
      const res = pathname.match(/[a-zA-Z0-9]+/);
      if(res) {
        loginFrom = res[0]
      }
    }catch (e){
      // 无法获取到登录来源
      console.log(e)
    }

  }
}


function addPath(ele, first) {
  const menu = website.menu;
  const propsConfig = menu.props;
  const propsDefault = {
    label: propsConfig.label || 'name',
    path: propsConfig.path || 'path',
    icon: propsConfig.icon || 'icon',
    children: propsConfig.children || 'children'
  }
  const icon = ele[propsDefault.icon];
  ele[propsDefault.icon] = validatenull(icon) ? menu.iconDefault : icon;
  const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0;
  if (!isChild) ele[propsDefault.children] = [];
  if (!isChild && first && !isURL(ele[propsDefault.path])) {
    ele[propsDefault.path] = ele[propsDefault.path].endsWith('/index') ? ele[propsDefault.path] : ele[propsDefault.path] + '/index'
  } else {
    ele[propsDefault.children].forEach(child => {
      addPath(child);
    })
  }
}
// 过滤掉displayStatus为0的菜单
function filterMenu(menuList) {
  let res = []
  const menu = website.menu;
  const propsConfig = menu.props;
  const propsDefault = {
    // label: propsConfig.label || 'name',
    // path: propsConfig.path || 'path',
    // icon: propsConfig.icon || 'icon',
    children: propsConfig.children || 'children'
  }
  for (let i = 0, l = menuList.length; i < l; i++) {
    const item = deepClone(menuList[i])
    if (item.displayStatus === '1') {
      item[propsDefault.children] = filterMenu(item[propsDefault.children])
      res.push(item)
    }
  }
  return res
}

// 获取返回的菜单的名称，用于国际化
function getMenuName(list) {
  const menu = website.menu;
  const propsConfig = menu.props;
  const propsDefault = {
    label: propsConfig.label || 'name',
    // path: propsConfig.path || 'path',
    // icon: propsConfig.icon || 'icon',
    children: propsConfig.children || 'children'
  }
  const res = {}
  list.forEach(item=>{
    const key = item.code
    const value = item[propsDefault.label]
    res[key] = value;
    const children = item[propsDefault.children];
    if(children) {
      const childrenRes = getMenuName(children)
      Object.assign(res, childrenRes);
    }
  })
  return res
}
function addMenuI18n(list, curLang) {
  const res = getMenuName(list);
  i18n.mergeLocaleMessage(curLang, {route: res})
  // 从系统的配置文件中读取
  const Aicos = window.HuilanAicos;
  // 读取系统配置的本地化信息,如果配置中有重命名菜单的选项,重命名的菜单会生效
  // 打包成远程模块时，可能没有这个对象
  if(Aicos && Aicos.locale) {
    for(const [key, val] of Object.entries(Aicos.locale)) {
      i18n.mergeLocaleMessage(key, val)
      // console.log(i18n.getLocaleMessage(key))
    }
  }
}

const user = {
  state: {
    tenantId: getStore({
      name: 'tenantId'
    }) || '',
    userInfo: getStore({
      name: 'userInfo'
    }) || [],
    permission: getStore({
      name: 'permission'
    }) || {},
    roles: [],
    menu: getStore({
      name: 'menu'
    }) || [],
    menuId: getStore({
      name: 'menuId'
    }) || [],
    menuAll: getStore({
      name: 'menuAll'
    }) || [],
    token: getStore({
      name: 'token'
    }) || '',
    refreshToken: getStore({
      name: 'refreshToken'
    }) || '',
    // 控制是否要显示修改密码的弹出窗口
    modifyPwd: false,
    // 主要用于登录失败时首页的跳转
    ssoStatus: true,
    // 存放当前租户的租户id,切换租户后存储切换后的租户id
    currentTenantId: getStore({name: 'currentTenantId'}) || '',
    currentTenantAll: getStore({name: 'currentTenantAll'}) || { tenantName: '', tenantId: '' },
  },
  actions: {
    //根据用户名登录
    async LoginByUsername({
      commit,
      dispatch
    }, userInfo) {

      // 获取用户安全配置参数
      let configurationParams = getStore({ name: 'frontParam' }) || '';
      let isEncryption = false, encryptionType = '';
      let OsNow = '';
      if (configurationParams) {
        // 是否开启密码传输是对明文进行加密
        if (configurationParams.enableUserPasswordEncryption === 'on') {
          isEncryption = true;
          await getOsTime().then((res) => {
            OsNow = res.data.data.timestamp;
          })
        }
        // 用户密码加密类型
        encryptionType = configurationParams.userPasswordType
      }
      // console.log(configurationParams);
      return new Promise((resolve, reject) => {
        // 不开启加密时默认base64
        let thePW = Base64.encode(userInfo.password)
        if (isEncryption) {
          // 非国密
          if (encryptionType === 'nsm') {
            thePW = Base64.encode(crypto.RSAEncrypted(Base64.encode(userInfo.password) + '#' + OsNow))
          }
          // sm2加密
          if (encryptionType === 'sm') {
            thePW = Base64.encode(encryptSM2(Base64.encode(userInfo.password) + '#' + OsNow))
          }
        }
        // console.log('sm2加密：'+thePW);
        loginByUsername(userInfo.username, thePW, userInfo.type, userInfo.validateKey, userInfo.validateValue).then(res => {
          const data = res.data.data;
          const dataMsg = res.data.msg;

          if (typeof data != "object") {
            //授权异常 过期了 的返回体
            resolve({ lsErro: data });
            //commit('SET_CHECK_AICOS_LICENSE', true);
            return false;
          } else if (dataMsg.split(":")[1] == 'AiCOS') {
            //授权异常 30天以内的返回体
            resolve({ lsErro: dataMsg });
          }
          if (data.error_description) {
            Message({
              message: data.error_description,
              type: 'error'
            })
            resolve({ lsErro: '' });
          } else {
            commit('SET_TOKEN', data.tokenValue);
            commit('SET_REFRESH_TOKEN', data.refresh_token);
            // commit('SET_TENANT_ID', data.tenant_id);
            // commit('SET_USER_INFO', data);
            commit('DEL_ALL_TAG');
            commit('CLEAR_LOCK');

            const p1 = dispatch('GetUserInfo');
            const p2 = dispatch('getSystemParam');
            const p3 = dispatch('GetMenu');
            const p4 = dispatch('GetCurrentTenantId');
            Promise.all([p1, p2, p3, p4]).then(() => {
              resolve({ lsErro: '' });
            })
          }
        }).catch(error => {
          reject(error);
        })
      })
    },
    async handleSSO({
      commit,
      dispatch,
      state,
      rootState
    }, token) {
      let promise;
      let oldToken = state.token;
      const mode = rootState.common.mode;
      if (state.token !== token) {
        commit('SET_TOKEN', token);
        commit('DEL_ALL_TAG');
        commit('CLEAR_LOCK');
        promise = legalizeSSOToken(token).catch(err => {
          commit('SET_STORE_TOKEN', oldToken);
          if(mode === 'sso') {
            commit('SET_SSO_STATUS', false);
          }
          throw err
        })
      } else {
        promise = Promise.resolve()
      }
      return promise.then(() => {
        if(mode === 'sso') {
          commit('SET_SSO_STATUS', true);
          if(loginFrom) {
            commit('SET_LOGIN_FROM', loginFrom)
          }
        }
        const p1 = dispatch('GetUserInfo');
        const p2 = dispatch('getSystemParam');
        const p3 = dispatch('GetMenu');
        const p4 = dispatch('GetCurrentTenantId');
        return Promise.all([p1, p2, p3, p4])
      })

    },
    //根据手机号登录
    LoginByPhone({
      commit
    }, userInfo) {
      return new Promise((resolve) => {
        loginByUsername(userInfo.phone, userInfo.code).then(res => {
          const data = res.data.data;
          commit('SET_TOKEN', data);
          commit('DEL_ALL_TAG');
          commit('CLEAR_LOCK');
          resolve();
        })
      })
    },
    //根据第三方信息登录
    // LoginBySocial({commit}, userInfo) {
    //   return new Promise((resolve) => {
    //     loginBySocial(userInfo.tenantId, userInfo.source, userInfo.code, userInfo.state).then(res => {
    //       const data = res.data;
    //       if (data.error_description) {
    //         Message({
    //           message: data.error_description,
    //           type: 'error'
    //         })
    //       } else {
    //         commit('SET_TOKEN', data.access_token);
    //         commit('SET_REFRESH_TOKEN', data.refresh_token);
    //         commit('SET_USER_INFO', data);
    //         commit('DEL_ALL_TAG');
    //         commit('CLEAR_LOCK');
    //       }
    //       resolve();
    //     })
    //   })
    // },
    //获取用户信息
    GetUserInfo({
      commit
    }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then((res) => {
          const data = res.data.data;
          // commit('SET_ROLES', data.roles);
          commit('SET_TENANT_ID', data.tenantId);
          commit('SET_USER_INFO', data);
          resolve(data);
        }).catch(err => {
          reject(err);
        })
      })
    },
    //刷新token
    refreshToken( /*{state, commit}*/) {
      window.console.log('handle refresh token')
      // return new Promise((resolve, reject) => {
      //   refreshToken(state.refreshToken, state.tenantId).then(res => {
      //     const data = res.data;
      //     commit('SET_TOKEN', data.access_token);
      //     commit('SET_REFRESH_TOKEN', data.refresh_token);
      //     resolve();
      //   }).catch(error => {
      //     reject(error)
      //   })
      // })
    },
    // 登出
    LogOut({
      commit
    }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '');
          commit('SET_MENU', []);
          commit('SET_MENU_ID', {});
          commit('SET_MENU_ALL', []);
          commit('SET_ROLES', []);
          commit('SET_TAG_LIST', []);
          commit('DEL_ALL_TAG');
          commit('CLEAR_LOCK');
          removeToken();
          removeRefreshToken();
          resolve();
        }).catch(error => {
          reject(error)
        })
      })
    },
    //注销session
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        commit('SET_MENU_ID', {});
        commit('SET_MENU_ALL', []);
        commit('SET_MENU', []);
        commit('SET_ROLES', []);
        commit('SET_TAG_LIST', []);
        commit('DEL_ALL_TAG');
        commit('CLEAR_LOCK');
        removeToken();
        removeRefreshToken();
        resolve();
      })
    },
    // 切换租户
    async switchTenant({
      commit,
      dispatch
    }, payload) {
      const {
        data
      } = await switchTenant(payload);

      if (data.success) {
        commit('SET_MENU_ID', {});
        commit('SET_MENU_ALL', []);
        commit('SET_MENU', []);
        commit('SET_ROLES', []);
        commit('SET_TAG_LIST', []);
        commit('DEL_ALL_TAG');
        commit('CLEAR_LOCK');

        // const p1 = dispatch('GetUserInfo');
        // const p2 = dispatch('getSystemParam');
        const p3 = dispatch('GetMenu');
        return Promise.all([p3])
      }
    },
    //获取顶部菜单
    GetTopMenu() {
      return new Promise(resolve => {
        // getTopMenu().then((res) => {
        //   const data = res.data.data || [];
        //   resolve(data)
        // })
        resolve([])
      })
    },
    //获取系统菜单
    GetMenu({ commit, dispatch, rootState }, topMenuId) {
      return new Promise(resolve => {
        getRoutes(topMenuId).then((res) => {
          const data = res.data.data.menuList
          let menu = deepClone(data);
          menu.forEach(ele => {
            addPath(ele, true);
          });
          commit('SET_MENU_ALL', menu)
          // 过滤掉隐藏的菜单
          commit('SET_MENU', filterMenu(menu))

          const curLang = rootState.common.language
          //注册菜单的国际化数据
          addMenuI18n(menu, curLang);
          dispatch('GetButtons');
          resolve(menu)
        })
      })
    },
    //获取系统功能项
    GetButtons({
      commit
    }) {
      return new Promise((resolve) => {
        getButtons().then(res => {
          const data = res.data.data;
          commit('SET_PERMISSION', data);
          resolve();
        })
      })
    },
    GetCurrentTenantId({
      commit
    }) {
      return new Promise((resolve) => {
        getUserTenant().then(res => {
          const data = res.data.data;
          commit('SET_CURRENT_TENANT_ID', data.tenantId);
          commit('SET_CURRENT_TENANT_ALL', data);

          resolve();
        })
      })
    },

  },
  mutations: {
    // 只更新store中的token
    SET_STORE_TOKEN: (state, token) => {
      // setToken(token);
      state.token = token;
      setStore({
        name: 'token',
        content: state.token
      })
    },
    SET_TOKEN: (state, token) => {
      setToken(token);
      state.token = token;
      setStore({
        name: 'token',
        content: state.token
      })
    },
    SET_MENU_ID(state, menuId) {
      state.menuId = menuId;
      setStore({
        name: 'menuId',
        content: state.menuId
      })
    },
    SET_MENU_ALL: (state, menuAll) => {
      state.menuAll = menuAll
      setStore({
        name: 'menuAll',
        content: state.menuAll
      })
    },
    SET_MENU: (state, menu) => {
      state.menu = menu
      setStore({
        name: 'menu',
        content: state.menu
      })
      if (validatenull(menu)) return;
      //合并动态路由去重
      // let menuAll = state.menuAll;
      // menuAll = menuAll.concat(menu).reverse();
      // let newMenu = [];
      // for (let item1 of menuAll) {
      //   let flag = true;
      //   for (let item2 of newMenu) {
      //     if (item1.menuName === item2.menuName || item1.linkUrl === item2.linkUrl) {
      //       flag = false;
      //     }
      //   }
      //   if (flag) {
      //     newMenu.push(item1);
      //   }
      // }
      // state.menuAll = newMenu;
      // setStore({
      //   name: 'menuAll',
      //   content: state.menuAll
      // })
    },
    SET_REFRESH_TOKEN: (state, refreshToken) => {
      setRefreshToken(refreshToken)
      state.refreshToken = refreshToken;
      setStore({
        name: 'refreshToken',
        content: state.refreshToken
      })
    },
    SET_TENANT_ID: (state, tenantId) => {
      state.tenantId = tenantId;
      setStore({
        name: 'tenantId',
        content: state.tenantId
      })
    },
    SET_USER_INFO: (state, userInfo) => {
      if (validatenull(userInfo.avatar)) {
        userInfo.avatar = `${baseUrl}img/bg/img-logo.png`;
      }
      state.userInfo = userInfo;
      setStore({
        name: 'userInfo',
        content: state.userInfo
      })
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_PERMISSION: (state, permission) => {
      let result = [];

      function getCode(list) {
        list.forEach(ele => {
          if (typeof (ele) === 'object') {
            const chiildren = ele.children;
            const code = ele.code;
            if (chiildren) {
              getCode(chiildren)
            } else {
              result.push(code);
            }
          }
        })
      }

      getCode(permission);
      state.permission = {};
      result.forEach(ele => {
        state.permission[ele] = true;
      });
      setStore({
        name: 'permission',
        content: state.permission
      })
    },
    SET_MODIFYPWD: (state, payload) => {
      state.modifyPwd = payload
    },
    SET_SSO_STATUS: (state, payload) => {
      state.ssoStatus = payload
    },
    SET_CURRENT_TENANT_ID: (state, payload) => {
      state.currentTenantId = payload
      setStore({
        name: 'currentTenantId',
        content: payload
      })
    },
    SET_CURRENT_TENANT_ALL: (state, payload) => {
      state.currentTenantAll = payload
      setStore({
        name: 'currentTenantAll',
        content: payload
      })
    },
  }

}
export default user
