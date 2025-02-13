import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { ai,system } = serviceList

// 变量词分页列表
export const listPage = (row) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpVariable/listPage`,
    method: 'post',
    data: row
  })
}
// 变量词新增
export const save = (row) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpVariable/save`,
    method: 'post',
    data: row
  })
}
// 变量词单行删除
export const aiNlpVariableDelete = (row) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpVariable/delete`,
    method: 'post',
    data: row
  })
}
// 变量词编辑
export const update = (row) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpVariable/update`,
    method: 'post',
    data: row
  })
}
// 变量词编辑
export const getBasePluginById = (row) => {
  return request({
    url: `${baseURL}api/${system}/basePlugin/getBasePluginById`,
    method: 'post',
    data: row
  })
}
// 变量词批量删除
export const deleteBatch = (row) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpVariable/deleteBatch`,
    method: 'post',
    data: row
  })
}
// 插件库请求参数配置参数类型
export const getDictItemListByDictCode = (row) => {
  return request({
    url: `${baseURL}api/${system}/baseDict/getDictItemListByDictCode`,
    method: 'post',
    data: row
  })
}
