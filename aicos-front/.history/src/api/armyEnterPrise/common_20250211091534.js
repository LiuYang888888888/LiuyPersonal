import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';


export const getEnterList = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/member/highQualityEnterprise/listByPage`,
    method: 'post',
    data:data
  })
}

export const getById = (params) => {
  return request({
    url: `${baseURL}api/aicos-second/member/highQualityEnterprise/getById`,
    method: 'post',
    data: params,
  })
}

export const submit = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/member/highQualityEnterprise/submit`,
    method: 'post',
    data:data
  })
}

export const importExcel = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/member/highQualityEnterprise/importExcel`,
    method: 'post',
    data:data
  })
}
export const complete = (param) => {
  return request({
    url: `${baseURL}api/aicos-second/member/highQualityEnterprise/complete`,
    method: 'post',
    data:param
  })
}

export const disagree = (param) => {
  return request({
    url: `${baseURL}api/aicos-second/member/highQualityEnterprise/disagree`,
    method: 'post',
    data:param
  })
}

export const add = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/highQualityEnterprise/saveOrUpdateFormData`,
    method: 'post',
    data:row
  })
}

export const update = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/highQualityEnterprise/saveOrUpdateFormData`,
    method: 'post',
    data: row
  })
}

export const remove = (param) => {
  return request({
    url: `${baseURL}api/aicos-second/member/highQualityEnterprise/delete`,
    method: 'post',
    data: param
  })
}
//技术产品导出
export const exportExcel = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/highQualityEnterprise/exportExcel`,
    method: 'post',
    data: row
  })
}
//工作台
export const getWorkLK = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/member/highQualityEnterprise/listByPage`,
    method: 'post',
    data:data
  })
}
