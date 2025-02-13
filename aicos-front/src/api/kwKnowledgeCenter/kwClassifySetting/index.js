//分类设置相关

import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {
  baseURL
} from '@/api/common';

const {
  knowledge
} = serviceList;
//分类属性结构
///aicos-knowledge/km-classify/treeList
export const treeList = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-classify/treeList`,
    method: 'post',
    data
  })
}

//根据父级获取子级数据
// /aicos-knowledge/km-classify/sonList
export const sonList = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-classify/sonList`,
    method: 'post',
    data
  })
}

//新增分类
// /aicos-knowledge/km-classify/saveOrUpdate
export const saveOrUpdate = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-classify/saveOrUpdate`,
    method: 'post',
    data
  })
}

//上移,下移

///aicos-knowledge/km-classify/changeOrder
export const changeOrder = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-classify/changeOrder`,
    method: 'post',
    data
  })
}

//修改状态 启用/停用

// /aicos-knowledge/km-classify/status
export const changeStatus = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-classify/status`,
    method: 'post',
    data
  })
}

//批量修改状态
// /aicos-knowledge/km-classify/batchStatus
export const batchStatus = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-classify/batchStatus`,
    method: 'post',
    data
  })
}
//删除分类
// /aicos-knowledge/km-classify/delete
export const classifyDelete = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-classify/delete`,
    method: 'post',
    data
  })
}

//批量删除
// /aicos-knowledge/km-classify/batchDelete
export const batchDelete = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-classify/batchDelete`,
    method: 'post',
    data
  })
}

//移动节点
// /aicos-knowledge/km-classify/move
export const moveNode = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-classify/move`,
    method: 'post',
    data
  })
}

//批量移动
///aicos-knowledge/km-classify/batchMove
export const batchMove = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-classify/batchMove`,
    method: 'post',
    data
  })
}

//收藏
// /aicos-knowledge/km-classify-mine/collect
export const collect = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-classify-mine/collect`,
    method: 'post',
    data
  })
}

//取消收藏
// /aicos-knowledge/km-classify-mine/cancel

export const cancel = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-classify-mine/cancel`,
    method: 'post',
    data
  })
}

//搜索
// /aicos-knowledge/km-classify/treeSearch
export const treeSearch = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-classify/treeSearch`,
    method: 'post',
    data
  })
}
