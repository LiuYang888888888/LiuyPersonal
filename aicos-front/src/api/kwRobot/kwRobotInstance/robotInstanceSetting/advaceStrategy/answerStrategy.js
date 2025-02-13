import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {
  baseURL,
} from '@/api/common';

const {kwRobot} = serviceList;

// 获取整个应答策略的数据
export const getAnswerStrategyUrl = (strategyId) => {
  return request({
    url: `${baseURL}api/${kwRobot}/replyStrategy/detail/${strategyId}`,
    method: 'post'
  })
}

// 获取会话模块列表
export const getSessionUrl = (botId) => {
  return request({
    url: `${baseURL}api/${kwRobot}/robotStrategy/getModule/${botId}`,
    method: 'post'
  })
}

// 保存基础和应答置信度
export const saveBasicAndAnswerUrl = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/replyStrategy/saveOrUpdate`,
    method: 'post',
    data
  })
}

// 自定义应答模块策略，保存策略
export const saveCustomStrategyUrl = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/huilan-robot-reply-custom-strategy/savaOrUpdate`,
    method: 'post',
    data
  })
}

// 自定义应答模块策略，删除策略
export const deleteStrategyUrl = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/huilan-robot-reply-custom-strategy/delete`,
    method: 'post',
    data
  })
}

// 自定义应答模块策略，启用或者停用策略
export const stopOrEnableStrategyUrl = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/huilan-robot-reply-custom-strategy/updateStatus`,
    method: 'post',
    data
  })
}

// 自定义应答模块策略，保存规则项
export const saveRuleUrl = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/huilan-robot-reply-custom-strategy/saveOrUpdate`,
    method: 'post',
    data
  })
}

// 获取自定义规则数据
export const getRuleDetailUrl = (ruleId) => {
  return request({
    url: `${baseURL}api/${kwRobot}/replyStrategy/ruleDetail/${ruleId}`,
    method: 'post'
  })
}

// 删除自定义规则
export const deleteRuleUrl = (ruleId) => {
  return request({
    url: `${baseURL}api/${kwRobot}/replyStrategy/deleteRule/${ruleId}`,
    method: 'post'
  })
}

// 获取拒识模块列表
export const getRefuseWordsUrl = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/replyStrategy/listRefuseWords`,
    method: 'post',
    data
  })
}

// 保存拒识模块
export const saveRefuseWordsUrl = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/replyStrategy/addRefuseModule`,
    method: 'post',
    data
  })
}
