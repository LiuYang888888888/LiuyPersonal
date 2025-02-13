import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';


export const getList = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/member/requirementInformation/listByPage`,
    method: 'post',
    data:data
  })
}

export const submit = (param) => {
  return request({
    url: `${baseURL}api/aicos-second/member/requirementInformation/submit`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:param,
  })
}

export const complete = (param) => {
  return request({
    url: `${baseURL}api/aicos-second/member/requirementInformation/complete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:param
  })
}

export const disagree = (param) => {
  return request({
    url: `${baseURL}api/aicos-second/member/requirementInformation/disagree`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:param
  })
}

export const add = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/requirementInformation/saveOrUpdateFormData`,
    method: 'post',
    data:row
  })
}

export const update = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/requirementInformation/saveOrUpdateFormData`,
    method: 'post',
    data: row
  })
}

export const remove = (params) => {
  return request({
    url: `${baseURL}api/aicos-second/member/requirementInformation/delete`,
    method: 'post',
    data: params,
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
  })
}

export const getById = (params) => {
  return request({
    url: `${baseURL}api/aicos-second/member/requirementInformation/getById`,
    method: 'post',
    data: params,
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
  })
}

//导出
export const exportExcel = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/requirementInformation/exportExcel`,
    method: 'post',
    data: row
  })
}
//工作台
export const getWorkbenchList = () => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/util/getTechnicalProductInformationInfo`,
    method: 'post',
  })  
}
