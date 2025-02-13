import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {
  baseURL
} from '@/api/common';

const {
  system
} = serviceList

export const getListData = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseAppstore/product/list`,
    method: 'post',
    data
  })
}


export const addListData = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseAppstore/product/add`,
    method: 'post',
    data
  })
}

export const updateListData = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseAppstore/product/update`,
    method: 'post',
    data
  })
}


export const delListData = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseAppstore/product/delete`,
    method: 'post',
    data
  })
}

export const installApp = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseAppstore/product/install`,
    method: 'post',
    data
  })
}


export const uninstallApp = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseAppstore/product/uninstall`,
    method: 'post',
    data
  })
}

export const getRolesList = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseRole/listByPage`,
    method: 'post',
    data
  })
}
