import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { system } = serviceList
//云厂分页列表
export const listByPage = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseCloudvendor/listByPage`,
    method: 'post',
    data
  })
}
//云厂列表（不分页）
export const getAllCloudvendorList = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseCloudvendor/getAllCloudvendorList`,
    method: 'post',
    data
  })
}
//云厂新增
export const save = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseCloudvendor/save`,
    method: 'post',
    data
  })
}
//云厂单行删除
export const properDelete = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseCloudvendor/delete`,
    method: 'post',
    data
  })
}
//云厂单行编辑
export const properUpdate = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseCloudvendor/update`,
    method: 'post',
    data
  })
}


