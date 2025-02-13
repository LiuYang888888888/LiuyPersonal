import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
//查询列表
export const getListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/godManagement/listByPage`,
    method: 'post',
    data
  })
}
//查看
export const viewListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/godManagement/getById`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}

//新增
export const saveOrUpdateListData = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/godManagement/saveOrUpdateFormData`,
    method: 'post',
    data: row
  })
}

//删除
export const delListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/godManagement/delete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}
//提交
export const submitListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/godApplication/startProcessInstanceById`,
    //headers:{'Content-Type':'application/x-www-form-urlencoded'},
    method: 'post',
    data: id
  })
}
//审核通过
export const auditListData = (form) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/godApplication/updateCompleteTask`,
    method: 'post',
    //headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:form
  })
}
//审核不通过
export const auditNoListData = (form) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/godApplication/closeForDisagree`,
    method: 'post',
    //headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:form
  })
}
//物品查询
export const getListDataEx = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/godManagement/queryGodList`,
    method: 'post',
    data
  })
}
//物品型号查询
export const getListDataPro = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/godManagement/queryGodXHList`,
    method: 'post',
    data
  })
}
//物品可用库存
export const getListDataJungong = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/godManagement/queryGodXHSum`,
    method: 'post',
    data
  })
}
