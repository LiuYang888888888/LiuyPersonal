import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { mq } = serviceList

export const getList = (data) => {
  return request({
    url: `${baseURL}api/${mq}/mqProducer/listPageByMqProducerParam`,
    method: 'post',
    data
  })
}

//新增,secret由后台自动生成
export const add = (data) => {
  return request({
    url: `${baseURL}api/${mq}/mqProducer/save`,
    method: 'post',
    data
  })
}

//修改
export const update = (data) => {
  return request({
    url: `${baseURL}api/${mq}/mqProducer/update`,
    method: 'post',
    data
  })
}

//删除
export const remove = (id) => {
  return request({
    url: `${baseURL}api/${mq}/mqProducer/delete`,
    method: 'post',
    data: {
      id
    }
  })
}


// 保存渠道模板关系,传producerId,templateId,templateId用逗号间隔
export const saveProducerTemplate = (data) => {
  return request({
    url: `${baseURL}api/${mq}/mqProducer/saveHuilanBaseMqProducerTemplateRelationByProducerId`,
    method: 'post',
    data
  })
}

// 取渠道下面的所有模板,传id
export const getTemplateByProducerId = (id) => {
  return request({
    url: `${baseURL}api/${mq}/mqProducer/getHuilanBaseMqTemplateByProducerId`,
    method: 'post',
    data: {
      id
    }
  })
}

// 取渠道下面的所有通道,传id
export const getChannelByProducerId = (id) => {
  return request({
    url: `${baseURL}api/${mq}/mqProducer/getHuilanBaseMqChannelByProducerId`,
    method: 'post',
    data: {
      id
    }
  })
}

// 保存渠道通道关系,传producerId,channelId，channelId用逗号间隔
export const saveProducerChannel = (data) => {
  return request({
    url: `${baseURL}api/${mq}/mqProducer/saveHuilanBaseMqProducerChannelRelationByProducerId`,
    method: 'post',
    data
  })
}

// 发送消息，通道必填，模板选填
export const sendMessage = (data) => {
  return request({
    url: `${baseURL}api/${mq}/rabbitmq/sendByChannelAndTemplate`,
    method: 'post',
    data
  })
}
