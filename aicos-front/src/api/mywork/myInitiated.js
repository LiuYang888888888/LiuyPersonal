import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { flow } = serviceList

export const getList = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flow/sendList`,
    method: 'post',
    data
  })
}

// 获取当选要处理的表单及数据
export const getItemInfo = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flow/getAnyTask`,
    method: 'post',
    data
  })
}
