import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import { baseURL } from '@/api/common';

const { ai } = serviceList
//专有词分页列表
export const listByPage = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpProper/listByPage`,
    method: 'post',
    data
  })
}
//专有词新增
export const save = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpProper/save`,
    method: 'post',
    data
  })
}
//专有词单行删除
export const properDelete = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpProper/delete`,
    method: 'post',
    data
  })
}
//专有词单行编辑
export const properUpdate = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpProper/update`,
    method: 'post',
    data
  })
}
//专有词批量删除
export const deleteBatch = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpProper/deleteBatch`,
    method: 'post',
    data
  })
}
//专有词批量导出
export const properExportExcel = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpProper/exportExcel`,
    method: 'post',
    data
  })
}
//专有词批量导入
export const properImportExcel = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpProper/importExcel`,
    method: 'post',
    data
  })
}

