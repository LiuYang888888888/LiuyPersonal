import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {
  baseURL
} from '@/api/common';

const {
  /*system,*/form
} = serviceList


//元数据字段接口

export const getListData = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseMetaField/list`,
    method: 'post',
    data
  })
}

export const addListData = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseMetaField/save`,
    method: 'post',
    data
  })
}

export const updateListData = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseMetaField/update`,
    method: 'post',
    data
  })
}

export const delListData = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseMetaField/disable`,
    method: 'post',
    data
  })
}

export const reduListData = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseMetaField/enable`,
    method: 'post',
    data
  })
}

export const syncData = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseMetaObj/sync`,
    method: 'post',
    data
  })
}

//表单页设置接口
export const customFormList = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseFormCustom/list`,
    method: 'post',
    data
  })
}
export const customFormAdd = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseFormCustom/add`,
    method: 'post',
    data
  })
}
export const customFormUpdate = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseFormCustom/update`,
    method: 'post',
    data
  })
}
export const customFormDel = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseFormCustom/delete`,
    method: 'post',
    data
  })
}
