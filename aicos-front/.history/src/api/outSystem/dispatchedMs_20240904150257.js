import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
//查询列表
export const getListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/vehicleApplication/listByPage`,
    method: 'post',
    data
  })
}
//查看
export const viewListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/vehicleApplication/getById`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}

//新增
export const saveOrUpdateListData = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/vehicleApplication/saveOrUpdateFormData`,
    method: 'post',
    data: row
  })
}

//空闲车辆
export const getListDataKong = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/vehicleManagement/listFreeByPage`,
    method: 'post',
    data
  })
}
//空闲车辆
export const getListDataKong = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/vehicleManagement/listFreeByPage`,
    method: 'post',
    data
  })
}
