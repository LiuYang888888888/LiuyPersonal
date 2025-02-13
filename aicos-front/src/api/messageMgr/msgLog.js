import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { mq } = serviceList

// 日志接收查询，分页，传producerName
export const getReceiveList = (data) => {
  return request({
    url: `${baseURL}api/${mq}/mqLog/listPageReceiveMessageByMqLogParam`,
    method: 'post',
    data
  })
}

// 日志接收查询，详情，传parentMessageId
export const getReceiveLogDetail = (parentMessageId) => {
  return request({
    url: `${baseURL}api/${mq}/mqLog/getOneReceiveMessage`,
    method: 'post',
    data:{parentMessageId}
  })
}

// 日志发送查询，分页,传titleContent,channelType
export const getSendList = (data) => {
  return request({
    url: `${baseURL}api/${mq}/mqLog/listPageSendMessageByMqLogParam`,
    method: 'post',
    data
  })
}

// 发送日志详细
export const getSendLogDetail = (id) => {
  return request({
    url: `${baseURL}api/${mq}/mqLog/getOneSendMessage`,
    method: 'post',
    data:{id}
  })
}

//以一条消息方式展现日志，分页,传channelName，producerName,templateName
export const getCombinLogList = (data) => {
  return request({
    url: `${baseURL}api/${mq}/mqLog/listPageMessageByMqLogParam`,
    method: 'post',
    data
  })
}

// 按一条消息方式查看详情,传sameId
export const getCombinLogDetail = (sameId) => {
  return request({
    url: `${baseURL}api/${mq}/mqLog/getMessageSearchDetail`,
    method: 'post',
    data:{sameId}
  })
}
