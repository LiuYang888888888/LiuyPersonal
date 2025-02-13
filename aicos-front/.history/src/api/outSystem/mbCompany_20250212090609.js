import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';


export const getList = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/enterpriseInformation/listByPage`,
    method: 'post',
    data:data
  })
}

// 提交
export const submit = (param) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/enterpriseInformation/submit`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:param,
  })
}

//getById
export const getById = (param) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/enterpriseInformation/getById`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:param,
  })
}

// 审核
export const complete = (param) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/enterpriseInformation/complete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:param
  })
}

// 审核不通过
export const disagree = (param) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/enterpriseInformation/disagree`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:param
  })
}

// 新增
export const add = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/enterpriseInformation/saveOrUpdateFormData`,
    method: 'post',
    data:row
  })
}

export const update = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/enterpriseInformation/saveOrUpdateFormData`,
    method: 'post',
    data: row
  })
}

export const remove = (params) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/enterpriseInformation/delete`,
    method: 'post',
    data: params,
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
  })
}


//导出
export const exportExcel = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/enterpriseInformation/exportExcel`,
    method: 'post',
    data: row
  })
}

//导入
export const importExcel = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/enterpriseInformation/importExcel`,
    method: 'post',
    data: row
  })
}

// 下载模版
export const importTemplateFile = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/enterpriseInformation/importTemplateFile`,
    method: 'post',
    data: row
  })
}
//工作台
export const getWorkbench = () => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/enterpriseInformation/getWorkbench`,
    method: 'post',
  })
}
