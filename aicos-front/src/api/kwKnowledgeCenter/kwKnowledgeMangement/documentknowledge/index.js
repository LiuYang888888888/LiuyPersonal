import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {
  baseURL
} from '@/api/common';

const {
  knowledge
} = serviceList;

//文档知识列表
export const listData = (current, size, params) => {
  return request({
    url: `${baseURL}api/${knowledge}/fileKnowledge/selectList`,
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
//文档知识详情
export const detail = (id) => {
  return request({
    url: `${baseURL}api/${knowledge}/fileKnowledge/detail`,
    method: 'get',
    params: {
      id
    }
  })
}
//新增文档知识
export const save = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/fileKnowledge/save`,
    method: 'post',
    data
  })
}

//修改状态 启用,停用
export const updateEnabled = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/fileKnowledge/enableOrDisable`,
    method: 'get',
    params: {
      ...data
    }
  })
}

//删除
export const remove = (ids) => {
  return request({
    url: `${baseURL}api/${knowledge}/fileKnowledge/delete`,
    method: 'post',
    params: {
      ids
    }
  })
}
//编辑
export const update = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/fileKnowledge/update`,
    method: 'post',
    data
  })
}
/* 知识标注模块接口*/
//所属分类
export const selectList = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-classify/selectList`,
    method: 'post',
    data
  })
}
// 所属意图查询
export const selectIntentListWithRobot = (robotId)=>{
  return request({
    url: `${baseURL}api/${knowledge}/faqQuestion/selectIntentListWithRobot`,
    method: 'get',
    params:{
      robotId
    }
  })
}
// 根据问题查询意图
export const recommendIntent = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-intentRelation/recommendIntent`,
    method: 'post',
    data
  })
}
/**
 * 专有词
 */
// 分词结果接口查询
export const fileKnowledgeSplit = (data)=>{
  return request({
    url: `${baseURL}api/${knowledge}/fileKnowledge/split`,
    method: 'post',
    data
  })
}
// 根据知识id查询专有词
export const selectProperByKnId = (data)=>{
  return request({
    url: `${baseURL}api/${knowledge}/fileKnowledge/selectProperByKnId`,
    method: 'post',
    data
  })
}
// 新增专有词
export const saveProper = (data)=>{
  return request({
    url: `${baseURL}api/${knowledge}/fileKnowledge/saveProper`,
    method: 'post',
    data
  })
}
// 编辑专有词
export const updateProper = (data)=>{
  return request({
    url: `${baseURL}api/${knowledge}/fileKnowledge/updateProper`,
    method: 'post',
    data
  })
}
// 根据id删除专有词
export const deleteProperById = (data)=>{
  return request({
    url: `${baseURL}api/${knowledge}/fileKnowledge/deleteProperById`,
    method: 'post',
    data
  })
}
// 批量删除专有词
export const deleteProperBatch = (data)=>{
  return request({
    url: `${baseURL}api/${knowledge}/fileKnowledge/deleteProperBatch`,
    method: 'post',
    data
  })
}
/**
 * 敏感词
 */
// 根据知识id查询敏感词
export const selectSensitiveByKnId = (data)=>{
  return request({
    url: `${baseURL}api/${knowledge}/fileKnowledge/selectSensitiveByKnId`,
    method: 'post',
    data
  })
}
// 新增敏感词
export const saveSensitive = (data)=>{
  return request({
    url: `${baseURL}api/${knowledge}/fileKnowledge/saveSensitive`,
    method: 'post',
    data
  })
}
// 编辑敏感词
export const updateSensitive = (data)=>{
  return request({
    url: `${baseURL}api/${knowledge}/fileKnowledge/updateSensitive`,
    method: 'post',
    data
  })
}
// 根据id删除敏感词
export const deleteSensitiveById = (data)=>{
  return request({
    url: `${baseURL}api/${knowledge}/fileKnowledge/deleteSensitiveById`,
    method: 'post',
    data
  })
}
// 批量删除敏感词
export const deleteSensitiveBatch = (data)=>{
  return request({
    url: `${baseURL}api/${knowledge}/fileKnowledge/deleteSensitiveBatch`,
    method: 'post',
    data
  })
}
/**
 * 实体词，实体
 */
// 新增实体词
export const saveEntity = (data)=>{
  return request({
    url: `${baseURL}api/${knowledge}/fileKnowledge/saveEntity`,
    method: 'post',
    data
  })
}
// 查询实体词
export const selectEntityByKnId = (data)=>{
  return request({
    url: `${baseURL}api/${knowledge}/fileKnowledge/selectEntityByKnId`,
    method: 'post',
    data
  })
}
// 保存实例
export const saveEntityWord = (data)=>{
  return request({
    url: `${baseURL}api/${knowledge}/fileKnowledge/saveEntityWord`,
    method: 'post',
    data
  })
}
// 根据知识id查询实例
export const selectEntityWordByKnId = (data)=>{
  return request({
    url: `${baseURL}api/${knowledge}/fileKnowledge/selectEntityWordByKnId`,
    method: 'post',
    data
  })
}
// 删除实例
export const deleteEntityWordById = (data)=>{
  return request({
    url: `${baseURL}api/${knowledge}/fileKnowledge/deleteEntityWordById`,
    method: 'post',
    data
  })
}
// 编辑实例
export const updateEntityWord = (data)=>{
  return request({
    url: `${baseURL}api/${knowledge}/fileKnowledge/updateEntityWord`,
    method: 'post',
    data
  })
}
// 批量删除实例
export const deleteEntityWordBatch = (data)=>{
  return request({
    url: `${baseURL}api/${knowledge}/fileKnowledge/deleteEntityWordBatch`,
    method: 'post',
    data
  })
}

/**
 * 根据知识id查询faq标注
 */
export const selectFaqByKnId = (fileKnowledgeId)=>{
  return request({
    url: `${baseURL}api/${knowledge}/fileKnowledge/selectFaqByKnId`,
    method: 'get',
    params:{
      fileKnowledgeId
    }
  })
}
//根据标注id查询具体数据
export const getById = (fileKnowledgeId)=>{
  return request({
    url: `${baseURL}api/${knowledge}/faqQuestion/getById`,
    method: 'get',
    params:{
      fileKnowledgeId
    }
  })
}
