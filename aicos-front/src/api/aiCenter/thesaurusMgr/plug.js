import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { system } = serviceList

export const getList = (data) => {
  return request({
    url: `${baseURL}api/${system}/basePluginGroup/listByPage`,
    method: 'post',
    data
  })
}

export const remove = (id) => {
  return request({
    url: `${baseURL}api/${system}/basePluginGroup/delete`,
    method: 'post',
    data: {
      id,
    }
  })
}

export const add = (row) => {
  return request({
    url: `${baseURL}api/${system}/basePluginGroup/save`,
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: `${baseURL}api/${system}/basePluginGroup/update`,
    method: 'post',
    data: row
  })
}

// 按entityId获得所有词,分页,可传excluded,wordType
export const getEntityInstanceList = (data) => {
  return request({
    url: `${baseURL}api/${system}/basePluginGroup/getPluginListByPluginGroupId`,
    method: 'post',
    data
  })
}

export const removeEntityInstance = (id) => {
  return request({
    url: `${baseURL}api/${system}/basePlugin/delete`,
    method: 'post',
    data: {
      id,
    }
  })
}
export const removeEntityInstanceBatch = (id) => {
  return request({
    url: `${baseURL}api/${system}/basePlugin/deleteBatch`,
    method: 'post',
    data: {
      id,
    }
  })
}

export const addEntityInstance = (row) => {
  return request({
    url: `${baseURL}api/${system}/basePlugin/save`,
    method: 'post',
    data: row
  })
}

export const updateEntityInstance = (row) => {
  return request({
    url: `${baseURL}api/${system}/basePlugin/update`,
    method: 'post',
    data: row
  })
}
// 调用方式字典接口获取
export const requestTypeList = (row) => {
  return request({
    url: `${baseURL}api/${system}/baseDict/getDictItemListByDictCode`,
    method: 'post',
    data: row
  })
}
