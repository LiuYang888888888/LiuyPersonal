import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { ai } = serviceList

export const getList = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpDisambiguation/listPage`,
    method: 'post',
    data
  })
}

export const remove = (id) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpDisambiguation/delete`,
    method: 'post',
    data: {
      id,
    }
  })
}
export const removeBatch = (id) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpDisambiguation/deleteBatch`,
    method: 'post',
    data: {
      id,
    }
  })
}

export const add = (row) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpDisambiguation/save`,
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpDisambiguation/update`,
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
    url: `${baseURL}api/${ai}/aiNlpDisambiguation/exportExcel`,
    method: 'post',
    data
  })
}

