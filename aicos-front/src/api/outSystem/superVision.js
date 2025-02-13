import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
/*民爆局监管体系*/
//查询列表
export const getListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/civilExplosives/listByPage`,
    method: 'post',
    data
  })
}
//新增
export const saveOrUpdateListData = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/civilExplosives/saveOrUpdateFormData`,
    method: 'post',
    data: row
  })
}
//删除
export const deleteListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/civilExplosives/delete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}

//getbyid
export const getById = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/civilExplosives/getById`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}
//提交
export const submitListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/civilExplosives/submit`,
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    method: 'post',
    data: id
  })
}
//审核通过
export const auditListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/civilExplosives/complete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:data
  })
}
//审核不通过
export const auditNoListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/civilExplosives/disagree`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:data
  })
}

//导出
export const exportExcel = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/civilExplosives/exportExcel`,
    method: 'post',
    data: row
  })
}

//导入
export const importExcel = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/civilExplosives/importExcel`,
    method: 'post',
    data: row
  })
}

// 下载模版
export const importTemplateFile = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/civilExplosives/importTemplateFile`,
    method: 'post',
    data: row
  })
}
