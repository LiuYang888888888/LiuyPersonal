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
//出库
export const chukuListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/godApplication/chuku`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}