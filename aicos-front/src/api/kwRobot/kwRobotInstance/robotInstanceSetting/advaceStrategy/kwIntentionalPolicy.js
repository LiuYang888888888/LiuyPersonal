//意图策略
import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {
  baseURL,

} from '@/api/common';

const {
  kwRobot,
  // knowledge
} = serviceList;
//意图策略列表
export const loadIntentionalPolicyList = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/intentStrategy/list`,
    method: 'post',
    data
  })
}

//新增编辑意图策略
export const addOrUpdataIntentionalPolicy = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/intentStrategy/saveOrUpdate`,
    method: 'post',
    data
  })
}

//删除意图策略
export const delIntentionalPolicy = (ids) => {
  return request({
    url: `${baseURL}api/${kwRobot}/intentStrategy/delete`,
    method: 'post',
    params: {
      ids
    }
  })
}
