import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {
  baseURL,
} from '@/api/common';

const {
  kwRobot,
} = serviceList;
// 新词列表
export const newWordList = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/robotStudy/newWord/selectList`,
    method: 'post',
    data
  })
}
// 新词忽略
export const deleteByIds = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/robotStudy/newWord/deleteByIds`,
    method: 'post',
    data
  })
}