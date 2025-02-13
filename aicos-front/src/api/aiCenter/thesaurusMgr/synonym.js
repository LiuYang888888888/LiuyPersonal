import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { ai } = serviceList

export const getList = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpSynonym/listPage`,
    method: 'post',
    data
  })
}

export const remove = (id) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpSynonym/delete`,
    method: 'post',
    data: {
      id,
    }
  })
}
export const removeBatch = (id) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpSynonym/deleteBatch`,
    method: 'post',
    data: {
      id,
    }
  })
}

export const add = (row) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpSynonym/save`,
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpSynonym/update`,
    method: 'post',
    data: row
  })
}

// 导入
// export const importExcel = (data) => {
//   return request({
//     url: `${baseURL}api/${ai}/aiNlpSynonym/importExcel`,
//     method: 'post',
//     data
//   })
// }

export const exportExcel = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpSynonym/exportExcel`,
    method: 'post',
    data
  })
}

