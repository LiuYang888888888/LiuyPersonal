import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
/*军口供应信息*/
//查询列表
export const getListDataPro = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceJKItems/listByPage`,
    method: 'post',
    data
  })
}
//查看
export const viewListDataPro = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceJKItems/getById`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}

//新增
export const saveOrUpdateListDataPro = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceJKItems/saveOrUpdateFormData`,
    method: 'post',
    data: row
  })
}

//删除
export const delListDataPro = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceJKItems/delete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}
//提交
export const submitListDataPro = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceJKItems/submit`,
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    method: 'post',
    data: id
  })
}
//审核通过
export const auditListDataPro = (form) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceJKItems/complete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:form
  })
}
//审核不通过
export const auditNoListDataPro = (form) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceJKItems/disagree`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:form
  })
}
//导出
export const exportExcelxm = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceJKItems/exportExcel`,
    method: 'post',
    data: row
  })
}
//服务机构信息
export const getInfo = () => {
  return request({
    url: `${baseURL}api/aicos-second/member/get`,
    method: 'post',
  })
}
//工作台
