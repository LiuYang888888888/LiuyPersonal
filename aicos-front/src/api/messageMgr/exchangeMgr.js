import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { mq } = serviceList

export const getList = (data) => {
  return request({
    url: `${baseURL}api/${mq}/rabbitmq/exchanges`,
    method: 'post',
    data
  })
}

//addExchange:传name,body里面填json
export const save = (data) => {
  return request({
    url: `${baseURL}api/${mq}/rabbitmq/addExchange`,
    method: 'post',
    data
  })
}

//deleteExchange,传name
export const remove = (name) => {
  const body = {
    name,
    vhost: '/'
  }
  return request({
    url: `${baseURL}api/${mq}/rabbitmq/deleteExchange`,
    method: 'post',
    data: {
      name,
      body: JSON.stringify(body)
    }
  })
}

// 获取exchange绑定的exchange
export const getBindingsExchangeList = (name) => {
  return request({
    url: `${baseURL}api/${mq}/rabbitmq/listBindingsExchangeDestination`,
    method: 'post',
    data:{
      name
    }
  })
}
// 获取以给定name为souce的绑定列表
export const getSourceBindingsList = (name) => {
  return request({
    url: `${baseURL}api/${mq}/rabbitmq/listBindingsExchangeSource`,
    method: 'post',
    data:{
      name
    }
  })
}
