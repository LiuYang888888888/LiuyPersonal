import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {
  baseURL
} from '@/api/common';

const {
  knowledge
} = serviceList;

// 查询任务列表
export const taskList = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-knowledge-test-task/taskList`,
    method: 'post',
    data
  })
}
//新增任务保存
export const saveTask = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-knowledge-test-task/crete/testTask`,
    method: 'post',
    data
  })
}
// 编辑任务保存
export const editTask = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-knowledge-test-task/update/taskName`,
    method: 'get',
    params: {
      ...data
    }
  })
}
// 立即测试
export const doDetection = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-knowledge-test-task/start/testTask`,
    method: 'post',
    params: {
      ...data,
    }
  })
}
// 测试统计列表
export const taskBatchList = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-knowledge-test-task/taskBatchList`,
    method: 'get',
    params: {
      ...data,
    }
  })
}
// 测试结果批次数据
export const taskBatchSeqList = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-knowledge-test-task/taskBatchSeqList`,
    method: 'get',
    params: {
      ...data,
    }
  })
}
// 根据批次号查询测试结果
export const getBatchDetailsList = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-knowledge-test-task/getBatchDetailsList`,
    method: 'post',
    data
  })
}
// 创建知识计数统计
export const createKnowledgeCount = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-knowledge-test-task/taskBatch/createKnowledge/count`,
    method: 'get',
    params:{
      ...data,
    }
  })
}
// 知识标注计数统计
export const labelKnowledgeCount = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-knowledge-test-task/taskBatch/labelKnowledge/count`,
    method: 'get',
    params:{
      ...data,
    }
  })
}
// 测试结果批量导出
export const exportTaskBatch = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-knowledge-test-task/taskBatch/export`,
    method: 'post',
    responseType: 'blob',
    data
  })
}
// 测试统计批量导出
export const exportTaskDetails = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-knowledge-test-task/taskDetails/export`,
    method: 'post',
    responseType: 'blob',
    data
  })
}
// 测试任务删除
export const deleteTask = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-knowledge-test-task/delete`,
    method: 'post',
    data
  })
}