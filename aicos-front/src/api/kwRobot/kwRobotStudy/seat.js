import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {
  baseURL,
} from '@/api/common';

const {
  kwRobot,
} = serviceList;

// 坐席登记问题列表
export const selectList = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/robotStudy/agent/selectList`,
    method: 'post',
    data
  })
}
// 删除or批量删除
export const deleteByIds = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/robotStudy/agent/deleteByIds`,
    method: 'post',
    data
  })
}
// 坐席列表导出
export const exportExcel = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/robotStudy/agent/export`,
    method: 'post',
    responseType: 'blob',
    data
  })
}