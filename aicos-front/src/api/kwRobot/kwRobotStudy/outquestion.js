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
// 被踩列表
export const selectList = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/robotStudy/poor/selectList`,
    method: 'post',
    data
  })
}
// 被踩详情列表

export const detailList = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/robotStudy/poor/detail/selectList`,
    method: 'post',
    data
  })
}
// 被踩列表删除
export const deleteByIds = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/robotStudy/poor/deleteByIds`,
    method: 'post',
    data
  })
}
// 被踩列表详情删除
export const detailDeleteByIds = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/robotStudy/poor/detail/deleteByIds`,
    method: 'post',
    data
  })
}
// 被踩列表导出
export const exportExcel = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/robotStudy/poor/export`,
    method: 'post',
    responseType: 'blob',
    data
  })
}