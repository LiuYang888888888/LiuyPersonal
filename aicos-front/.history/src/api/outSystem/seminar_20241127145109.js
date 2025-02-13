import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
//查询列表
export const getListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/meetintNotice/listByPage	`,
    method: 'post',
    data
  })
}
//查看
export const viewListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/meetintNotice/getById`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}

//新增
export const saveOrUpdateListData = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/meetintNotice/saveOrUpdateFormData`,
    method: 'post',
    data: row
  })
}

//删除
export const delListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/meetintNotice/delete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}