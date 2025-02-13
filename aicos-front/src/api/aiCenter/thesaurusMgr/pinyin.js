import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { ai } = serviceList
//拼音分页列表
export const listByPage = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpPinyin/listPage`,
    method: 'post',
    data
  })
}
//拼音新增
export const save = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpPinyin/save`,
    method: 'post',
    data
  })
}
//拼音单行删除
export const properDelete = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpPinyin/delete`,
    method: 'post',
    data
  })
}
//拼音单行编辑
export const properUpdate = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpPinyin/update`,
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
//敏感词批量删除
export const deleteBatch = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpPinyin/deleteBatch`,
    method: 'post',
    data
  })
}

