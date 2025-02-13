import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
//问卷设计模板列表查询
export const shejiList = (current, size, params) => {
  return request({
    url: '/api/questionnaire/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
//修改问卷状态
export const editStatus = (row) => {
  return request({
    url: '/api/questionnaire/update',
    method: 'post',
    data: row
  })
}
//调查问卷问题删除
export const delQuestion = (ids) => {
  return request({
    url: '/api/questions/remove',
    method: 'post',
    params: {
      ids
    }
  })
}
//问卷设计删除问题选项
export const delOption = (ids) => {
  return request({
    url: '/api/questionOption/remove',
    method: 'post',
    params: {
      ids
    }
  })
}