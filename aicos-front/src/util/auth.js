import Cookies from 'js-cookie'
// import {regx} from '@/util/regx'

const TokenKey = 'huilan-access-token'
const RefreshTokenKey = 'huilan-refresh-token'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey)
}

export function setRefreshToken(token) {
  return Cookies.set(RefreshTokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshTokenKey)
}

// /**
//  * 获取sso登录的token
//  */
// export function getSSOToken() {
//   return Cookies.get('satoken')
// }
//
// /**
//  * 删除sso登录的token
//  */
// export function removeSSOToken() {
//   const hostname = location.hostname;
//   let domain = ''
//   if(regx.ip.regx.test(hostname)) {
//     domain = hostname
//   }else {
//     // 对于使用ip的时候无效，使用ip时domain不能这样截取出来
//     const host = hostname.split('.')
//     domain = host.slice(-2).join('.')
//   }
//   Cookies.remove('satoken',{domain})
// }

