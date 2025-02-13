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
//派车
export const submitListData = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/vehicleApplication/dispatch`,
    method: 'post',
    data: row
  })
}