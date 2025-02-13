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