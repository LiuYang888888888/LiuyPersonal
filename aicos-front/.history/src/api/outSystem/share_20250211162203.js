import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
//查询
export const getListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/sharingAchievements/listByPage`,
    method: 'post',
    data
  })
}
//查询共享列表
export const getListDataShare = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/sharingAchievements/listShareByPage`,
    method: 'post',
    data
  })
}
// getById
export const getById = (params) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/sharingAchievements/getById`,
    method: 'post',
    data: params,
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
  })
}
//新增
export const saveOrUpdateListData = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/sharingAchievements/saveOrUpdateFormData`,
    method: 'post',
    data: row
  })
}
//删除
export const delListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/sharingAchievements/delete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}
//提交
export const submitListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/sharingAchievements/submit`,
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    method: 'post',
    data: id
  })
}
//审核通过
export const auditListData = (form) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/sharingAchievements/complete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:form
  })
}
//审核不通过
export const auditNoListData = (form) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/sharingAchievements/disagree`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:form
  })
}
//导出
export const exportExcel = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/sharingAchievements/exportExcel`,
    method: 'post',
    data: row
  })
}

//导入
export const importExcel = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/sharingAchievements/importExcel`,
    method: 'post',
    data: row
  })
}

// 下载模版
export const importTemplateFile = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/sharingAchievements/importTemplateFile`,
    method: 'post',
    data: row
  })
}

//共享单位
export const getEnterList = (data) => {
  request({
    url: `${baseURL}api/aicos-second/mbj/sharingAchievements/saveXiafa`,
    method: 'post',
    data
  })
}

//工作台
export const getWorkList = () => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/util/getSharingAchievementsInfo`,
    method: 'post',
  })
}
