import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
//查询列表
export const getListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/godOutboundDeliveryOrder/listByPage`,
    method: 'post',
    data
  })
}
//查看
export const viewListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/godOutboundDeliveryOrder/getById`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}
//删除
export const delListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/godApplication/delete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}