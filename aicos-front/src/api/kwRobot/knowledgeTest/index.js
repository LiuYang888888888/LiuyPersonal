import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {
  baseURL
} from '@/api/common';

const {
  knowledge
} = serviceList;

// 获取知识库检测时间
export const getRobot = () => {
  return request({
    url: `${baseURL}api/${knowledge}/kmDetection/getRobot`,
    method: 'get',
  })
}
// 开始检测操作
export const doDetection = (params) => {
  return request({
    url: `${baseURL}api/${knowledge}/kmDetection/doDetection`,
    method: 'get',
    params:{
      ...params,
    }
  })
}
// 获取实时检测进度
export const detectionDetail = (params) => {
  return request({
    url: `${baseURL}api/${knowledge}/kmDetection/detectionDetail`,
    method: 'get',
    params:{
      ...params,
    }
  })
}

// 获取检测结果
export const detectionResult = (params) => {
  return request({
    url: `${baseURL}api/${knowledge}/kmDetection/detectionResult`,
    method: 'get',
    params:{
      ...params,
    }
  })
}
// 末级意图未关联推荐响应列表
export const intentLeafNodeNoneBoundKm = (params) => {
  return request({
    url: `${baseURL}api/${knowledge}/kmDetection/intentLeafNodeNoneBoundKm`,
    method: 'get',
    params:{
      ...params,
    }
  })
}
// 答案中链接已失效列表
export const invalidLink = (params) => {
  return request({
    url: `${baseURL}api/${knowledge}/kmDetection/invalidLink`,
    method: 'get',
    params:{
      ...params,
    }
  })
}
// 表单配置中未设置答案展示字段列表
export const noShown = (params) => {
  return request({
    url: `${baseURL}api/${knowledge}/kmDetection/noShown`,
    method: 'get',
    params:{
      ...params,
    }
  })
}
// 存在已失效答案视角列表
export const invalidAngle = (params) => {
  return request({
    url: `${baseURL}api/${knowledge}/kmDetection/invalidAngle`,
    method: 'get',
    params:{
      ...params,
    }
  })
}
// 存在未发布知识列表
export const noPublish = (params) => {
  return request({
    url: `${baseURL}api/${knowledge}/kmDetection/noPublish`,
    method: 'get',
    params:{
      ...params,
    }
  })
}
// 未配置意图引导展示名称
export const noDisplayName = (params) => {
  return request({
    url: `${baseURL}api/${knowledge}/kmDetection/noDisplayName`,
    method: 'get',
    params:{
      ...params,
    }
  })
}
// 意图问法重复
export const intentQuestionRepeat = (params) => {
  return request({
    url: `${baseURL}api/${knowledge}/kmDetection/intentQuestionRepeat`,
    method: 'get',
    params:{
      ...params,
    }
  })
}
