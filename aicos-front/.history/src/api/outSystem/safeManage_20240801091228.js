import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
//查询
export const getListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/securityAdministration/listByPage`,
    method: 'post',
    data
  })
}
//新增
export const saveOrUpdateListData = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/securityAdministration/saveOrUpdateFormData`,
    method: 'post',
    data: row
  })
}
//删除
export const delListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/securityAdministration/delete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}
//提交
export const submitListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/securityAdministration/submit`,
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
//接收单位
export const danwei = (name) => {
  return request({
    url: `${baseURL}api/aicos-second/member/getEnterpriseNameListByQuery`,
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    method: 'post',
    data: name
  })
}

//导出
export const exportExcel = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/securityAdministration/exportExcel`,
    method: 'post',
    data: row
  })
}