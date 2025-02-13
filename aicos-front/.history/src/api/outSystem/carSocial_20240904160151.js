import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
//查询列表
export const getListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/vehicleOfSocietyApplication/listPersonByPage`,
    method: 'post',
    data
  })
}
//查看
export const viewListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/vehicleOfSocietyApplication/getById`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}

//新增
export const saveOrUpdateListData = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/vehicleOfSocietyApplication/saveOrUpdateFormData`,
    method: 'post',
    data: row
  })
}

//删除
export const delListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/vehicleOfSocietyApplication/delete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}
//提交
export const submitListData = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/vehicleOfSocietyApplication/startProcessInstanceById`,
    method: 'post',
    data: row
  })
}
//审核通过
export const auditListData = (form) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/vehicleOfSocietyApplication/updateCompleteTask`,
    method: 'post',
    data:form
  })
}
//审核不通过
export const auditNoListData = (form) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/vehicleApplication/closeForDisagree`,
    method: 'post',
    data:form
  })
}
//还车
export const backListData = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/vehicleApplication/returnVehicle`,
    method: 'post',
    data: row
  })
}