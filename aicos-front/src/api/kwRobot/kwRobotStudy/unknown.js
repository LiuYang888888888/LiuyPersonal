import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {
  baseURL,
} from '@/api/common';

const {
  kwRobot,
} = serviceList;

// 预警新增编辑接口
export const saveOrUpdate = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/earlyWarning/saveOrUpdate`,
    method: 'post',
    data
  })
}
// 预警详情
export const detail = (type) => {
  return request({
    url: `${baseURL}api/${kwRobot}/earlyWarning/detail`,
    method: 'get',
    params:{
      type
    }
  })
}
// 未知问题列表
export const selectList = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/robotStudy/unknown/selectList`,
    method: 'post',
    data
  })
}
// 详情列表

export const detailList = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/robotStudy/unknown/detail/selectList`,
    method: 'post',
    data
  })
}
// 列表删除
export const deleteByIds = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/robotStudy/unknown/deleteByIds`,
    method: 'post',
    data
  })
}
// 列表详情删除
export const detailDeleteByIds = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/robotStudy/unknown/detail/deleteByIds`,
    method: 'post',
    data
  })
}
// 未知问题导出
export const exportUnknown = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/robotStudy/unKnown/export`,
    method: 'post',
    responseType: 'blob',
    data
  })
}
// 原始问题导出
export const exportOriginal = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/robotStudy/original/export`,
    method: 'post',
    responseType: 'blob',
    data
  })
}