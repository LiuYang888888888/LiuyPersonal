import request from '@/router/axios';
// import website from "@/config/website";
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { auth, system } = serviceList

export const loginByUsername = (account, password, type, validateKey, validateValue) => request({
  url: `${baseURL}api/${auth}/auth/doLogin`,
  method: 'post',
  // headers: {
  //   'Tenant-Id': tenantId,
  //   'Captcha-Key': key,
  //   'Captcha-Code': code,
  // },
  data: {
    // tenantId,
    account,
    password,
    // grant_type: (website.captchaMode ? "captcha" : "password"),
    scope: "all",
    type,
    validateKey,
    validateValue
  }
});

// 是否需要修改密码,传account
export const ifNeedModifyPassword = (data) => request({
  url: `${baseURL}api/${auth}/auth/passwordForceToModify`,
  method: 'post',
  data
});

// export const loginBySocial = (tenantId, source, code, state) => request({
//   url: '/api/blade-auth/oauth/token',
//   method: 'post',
//   headers: {
//     'Tenant-Id': tenantId
//   },
//   params: {
//     tenantId,
//     source,
//     code,
//     state,
//     grant_type: "social",
//     scope: "all",
//   }
// })

// export const refreshToken = (refresh_token, tenantId) => request({
//   url: '/api/blade-auth/oauth/token',
//   method: 'post',
//   headers: {
//     'Tenant-Id': tenantId
//   },
//   params: {
//     tenantId,
//     refresh_token,
//     grant_type: "refresh_token",
//     scope: "all",
//   }
// });

// export const registerGuest = (form, oauthId) => request({
//   url: '/api/blade-user/register-guest',
//   method: 'post',
//   params: {
//     tenantId: form.tenantId,
//     name: form.name,
//     account: form.account,
//     password: form.password,
//     oauthId
//   }
// });

export const getButtons = () => request({
  url: `${baseURL}api/${auth}/auth/getResourceByUserAuth`,
  method: 'get'
});

export const getCaptcha = () => request({
  url: `${baseURL}api/${auth}/auth/captcha`,
  method: 'get'
});

export const logout = () => request({
  url: `${baseURL}api/${auth}/auth/doLogout`,
  method: 'get'
});

export const getUserInfo = () => request({
  url: `${baseURL}api/${auth}/auth/getUserInfo`,
  method: 'get'
});

// export const sendLogs = (list) => request({
//   url: '/api/blade-auth/oauth/logout',
//   method: 'post',
//   data: list
// });
//
// export const clearCache = () => request({
//   url: '/api/blade-auth/oauth/clear-cache',
//   method: 'get'
// });

// 切换租户
export const switchTenant = (data) => request({
  url: `${baseURL}api/${auth}/auth/switchTenant`,
  method: 'post',
  data
});
// 获取当前租户信息
export const getUserTenant = () => request({
  url: `${baseURL}api/${auth}/auth/getUserTenant`,
  method: 'get',
  // data: {}
});

// 获取用户的部门
export const getUserDeptStr = () => request({
  url: `${baseURL}api/${auth}/auth/getUserDept`,
  method: 'get'
});

// 获取最近访问的菜单，暂无参数
export const getRecentUsedMenu = (data={}) => request({
  url: `${baseURL}api/${auth}/desktop/getRecentUsedMenu`,
  method: 'post',
  data
});

// 获取最新上架的菜单，recentDay最近多少天
export const getTopNewMenu = (recentDay= 30) => request({
  url: `${baseURL}api/${auth}/desktop/getTopNewMenu`,
  method: 'post',
  data: {
    recentDay
  }
});

// 生成ticket
export const getTicket = () => request({
  url: `${baseURL}api/${auth}/sso/createTicket`,
  method: 'get'
});

export const addTicket = (url) => {
  let join = '?'
  if(/\?/.test(url)) {
    join = '&'
  }
  return getTicket().then(({data: {data}})=> {
    return `${url}${join}ticket=${data}`
  })
};

/*用户登录获取服务器时间戳*/
export const getOsTime = (data) => {
  return request({
    url: `${baseURL}api/${system}/sys/info`,
    method: 'post',
    data
  })
}

