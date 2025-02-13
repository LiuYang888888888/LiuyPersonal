import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';

// 查询本人文章list
export const queryList = (params) => {
  return request({
    url: `${baseURL}api/aicos-second/member/article/queryList`,
    method: 'post',
    data:params,
  })
}

// 查询栏目list
export const queryPageList = (params) => {
  return request({
    url: `${baseURL}api/aicos-second/member/article/queryPageList`,
    method: 'post',
    data:params
  })
}

// 查询栏目list
export const queryPagePList = (params) => {
  return request({
    url: `${baseURL}api/aicos-second/member/article/queryPagePList`,
    method: 'post',
    data:params
  })
}

// 根据文章ID删除
export const deleteById = (params) => {
  return request({
    url: `${baseURL}api/aicos-second/member/article/delete`,
    method: 'post',
    data:params
  })
}

// 根据文章id--查询详情
export const getById = (params) => {
  return request({
    url: `${baseURL}api/aicos-second/member/article/get`,
    method: 'post',
    data:params
  })
}

// 保存文章
export const saveArticle = (params) => {
  return request({
    url: `${baseURL}api/aicos-second/member/article/save`,
    method: 'post',
    data:params,
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
  })
}
