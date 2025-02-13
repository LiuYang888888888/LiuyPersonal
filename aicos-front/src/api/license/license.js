import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {
  baseURL
} from '@/api/common';

const {
  system
} = serviceList

//获取AiCOS已授权的license
export const getLatestLicenseFromAiCOS = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseLicense/getLatestLicenseFromAiCOS`,
    method: 'post',
    data
  })
}

//更新AiCOS的license
export const updateLicenseToAiCOS = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseLicense/updateLicenseToAiCOS`,
    method: 'post',
    data
  })
}

//更新AiCOS的license只登录时调用
export const updateLicenseToAiCOSForLogin = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseLicense/updateLicenseToAiCOSForLogin`,
    method: 'post',
    data
  })
}



//获取其他系统已授权的license
export const getLatestLicenseFromRemote = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseLicense/getLatestLicenseFromRemote`,
    method: 'post',
    data
  })
}

// 应用商城 更新其他系统的license 
export const updateLicenseToRemote = (systemCode,data) => {
  return request({
    url: `${baseURL}api/${system}/baseLicense/updateLicenseToRemote`,
    method: 'post',
    params:{
      "systemCode":systemCode
    },
    data
  })
}

//根据菜单 menuid 获取其他系统已授权的license
export const getLatestLicenseFromRemoteFromMenu = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseLicense/getLatestLicenseFromRemote2`,
    method: 'post',
    data
  })
}

//根据菜单 menuid 更新其他系统的license
export const updateLicenseToRemoteFromMenu = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseLicense/updateLicenseToRemote2`,
    method: 'post',
    data
  })
}


//验证其他系统的license
export const checkLicenseApp = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseLicense/clickFromDesktop`,
    method: 'post',
    data
  })
}

//验证AiCOS的license
export const checkLicenseAicos = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseLicense/checkAicosLicense`,
    method: 'post',
    data
  })
}




