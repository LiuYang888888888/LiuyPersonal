import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { mq } = serviceList

export const getList = (data) => {
  return request({
    url: `${baseURL}api/${mq}/mqTemplate/listPageByMqTemplateParam`,
    method: 'post',
    data
  })
}

//新增
export const add = (data) => {
  return request({
    url: `${baseURL}api/${mq}/mqTemplate/save`,
    method: 'post',
    data
  })
}

//修改
export const update = (data) => {
  return request({
    url: `${baseURL}api/${mq}/mqTemplate/update`,
    method: 'post',
    data
  })
}

//删除
export const remove = (id) => {
  return request({
    url: `${baseURL}api/${mq}/mqTemplate/delete`,
    method: 'post',
    data: {
      id
    }
  })
}

//删除
export const detail = (id) => {
  return request({
    url: `${baseURL}api/${mq}/mqTemplate/getHuilanBaseMqTemplateById`,
    method: 'post',
    data: {
      id
    }
  })
}


export const syncWeixinTemplateByChannelId = (id={}) => {
  return request({
    url: `${baseURL}api/${mq}/mqTemplate/syncWeixinTemplateByChannelId`,
    method: 'post',
    data: {
      id
    }
  })
}

// 同步所有微信
export const syncWeixinTemplate = (data={}) => {
  return request({
    url: `${baseURL}api/${mq}/mqTemplate/syncWeixinTemplate`,
    method: 'post',
    data
  })
}
