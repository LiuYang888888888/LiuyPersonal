import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {baseURL} from '@/api/common';

const { knowledge } = serviceList;


export const getLazyList = (pid, botId) => {
  return request({
    url: `${baseURL}api/${knowledge}/dimension/findByPid`,
    method: 'get',
    params: {
      pid,
      botId
    }
  })
}

export const getTableUrl = (params) => {
  return request({
    url: `${baseURL}api/${knowledge}/dimension/listByPage`,
    method: 'post',
    data: {
      ...params
    }
  })
}

export const saveDimensionUrl = (params) => {
  return request({
    url: `${baseURL}api/${knowledge}/dimension/saveorUpdate`,
    method: 'post',
    data: {
      ...params
    }
  })
}

export const deleteDimensionUrl = (ids, pid) => {
  return request({
    url: `${baseURL}api/${knowledge}/dimension/delete`,
    method: 'post',
    params: {
      ids,
      pid
    }
  })
}

export const changeOrder = (id, type) => {
  return request({
    url: `${baseURL}api/${knowledge}/dimension/sort`,
    method: 'post',
    params: {
      id,
      type
    }
  })
}

// 是否开启过滤
export const isOpenFilterUrl = (id, type) => {
  return request({
    url: `${baseURL}api/${knowledge}/dimension/toFilter`,
    method: 'post',
    params: {
      id,
      type
    }
  })
}
