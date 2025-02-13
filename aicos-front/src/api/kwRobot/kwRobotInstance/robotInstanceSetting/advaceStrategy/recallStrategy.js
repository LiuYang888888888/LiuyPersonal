//召回策略
import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {
  baseURL,

} from '@/api/common';

const {
  system,
  kwRobot,
  // knowledge
} = serviceList;
//左侧会话模块列表
export const conversationList = (botId) => {
  return request({
    url: `${baseURL}api/${kwRobot}/robotStrategy/getModule/${botId}`,
    method: 'post',
  })
}
//会话模块表单
export const recallListData = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseDict/getDictItemListByDictCode`,
    method: 'post',
    data
  })
}
//会话模块表单保存
export const saveRecallListData = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/recallStrategy/saveOrUpdate`,
    method: 'post',
    data
  })
}
//会话表单详情
export const recallListDetail = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/recallStrategy/getRecallStrategy`,
    method: 'post',
    data
  })
}
//召回策略保存
export const finalSave = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/recallStrategy/finalSave`,
    method: 'post',
    data
  })
}
