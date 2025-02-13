import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { ai } = serviceList
//词共现分页列表
export const listByPage = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpKnowledgePointWord/listPage`,
    method: 'post',
    data
  })
}
//词共现新增
export const save = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpKnowledgePointWord/save`,
    method: 'post',
    data
  })
}
//词共现单行删除
export const properDelete = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpKnowledgePointWord/delete
    `,
    method: 'post',
    data
  })
}
//词共现单行编辑
export const properUpdate = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpKnowledgePointWord/update`,
    method: 'post',
    data
  })
}
//词共现批量删除
export const deleteBatch = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpKnowledgePointWord/deleteBatch`,
    method: 'post',
    data
  })
}


