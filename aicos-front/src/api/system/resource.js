import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { system } = serviceList

export const getList = (current, size, params) => {
  return request({
    url: `${baseURL}api/${system}/baseResource/listByPage`,
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
    url: `${baseURL}api/${system}/baseResource/delete`,
    method: 'post',
    data: {
      id,
    }
  })
}

export const add = (row) => {
  return request({
    url: `${baseURL}api/${system}/baseResource/save`,
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: `${baseURL}api/${system}/baseResource/update`,
    method: 'post',
    data: row
  })
}
