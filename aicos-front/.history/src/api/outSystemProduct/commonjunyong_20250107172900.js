import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';


export const getList = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/member/TechnicalJZMProductInformation/listByPage`,
    method: 'post',
    data:data
  })
}

export const submit = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/member/TechnicalJZMProductInformation/submit`,
    method: 'post',
    data:data
  })
}

export const complete = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/member/TechnicalJZMProductInformation/complete`,
    method: 'post',
    data:data
  })
}

export const disagree = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/member/TechnicalJZMProductInformation/disagree`,
    method: 'post',
    data:data
  })
}

export const add = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/TechnicalJZMProductInformation/saveOrUpdateFormData`,
    method: 'post',
    data:row
  })
}

export const update = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/TechnicalProductInformation/saveOrUpdateFormData`,
    method: 'post',
    data: row
  })
}

export const remove = (params) => {
  return request({
    url: `${baseURL}api/aicos-second/member/TechnicalProductInformation/delete`,
    method: 'post',
    data: params,
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
  })
}

export const getById = (params) => {
  return request({
    url: `${baseURL}api/aicos-second/member/TechnicalProductInformation/getById`,
    method: 'post',
    data: params,
  })
}


//技术产品导出
export const exportExcel = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/TechnicalProductInformation/exportExcel`,
    method: 'post',
    data: row
  })
}
