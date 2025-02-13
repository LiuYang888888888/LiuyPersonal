import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
//查询全部列表
export const getListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/vehicleManagement/listByPage`,
    method: 'post',
    data
  })
}
//查询列表
export const getListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/meetingRoomApplication/listPersonByPage`,
    method: 'post',
    data
  })
}
//查看
export const viewListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/meetingRoomApplication/getById`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}

//新增
export const saveOrUpdateListData = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/meetingRoomApplication/saveOrUpdateFormData`,
    method: 'post',
    data: row
  })
}

//删除
export const delListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/meetingRoomApplication/delete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}
//提交
export const submitListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/meetingRoomApplication/submit`,
    //headers:{'Content-Type':'application/x-www-form-urlencoded'},
    method: 'post',
    data: id
  })
}