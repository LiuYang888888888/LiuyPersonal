import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { message } = serviceList

// 获取消息模板列表
export const getList = (data) => {
  return request({
    url: `${baseURL}api/${message}/baseMessageTemplate/listPageByMessageTemplateParam`,
    method: 'post',
    data
  })
}

export const add = (row) => {
  return request({
    url: `${baseURL}api/${message}/baseMessageTemplate/save`,
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: `${baseURL}api/${message}/baseMessageTemplate/update`,
    method: 'post',
    data: row
  })
}

export const remove = (id) => {
  return request({
    url: `${baseURL}api/${message}/baseMessageTemplate/delete`,
    method: 'post',
    data: {
      id,
    }
  })
}

export const enableStatus = (data) => {
  return request({
    url: `${baseURL}api/${message}/baseMessageTemplate/enable`,
    method: 'post',
    data
  })
}

// 按type取所有消息模板,传type
export const getBaseMessageTemplateByType = (type) => {
  return request({
    url: `${baseURL}api/${message}/baseMessageTemplate/getBaseMessageTemplateByType`,
    method: 'post',
    data: {
      type
    }
  })
}
