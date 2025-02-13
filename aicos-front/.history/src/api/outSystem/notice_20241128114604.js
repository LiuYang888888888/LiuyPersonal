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
//回执详情
export const viewListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/msc/meetingPer/listByPage	`,
    method: 'post',
    data
  })
}




