import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
//查询
export const getListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/documentDistribution/listByPage`,
    method: 'post',
    data
  })
}
//新增
export const saveOrUpdateListData = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/documentDistribution/saveOrUpdateFormData`,
    method: 'post',
    data: row
  })
}
//删除
export const delListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/documentDistribution/delete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}
//提交
export const submitListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/documentDistribution/submit`,
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    method: 'post',
    data: id
  })
}
//接收单位
export const danwei = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/getEnterpriseNameListByQuery`,
    method: 'post',
    data: row
  })
}