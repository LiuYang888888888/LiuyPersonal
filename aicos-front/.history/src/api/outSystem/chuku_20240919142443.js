import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
//查询列表
export const getListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/godApplication/listByPage`,
    method: 'post',
    data
  })
}
//查看
export const viewListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/godApplication/getById`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}
//出库
export const chukuListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/godApplication/godOutboundDelivery`,
    method: 'post',
    //headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data
  })
}