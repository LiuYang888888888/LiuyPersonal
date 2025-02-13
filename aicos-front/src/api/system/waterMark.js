import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { material } = serviceList

export const getList = (data) => {
  return request({
    url: `${baseURL}api/${material}/waterMark/listPage`,
    method: 'post',
    data
  })
}

export const remove = (id) => {
  return request({
    url: `${baseURL}api/${material}/waterMark/deleteWaterMark`,
    method: 'post',
    data: {
      id,
    }
  })
}

export const add = (row) => {
  return request({
    url: `${baseURL}api/${material}/waterMark/saveWaterMark`,
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: `${baseURL}api/${material}/waterMark/updateWaterMark`,
    method: 'post',
    data: row
  })
}
