//意图相关
import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {
  baseURL
} from '@/api/common';

const {
  knowledge
} = serviceList;

//意图列表
///aicos-knowledge/km-intent/list
export const intentList = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-intent/list`,
    method: 'post',
    data
  })
}

//新建意图
// /aicos-knowledge/km-intent/saveOrUpdate
export const saveOrUpdate = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-intent/saveOrUpdate`,
    method: 'post',
    data
  })
}

//查看该条知识
// /aicos-knowledge/km-intent/detail
export const detail = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-intent/detail`,
    method: 'post',
    data
  })
}

//判断是否同名
// /aicos-knowledge/km-intent/isSameName

export const isSameName = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-intent/isSameName`,
    method: 'post',
    data
  })
}

//删除单条数据
// /aicos-knowledge/km-intent/delete
export const intentDelete = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-intent/delete`,
    method: 'post',
    data
  })
}

//批量删除
// /aicos-knowledge/km-intent/batchDelete

export const batchDelete = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-intent/batchDelete`,
    method: 'post',
    data
  })
}

//导出
// /aicos-knowledge/km-intent/export
export const intentionExport = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-intent/export`,
    method: 'post',
    data
  })
}


//获取所有的一级关系推理
// /aicos-knowledge/km-intentRelation/topNodes
export const topNodes = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-intentRelation/topNodes`,
    method: 'post',
    data
  })
}

//获取关系推理
// /aicos-knowledge/km-intentRelation/canvasList/{botId}
export const canvasList = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-intentRelation/canvasList`,
    method: 'post',
    data
  })
}

//意图节点连线操作
// /aicos-knowledge/km-intentRelation/move
export const move = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-intentRelation/move`,
    method: 'post',
    data
  })
}


//获取所有的字节点,用于做展开收起用
// /aicos-knowledge/km-intentRelation/sonNodes/{id}
export const sonNodes = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-intentRelation/sonNodes/${data}`,
    method: 'post',
  })
}


//节点的搜索
// /aicos-knowledge/km-intentRelation/searchTopNode
export const searchTopNode = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-intentRelation/searchTopNode`,
    method: 'post',
    data
  })
}

//获取知识数量
// /aicos-knowledge/km-intentRelation/knowledgeCount/{id}
export const knowledgeCount = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-intentRelation/knowledgeCount`,
    method: 'post',
    data
  })
}

//导入意图
// /aicos-knowledge/km-intent/importExcel
export const importExcel = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-intent/importExcel`,
    method: 'post',
    timeout: 6000000,
    data
  })
}
// 绑定知识移动意图接口
export const knowledgeSwitchingIntent = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-intentRelation/knowledgeSwitchingIntent`,
    method: 'get',
    params:{
      ...data
    }
  })
}
// 查询移动选择数据 
export const knowledgeCorrelation = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-intentRelation/knowledgeCorrelation`,
    method: 'get',
    params:{
      ...data
    }
  })
}

// 对话流程分类
export const allAiccCategory = () => {
  return request({
    url: `${baseURL}api/${knowledge}/km-intent/allAiccCategory`,
    method: 'get',
  })
}
// 对话流程
export const aiccSpeechListByCategory = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-intent/aiccSpeechListByCategory`,
    method: 'post',
    data
  })
}
// 流程
export const aiccFlowBySpeechId = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-intent/aiccFlowBySpeechId`,
    method: 'post',
    data
  })
}
// 节点 
export const aiccNodeByFlowId = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-intent/aiccNodeByFlowId`,
    method: 'post',
    data
  })
}
// 意图绑定对话流程功能是否打开
export const connectAiccEnable = () => {
  return request({
    url: `${baseURL}api/${knowledge}/km-intent/connectAiccEnable`,
    method: 'get',
  })
}
// 意图同步
export const batchSyncToEs = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-intent/batchSyncToEs`,
    method: 'post',
    data
  })
}