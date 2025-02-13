import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';


export const getList = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/member/equipmentResources/listByPage`,
    method: 'post',
    data:data
  })
}
//查询共享列表
export const getListDataShare = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/member/equipmentResources/listShareByPage`,
    method: 'post',
    data
  })
}
export const submit = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/member/equipmentResources/submit`,
    method: 'post',
    data:data
  })
}

export const complete = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/member/equipmentResources/complete`,
    method: 'post',
    data:data
  })
}

export const disagree = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/member/equipmentResources/disagree`,
    method: 'post',
    data:data
  })
}

export const add = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/equipmentResources/saveOrUpdateFormData`,
    method: 'post',
    data:row
  })
}

export const update = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/equipmentResources/saveOrUpdateFormData`,
    method: 'post',
    data: row
  })
}

export const remove = (params) => {
  return request({
    url: `${baseURL}api/aicos-second/member/equipmentResources/delete`,
    method: 'post',
    data: params,
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
  })
}

export const getById = (params) => {
  return request({
    url: `${baseURL}api/aicos-second/member/equipmentResources/getById`,
    method: 'post',
    data: params,
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
  })
}

//导出
export const exportExcel = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/equipmentResources/exportExcel`,
    method: 'post',
    data: row
  })
}

//导入
export const importExcel = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/equipmentResources/importExcel`,
    method: 'post',
    data: row
  })
}

// 下载模版
export const importTemplateFile = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/equipmentResources/importTemplateFile`,
    method: 'post',
    data: row
  })
}


//共享单位
export const getEnterList = (data) =>{
  request({
    url: `${baseURL}api/aicos-second/member/equipmentResources/saveXiafa`,
    method: 'post',
    data
  })




