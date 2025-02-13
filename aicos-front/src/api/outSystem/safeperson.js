import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
/*安全管理人员考核*/
//查询列表
export const getListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/safetyExamination/listByPage`,
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

//getById
export const getById = (params) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/safetyExamination/getById`,
    method: 'post',
    data: params,
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
  })
}

//提交
export const submitListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/safetyExamination/submit`,
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    method: 'post',
    data: id
  })
}
//审核通过
export const auditListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/safetyExamination/complete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:data
  })
}
//审核不通过
export const auditNoListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/safetyExamination/disagree`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:data
  })
}

//导出
export const exportExcel = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/safetyExamination/exportExcel`,
    method: 'post',
    data: row
  })
}

//导入
export const importExcel = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/safetyExamination/importExcel`,
    method: 'post',
    data: row
  })
}

// 下载模版
export const importTemplateFile = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/safetyExamination/importTemplateFile`,
    method: 'post',
    data: row
  })
}

