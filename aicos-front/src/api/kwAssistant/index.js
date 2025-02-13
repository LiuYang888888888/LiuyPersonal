//健康度助手
import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {
  baseURL
} from '@/api/common';

const {knowledge} = serviceList;
//新增编辑设置
export const addEditAssistantSet = (detectEnable,detectFrequency,id,robotId) => {
  return request({
    url: `${baseURL}api/${knowledge}/healthConfig/save`,
    method: 'get',
    params: {
      detectEnable,
      detectFrequency,
      id,
      robotId,
    }
  })
}
//获取设置信息
export const getAssistantSet = (robotId) => {
  return request({
    url: `${baseURL}api/${knowledge}/healthConfig/query`,
    method: 'get',
    params: {
      robotId
    }
  })
}