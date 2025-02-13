import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { mq } = serviceList

export const getList = (data) => {
  return request({
    url: `${baseURL}api/${mq}/mqChannel/listPageByMqChannelParam`,
    method: 'post',
    data
  })
}

//新增
export const add = (data) => {
  return request({
    url: `${baseURL}api/${mq}/mqChannel/save`,
    method: 'post',
    data
  })
}

//修改
export const update = (data) => {
  return request({
    url: `${baseURL}api/${mq}/mqChannel/update`,
    method: 'post',
    data
  })
}

//删除
export const remove = (id) => {
  return request({
    url: `${baseURL}api/${mq}/mqChannel/delete`,
    method: 'post',
    data: {
      id
    }
  })
}
// 测试
export const sendTest = (data) => {
  return request({
    url: `${baseURL}api/${mq}/rabbitmq/testMessageByChannelType`,
    method: 'post',
    data
  })
}

// 根据类型获取云厂商列表
export const getWeixinList = (data) => {
  return request({
    url: `${baseURL}api/${mq}/mqChannel/getCloudvendorListByType`,
    method: 'post',
    data
  })
}
