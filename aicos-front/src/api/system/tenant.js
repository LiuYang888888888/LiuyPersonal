import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import { baseURL } from '@/api/common';

const { system, auth } = serviceList


export const getList = (current, size, params) => {
  return request({
    url: `${baseURL}api/${system}/baseTenant/listPage`,
    method: 'post',
    data: {
      ...params,
      current,
      size,
    }
  })
}

export const getAllTenant = () => {
  return request({
    url: `${baseURL}api/${auth}/baseTenant/list`,
    method: 'post'
  })
}

export const getDetail = (id) => {
  return request({
    url: `${baseURL}api/${system}/baseTenant/getBaseTenantByUuid`,
    method: 'post',
    data: {
      id
    }
  })
}

export const remove = (id) => {
  return request({
    url: `${baseURL}api/${system}/baseTenant/delete`,
    method: 'post',
    data: {
      id
    }
  })
}

export const add = (row) => {
  return request({
    url: `${baseURL}api/${system}/baseTenant/save`,
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: `${baseURL}api/${system}/baseTenant/update`,
    method: 'post',
    data: row
  })
}


// export const info = (domain) => {
//   return request({
//     url: '/api/blade-system/tenant/info',
//     method: 'get',
//     params: {
//       domain
//     }
//   })
// }


// 获取切换租户的租户列表
export const getChangeableTenantList = () => {
  return request({
    url: `${baseURL}api/${system}/baseTenant/listForChangeTenant`,
    method: 'post'
  })
}
// 获取系统默认语言
export const getCurrentLanguage = () => {
  return request({
    url: `${baseURL}api/${system}/sys/getCurrentLanguage `,
    method: 'get'
  })
}
