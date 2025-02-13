import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { mq } = serviceList

export const getOverview = (data) => {
  return request({
    url: `${baseURL}api/${mq}/rabbitmq/overview`,
    method: 'post',
    data
  })
}

export const getMessageOverview = (data) => {
  return request({
    url: `${baseURL}api/${mq}/rabbitmq/messageOverview`,
    method: 'post',
    data
  })
}

export const getConnections = (data) => {
  return request({
    url: `${baseURL}api/${mq}/rabbitmq/connections`,
    method: 'post',
    data
  })
}

export const getChannels = (data) => {
  return request({
    url: `${baseURL}api/${mq}/rabbitmq/channels`,
    method: 'post',
    data
  })
}
