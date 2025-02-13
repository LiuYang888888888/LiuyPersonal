import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';


export const getList = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/member/enterpriseInformation/listByPage`,
    method: 'post',
    data:data
  })
}

export const submit = (param) => {
  return request({
    url: `${baseURL}api/aicos-second/member/enterpriseInformation/submit`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:param,
  })
}

export const complete = (param) => {
  return request({
    url: `${baseURL}api/aicos-second/member/enterpriseInformation/complete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:param
  })
}

export const getById = (param) => {
  return request({
    url: `${baseURL}api/aicos-second/member/enterpriseInformation/getById`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:param
  })
}

export const disagree = (param) => {
  return request({
    url: `${baseURL}api/aicos-second/member/enterpriseInformation/disagree`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:param
  })
}

export const add = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/enterpriseInformation/saveOrUpdateFormData`,
    method: 'post',
    data:row
  })
}

export const update = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/enterpriseInformation/saveOrUpdateFormData`,
    method: 'post',
    data: row
  })
}

export const remove = (params) => {
  return request({
    url: `${baseURL}api/aicos-second/member/enterpriseInformation/delete`,
    method: 'post',
    data: params,
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
  })
}


//导出
export const exportExcel = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/enterpriseInformation/exportExcel`,
    method: 'post',
    data: row
  })
}

//导入
export const importExcel = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/enterpriseInformation/importExcel`,
    method: 'post',
    data: row
  })
}

// 下载模版
export const importTemplateFile = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/enterpriseInformation/importTemplateFile`,
    method: 'post',
    data: row
  })
}
//工作台
export const getWorkbench = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/enterpriseInformation/getWorkbench`,
    method: 'post',
  })
}