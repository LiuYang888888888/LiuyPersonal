import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
//接口自定义
export const apiData = (data,url,method) => {
  return request({
    url: url,
    method: method,
    data
  })
}

//移动端图片上传
export const uploadImg = (data) => {
  return request({
    url: `/aicos/api/aicos-file/miniofile/upload?fromSystemName=base`,
    method: 'post',
    data
  })
}
/*服务机构*/
//查询列表
export const getListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceOrganization/listByPage`,
    method: 'post',
    data
  })
}
//查看
export const viewListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceOrganization/getById`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
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
//服务机构信息
export const getInfo = () => {
  return request({
    url: `${baseURL}api/aicos-second/member/get`,
    method: 'post',
  })
}
//导出
export const exportExcel = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceOrganization/exportExcel`,
    method: 'post',
    data: row
  })
}


/*服务项目*/
//查询列表
export const getListDataPro = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceItems/listByPage`,
    method: 'post',
    data
  })
}
//查看
export const viewListDataPro = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceItems/getById`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}

//新增
export const saveOrUpdateListDataPro = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceItems/saveOrUpdateFormData`,
    method: 'post',
    data: row
  })
}

//删除
export const delListDataPro = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceItems/delete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}
//提交
export const submitListDataPro = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceItems/submit`,
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    method: 'post',
    data: id
  })
}
//审核通过
export const auditListDataPro = (form) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceItems/complete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:form
  })
}
//审核不通过
export const auditNoListDataPro = (form) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceItems/disagree`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:form
  })
}
//导出
export const exportExcelxm = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceItems/exportExcel`,
    method: 'post',
    data: row
  })
}
/*军工三证*/
//查询列表
export const getListDataJungong = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/member/threeCertificates/listByPage`,
    method: 'post',
    data
  })
}


/*服务专家*/
//查询列表
export const getListDataEx = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceExperts/listByPage`,
    method: 'post',
    data
  })
}
//查看
export const viewListDataEx = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceExperts/getById`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}

//新增
export const saveOrUpdateListDataEx = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceExperts/saveOrUpdateFormData`,
    method: 'post',
    data: row
  })
}

//删除
export const delListDataEx = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceExperts/delete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}
//提交
export const submitListDataEx = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceExperts/submit`,
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    method: 'post',
    data: id
  })
}
//审核通过
export const auditListDataEx = (form) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceExperts/complete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:form
  })
}
//审核不通过
export const auditNoListDataEx = (form) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceExperts/disagree`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:form
  })
}
//导出
export const exportExcelzj = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceExperts/exportExcel`,
    method: 'post',
    data: row
  })
}
/*军工三证*/
//查询列表
export const getListDataMl = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/member/threeCertificates/listByPage`,
    method: 'post',
    data
  })
}
//查看
export const viewListDataMl = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/member/threeCertificates/getById`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}

//新增
export const saveOrUpdateListDataMl = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/threeCertificates/saveOrUpdateFormData`,
    method: 'post',
    data: row
  })
}

//删除
export const delListDataMl = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/member/threeCertificates/delete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}


//服务机构工作台
