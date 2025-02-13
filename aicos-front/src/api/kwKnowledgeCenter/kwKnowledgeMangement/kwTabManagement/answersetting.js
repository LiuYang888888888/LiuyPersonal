import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {
  baseURL
} from '@/api/common';

const {
  knowledge
} = serviceList;

//答案列表接口
export const listData = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-tableqa-answer/getList`,
    method: 'post',
    data
  })
}

//新增编辑答案
export const saveOrUpdate = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-tableqa-answer/saveOrUpdate`,
    method: 'post',
    data
  })
}

//修改状态 启用,停用
export const updateEnabled = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-tableqa-answer/enableAndDisable`,
    method: 'get',
    params: {
      ...data
    }
  })
}
// 发布
export const publishFaqUrl = (id) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-tableqa-answer/publish`,
    method: 'get',
    params: {
      id
    }
  })
}
//删除
export const remove = (ids) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-tableqa-answer/delete`,
    method: 'get',
    params: {
      ids
    }
  })
}
// 查询答案动态字段
export const getTableSetting = (tableQaId) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-tableqa-answer/getTableSetting`,
    method: 'get',
    params: {
      tableQaId
    }
  })
}
// 答案详情
export const getDetail = (id) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-tableqa-answer/getDetail`,
    method: 'get',
    params: {
      id
    }
  })
}
// 答案视角树结构
export const getForestTree = (robotId) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-answer-angle/getForestTree`,
    method: 'get',
    params: {
      robotId
    }
  })
}

// 版本记录
export const versionListUrl = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-tableqa-answer/versionRecord`,
    method: 'get',
    params: {
      ...data
    }
  })
}
// 同步知识
export const oneKeySync = (tableQaId) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-tableqa-answer/oneKeySync`,
    method: 'get',
    params: {
      tableQaId
    }
  })
}
// 答案版本记录接口
export const versionAnswer = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/answerHistory/history`,
    method: 'get',
    params: {
      ...data
    }
  })
}
// 获取当前知识主体下有无通用视角
export const getEmptyAngle = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-tableqa-answer/checkNotBoundAngle`,
    method: 'get',
    params: {
      ...data
    }
  })
}