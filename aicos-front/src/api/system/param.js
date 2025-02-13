import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { system } = serviceList

export const getList = (current, size, params) => {
  return request({
    url: `${baseURL}api/${system}/baseSystemparam/listPage`,
    method: 'post',
    data: {
      ...params,
      current,
      size,
    }
  })
}

export const remove = (id) => {
  return request({
    url: `${baseURL}api/${system}/baseSystemparam/delete`,
    method: 'post',
    data: {
      id
    }
  })
}

export const add = (row) => {
  return request({
    url: `${baseURL}api/${system}/baseSystemparam/save`,
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: `${baseURL}api/${system}/baseSystemparam/update`,
    method: 'post',
    data: row
  })
}


export const getParamItemList = (current, size, params) => {
  return request({
    url: `${baseURL}api/${system}/baseSystemparamItem/listPage`,
    method: 'post',
    data: {
      ...params,
      current,
      size,
    }
  })
}

export const addItem = (row) => {
  return request({
    url: `${baseURL}api/${system}/baseSystemparamItem/save`,
    method: 'post',
    data: row
  })
}

export const updateItem = (row) => {
  return request({
    url: `${baseURL}api/${system}/baseSystemparamItem/update`,
    method: 'post',
    data: row
  })
}

export const removeItem = (id) => {
  return request({
    url: `${baseURL}api/${system}/baseSystemparamItem/delete`,
    method: 'post',
    data: {
      id
    }
  })
}

// 获取所有系统参数
export const getAllParamItem = () => {
  return request({
    url: `${baseURL}api/${system}/baseSystemparamItem/getAll`,
    method: 'post',
    data: {}
  })
}

// 获取所有登录前系统参数
export const getAllFrontParamItem = () => {
  return request({
    url: `${baseURL}api/${system}/baseSystemparamItem/getAllFront`,
    method: 'post',
    data: {}
  })
}
// 获取系统参数列表
export const getSysParamList = (current, size, params) => {
  return request({
    url: `${baseURL}api/${system}/baseSystemparam/getlist`,
    method: 'post',
    data: {
      ...params,
      current,
      size,
    }
  })
}
