import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { system } = serviceList

// export const getList = (current, size, params) => {
//   return request({
//     url: '/api/aiworkorder-system/baseDict/listPage',
//     method: 'get',
//     params: {
//       ...params,
//       current,
//       size,
//     }
//   })
// }

export const getParentList = (current, size, params) => {
  return request({
    url: `${baseURL}api/${system}/baseDict/listPage`,
    method: 'post',
    data: {
      ...params,
      current,
      size,
    }
  })
}

export const getChildList = (current, size, dictId, params) => {
  return request({
    url: `${baseURL}api/${system}/baseDictItem/listPage`,
    method: 'post',
    data: {
      ...params,
      current,
      size,
      dictId
    }
  })
}

export const remove = (id) => {
  return request({
    url: `${baseURL}api/${system}/baseDict/delete`,
    method: 'post',
    data: {
      id
    }
  })
}

export const add = (row) => {
  return request({
    url: `${baseURL}api/${system}/baseDict/save`,
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: `${baseURL}api/${system}/baseDict/update`,
    method: 'post',
    data: row
  })
}


// export const getDict = (id) => {
//   return request({
//     url: '/api/blade-system/dict/detail',
//     method: 'get',
//     params: {
//       id,
//     }
//   })
// }
// export const getDictTree = () => {
//   return request({
//     url: '/api/blade-system/dict/tree?code=DICT',
//     method: 'get'
//   })
// }

export const removeDictItem = (id) => {
  return request({
    url: `${baseURL}api/${system}/baseDictItem/delete`,
    method: 'post',
    data: {
      id
    }
  })
}

export const addDictItem = (row) => {
  return request({
    url: `${baseURL}api/${system}/baseDictItem/save`,
    method: 'post',
    data: row
  })
}

export const updateDictItem = (row) => {
  return request({
    url: `${baseURL}api/${system}/baseDictItem/update`,
    method: 'post',
    data: row
  })
}

export const getDictionary = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseDict/getDictItemListByDictCode`,
    method: 'post',
    data,
  })
}
