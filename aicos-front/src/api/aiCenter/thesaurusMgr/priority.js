import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { ai } = serviceList
//词优先级分页列表
export const listByPage = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpBusiness/listPage`,
    method: 'post',
    data
  })
}
//词优先级新增
export const save = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpBusiness/save`,
    method: 'post',
    data
  })
}
//词优先级单行删除
export const properDelete = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpBusiness/delete`,
    method: 'post',
    data
  })
}
//词优先级单行编辑
export const properUpdate = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpBusiness/update`,
    method: 'post',
    data
  })
}
//词优先级批量删除
export const deleteBatch = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpBusiness/deleteBatch`,
    method: 'post',
    data
  })
}

//词优先级批量导入
export const properImportExcel = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpBusiness/importExcel`,
    method: 'post',
    data
  })
}

//词优先级批量导出
export const aiNlpBusinessExportExcel = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpBusiness/exportExcel`,
    method: 'post',
    data
  })
}

