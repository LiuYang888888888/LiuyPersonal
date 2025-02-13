import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { message } = serviceList

//我的消息，分页
export const getListPageByMessageParam = (data) => {
  return request({
    url: `${baseURL}api/${message}/baseMessage/listPageByMessageParam`,
    method: 'post',
    data
  })
}

export const remove = (id) => {
  return request({
    url: `${baseURL}api/${message}/baseMessage/delete`,
    method: 'post',
    data: {
      id
    }
  })
}

export const getMessageById = (id) => {
  return request({
    url: `${baseURL}api/${message}/baseMessage/getMessageById`,
    method: 'post',
    data: {
      id
    }
  })
}

//批量设置消息状态
export const setAllStatus = (data) => {
  return request({
    url: `${baseURL}api/${message}/baseMessage/setStatusInMyMessage`,
    method: 'post',
    data
  })
}
//获取本人选择的菜单