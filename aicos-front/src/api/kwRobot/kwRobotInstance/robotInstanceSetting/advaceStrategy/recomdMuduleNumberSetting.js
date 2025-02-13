import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {
  baseURL,
} from '@/api/common';

const {kwRobot} = serviceList;

export const saveUrl = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/recommendedStrategy/saveOrUpdate`,
    method: 'post',
    data
  })
}

export const getDataUrl = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/recommendedStrategy/detail`,
    method: 'post',
    data
  })
}
