import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
/*民爆局应急体系*/
//查询列表
export const getListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/emergencySystem/listByPage`,
    method: 'post',
    data
  })
}
//新增
export const saveOrUpdateListData = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/emergencySystem/saveOrUpdateFormData`,
    method: 'post',
    data: row
  })
}
//getById
export const getById = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/emergencySystem/getById`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}

//删除
export const deleteListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/emergencySystem/delete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}
//提交
export const submitListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/emergencySystem/submit`,
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    method: 'post',
    data: id
  })
}
//审核通过
export const auditListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/emergencySystem/complete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:data
  })
}
//审核不通过
export const auditNoListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/emergencySystem/disagree`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:data
  })
}

//导出
export const exportExcel = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/emergencySystem/exportExcel`,
    method: 'post',
    data: row
  })
}

//导入
export const importExcel = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/emergencySystem/importExcel`,
    method: 'post',
    data: row
  })
}

// 下载模版
export const importTemplateFile = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/emergencySystem/importTemplateFile`,
    method: 'post',
    data: row
  })
}
