import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { ai } = serviceList
//敏感词分页列表
export const listByPage = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpSensitive/listPage`,
    method: 'post',
    data
  })
}
//敏感词新增
export const save = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpSensitive/save`,
    method: 'post',
    data
  })
}
//敏感词单行删除
export const properDelete = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpSensitive/delete`,
    method: 'post',
    data
  })
}
//敏感词单行编辑
export const properUpdate = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpSensitive/update`,
    method: 'post',
    data
  })
}
//敏感词批量删除
export const deleteBatch = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpSensitive/deleteBatch`,
    method: 'post',
    data
  })
}
//敏感词批量导出
export const properExportExcel = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpSensitive/exportExcel`,
    method: 'post',
    data
  })
}
//敏感词批量导入
export const properImportExcel = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpSensitive/importExcel`,
    method: 'post',
    data
  })
}

