import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { mq } = serviceList

export const getList = (data) => {
  return request({
    url: `${baseURL}api/${mq}/rabbitmq/queues`,
    method: 'post',
    data
  })
}

//addQueue:传name,body里面填json
export const save = (data) => {
  return request({
    url: `${baseURL}api/${mq}/rabbitmq/addQueue`,
    method: 'post',
    data
  })
}

//deleteQueue,传name
export const remove = (name) => {
  const body = {
    mode: 'delete',
    vhost: '/',
    name
  }
  return request({
    url: `${baseURL}api/${mq}/rabbitmq/deleteQueue`,
    method: 'post',
    data: {
      body: JSON.stringify(body),
      name
    }
  })
}

// 清空队列
export const purgeQueue = (name) => {
  const body = {
    mode: 'delete',
    vhost: '/',
    name
  }
  return request({
    url: `${baseURL}api/${mq}/rabbitmq/purgeQueue`,
    method: 'post',
    data: {
      body: JSON.stringify(body),
      name
    }
  })
}
// 绑定
export const bindings = (data) => {
  return request({
    url: `${baseURL}api/${mq}/rabbitmq/bindings`,
    method: 'post',
    data
  })
}
// 解绑
export const unbindings = (data) => {
  return request({
    url: `${baseURL}api/${mq}/rabbitmq/unbindings`,
    method: 'post',
    data
  })
}
// 获取queue绑定的exchange
export const getBindingsExchange = (name) => {
  return request({
    url: `${baseURL}api/${mq}/rabbitmq/listBindingsQueue`,
    method: 'post',
    data:{
      name
    }
  })
}
