import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
//查询列表
export const getListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/productLicense/listByPage`,
    method: 'post',
    data
  })
}
//新增
export const saveOrUpdateListData = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceOrganization/saveOrUpdateFormData`,
    method: 'post',
    data: row
  })
}
//删除
export const delListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceOrganization/delete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}
//提交
export const submitListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceOrganization/submit`,
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    method: 'post',
    data: id
  })
}
//审核通过
export const auditListData = (form) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceOrganization/complete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:form
  })
}
//审核不通过
export const auditNoListData = (form) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceOrganization/disagree`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:form
  })
}