import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
//调试或整体打包时使用END

import serviceList from '@/config/serviceList';

const {
  exam
} = serviceList

/*阅卷管理列表*/
export const getList = (data) => {
  return request({
    url: `${baseURL}api/${exam}/reviewExam/pageList`,
    method: 'post',
    data
  })
}
// 答案列表
export const getAnswerSheet = (data) => {
  return request({
    url: `${baseURL}api/${exam}/reviewExam/reviewExamAnswerList`,
    method: 'post',
    data
  })
}
// 批阅详情
export const getExamDetail = (data) => {
  return request({
    url: `${baseURL}api/${exam}/reviewExam/detail`,
    method: 'get',
    params: {
      ...data
    }
  })
}
//更新批阅
export const saveOrUpdate = (data) => {
  return request({
    url: `${baseURL}api/${exam}/reviewExam/saveOrUpdate`,
    method: 'post',
    data
  })
}