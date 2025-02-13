import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
//查询列表
export const getListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/member/consultancy/listByPage`,
    method: 'post',
    data
  })
}
//新增
export const saveOrUpdateListData = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/safetyExamination/saveOrUpdateFormData`,
    method: 'post',
    data: row
  })
}
//删除
export const deleteListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/safetyExamination/delete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}
//回复
export const submitListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/safetyExamination/submit`,
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    method: 'post',
    data: id
  })
}